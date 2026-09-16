import { describe, expect, it } from 'vitest';

import { PlayerEngine } from '@mockupfx/runtime';
import { checkoutProject, expectedCheckoutTraceKinds } from '@mockupfx/test-fixtures';

describe('checkout reference journey', () => {
  it('produces the same committed snapshot and trace on every fresh engine', () => {
    const executeJourney = () => {
      const engine = new PlayerEngine(checkoutProject, { trace: true });
      return engine.dispatch({ ownerId: 'component_checkout_button', name: 'click' });
    };

    const first = executeJourney();
    const second = executeJourney();

    expect(first.error).toBeUndefined();
    expect(second.error).toBeUndefined();
    expect(first.snapshot).toEqual(second.snapshot);
    expect(first.trace).toEqual(second.trace);
    expect(first.trace.map((entry) => entry.kind)).toEqual(expectedCheckoutTraceKinds);
  });
});
