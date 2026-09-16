import type { Component, ComponentStyle, ProjectDocument } from '@mockupfx/format';
import type { RuntimeSnapshot } from '@mockupfx/runtime';

export interface RenderPreviewOptions {
  titleSuffix?: string;
}

export function renderPreviewHtml(project: ProjectDocument, snapshot: RuntimeSnapshot, options: RenderPreviewOptions = {}): string {
  const page = project.pages.find((candidate) => candidate.id === snapshot.currentPageId);
  if (!page) {
    return '<main class="mfx-preview" tabindex="-1" aria-live="polite">Preview page is unavailable.</main>';
  }

  const pageComponents = project.components.filter((component) => component.pageId === page.id);
  const componentById = new Map(pageComponents.map((component) => [component.id, component]));
  const roots = pageComponents.filter((component) => component.parentComponentId === undefined);
  const content = roots.map((component) => renderComponent(component, pageComponents, componentById, snapshot)).join('');
  const title = `${project.project.name}${options.titleSuffix ?? ' preview'}`;

  return `<main class="mfx-preview" tabindex="-1" aria-label="${escapeHtml(title)}">` +
    `<div class="mfx-preview__page" data-mfx-page-id="${escapeAttribute(page.id)}">${content}</div>` +
    '<div class="mfx-preview__status" aria-live="polite" role="status"></div>' +
    '</main>';
}

function renderComponent(
  component: Component,
  allComponents: Component[],
  componentById: Map<string, Component>,
  snapshot: RuntimeSnapshot
): string {
  const override = snapshot.components[component.id];
  const visible = override?.visible ?? component.visible ?? true;
  if (!visible || !isInActivePanelState(component, componentById, snapshot)) {
    return '';
  }

  const children = allComponents
    .filter((candidate) => candidate.parentComponentId === component.id)
    .map((child) => renderComponent(child, allComponents, componentById, snapshot))
    .join('');
  const text = override?.text ?? component.text ?? '';
  const attributes = commonAttributes(component);
  const style = inlineStyle(component.style, component.bounds);

  switch (component.type) {
    case 'button':
      return `<button type="button" ${attributes} data-mfx-event="click"${style}>${escapeHtml(text)}</button>`;
    case 'image':
      return `<img ${attributes} src="#" alt="${escapeAttribute(component.altText ?? component.ariaLabel ?? component.name ?? '')}"${style}>`;
    case 'input':
      return `<label ${attributes}${style}>${escapeHtml(component.ariaLabel ?? component.name ?? 'Input')}<input type="text" value="${escapeAttribute(component.value ?? '')}" aria-label="${escapeAttribute(component.ariaLabel ?? component.name ?? 'Input')}"></label>`;
    case 'checkbox':
      return `<label ${attributes}${style}><input type="checkbox" aria-label="${escapeAttribute(component.ariaLabel ?? text ?? component.name ?? 'Checkbox')}">${escapeHtml(text)}</label>`;
    case 'text':
      return `<span ${attributes}${style}>${escapeHtml(text)}</span>${children}`;
    case 'dynamicPanel':
    case 'master':
    case 'container':
      return `<section ${attributes}${style}>${children}</section>`;
  }
}

function isInActivePanelState(component: Component, componentById: Map<string, Component>, snapshot: RuntimeSnapshot): boolean {
  if (component.panelStateId === undefined) {
    return true;
  }
  const parent = component.parentComponentId === undefined ? undefined : componentById.get(component.parentComponentId);
  if (!parent || parent.type !== 'dynamicPanel') {
    return false;
  }
  const activeState = snapshot.components[parent.id]?.panelStateId ?? parent.initialPanelStateId ?? parent.panelStates?.[0]?.id;
  return activeState === component.panelStateId;
}

function commonAttributes(component: Component): string {
  const label = component.ariaLabel ?? component.name ?? component.text ?? component.id;
  return `class="mfx-component mfx-component--${escapeAttribute(component.type)}" data-mfx-id="${escapeAttribute(component.id)}" aria-label="${escapeAttribute(label)}"`;
}

function inlineStyle(style: ComponentStyle | undefined, bounds: Component['bounds']): string {
  const declarations: string[] = ['box-sizing:border-box'];
  if (bounds) {
    declarations.push('position:absolute', `left:${bounds.x}px`, `top:${bounds.y}px`, `width:${bounds.width}px`, `height:${bounds.height}px`);
  }
  if (style?.backgroundColor) declarations.push(`background-color:${style.backgroundColor}`);
  if (style?.borderColor) declarations.push(`border:1px solid ${style.borderColor}`);
  if (style?.color) declarations.push(`color:${style.color}`);
  if (style?.borderRadius !== undefined) declarations.push(`border-radius:${style.borderRadius}px`);
  if (style?.fontSize !== undefined) declarations.push(`font-size:${style.fontSize}px`);
  if (style?.fontWeight) declarations.push(`font-weight:${style.fontWeight}`);
  if (style?.padding !== undefined) declarations.push(`padding:${style.padding}px`);
  if (style?.textAlign) declarations.push(`text-align:${style.textAlign}`);
  return ` style="${escapeAttribute(declarations.join(';'))}"`;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const replacements: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    };
    return replacements[character]!;
  });
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
