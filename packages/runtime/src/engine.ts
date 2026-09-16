import { validateProject } from '@mockupfx/format';
import type { ProjectDocument, VariableValue } from '@mockupfx/format';

import { applyAction } from './actions.js';
import { evaluateCondition } from './conditions.js';
import { RuntimeError } from './errors.js';
import { TraceRecorder } from './trace.js';
import type { DispatchEvent, DispatchResult, PlayerEngineOptions, RuntimeSnapshot } from './types.js';

const defaultMaxEventsPerDispatch = 100;

export class PlayerEngine {
  private readonly project: ProjectDocument;
  private readonly maxEventsPerDispatch: number;
  private readonly traceEnabled: boolean;
  private state: RuntimeSnapshot;
  private dispatchId = 0;

  public constructor(project: ProjectDocument, options: PlayerEngineOptions = {}) {
    this.project = validateProject(project);
    this.maxEventsPerDispatch = options.maxEventsPerDispatch ?? defaultMaxEventsPerDispatch;
    this.traceEnabled = options.trace ?? true;

    if (!Number.isInteger(this.maxEventsPerDispatch) || this.maxEventsPerDispatch < 1) {
      throw new RuntimeError('RUNTIME_INVALID_EVENT', 'maxEventsPerDispatch must be an integer greater than zero.', {
        maxEventsPerDispatch: String(this.maxEventsPerDispatch)
      });
    }

    const initialPageId = options.initialPageId ?? this.project.project.startPageId;
    if (!this.hasPage(initialPageId)) {
      throw new RuntimeError('RUNTIME_UNKNOWN_PAGE', `Initial page '${initialPageId}' does not exist.`, { pageId: initialPageId });
    }
    this.state = this.createInitialSnapshot(initialPageId);
  }

  public dispatch(event: DispatchEvent): DispatchResult {
    const trace = new TraceRecorder(++this.dispatchId, this.traceEnabled);
    const queue: DispatchEvent[] = [event];
    let processedEvents = 0;

    while (queue.length > 0) {
      if (processedEvents >= this.maxEventsPerDispatch) {
        const error = new RuntimeError('RUNTIME_EVENT_LIMIT', 'The event dispatch limit was reached.', {
          maxEventsPerDispatch: String(this.maxEventsPerDispatch)
        });
        trace.record('event-failed', { code: error.code });
        return this.result(trace, processedEvents, error);
      }

      const currentEvent = queue.shift()!;
      trace.record('event-started', { ownerId: currentEvent.ownerId, eventName: currentEvent.name });
      try {
        this.validateEvent(currentEvent);
        const draft = cloneSnapshot(this.state);
        const emittedEvents = this.executeEvent(currentEvent, draft, trace);
        this.state = cloneSnapshot(draft);
        processedEvents += 1;
        trace.record('event-committed', { ownerId: currentEvent.ownerId, eventName: currentEvent.name });
        queue.push(...emittedEvents);
      } catch (error) {
        const runtimeError = normalizeRuntimeError(error);
        trace.record('event-failed', {
          ownerId: currentEvent.ownerId,
          eventName: currentEvent.name,
          code: runtimeError.code
        });
        return this.result(trace, processedEvents, runtimeError);
      }
    }

    return this.result(trace, processedEvents);
  }

  public getSnapshot(): RuntimeSnapshot {
    return cloneSnapshot(this.state);
  }

  public reset(): RuntimeSnapshot {
    this.state = this.createInitialSnapshot(this.project.project.startPageId);
    return this.getSnapshot();
  }

  public toUrlState(): string {
    return `?page=${encodeURIComponent(this.state.currentPageId)}`;
  }

  private executeEvent(event: DispatchEvent, draft: RuntimeSnapshot, trace: TraceRecorder): DispatchEvent[] {
    const emittedEvents: DispatchEvent[] = [];
    const interactions = this.project.interactions.filter(
      (interaction) => interaction.ownerId === event.ownerId && interaction.event === event.name
    );

    for (const interaction of interactions) {
      for (const branch of interaction.branches) {
        if (!branch.enabled) {
          trace.record('branch-evaluated', {
            interactionId: interaction.id,
            branchId: branch.id,
            conditionResult: false
          });
          continue;
        }

        const conditionResult = evaluateCondition(branch.condition, draft.variables);
        trace.record('branch-evaluated', {
          interactionId: interaction.id,
          branchId: branch.id,
          conditionResult
        });
        if (!conditionResult) {
          continue;
        }

        trace.record('branch-selected', { interactionId: interaction.id, branchId: branch.id });
        for (const action of branch.actions) {
          try {
            const application = applyAction(action, draft, this.project);
            if (application.emittedEvent) {
              emittedEvents.push(application.emittedEvent);
            }
            trace.record('action-completed', {
              interactionId: interaction.id,
              branchId: branch.id,
              actionId: action.id
            });
          } catch (error) {
            const runtimeError = normalizeRuntimeError(error);
            trace.record('action-failed', {
              interactionId: interaction.id,
              branchId: branch.id,
              actionId: action.id,
              code: runtimeError.code
            });
            throw runtimeError;
          }
        }
        break;
      }
    }

    return emittedEvents;
  }

  private validateEvent(event: DispatchEvent): void {
    if (event.ownerId.length === 0 || event.name.length === 0) {
      throw new RuntimeError('RUNTIME_INVALID_EVENT', 'An event requires a nonempty owner and name.', {
        ownerId: event.ownerId,
        eventName: event.name
      });
    }
    if (!this.hasOwner(event.ownerId)) {
      throw new RuntimeError('RUNTIME_UNKNOWN_OWNER', `Event owner '${event.ownerId}' does not exist.`, {
        ownerId: event.ownerId
      });
    }
  }

  private hasOwner(ownerId: string): boolean {
    return this.project.pages.some((page) => page.id === ownerId) || this.project.components.some((component) => component.id === ownerId);
  }

  private hasPage(pageId: string): boolean {
    return this.project.pages.some((page) => page.id === pageId);
  }

  private createInitialSnapshot(currentPageId: string): RuntimeSnapshot {
    const variables: Record<string, VariableValue> = {};
    for (const variable of this.project.variables) {
      variables[variable.id] = variable.initialValue;
    }
    return { currentPageId, history: [], variables, components: {} };
  }

  private result(trace: TraceRecorder, processedEvents: number, error?: RuntimeError): DispatchResult {
    return {
      snapshot: this.getSnapshot(),
      trace: trace.snapshot(),
      processedEvents,
      ...(error === undefined ? {} : { error })
    };
  }
}

function cloneSnapshot(snapshot: RuntimeSnapshot): RuntimeSnapshot {
  return {
    currentPageId: snapshot.currentPageId,
    history: [...snapshot.history],
    variables: { ...snapshot.variables },
    components: Object.fromEntries(
      Object.entries(snapshot.components).map(([componentId, override]) => [componentId, { ...override }])
    )
  };
}

function normalizeRuntimeError(error: unknown): RuntimeError {
  if (error instanceof RuntimeError) {
    return error;
  }
  return new RuntimeError('RUNTIME_INVALID_ACTION', 'The runtime encountered an unexpected action failure.', {});
}
