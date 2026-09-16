import { describe, expect, it } from 'vitest';

import { evaluateCondition } from '../src/conditions.js';
import { RuntimeError } from '../src/errors.js';

describe('evaluateCondition', () => {
  const variables = {
    variable_flag: true,
    variable_count: 2,
    variable_label: 'confirmed'
  };

  it('evaluates literal and typed variable equality conditions', () => {
    expect(evaluateCondition({ type: 'literal', value: true }, variables)).toBe(true);
    expect(evaluateCondition({ type: 'variableEquals', variableId: 'variable_count', expected: 2 }, variables)).toBe(true);
    expect(evaluateCondition({ type: 'variableEquals', variableId: 'variable_count', expected: '2' }, variables)).toBe(false);
  });

  it('evaluates variable truthiness without evaluating source code', () => {
    expect(evaluateCondition({ type: 'variableIsTruthy', variableId: 'variable_flag' }, variables)).toBe(true);
    expect(evaluateCondition({ type: 'variableIsTruthy', variableId: 'variable_label' }, variables)).toBe(true);
  });

  it('returns a typed error for an undeclared variable', () => {
    expect(() => evaluateCondition({ type: 'variableIsTruthy', variableId: 'variable_missing' }, variables)).toThrow(RuntimeError);
    expect(() => evaluateCondition({ type: 'variableIsTruthy', variableId: 'variable_missing' }, variables)).toThrow(
      expect.objectContaining({ code: 'RUNTIME_UNKNOWN_VARIABLE' })
    );
  });
});
