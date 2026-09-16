import { describe, expect, it } from 'vitest';

import { createWordReport } from '@mockupfx/exporter';
import { complexDashboardProject } from '@mockupfx/test-fixtures';

describe('createWordReport', () => {
  it('creates an Office Open XML package with report headings and scope', async () => {
    const report = await createWordReport(complexDashboardProject, {
      publicationId: 'publication_complex_001',
      generatedAt: '2026-09-16T12:00:00.000Z'
    });

    expect(report.bytes.subarray(0, 2)).toEqual(new Uint8Array([0x50, 0x4b]));
    expect(report.entries).toEqual(expect.arrayContaining(['[Content_Types].xml', '_rels/.rels', 'docProps/core.xml', 'word/document.xml']));
    expect(report.documentXml).toContain('Operations dashboard');
    expect(report.documentXml).toContain('Export scope');
    expect(report.documentXml).toContain('Connection details');
    expect(report.documentXml).toContain('Accessibility statement');
    expect(report.documentXml).toContain('Heading1');
  });
});
