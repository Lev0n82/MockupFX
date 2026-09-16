import JSZip from 'jszip';
import type { ProjectDocument } from '@mockupfx/format';

export interface WordReportOptions {
  publicationId: string;
  generatedAt?: string;
}

export interface WordReport {
  bytes: Uint8Array;
  entries: string[];
  documentXml: string;
}

export async function createWordReport(project: ProjectDocument, options: WordReportOptions): Promise<WordReport> {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const documentXml = createDocumentXml(project, options.publicationId);
  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypesXml());
  zip.file('_rels/.rels', rootRelationshipsXml());
  zip.file('docProps/core.xml', corePropertiesXml(project.project.name, generatedAt));
  zip.file('word/document.xml', documentXml);
  zip.file('word/_rels/document.xml.rels', documentRelationshipsXml());
  zip.file('word/styles.xml', stylesXml());
  const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  return {
    bytes,
    entries: Object.keys(zip.files).sort(),
    documentXml
  };
}

function createDocumentXml(project: ProjectDocument, publicationId: string): string {
  const paragraphs = [
    heading(project.project.name, 'Heading1'),
    paragraph(`MockupFX Word handoff report for project ${project.project.id}.`),
    heading('Export scope', 'Heading1'),
    paragraph('This report is a read-only handoff artifact. It does not contain raw variable initial values, secrets, user accounts, comments, or access controls.'),
    metadataTable([
      ['Project ID', project.project.id],
      ['Publication ID', publicationId],
      ['Source format', project.formatVersion]
    ]),
    heading('Pages', 'Heading1'),
    ...project.pages.flatMap((page) => [heading(page.name, 'Heading2'), paragraph(`Page identifier: ${page.id}.`)]),
    heading('Interactions', 'Heading1'),
    paragraph(`${project.interactions.length} interaction definitions are included in the source project.`),
    heading('Accessibility statement', 'Heading1'),
    paragraph('The HTML preview renderer uses native controls, labelled form controls, visible focus defaults, stable component identifiers, and escaped authored text. Color contrast and author-supplied assets require project-level review.'),
    heading('Limitations', 'Heading1'),
    paragraph('This DOCX is a report, not an editable MockupFX project or interactive prototype. Dynamic panel runtime behavior is summarized rather than executable.')
  ].join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr></w:body></w:document>`;
}

function heading(text: string, style: 'Heading1' | 'Heading2'): string {
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
}

function paragraph(text: string): string {
  return `<w:p><w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function metadataTable(rows: Array<[string, string]>): string {
  const header = '<w:tr><w:trPr><w:tblHeader/></w:trPr><w:tc><w:p><w:r><w:t>Field</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Value</w:t></w:r></w:p></w:tc></w:tr>';
  const body = rows.map(([label, value]) => `<w:tr><w:tc><w:p><w:r><w:t>${escapeXml(label)}</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>${escapeXml(value)}</w:t></w:r></w:p></w:tc></w:tr>`).join('');
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/></w:tblPr>${header}${body}</w:tbl>`;
}

function contentTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
}

function rootRelationshipsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
}

function documentRelationshipsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
}

function corePropertiesXml(title: string, generatedAt: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(title)}</dc:title><dc:creator>MockupFX</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${escapeXml(generatedAt)}</dcterms:created></cp:coreProperties>`;
}

function stylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/></w:style></w:styles>`;
}

function escapeXml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' })[character]!);
}
