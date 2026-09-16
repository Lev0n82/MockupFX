import type { RuntimeTraceEntry, RuntimeTraceKind } from './types.js';

export class TraceRecorder {
  private sequence = 0;
  private readonly entries: RuntimeTraceEntry[] = [];

  public constructor(
    private readonly dispatchId: number,
    private readonly enabled: boolean
  ) {}

  public record(kind: RuntimeTraceKind, details: Omit<RuntimeTraceEntry, 'sequence' | 'dispatchId' | 'kind'> = {}): void {
    if (!this.enabled) {
      return;
    }
    this.sequence += 1;
    this.entries.push({ sequence: this.sequence, dispatchId: this.dispatchId, kind, ...details });
  }

  public snapshot(): RuntimeTraceEntry[] {
    return this.entries.map((entry) => ({ ...entry }));
  }
}
