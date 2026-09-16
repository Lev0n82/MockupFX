import { describe, expect, it } from 'vitest';

import { PlayerEngine, parseUrlState } from '@mockupfx/runtime';
import { checkoutProject } from '@mockupfx/test-fixtures';

describe('URL state', () => {
  it('serializes only the current page identifier', () => {
    const engine = new PlayerEngine(checkoutProject);
    engine.dispatch({ ownerId: 'component_checkout_button', name: 'click' });

    expect(engine.toUrlState()).toBe('?page=page_confirmation');
    expect(engine.toUrlState()).not.toContain('variable_checkout_count');
  });

  it('reads a known page and defaults to the project start page when absent', () => {
    expect(parseUrlState('?page=page_confirmation', checkoutProject)).toEqual({ pageId: 'page_confirmation' });
    expect(parseUrlState('?unused=value', checkoutProject)).toEqual({ pageId: 'page_cart' });
  });

  it('returns a typed error for an unknown page identifier', () => {
    expect(parseUrlState('?page=page_missing', checkoutProject)).toEqual({
      error: expect.objectContaining({ code: 'RUNTIME_UNKNOWN_PAGE' })
    });
  });
});
