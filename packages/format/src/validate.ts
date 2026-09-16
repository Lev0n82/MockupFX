import { ProjectValidationError } from './errors.js';
import type { FormatErrorCode } from './errors.js';
import type {
  Action,
  Branch,
  Component,
  Condition,
  Interaction,
  Page,
  ProjectDocument,
  Variable,
  VariableType,
  VariableValue
} from './types.js';

const componentTypes = new Set(['text', 'button', 'container', 'image']);
const variableTypes = new Set<VariableType>(['string', 'number', 'boolean']);

export function validateProject(input: unknown): ProjectDocument {
  const document = recordAt(input, '');
  assertEqual(document.formatVersion, '0.1.0', '/formatVersion', 'FORMAT_UNSUPPORTED_VERSION', 'Only format version 0.1.0 is supported.');

  const project = recordAt(document.project, '/project');
  assertNonEmptyString(project.id, '/project/id');
  assertNonEmptyString(project.name, '/project/name');
  assertNonEmptyString(project.startPageId, '/project/startPageId');

  const seenIds = new Set<string>();
  const pages = arrayAt(document.pages, '/pages').map((page, index) => validatePage(page, index, seenIds));
  const components = arrayAt(document.components, '/components').map((component, index) => validateComponent(component, index, seenIds));
  const variables = arrayAt(document.variables, '/variables').map((variable, index) => validateVariable(variable, index, seenIds));

  const pageIds = new Set(pages.map((page) => page.id));
  const componentIds = new Set(components.map((component) => component.id));
  const variableById = new Map(variables.map((variable) => [variable.id, variable]));

  if (!pageIds.has(project.startPageId as string)) {
    fail('FORMAT_UNKNOWN_PAGE', '/project/startPageId', `Start page '${String(project.startPageId)}' does not exist.`);
  }

  for (const [index, page] of pages.entries()) {
    if (!componentIds.has(page.rootComponentId)) {
      fail('FORMAT_UNKNOWN_COMPONENT', `/pages/${index}/rootComponentId`, `Root component '${page.rootComponentId}' does not exist.`);
    }
  }

  for (const [index, component] of components.entries()) {
    if (!pageIds.has(component.pageId)) {
      fail('FORMAT_UNKNOWN_PAGE', `/components/${index}/pageId`, `Component page '${component.pageId}' does not exist.`);
    }
  }

  const ownerIds = new Set([...pageIds, ...componentIds]);
  const interactions = arrayAt(document.interactions, '/interactions').map((interaction, index) =>
    validateInteraction(interaction, index, seenIds, ownerIds, pageIds, componentIds, variableById)
  );

  return {
    formatVersion: '0.1.0',
    project: {
      id: project.id as string,
      name: project.name as string,
      startPageId: project.startPageId as string
    },
    pages,
    components,
    variables,
    interactions
  };
}

function validatePage(input: unknown, index: number, seenIds: Set<string>): Page {
  const path = `/pages/${index}`;
  const page = recordAt(input, path);
  const id = uniqueId(page.id, `${path}/id`, seenIds);
  const name = stringAt(page.name, `${path}/name`);
  const rootComponentId = stringAt(page.rootComponentId, `${path}/rootComponentId`);
  return { id, name, rootComponentId };
}

function validateComponent(input: unknown, index: number, seenIds: Set<string>): Component {
  const path = `/components/${index}`;
  const component = recordAt(input, path);
  const id = uniqueId(component.id, `${path}/id`, seenIds);
  const pageId = stringAt(component.pageId, `${path}/pageId`);
  const type = stringAt(component.type, `${path}/type`);
  if (!componentTypes.has(type)) {
    fail('FORMAT_INVALID_FIELD', `${path}/type`, `Unsupported component type '${type}'.`);
  }

  if (component.text !== undefined && typeof component.text !== 'string') {
    fail('FORMAT_INVALID_FIELD', `${path}/text`, 'Component text must be a string.');
  }
  if (component.visible !== undefined && typeof component.visible !== 'boolean') {
    fail('FORMAT_INVALID_FIELD', `${path}/visible`, 'Component visibility must be a Boolean.');
  }

  return {
    id,
    pageId,
    type: type as Component['type'],
    ...(component.text === undefined ? {} : { text: component.text as string }),
    ...(component.visible === undefined ? {} : { visible: component.visible as boolean })
  };
}

