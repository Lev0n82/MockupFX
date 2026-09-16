import { describe, expect, it } from 'vitest';

import { applyAction } from '../src/actions.js';
import { PlayerEngine } from '@mockupfx/runtime';
import type { RuntimeSnapshot } from '@mockupfx/runtime';
import { complexDashboardExpectedState, complexDashboardProject } from '@mockupfx/test-fixtures';

const initialSnapshot: RuntimeSnapshot = {
  currentPageId: 'page_dashboard',
  history: [],
  variables: { variable_connected: false, variable_connection_label: 'Disconnected' },
  components: {}
};

describe('dynamic panel runtime state', () => {
  it('applies a panel-state override to its draft snapshot', () => {
    const draft = structuredClone(initialSnapshot);

    const result = applyAction(
      {
        id: 'action_show_online',
        type: 'setPanelState',
        componentId: 'component_connection_panel',
        stateId: 'state_online'
      },
      draft,
      complexDashboardProject
    );

    expect(result.emittedEvent).toBeUndefined();
    expect(draft.components.component_connection_panel).toEqual({ panelStateId: 'state_online' });
    expect(initialSnapshot.components).toEqual({});
  });

  it('commits the complete master-panel transition through the existing event queue', () => {
    const engine = new PlayerEngine(complexDashboardProject, { trace: true });

    const result = engine.dispatch({ ownerId: 'component_connect_button', name: 'click' });

    expect(result.error).toBeUndefined();
    expect(result.processedEvents).toBe(2);
    expect(result.snapshot.currentPageId).toBe(complexDashboardExpectedState.currentPageId);
    expect(result.snapshot.variables).toEqual(complexDashboardExpectedState.variables);
    expect(result.snapshot.components).toEqual(complexDashboardExpectedState.components);
  });
});
