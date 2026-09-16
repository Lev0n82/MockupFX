import { describe, expect, it } from 'vitest';

import { PlayerEngine } from '@mockupfx/runtime';
import { renderPreviewHtml } from '@mockupfx/renderer';
import { complexDashboardProject } from '@mockupfx/test-fixtures';

describe('renderPreviewHtml', () => {
  it('renders safe native controls with stable component identifiers', () => {
    const html = renderPreviewHtml(complexDashboardProject, new PlayerEngine(complexDashboardProject).getSnapshot());

    expect(html).toContain('<main class="mfx-preview" tabindex="-1" aria-label="Operations dashboard preview">');
    expect(html).toMatch(/<button type="button"[^>]*data-mfx-id="component_connect_button"[^>]*>Connect service<\/button>/);
    expect(html).toContain('data-mfx-event="click"');
    expect(html).toContain('aria-label="Connect service"');
    expect(html).toContain('data-mfx-id="component_connection_offline_text"');
    expect(html).toContain('No service connection is active.');
    expect(html).not.toContain('component_connection_online_text');
  });

  it('reflects dynamic panel state and text overrides from the player engine', () => {
    const engine = new PlayerEngine(complexDashboardProject);
    engine.dispatch({ ownerId: 'component_connect_button', name: 'click' });

    const html = renderPreviewHtml(complexDashboardProject, engine.getSnapshot());

    expect(html).toContain('data-mfx-id="component_connection_online_text"');
    expect(html).toContain('Service connected and synchronizing.');
    expect(html).toContain('data-mfx-id="component_view_details_button"');
    expect(html).toContain('>Connected</span>');
    expect(html).not.toContain('component_connection_offline_text');
  });

  it('escapes authored strings rather than inserting markup', () => {
    const project = structuredClone(complexDashboardProject);
    project.components.find((component) => component.id === 'component_status_badge')!.text = '<img src=x onerror=alert(1)>';

    const html = renderPreviewHtml(project, new PlayerEngine(project).getSnapshot());

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
  });
});