function validateVariable(input: unknown, index: number, seenIds: Set<string>): Variable {
  const path = `/variables/${index}`;
  const variable = recordAt(input, path);
  const id = uniqueId(variable.id, `${path}/id`, seenIds);
  const type = stringAt(variable.type, `${path}/type`);
  if (!variableTypes.has(type as VariableType)) {
    fail('FORMAT_INVALID_FIELD', `${path}/type`, `Unsupported variable type '${type}'.`);
  }
  if (!isValueOfType(variable.initialValue, type as VariableType)) {
    fail('FORMAT_INITIAL_VALUE_TYPE', `${path}/initialValue`, `Initial value must be a ${type}.`);
  }
  return { id, type: type as VariableType, initialValue: variable.initialValue as VariableValue };
}

function validateInteraction(
  input: unknown,
  index: number,
  seenIds: Set<string>,
  ownerIds: Set<string>,
  pageIds: Set<string>,
  componentIds: Set<string>,
  variableById: Map<string, Variable>
): Interaction {
  const path = `/interactions/${index}`;
  const interaction = recordAt(input, path);
  const id = uniqueId(interaction.id, `${path}/id`, seenIds);
  const ownerId = stringAt(interaction.ownerId, `${path}/ownerId`);
  if (!ownerIds.has(ownerId)) {
    fail('FORMAT_UNKNOWN_OWNER', `${path}/ownerId`, `Interaction owner '${ownerId}' does not exist.`);
  }
  const event = stringAt(interaction.event, `${path}/event`);
  const branches = arrayAt(interaction.branches, `${path}/branches`).map((branch, branchIndex) =>
    validateBranch(branch, `${path}/branches/${branchIndex}`, seenIds, ownerIds, pageIds, componentIds, variableById)
  );
  return { id, ownerId, event, branches };
}

function validateBranch(
  input: unknown,
  path: string,
  seenIds: Set<string>,
  ownerIds: Set<string>,
  pageIds: Set<string>,
  componentIds: Set<string>,
  variableById: Map<string, Variable>
): Branch {
  const branch = recordAt(input, path);
  const id = uniqueId(branch.id, `${path}/id`, seenIds);
  if (typeof branch.enabled !== 'boolean') {
    fail('FORMAT_INVALID_FIELD', `${path}/enabled`, 'Branch enabled must be a Boolean.');
  }
  const condition = validateCondition(branch.condition, `${path}/condition`, variableById);
  const actions = arrayAt(branch.actions, `${path}/actions`).map((action, actionIndex) =>
    validateAction(action, `${path}/actions/${actionIndex}`, seenIds, ownerIds, pageIds, componentIds, variableById)
  );
  return { id, enabled: branch.enabled, condition, actions };
}

function validateCondition(input: unknown, path: string, variableById: Map<string, Variable>): Condition {
  const condition = recordAt(input, path);
  const type = stringAt(condition.type, `${path}/type`);
  if (type === 'literal') {
    if (typeof condition.value !== 'boolean') {
      fail('FORMAT_INVALID_FIELD', `${path}/value`, 'Literal condition value must be a Boolean.');
    }
    return { type, value: condition.value };
  }
  if (type === 'variableIsTruthy') {
    const variableId = stringAt(condition.variableId, `${path}/variableId`);
    requireVariable(variableId, `${path}/variableId`, variableById);
    return { type, variableId };
  }
  if (type === 'variableEquals') {
    const variableId = stringAt(condition.variableId, `${path}/variableId`);
    const variable = requireVariable(variableId, `${path}/variableId`, variableById);
    if (!isValueOfType(condition.expected, variable.type)) {
      fail('FORMAT_ACTION_VALUE_TYPE', `${path}/expected`, `Expected value must be a ${variable.type}.`);
    }
    return { type, variableId, expected: condition.expected as VariableValue };
  }
  fail('FORMAT_UNSUPPORTED_CONDITION', `${path}/type`, `Unsupported condition type '${type}'.`);
}

