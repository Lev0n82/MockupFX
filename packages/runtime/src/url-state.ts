import type { ProjectDocument } from '@mockupfx/format';

import { RuntimeError } from './errors.js';
import type { UrlStateResult } from './types.js';

export function parseUrlState(input: string | URLSearchParams, project: ProjectDocument): UrlStateResult {
  const parameters = typeof input === 'string' ? new URLSearchParams(input.startsWith('?') ? input.slice(1) : input) : input;
  const pageId = parameters.get('page');
  if (pageId === null || pageId.length === 0) {
    return { pageId: project.project.startPageId };
  }
  if (!project.pages.some((page) => page.id === pageId)) {
    return {
      error: new RuntimeError('RUNTIME_UNKNOWN_PAGE', `Page '${pageId}' does not exist.`, { pageId })
    };
  }
  return { pageId };
}
