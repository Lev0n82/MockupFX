import { describe, expect, it } from 'vitest';

import { createCsvReport } from '@mockupfx/exporter';
import { complexDashboardProject } from '@mockupfx/test-fixtures';

describe('createCsvReport', () => {
  it('creates RFC 4180-compatible inventory files and redacts initial variable values', () => {
    const project = structuredClone(complexDashboardProject);
    project.components.find((component) => component.id === 'component_status_heading')!.name = 'Heading, "primary"';
    const report = createCsvReport(project, { publicationId: 'publication_complex_001' });

    expect(Object.keys(report.files).sort()).toEqual(['README.md', 'components.csv', 'interactions.csv', 'pages.csv', 'variables.csv']);
    expect(report.files['components.csv']).toContain('"Heading, ""primary"""');
    expect(report.files['components.csv']).toContain('\r\n');
    expect(report.files['variables.csv']).toContain('[redacted]');
    expect(report.files['variables.csv']).not.toContain('Disconnected');
    expect(report.files['README.md']).toContain('flattened inventory');
    expect(report.files['pages.csv']).toContain('publication_complex_001');
  });
});