function validateAction(
  input: unknown,
  path: string,
  seenIds: Set<string>,
  ownerIds: Set<string>,
  pageIds: Set<string>,
  componentIds: Set<string>,
  variableById: Map<string, Variable>
): Action {
  const action = recordAt(input, path);
  const id = uniqueId(action.id, `${path}/id`, seenIds);
  const type = stringAt(action.type, `${path}/type`);

  if (type === 'navigate') {
    const pageId = stringAt(action.pageId, `${path}/pageId`);
    if (!pageIds.has(pageId)) {
      fail('FORMAT_UNKNOWN_PAGE', `${path}/pageId`, `Navigation page '${pageId}' does not exist.`);
    }
    const mode = stringAt(action.mode, `${path}/mode`);
    if (mode !== 'push' && mode !== 'replace') {
      fail('FORMAT_INVALID_FIELD', `${path}/mode`, "Navigation mode must be 'push' or 'replace'.");
    }
    return { id, type, pageId, mode };
  }

  if (type === 'setVariable') {
    const variableId = stringAt(action.variableId, `${path}/variableId`);
    const variable = requireVariable(variableId, `${path}/variableId`, variableById);
    if (!isValueOfType(action.value, variable.type)) {
      fail('FORMAT_ACTION_VALUE_TYPE', `${path}/value`, `Variable value must be a ${variable.type}.`);
    }
    return { id, type, variableId, value: action.value as VariableValue };
  }

  if (type === 'setText') {
    const componentId = requireComponent(action.componentId, `${path}/componentId`, componentIds);
    const text = stringAt(action.text, `${path}/text`);
    return { id, type, componentId, text };
  }

  if (type === 'setVisibility') {
    const componentId = requireComponent(action.componentId, `${path}/componentId`, componentIds);
    if (typeof action.visible !== 'boolean') {
      fail('FORMAT_INVALID_FIELD', `${path}/visible`, 'Visibility action must include a Boolean visible value.');
    }
    return { id, type, componentId, visible: action.visible };
  }

  if (type === 'emit') {
    const ownerId = stringAt(action.ownerId, `${path}/ownerId`);
    if (!ownerIds.has(ownerId)) {
      fail('FORMAT_UNKNOWN_OWNER', `${path}/ownerId`, `Emit owner '${ownerId}' does not exist.`);
    }
    const event = stringAt(action.event, `${path}/event`);
    return { id, type, ownerId, event };
  }

  fail('FORMAT_UNSUPPORTED_ACTION', `${path}/type`, `Unsupported action type '${type}'.`);
}

function requireVariable(variableId: string, path: string, variables: Map<string, Variable>): Variable {
  const variable = variables.get(variableId);
  if (!variable) {
    fail('FORMAT_UNKNOWN_VARIABLE', path, `Variable '${variableId}' does not exist.`);
  }
  return variable;
}

function requireComponent(value: unknown, path: string, componentIds: Set<string>): string {
  const componentId = stringAt(value, path);
  if (!componentIds.has(componentId)) {
    fail('FORMAT_UNKNOWN_COMPONENT', path, `Component '${componentId}' does not exist.`);
  }
  return componentId;
}

function uniqueId(value: unknown, path: string, seenIds: Set<string>): string {
  const id = stringAt(value, path);
  if (seenIds.has(id)) {
    fail('FORMAT_DUPLICATE_ID', path, `Identifier '${id}' is duplicated.`);
  }
  seenIds.add(id);
  return id;
}

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('FORMAT_INVALID_DOCUMENT', path || '/', 'Expected an object.');
  }
  return value as Record<string, unknown>;
}

function arrayAt(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    fail('FORMAT_INVALID_FIELD', path, 'Expected an array.');
  }
  return value;
}

function stringAt(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    fail('FORMAT_INVALID_FIELD', path, 'Expected a nonempty string.');
  }
  return value;
}

function assertNonEmptyString(value: unknown, path: string): void {
  stringAt(value, path);
}

function assertEqual(value: unknown, expected: string, path: string, code: 'FORMAT_UNSUPPORTED_VERSION', message: string): void {
  if (value !== expected) {
    fail(code, path, message);
  }
}

function isValueOfType(value: unknown, type: VariableType): value is VariableValue {
  return typeof value === type;
}

function fail(code: FormatErrorCode, path: string, message: string): never {
  throw new ProjectValidationError(code, path, message);
}
