import { describe, expect, it } from 'vitest';

import { createStaticBundle } from '@mockupfx/exporter';
import { complexDashboardProject } from '@mockupfx/test-fixtures';

describe('createStaticBundle', () => {
  it('creates an offline package with relative resources and hashed manifest', async () => {
    const calls: string[] = [];
    const bundle = await createStaticBundle(complexDashboardProject, {
      publicationId: 'publication_complex_001',
      generatedAt: '2026-09-16T12:00:00.000Z',
      bundleBrowserPlayer: async (entryPoint) => {
        calls.push(entryPoint);
        return 'window.MockupFXPlayer={startStandalonePreview(){}};';
      }
    });

    expect(calls).toEqual([expect.stringContaining('browser-entry')]);
    expect(bundle.files['index.html']).toContain('<script type="module" src="./player.js"></script>');
    expect(bundle.files['index.html']).toContain('id="mockupfx-project" type="application/json"');
    expect(bundle.files['index.html']).not.toContain('https://');
    expect(bundle.files['project.json']).toContain('project_operations_dashboard');
    expect(bundle.manifest).toMatchObject({
      projectId: 'project_operations_dashboard',
      publicationId: 'publication_complex_001',
      formatVersion: '0.1.0',
      generatedAt: '2026-09-16T12:00:00.000Z'
    });
    expect(Object.keys(bundle.manifest.files).sort()).toEqual(['index.html', 'player.js', 'project.json']);
    expect(bundle.manifest.files['player.js']).toMatch(/^[a-f0-9]{64}$/);
  });

  it('bundles the actual renderer and player entrypoint without an external URL', async () => {
    const bundle = await createStaticBundle(complexDashboardProject, {
      publicationId: 'publication_complex_actual',
      generatedAt: '2026-09-16T12:00:00.000Z'
    });

    expect(bundle.files['player.js']).toContain('startStandalonePreview');
    expect(bundle.files['player.js']).not.toContain('https://');
    expect(bundle.files['player.js']!.length).toBeGreaterThan(1_000);
  });
});
