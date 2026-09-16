import { describe, expect, it } from 'vitest';

import { PlayerEngine } from '@mockupfx/runtime';
import { checkoutProject, expectedCheckoutTraceKinds } from '@mockupfx/test-fixtures';

describe('PlayerEngine', () => {
  it('selects the first matching enabled branch, commits actions, and drains emitted events in FIFO order', () => {
    const engine = new PlayerEngine(checkoutProject, { trace: true });

    const result = engine.dispatch({ ownerId: 'component_checkout_button', name: 'click' });

    expect(result.error).toBeUndefined();
    expect(result.processedEvents).toBe(2);
    expect(result.snapshot.currentPageId).toBe('page_confirmation');
    expect(result.snapshot.history).toEqual(['page_cart']);
    expect(result.snapshot.variables.variable_checkout_count).toBe(1);
    expect(result.snapshot.components.component_checkout_button).toBeUndefined();
    expect(result.snapshot.components.component_confirmation_message).toEqual({ visible: true });
    expect(result.trace.map((entry) => entry.kind)).toEqual(expectedCheckoutTraceKinds);
  });

  it('returns a typed failure without changing the last committed snapshot for an unknown owner', () => {
    const engine = new PlayerEngine(checkoutProject);
    const before = engine.getSnapshot();

    const result = engine.dispatch({ ownerId: 'component_missing', name: 'click' });

    expect(result.error).toMatchObject({ code: 'RUNTIME_UNKNOWN_OWNER' });
    expect(result.snapshot).toEqual(before);
    expect(result.trace.at(-1)).toMatchObject({ kind: 'event-failed' });
  });

  it('returns a deep copy that cannot mutate internal engine state', () => {
    const engine = new PlayerEngine(checkoutProject);
    const snapshot = engine.getSnapshot();
    snapshot.variables.variable_checkout_count = 99;
    snapshot.history.push('page_confirmation');

    expect(engine.getSnapshot()).toEqual({
      currentPageId: 'page_cart',
      history: [],
      variables: { variable_has_items: true, variable_checkout_count: 0 },
      components: {}
    });
  });

  it('enforces the event dispatch limit after committed emitted events', () => {
    const loopingProject = structuredClone(checkoutProject);
    loopingProject.interactions.push({
      id: 'interaction_loop',
      ownerId: 'page_cart',
      event: 'loop',
      branches: [
        {
          id: 'branch_loop',
          enabled: true,
          condition: { type: 'literal', value: true },
          actions: [{ id: 'action_loop', type: 'emit', ownerId: 'page_cart', event: 'loop' }]
        }
      ]
    });
    const engine = new PlayerEngine(loopingProject, { maxEventsPerDispatch: 2 });

    const result = engine.dispatch({ ownerId: 'page_cart', name: 'loop' });

    expect(result.error).toMatchObject({ code: 'RUNTIME_EVENT_LIMIT' });
    expect(result.processedEvents).toBe(2);
    expect(result.trace.at(-1)).toMatchObject({ kind: 'event-failed', code: 'RUNTIME_EVENT_LIMIT' });
  });

  it('resets state to document declarations after a committed interaction', () => {
    const engine = new PlayerEngine(checkoutProject);
    engine.dispatch({ ownerId: 'component_checkout_button', name: 'click' });

    expect(engine.reset()).toEqual({
      currentPageId: 'page_cart',
      history: [],
      variables: { variable_has_items: true, variable_checkout_count: 0 },
      components: {}
    });
  });
});
