import type { ProjectDocument } from '@mockupfx/format';
import { PlayerEngine } from '@mockupfx/runtime';

import { renderPreviewHtml } from './html.js';

export interface PreviewRoot {
  innerHTML: string;
  addEventListener(name: string, handler: (event: PreviewClickEvent) => void): void;
  removeEventListener(name: string, handler: (event: PreviewClickEvent) => void): void;
  querySelector?(selector: string): { focus(): void } | null;
}

export interface PreviewClickEvent {
  target: { closest(selector: string): PreviewElement | null } | null;
  preventDefault(): void;
}

export interface PreviewElement {
  getAttribute(name: string): string | null;
}

export interface MountedPreview {
  engine: PlayerEngine;
  render(): void;
  destroy(): void;
}

export function mountPreview(root: PreviewRoot, project: ProjectDocument): MountedPreview {
  const engine = new PlayerEngine(project);
  let previousPageId = engine.getSnapshot().currentPageId;

  const render = (): void => {
    const snapshot = engine.getSnapshot();
    root.innerHTML = renderPreviewHtml(project, snapshot);
    if (snapshot.currentPageId !== previousPageId) {
      root.querySelector?.('.mfx-preview')?.focus();
      previousPageId = snapshot.currentPageId;
    }
  };

  const onClick = (event: PreviewClickEvent): void => {
    const control = event.target?.closest('[data-mfx-event="click"]');
    const componentId = control?.getAttribute('data-mfx-id');
    if (!componentId) {
      return;
    }
    event.preventDefault();
    const result = engine.dispatch({ ownerId: componentId, name: 'click' });
    render();
    if (result.error) {
      const status = root.querySelector?.('.mfx-preview__status');
      if (status) {
        root.innerHTML = root.innerHTML.replace(
          '<div class="mfx-preview__status" aria-live="polite" role="status"></div>',
          `<div class="mfx-preview__status" aria-live="polite" role="status">${result.error.message}</div>`
        );
      }
    }
  };

  root.addEventListener('click', onClick);
  render();
  return { engine, render, destroy: () => root.removeEventListener('click', onClick) };
}
