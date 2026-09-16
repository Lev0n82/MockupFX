import { createHash } from 'node:crypto';

export interface StaticBundleManifest {
  projectId: string;
  publicationId: string;
  outputType: 'static-html';
  formatVersion: '0.1.0';
  generatorVersion: string;
  generatedAt: string;
  files: Record<string, string>;
}

export function sha256(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}
