import { describe, expect, it } from 'vitest';

import { mountPreview } from '@mockupfx/renderer';
import { complexDashboardProject } from '@mockupfx/test-fixtures';

describe('mountPreview', () => {
  it('delegates native button activation to the player engine and rerenders', () => {
    const listeners = new Map<string, (event: FakeEvent) => void>();
    const root = {
      innerHTML: '',
      addEventListener: (name: string, handler: (event: FakeEvent) => void) => listeners.set(name, handler),
      removeEventListener: (name: string) => listeners.delete(name)
    };
    const preview = mountPreview(root, complexDashboardProject);

    listeners.get('click')!({
      target: {
        closest: () => ({ getAttribute: (name: string) => (name === 'data-mfx-id' ? 'component_connect_button' : 'click') })
      },
      preventDefault: () => undefined
    });

    expect(preview.engine.getSnapshot().components.component_connection_panel).toEqual({ panelStateId: 'state_online' });
    expect(root.innerHTML).toContain('Service connected and synchronizing.');

    preview.destroy();
    expect(listeners.has('click')).toBe(false);
  });
});

interface FakeEvent {
  target: { closest(selector: string): { getAttribute(name: string): string | null } | null } | null;
  preventDefault(): void;
}
