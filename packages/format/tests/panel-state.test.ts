import { describe, expect, it } from 'vitest';

import { ProjectValidationError, validateProject } from '@mockupfx/format';
import { complexDashboardProject } from '@mockupfx/test-fixtures';

describe('dynamic panel project validation', () => {
  it('accepts nested dynamic panels and a multi-state master view', () => {
    expect(() => validateProject(complexDashboardProject)).not.toThrow();
  });

  it('rejects a child bound to an unknown state of its dynamic-panel parent', () => {
    const project = cloneComplexProject();
    const child = project.components.find((component) => component.id === 'component_connection_online_text')!;
    child.panelStateId = 'state_missing';

    expectValidationError(() => validateProject(project), 'FORMAT_UNKNOWN_PANEL_STATE');
  });

  it('rejects a panel-state action that names a state not declared by the target panel', () => {
    const project = cloneComplexProject();
    const action = project.interactions[0]!.branches[0]!.actions[2]!;
    action.stateId = 'state_missing';

    expectValidationError(() => validateProject(project), 'FORMAT_UNKNOWN_PANEL_STATE');
  });

  it('rejects a style value that could inject an arbitrary CSS declaration', () => {
    const project = structuredClone(complexDashboardProject) as unknown as { components: Array<{ id: string; style?: { color?: string } }> };
    project.components.find((component) => component.id === 'component_status_badge')!.style!.color = 'red;background-image:url(https://example.invalid/x)';

    expectValidationError(() => validateProject(project), 'FORMAT_INVALID_FIELD');
  });
});

function cloneComplexProject(): UntrustedComplexProject {
  return structuredClone(complexDashboardProject) as unknown as UntrustedComplexProject;
}

interface UntrustedComplexProject {
  components: Array<{ id: string; panelStateId?: string }>;
  interactions: Array<{ branches: Array<{ actions: Array<{ stateId?: string }> }> }>;
}

function expectValidationError(execute: () => unknown, code: string): void {
  try {
    execute();
    throw new Error('Expected validation to fail');
  } catch (error) {
    expect(error).toBeInstanceOf(ProjectValidationError);
    expect((error as ProjectValidationError).code).toBe(code);
  }
}
