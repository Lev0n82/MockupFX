import { build } from 'esbuild';
import type { ProjectDocument } from '@mockupfx/format';

import { escapeHtml } from '@mockupfx/renderer';

import { sha256 } from './manifest.js';
import type { StaticBundleManifest } from './manifest.js';

export interface StaticBundleOptions {
  publicationId: string;
  generatedAt?: string;
  bundleBrowserPlayer?: (entryPoint: string) => Promise<string>;
}

export interface StaticBundle {
  files: Record<string, string>;
  manifest: StaticBundleManifest;
}

const rendererBrowserEntry = new URL('../../renderer/src/browser-entry.ts', import.meta.url).pathname;

export async function createStaticBundle(project: ProjectDocument, options: StaticBundleOptions): Promise<StaticBundle> {
  const player = options.bundleBrowserPlayer ? await options.bundleBrowserPlayer(rendererBrowserEntry) : await bundleBrowserPlayer(rendererBrowserEntry);
  const projectJson = JSON.stringify(project, null, 2);
  const indexHtml = createIndexHtml(project.project.name, projectJson);
  const files = {
    'index.html': indexHtml,
    'player.js': player,
    'project.json': projectJson
  };
  const manifest: StaticBundleManifest = {
    projectId: project.project.id,
    publicationId: options.publicationId,
    outputType: 'static-html',
    formatVersion: project.formatVersion,
    generatorVersion: '0.1.0',
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    files: Object.fromEntries(Object.entries(files).map(([path, content]) => [path, sha256(content)]))
  };
  return { files: { ...files, 'mockupfx.manifest.json': `${JSON.stringify(manifest, null, 2)}\n` }, manifest };
}

async function bundleBrowserPlayer(entryPoint: string): Promise<string> {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    legalComments: 'none',
    target: ['es2022']
  });
  return result.outputFiles[0]!.text;
}

function createIndexHtml(projectName: string, projectJson: string): string {
  const safeProjectJson = projectJson.replace(/</g, '\\u003c');
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + escapeHtml(projectName) + '</title></head>',
    '<body><div id="mockupfx-preview"></div>',
    `<script id="mockupfx-project" type="application/json">${safeProjectJson}</script>`,
    '<script type="module" src="./player.js"></script>',
    '<script type="module">',
    'import { startStandalonePreview } from "./player.js";',
    'const project = JSON.parse(document.getElementById("mockupfx-project").textContent);',
    'startStandalonePreview(document.getElementById("mockupfx-preview"), project);',
    '</script></body></html>'
  ].join('\n');
}
