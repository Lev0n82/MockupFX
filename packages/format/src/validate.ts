import { ProjectValidationError } from './errors.js';
import type { FormatErrorCode } from './errors.js';
import type {
  Action,
  Branch,
  Component,
  ComponentBounds,
  ComponentStyle,
  Condition,
  Interaction,
  Page,
  PanelState,
  ProjectDocument,
  Variable,
  VariableType,
  VariableValue
} from './types.js';

const componentTypes = new Set(['text', 'button', 'container', 'image', 'dynamicPanel', 'master', 'input', 'checkbox']);
const variableTypes = new Set<VariableType>(['string', 'number', 'boolean']);
const styleKeys = new Set(['backgroundColor', 'borderColor', 'color', 'borderRadius', 'fontSize', 'fontWeight', 'padding', 'textAlign']);
const fontWeights = new Set(['normal', 'medium', 'semibold', 'bold']);
const textAlignments = new Set(['left', 'center', 'right']);

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
  const componentById = new Map(components.map((component) => [component.id, component]));
  const variableById = new Map(variables.map((variable) => [variable.id, variable]));

  if (!pageIds.has(project.startPageId as string)) {
    fail('FORMAT_UNKNOWN_PAGE', '/project/startPageId', `Start page '${String(project.startPageId)}' does not exist.`);
  }

  for (const [index, page] of pages.entries()) {
    if (!componentIds.has(page.rootComponentId)) {
      fail('FORMAT_UNKNOWN_COMPONENT', `/pages/${index}/rootComponentId`, `Root component '${page.rootComponentId}' does not exist.`);
    }
  }

  validateComponentRelationships(components, pageIds, componentById);

  const ownerIds = new Set([...pageIds, ...componentIds]);
  const interactions = arrayAt(document.interactions, '/interactions').map((interaction, index) =>
    validateInteraction(interaction, index, seenIds, ownerIds, pageIds, componentIds, componentById, variableById)
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

  validateOptionalString(component.text, `${path}/text`);
  validateOptionalBoolean(component.visible, `${path}/visible`);
  validateOptionalString(component.name, `${path}/name`);
  validateOptionalString(component.parentComponentId, `${path}/parentComponentId`);
  validateOptionalString(component.panelStateId, `${path}/panelStateId`);
  validateOptionalString(component.initialPanelStateId, `${path}/initialPanelStateId`);
  validateOptionalString(component.ariaLabel, `${path}/ariaLabel`);
  validateOptionalString(component.altText, `${path}/altText`);
  validateOptionalString(component.value, `${path}/value`, true);

  const panelStates = component.panelStates === undefined ? undefined : validatePanelStates(component.panelStates, `${path}/panelStates`);
  if (type === 'dynamicPanel' && (!panelStates || panelStates.length === 0)) {
    fail('FORMAT_INVALID_PANEL_STATE', `${path}/panelStates`, 'A dynamic panel requires at least one panel state.');
  }
  if (type !== 'dynamicPanel' && (panelStates !== undefined || component.initialPanelStateId !== undefined)) {
    fail('FORMAT_INVALID_PANEL_STATE', path, 'Only dynamic panels can declare panel states.');
  }

  const bounds = component.bounds === undefined ? undefined : validateBounds(component.bounds, `${path}/bounds`);
  const style = component.style === undefined ? undefined : validateStyle(component.style, `${path}/style`);

  return {
    id,
    pageId,
    type: type as Component['type'],
    ...(component.text === undefined ? {} : { text: component.text as string }),
    ...(component.visible === undefined ? {} : { visible: component.visible as boolean }),
    ...(component.name === undefined ? {} : { name: component.name as string }),
    ...(component.parentComponentId === undefined ? {} : { parentComponentId: component.parentComponentId as string }),
    ...(component.panelStateId === undefined ? {} : { panelStateId: component.panelStateId as string }),
    ...(panelStates === undefined ? {} : { panelStates }),
    ...(component.initialPanelStateId === undefined ? {} : { initialPanelStateId: component.initialPanelStateId as string }),
    ...(bounds === undefined ? {} : { bounds }),
    ...(style === undefined ? {} : { style }),
    ...(component.ariaLabel === undefined ? {} : { ariaLabel: component.ariaLabel as string }),
    ...(component.altText === undefined ? {} : { altText: component.altText as string }),
    ...(component.value === undefined ? {} : { value: component.value as string })
  };
}

