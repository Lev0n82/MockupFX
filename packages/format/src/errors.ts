export type FormatErrorCode =
  | 'FORMAT_INVALID_DOCUMENT'
  | 'FORMAT_UNSUPPORTED_VERSION'
  | 'FORMAT_DUPLICATE_ID'
  | 'FORMAT_UNKNOWN_PAGE'
  | 'FORMAT_UNKNOWN_COMPONENT'
  | 'FORMAT_UNKNOWN_VARIABLE'
  | 'FORMAT_UNKNOWN_OWNER'
  | 'FORMAT_INITIAL_VALUE_TYPE'
  | 'FORMAT_ACTION_VALUE_TYPE'
  | 'FORMAT_UNSUPPORTED_ACTION'
  | 'FORMAT_INVALID_FIELD'
  | 'FORMAT_UNSUPPORTED_CONDITION';

export class ProjectValidationError extends Error {
  public readonly code: FormatErrorCode;
  public readonly path: string;

  public constructor(code: FormatErrorCode, path: string, message: string) {
    super(message);
    this.name = 'ProjectValidationError';
    this.code = code;
    this.path = path;
  }
}
