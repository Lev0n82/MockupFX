import { describe, expect, it } from 'vitest';

import { applyAction } from '../src/actions.js';
import { RuntimeError } from '../src/errors.js';
import { checkoutProject } from '@mockupfx/test-fixtures';

const initialSnapshot = {
  currentPageId: 'page_cart',
  history: [],
  variables: { variable_has_items: true, variable_checkout_count: 0 },
  components: {}
};

describe('applyAction', () => {
  it('applies a valid variable action to the supplied draft only', () => {
    const draft = structuredClone(initialSnapshot);
    const result = applyAction(
      { id: 'action_count', type: 'setVariable', variableId: 'variable_checkout_count', value: 1 },
      draft,
      checkoutProject
    );

    expect(result.emittedEvent).toBeUndefined();
    expect(draft.variables.variable_checkout_count).toBe(1);
    expect(initialSnapshot.variables.variable_checkout_count).toBe(0);
  });

  it('rejects a malformed runtime action without changing its draft', () => {
    const draft = structuredClone(initialSnapshot);
    const invalidAction = {
      id: 'action_wrong_type',
      type: 'setVariable',
      variableId: 'variable_checkout_count',
      value: 'one'
    } as never;

    expect(() => applyAction(invalidAction, draft, checkoutProject)).toThrow(RuntimeError);
    expect(() => applyAction(invalidAction, draft, checkoutProject)).toThrow(
      expect.objectContaining({ code: 'RUNTIME_TYPE_MISMATCH' })
    );
    expect(draft).toEqual(initialSnapshot);
  });
});