function validateComponentRelationships(
  components: Component[],
  pageIds: Set<string>,
  componentById: Map<string, Component>
): void {
  for (const [index, component] of components.entries()) {
    const path = `/components/${index}`;
    if (!pageIds.has(component.pageId)) {
      fail('FORMAT_UNKNOWN_PAGE', `${path}/pageId`, `Component page '${component.pageId}' does not exist.`);
    }
    if (component.parentComponentId !== undefined) {
      const parent = componentById.get(component.parentComponentId);
      if (!parent) {
        fail('FORMAT_UNKNOWN_COMPONENT', `${path}/parentComponentId`, `Parent component '${component.parentComponentId}' does not exist.`);
      }
      if (parent.pageId !== component.pageId) {
        fail('FORMAT_INVALID_FIELD', `${path}/parentComponentId`, 'A component parent must belong to the same page.');
      }
    }
    if (component.panelStateId !== undefined) {
      const parent = component.parentComponentId === undefined ? undefined : componentById.get(component.parentComponentId);
      if (!parent || parent.type !== 'dynamicPanel') {
        fail('FORMAT_INVALID_PANEL_STATE', `${path}/panelStateId`, 'A panel-state child requires an immediate dynamic-panel parent.');
      }
      if (!parent.panelStates?.some((state) => state.id === component.panelStateId)) {
        fail('FORMAT_UNKNOWN_PANEL_STATE', `${path}/panelStateId`, `Panel state '${component.panelStateId}' does not exist on parent '${parent.id}'.`);
      }
    }
    if (component.type === 'dynamicPanel' && component.initialPanelStateId !== undefined) {
      if (!component.panelStates?.some((state) => state.id === component.initialPanelStateId)) {
        fail('FORMAT_UNKNOWN_PANEL_STATE', `${path}/initialPanelStateId`, `Initial panel state '${component.initialPanelStateId}' does not exist.`);
      }
    }
  }
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
  componentById: Map<string, Component>,
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
    validateBranch(branch, `${path}/branches/${branchIndex}`, seenIds, ownerIds, pageIds, componentIds, componentById, variableById)
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
  componentById: Map<string, Component>,
  variableById: Map<string, Variable>
): Branch {
  const branch = recordAt(input, path);
  const id = uniqueId(branch.id, `${path}/id`, seenIds);
  if (typeof branch.enabled !== 'boolean') {
    fail('FORMAT_INVALID_FIELD', `${path}/enabled`, 'Branch enabled must be a Boolean.');
  }
  const condition = validateCondition(branch.condition, `${path}/condition`, variableById);
  const actions = arrayAt(branch.actions, `${path}/actions`).map((action, actionIndex) =>
    validateAction(action, `${path}/actions/${actionIndex}`, seenIds, ownerIds, pageIds, componentIds, componentById, variableById)
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
  componentById: Map<string, Component>,
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

  if (type === 'setPanelState') {
    const componentId = requireComponent(action.componentId, `${path}/componentId`, componentIds);
    const component = componentById.get(componentId)!;
    if (component.type !== 'dynamicPanel') {
      fail('FORMAT_INVALID_PANEL_STATE', `${path}/componentId`, `Component '${componentId}' is not a dynamic panel.`);
    }
    const stateId = stringAt(action.stateId, `${path}/stateId`);
    if (!component.panelStates?.some((state) => state.id === stateId)) {
      fail('FORMAT_UNKNOWN_PANEL_STATE', `${path}/stateId`, `Panel state '${stateId}' does not exist on '${componentId}'.`);
    }
    return { id, type, componentId, stateId };
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

function validatePanelStates(input: unknown, path: string): PanelState[] {
  const seen = new Set<string>();
  return arrayAt(input, path).map((state, index) => {
    const statePath = `${path}/${index}`;
    const record = recordAt(state, statePath);
    const id = stringAt(record.id, `${statePath}/id`);
    if (seen.has(id)) {
      fail('FORMAT_DUPLICATE_ID', `${statePath}/id`, `Panel state '${id}' is duplicated.`);
    }
    seen.add(id);
    return { id, name: stringAt(record.name, `${statePath}/name`) };
  });
}

function validateBounds(input: unknown, path: string): ComponentBounds {
  const bounds = recordAt(input, path);
  const x = finiteNumberAt(bounds.x, `${path}/x`, false);
  const y = finiteNumberAt(bounds.y, `${path}/y`, false);
  const width = finiteNumberAt(bounds.width, `${path}/width`, true);
  const height = finiteNumberAt(bounds.height, `${path}/height`, true);
  return { x, y, width, height };
}

function validateStyle(input: unknown, path: string): ComponentStyle {
  const style = recordAt(input, path);
  for (const key of Object.keys(style)) {
    if (!styleKeys.has(key)) {
      fail('FORMAT_INVALID_FIELD', `${path}/${key}`, `Style property '${key}' is not supported.`);
    }
  }
  const result: ComponentStyle = {};
  for (const key of ['backgroundColor', 'borderColor', 'color'] as const) {
    if (style[key] !== undefined) {
      result[key] = safeColorAt(style[key], `${path}/${key}`);
    }
  }
  for (const key of ['borderRadius', 'fontSize', 'padding'] as const) {
    if (style[key] !== undefined) {
      result[key] = finiteNumberAt(style[key], `${path}/${key}`, false);
    }
  }
  if (style.fontWeight !== undefined) {
    const fontWeight = stringAt(style.fontWeight, `${path}/fontWeight`);
    if (!fontWeights.has(fontWeight)) {
      fail('FORMAT_INVALID_FIELD', `${path}/fontWeight`, `Unsupported font weight '${fontWeight}'.`);
    }
    result.fontWeight = fontWeight as Exclude<ComponentStyle['fontWeight'], undefined>;
  }
  if (style.textAlign !== undefined) {
    const textAlign = stringAt(style.textAlign, `${path}/textAlign`);
    if (!textAlignments.has(textAlign)) {
      fail('FORMAT_INVALID_FIELD', `${path}/textAlign`, `Unsupported text alignment '${textAlign}'.`);
    }
    result.textAlign = textAlign as Exclude<ComponentStyle['textAlign'], undefined>;
  }
  return result;
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

function finiteNumberAt(value: unknown, path: string, positive: boolean): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || (positive ? value <= 0 : value < 0)) {
    fail('FORMAT_INVALID_FIELD', path, positive ? 'Expected a positive finite number.' : 'Expected a nonnegative finite number.');
  }
  return value;
}

function safeColorAt(value: unknown, path: string): string {
  const color = stringAt(value, path);
  if (!/^#[0-9a-fA-F]{3,8}$|^[a-zA-Z]+$/.test(color)) {
    fail('FORMAT_INVALID_FIELD', path, 'Expected a simple named or hexadecimal color token.');
  }
  return color;
}

function validateOptionalString(value: unknown, path: string, allowEmpty = false): void {
  if (value !== undefined) {
    if (typeof value !== 'string' || (!allowEmpty && value.length === 0)) {
      fail('FORMAT_INVALID_FIELD', path, allowEmpty ? 'Expected a string.' : 'Expected a nonempty string.');
    }
  }
}

function validateOptionalBoolean(value: unknown, path: string): void {
  if (value !== undefined && typeof value !== 'boolean') {
    fail('FORMAT_INVALID_FIELD', path, 'Expected a Boolean.');
  }
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
