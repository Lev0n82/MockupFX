import type { Action, ProjectDocument } from '@mockupfx/format';

export interface CsvReportOptions {
  publicationId: string;
}

export interface CsvReport {
  files: Record<string, string>;
}

export function createCsvReport(project: ProjectDocument, options: CsvReportOptions): CsvReport {
  const files: Record<string, string> = {
    'pages.csv': toCsv(
      ['page_id', 'page_name', 'root_component_id', 'publication_id'],
      project.pages.map((page) => [page.id, page.name, page.rootComponentId, options.publicationId])
    ),
    'components.csv': toCsv(
      ['component_id', 'page_id', 'parent_component_id', 'type', 'name', 'x', 'y', 'width', 'height', 'visible', 'semantic_role', 'publication_id'],
      project.components.map((component) => [
        component.id,
        component.pageId,
        component.parentComponentId ?? '',
        component.type,
        component.name ?? '',
        component.bounds?.x ?? '',
        component.bounds?.y ?? '',
        component.bounds?.width ?? '',
        component.bounds?.height ?? '',
        String(component.visible ?? true),
        semanticRole(component.type),
        options.publicationId
      ])
    ),
    'variables.csv': toCsv(
      ['variable_id', 'type', 'initial_value_redacted', 'publication_id'],
      project.variables.map((variable) => [variable.id, variable.type, '[redacted]', options.publicationId])
    ),
    'interactions.csv': toCsv(
      ['interaction_id', 'owner_component_id', 'event', 'branch_index', 'condition_summary', 'action_index', 'action_type', 'target_id', 'enabled', 'publication_id'],
      project.interactions.flatMap((interaction) =>
        interaction.branches.flatMap((branch, branchIndex) =>
          branch.actions.map((action, actionIndex) => [
            interaction.id,
            interaction.ownerId,
            interaction.event,
            branchIndex,
            conditionSummary(branch.condition),
            actionIndex,
            action.type,
            actionTarget(action),
            String(branch.enabled),
            options.publicationId
          ])
        )
      )
    ),
    'README.md': [
      '# MockupFX CSV inventory export',
      '',
      'This package is a **flattened inventory** for reporting and review. It is not a lossless project interchange format and does not preserve component hierarchy, ordered interaction semantics, dynamic panel behavior, or runtime state.',
      '',
      `Project: ${project.project.id}`,
      `Publication: ${options.publicationId}`,
      '',
      'Initial variable values are intentionally represented as `[redacted]`.'
    ].join('\n') + '\n'
  };
  return { files };
}

function toCsv(headers: string[], rows: Array<Array<string | number>>): string {
  return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function semanticRole(type: ProjectDocument['components'][number]['type']): string {
  const roles: Record<ProjectDocument['components'][number]['type'], string> = {
    text: 'text',
    button: 'button',
    container: 'group',
    image: 'img',
    dynamicPanel: 'region',
    master: 'group',
    input: 'textbox',
    checkbox: 'checkbox'
  };
  return roles[type];
}

function conditionSummary(condition: ProjectDocument['interactions'][number]['branches'][number]['condition']): string {
  if (condition.type === 'literal') return String(condition.value);
  if (condition.type === 'variableIsTruthy') return `${condition.variableId} is truthy`;
  return `${condition.variableId} equals ${String(condition.expected)}`;
}

function actionTarget(action: Action): string {
  if ('componentId' in action) return action.componentId;
  if ('variableId' in action) return action.variableId;
  if ('pageId' in action) return action.pageId;
  if ('ownerId' in action) return action.ownerId;
  return '';
}
