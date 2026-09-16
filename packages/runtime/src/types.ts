import type { VariableValue } from '@mockupfx/format';

export interface RuntimeSnapshot {
  currentPageId: string;
  history: string[];
  variables: Record<string, VariableValue>;
  components: Record<string, ComponentOverride>;
}

export interface ComponentOverride {
  text?: string;
  visible?: boolean;
  panelStateId?: string;
}

export interface DispatchEvent {
  ownerId: string;
  name: string;
  payload?: Record<string, unknown>;
}

export interface PlayerEngineOptions {
  maxEventsPerDispatch?: number;
  trace?: boolean;
  initialPageId?: string;
}

export interface DispatchResult {
  snapshot: RuntimeSnapshot;
  trace: RuntimeTraceEntry[];
  processedEvents: number;
  error?: RuntimeErrorShape;
}

export type RuntimeTraceKind =
  | 'event-started'
  | 'branch-evaluated'
  | 'branch-selected'
  | 'action-completed'
  | 'action-failed'
  | 'event-committed'
  | 'event-failed';

export interface RuntimeTraceEntry {
  sequence: number;
  dispatchId: number;
  kind: RuntimeTraceKind;
  ownerId?: string;
  eventName?: string;
  interactionId?: string;
  branchId?: string;
  actionId?: string;
  conditionResult?: boolean;
  code?: RuntimeErrorCode;
}

export type RuntimeErrorCode =
  | 'RUNTIME_EVENT_LIMIT'
  | 'RUNTIME_UNKNOWN_OWNER'
  | 'RUNTIME_UNKNOWN_PAGE'
  | 'RUNTIME_UNKNOWN_COMPONENT'
  | 'RUNTIME_UNKNOWN_VARIABLE'
  | 'RUNTIME_UNKNOWN_PANEL_STATE'
  | 'RUNTIME_TYPE_MISMATCH'
  | 'RUNTIME_INVALID_EVENT'
  | 'RUNTIME_INVALID_ACTION';

export interface RuntimeErrorShape {
  code: RuntimeErrorCode;
  message: string;
  context: Record<string, string>;
}

export interface ActionApplication {
  emittedEvent?: DispatchEvent;
}

export type UrlStateResult = { pageId: string } | { error: RuntimeErrorShape };
