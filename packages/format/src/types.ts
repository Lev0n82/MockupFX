export type VariableType = 'string' | 'number' | 'boolean';

export type VariableValue = string | number | boolean;

export interface ProjectDocument {
  formatVersion: '0.1.0';
  project: ProjectMetadata;
  pages: Page[];
  components: Component[];
  variables: Variable[];
  interactions: Interaction[];
}

export interface ProjectMetadata {
  id: string;
  name: string;
  startPageId: string;
}

export interface Page {
  id: string;
  name: string;
  rootComponentId: string;
}

export type ComponentType = 'text' | 'button' | 'container' | 'image';

export interface Component {
  id: string;
  pageId: string;
  type: ComponentType;
  text?: string;
  visible?: boolean;
}

export interface Variable {
  id: string;
  type: VariableType;
  initialValue: VariableValue;
}

export interface Interaction {
  id: string;
  ownerId: string;
  event: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  enabled: boolean;
  condition: Condition;
  actions: Action[];
}

export type Condition = LiteralCondition | VariableEqualsCondition | VariableIsTruthyCondition;

export interface LiteralCondition {
  type: 'literal';
  value: boolean;
}

export interface VariableEqualsCondition {
  type: 'variableEquals';
  variableId: string;
  expected: VariableValue;
}

export interface VariableIsTruthyCondition {
  type: 'variableIsTruthy';
  variableId: string;
}

export type Action = NavigateAction | SetVariableAction | SetTextAction | SetVisibilityAction | EmitAction;

export interface NavigateAction {
  id: string;
  type: 'navigate';
  pageId: string;
  mode: 'push' | 'replace';
}

export interface SetVariableAction {
  id: string;
  type: 'setVariable';
  variableId: string;
  value: VariableValue;
}

export interface SetTextAction {
  id: string;
  type: 'setText';
  componentId: string;
  text: string;
}

export interface SetVisibilityAction {
  id: string;
  type: 'setVisibility';
  componentId: string;
  visible: boolean;
}

export interface EmitAction {
  id: string;
  type: 'emit';
  ownerId: string;
  event: string;
}
