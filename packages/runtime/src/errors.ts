import type { RuntimeErrorCode, RuntimeErrorShape } from './types.js';

export class RuntimeError extends Error implements RuntimeErrorShape {
  public readonly code: RuntimeErrorCode;
  public readonly context: Record<string, string>;

  public constructor(code: RuntimeErrorCode, message: string, context: Record<string, string> = {}) {
    super(message);
    this.name = 'RuntimeError';
    this.code = code;
    this.context = context;
  }
}
