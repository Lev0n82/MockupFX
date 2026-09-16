import type { Action, ProjectDocument, Variable, VariableValue } from '@mockupfx/format';

import { RuntimeError } from './errors.js';
import type { ActionApplication, RuntimeSnapshot } from './types.js';

export function applyAction(action: Action, draft: RuntimeSnapshot, project: ProjectDocument): ActionApplication {
  switch (action.type) {
    case 'navigate': {
      requirePage(action.pageId, project);
      if (action.mode === 'push') {
        draft.history.push(draft.currentPageId);
      }
      draft.currentPageId = action.pageId;
      return {};
    }
    case 'setVariable': {
      const variable = requireVariable(action.variableId, project);
      if (!isValueOfType(action.value, variable.type)) {
        throw new RuntimeError('RUNTIME_TYPE_MISMATCH', `Value for '${action.variableId}' must be a ${variable.type}.`, {
          variableId: action.variableId,
          expectedType: variable.type
        });
      }
      draft.variables[action.variableId] = action.value;
      return {};
    }
    case 'setText': {
      requireComponent(action.componentId, project);
      const current = draft.components[action.componentId] ?? {};
      draft.components[action.componentId] = { ...current, text: action.text };
      return {};
    }
    case 'setVisibility': {
      requireComponent(action.componentId, project);
      const current = draft.components[action.componentId] ?? {};
      draft.components[action.componentId] = { ...current, visible: action.visible };
      return {};
    }
    case 'setPanelState': {
      const panel = requireComponentRecord(action.componentId, project);
      if (panel.type !== 'dynamicPanel') {
        throw new RuntimeError('RUNTIME_INVALID_ACTION', `Component '${action.componentId}' is not a dynamic panel.`, {
          componentId: action.componentId
        });
      }
      if (!panel.panelStates?.some((state) => state.id === action.stateId)) {
        throw new RuntimeError('RUNTIME_UNKNOWN_PANEL_STATE', `Panel state '${action.stateId}' does not exist.`, {
          componentId: action.componentId,
          stateId: action.stateId
        });
      }
      const current = draft.components[action.componentId] ?? {};
      draft.components[action.componentId] = { ...current, panelStateId: action.stateId };
      return {};
    }
    case 'emit': {
      if (action.ownerId.length === 0 || action.event.length === 0) {
        throw new RuntimeError('RUNTIME_INVALID_EVENT', 'An emitted event requires a nonempty owner and name.', {
          ownerId: action.ownerId,
          eventName: action.event
        });
      }
      return { emittedEvent: { ownerId: action.ownerId, name: action.event } };
    }
  }
}

function requirePage(pageId: string, project: ProjectDocument): void {
  if (!project.pages.some((page) => page.id === pageId)) {
    throw new RuntimeError('RUNTIME_UNKNOWN_PAGE', `Page '${pageId}' does not exist.`, { pageId });
  }
}

function requireComponent(componentId: string, project: ProjectDocument): void {
  requireComponentRecord(componentId, project);
}

function requireComponentRecord(componentId: string, project: ProjectDocument): ProjectDocument['components'][number] {
  const component = project.components.find((candidate) => candidate.id === componentId);
  if (!component) {
    throw new RuntimeError('RUNTIME_UNKNOWN_COMPONENT', `Component '${componentId}' does not exist.`, { componentId });
  }
  return component;
}

function requireVariable(variableId: string, project: ProjectDocument): Variable {
  const variable = project.variables.find((candidate) => candidate.id === variableId);
  if (!variable) {
    throw new RuntimeError('RUNTIME_UNKNOWN_VARIABLE', `Variable '${variableId}' does not exist.`, { variableId });
  }
  return variable;
}

function isValueOfType(value: unknown, type: Variable['type']): value is VariableValue {
  return typeof value === type;
}
