import { describe, expect, it } from 'vitest';

import { ProjectValidationError, validateProject } from '@mockupfx/format';
import { checkoutProject } from '@mockupfx/test-fixtures';

describe('validateProject', () => {
  it('accepts the reference project without mutating it', () => {
    const project = structuredClone(checkoutProject);
    const validated = validateProject(project);

    expect(validated).toEqual(project);
    expect(project).toEqual(checkoutProject);
  });

  it('rejects duplicate identifiers', () => {
    const project = cloneUntrustedFixture();
    project.pages.push({ ...project.pages[0]! });

    expectValidationError(() => validateProject(project), 'FORMAT_DUPLICATE_ID', '/pages/2/id');
  });

  it('rejects a navigation action that targets an unknown page', () => {
    const project = cloneUntrustedFixture();
    project.interactions[0]!.branches[1]!.actions[1] = {
      id: 'action_missing_page',
      type: 'navigate',
      pageId: 'page_missing',
      mode: 'push'
    };

    expectValidationError(() => validateProject(project), 'FORMAT_UNKNOWN_PAGE', '/interactions/0/branches/1/actions/1/pageId');
  });

  it('rejects an initial variable value incompatible with its declared type', () => {
    const project = cloneUntrustedFixture();
    project.variables[0]!.initialValue = 'true';

    expectValidationError(() => validateProject(project), 'FORMAT_INITIAL_VALUE_TYPE', '/variables/0/initialValue');
  });

  it('rejects actions outside the runtime allowlist', () => {
    const project = cloneUntrustedFixture();
    project.interactions[0]!.branches[0]!.actions[0] = {
      id: 'action_not_supported',
      type: 'runScript'
    };

    expectValidationError(() => validateProject(project), 'FORMAT_UNSUPPORTED_ACTION', '/interactions/0/branches/0/actions/0/type');
  });
});

function expectValidationError(execute: () => unknown, code: string, path: string): void {
  try {
    execute();
    throw new Error('Expected validation to fail');
  } catch (error) {
    expect(error).toBeInstanceOf(ProjectValidationError);
    expect((error as ProjectValidationError).code).toBe(code);
    expect((error as ProjectValidationError).path).toBe(path);
  }
}

interface UntrustedFixture {
  pages: Array<Record<string, unknown>>;
  variables: Array<{ initialValue: unknown }>;
  interactions: Array<{
    branches: Array<{
      actions: Array<Record<string, unknown>>;
    }>;
  }>;
}

function cloneUntrustedFixture(): UntrustedFixture {
  return structuredClone(checkoutProject) as unknown as UntrustedFixture;
}
