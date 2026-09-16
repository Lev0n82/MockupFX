import type { Condition, VariableValue } from '@mockupfx/format';

import { RuntimeError } from './errors.js';

export function evaluateCondition(condition: Condition, variables: Record<string, VariableValue>): boolean {
  switch (condition.type) {
    case 'literal':
      return condition.value;
    case 'variableEquals':
      return getVariable(condition.variableId, variables) === condition.expected;
    case 'variableIsTruthy':
      return Boolean(getVariable(condition.variableId, variables));
  }
}

function getVariable(variableId: string, variables: Record<string, VariableValue>): VariableValue {
  if (!Object.hasOwn(variables, variableId)) {
    throw new RuntimeError('RUNTIME_UNKNOWN_VARIABLE', `Variable '${variableId}' does not exist.`, { variableId });
  }
  return variables[variableId]!;
}
