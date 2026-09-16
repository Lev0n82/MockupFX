import type { ProjectDocument } from '@mockupfx/format';

import { mountPreview } from './mount.js';

export function startStandalonePreview(root: HTMLElement, project: ProjectDocument): ReturnType<typeof mountPreview> {
  return mountPreview(root, project);
}
