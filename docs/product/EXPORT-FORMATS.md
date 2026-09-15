# MockupFX Publishing and Export Formats

## Purpose

MockupFX must let teams publish or export the right representation of a prototype for the recipient. A reviewer needs an interactive browser experience; a developer needs machine-readable metadata and assets; a project manager may need a Word or PDF handoff packet; and an organization may need a CSV extract of review activity. These are different outputs from the same immutable publication, not competing project formats.

> **Implementation status:** This is the target export contract for the initial releases. The formats listed as **MVP** are planned commitments and will be marked implemented only after test fixtures verify them.

## Export matrix

| Output | Recipient and use | MVP contents | Delivery form | Important limits |
|---|---|---|---|---|
| **Interactive web bundle** | Reviewers, usability testing, self-hosting | HTML, CSS, JavaScript, permitted assets, publication manifest | Directory and ZIP archive | Preserves supported interactions; does not include editable project history or secrets |
| **Open project archive** | Authors, version control, migration, independent implementations | `mockupfx.project.json`, assets, format/version manifest | Directory and ZIP archive | Editable canonical artifact; excludes workspace accounts, passwords, audit logs, and access-code values |
| **Publication JSON** | Integrators, archives, automation | Publication metadata, page map, share-safe manifest, element IDs, optional inspection metadata | JSON | Does not expose private project fields, credentials, or policies beyond the caller's authorization |
| **CSV workbook set** | Project managers, QA, operational reporting | Screen/page inventory, component inventory, variable inventory, comment/thread export, asset inventory | One UTF-8 CSV file per dataset plus README | CSV cannot represent nesting, interactions, or rich styling losslessly; it is an inventory/reporting export, not a prototype interchange format |
| **Word handoff report** | Stakeholders, developers, procurement, compliance review | Title/cover, publication identity, page thumbnails, screen specifications, interaction summary, comments, accessibility notes, asset appendix | `.docx` | Generated layout is a report, not a re-importable project; embedded images may increase file size |
| **PDF handoff report** | Read-only distribution, records, printing | Same selected report content as Word, with fixed pagination and hyperlinks where supported | PDF/A target where practical | PDF does not preserve interactions beyond links and does not replace the browser prototype |
| **Markdown report** | Repositories, issue trackers, lightweight review | Publication summary, page index, interaction outline, comments, handoff links, selected metadata | `.md` plus optional asset folder | Complex visual layout and binary assets are linked, not embedded by default |
| **Image package** | Presentations, tickets, documentation | One rendered image per selected page/view, page manifest, optional annotations | PNG by default; SVG only for a wholly vector-compatible renderer | Raster images do not preserve selectable text, state, or interactions; SVG availability depends on component support |
| **Asset package** | Development teams and content operations | Original permitted assets, rendered derivatives, filename map, metadata, license/attribution fields when present | Directory and ZIP archive | Export is governed by workspace/publication policy and source-asset rights |

## Publishing modes

Publishing creates an immutable **publication**. It may be delivered as a hosted review URL, an interactive static bundle, or a selected report/export package. Republishing creates a new publication version. Each output must identify its project ID, publication ID, generator version, generated timestamp, and source format version so that a recipient can determine exactly what it represents.

| Mode | Use | Access behavior |
|---|---|---|
| **Local preview** | Fast author validation | Not shareable by default; may be regenerated freely |
| **Hosted publication** | Online review, feedback, inspection | Enforces public, link-only, or authenticated policy; uses an access-code verifier when configured |
| **Static export** | Independent hosting and offline transfer | Access policy is applied at export time; a recipient who receives the files may access their contents |
| **Report/export package** | Handoff, record keeping, analytics | Contains only fields the exporter is allowed to read; includes sensitivity notice and publication metadata |

## Export requirements

- **MFX-EXP-001:** Export requests must reference a specific immutable publication, not a mutable working project, unless the output is explicitly identified as a local draft.
- **MFX-EXP-002:** Every exported package must include a machine-readable manifest with project ID, publication ID, output type, format version, generator version, timestamp, locale, and a content-hash inventory.
- **MFX-EXP-003:** The interactive web bundle must remain usable from ordinary static hosting and must not call MockupFX APIs merely to render its included prototype.
- **MFX-EXP-004:** The open project archive must contain the canonical open project document and referenced assets in a documented layout. It must be sufficient for a compatible editor to validate and open the project.
- **MFX-EXP-005:** CSV exports must use UTF-8 with a byte-order mark only when needed for interoperability, RFC 4180-compatible escaping, a documented delimiter, ISO 8601 timestamps, and stable column headings. Each CSV must be accompanied by a data dictionary README.
- **MFX-EXP-006:** CSV exports must include only flattened inventory/reporting data. They must never be presented as a lossless export of component hierarchy, interaction logic, or responsive overrides.
- **MFX-EXP-007:** Word reports must use Office Open XML (`.docx`) and include semantic headings, alt text for generated images, accessible table headers, page identifiers, publication metadata, and an export scope statement.
- **MFX-EXP-008:** PDF reports must be generated from the same canonical report model as Word, preserve a logical heading structure where the renderer supports it, include page numbers and publication metadata, and flag any content that could not be represented accessibly.
- **MFX-EXP-009:** Markdown reports must use GitHub-flavored Markdown, relative links where a package contains assets, and reference-style URLs for external links.
- **MFX-EXP-010:** Image exports must identify the source page, viewport/responsive view, scale, and renderer version in the package manifest. SVG export is allowed only when the renderer can preserve the selected content faithfully.
- **MFX-EXP-011:** Asset exports must preserve original filenames where safe, provide a normalized filename map, include content type and hash, and retain license/attribution metadata when supplied by the author.
- **MFX-EXP-012:** Export generation must enforce the caller's role and the publication's access policy. It must omit secrets, password hashes, API keys, raw access codes, private audit fields, and other data outside the selected export scope.
- **MFX-EXP-013:** An export job must be auditable. The audit event records actor, publication, output type, scope, time, outcome, and a correlation ID; it must not record sensitive content or raw access codes.
- **MFX-EXP-014:** A user must be able to select pages, responsive views, open/resolved feedback, and metadata categories before generating a report or CSV package. The selection must be recorded in the export manifest.
- **MFX-EXP-015:** Export generation must fail with clear diagnostics for an unavailable asset, unsupported component, incompatible format version, inaccessible data, or oversized output. Partial outputs must be clearly marked and must not silently omit content.

## Suggested CSV datasets

A selected publication may produce the following independent CSV files. The generator includes only datasets the exporter is permitted to access.

| Filename | One row per | Example columns |
|---|---|---|
| `pages.csv` | Page/responsive view | `page_id`, `page_name`, `parent_page_id`, `view_id`, `viewport_min`, `viewport_max`, `publication_id` |
| `components.csv` | Component instance | `component_id`, `page_id`, `parent_component_id`, `type`, `name`, `x`, `y`, `width`, `height`, `visible`, `semantic_role` |
| `interactions.csv` | Event/branch/action record | `interaction_id`, `owner_component_id`, `event`, `branch_index`, `condition_summary`, `action_index`, `action_type`, `target_id`, `enabled` |
| `variables.csv` | Declared variable | `variable_id`, `name`, `type`, `scope`, `initial_value_redacted`, `description` |
| `comments.csv` | Comment message | `thread_id`, `comment_id`, `publication_id`, `page_id`, `component_id`, `x`, `y`, `author_display_name`, `created_at`, `status`, `body` |
| `assets.csv` | Asset | `asset_id`, `filename`, `content_type`, `byte_size`, `sha256`, `attribution`, `download_included` |
| `export-audit.csv` | Export event, administrator-only | `event_id`, `actor_id_pseudonymous`, `publication_id`, `output_type`, `scope`, `created_at`, `outcome`, `correlation_id` |

The `interactions.csv` file intentionally flattens the ordered tree into rows with indices. It is useful for review, filtering, and compliance export, but the open project archive remains the only lossless interchange format for interaction behavior.

## Word and PDF report structure

The report generator uses a presentation-neutral intermediate report model, then renders it to DOCX, PDF, or Markdown. This avoids divergent content between formats and makes the output testable. The default report contains an executive summary, export scope, project and publication identity, page index, annotated thumbnails, component/measurement selections, interaction outline, feedback summary, accessibility notes, asset appendix, and a limitations statement.

Authors can select a short stakeholder report, a developer-handoff report, a review-comment report, or a full archive report. A report must clearly distinguish an editable source project from a read-only report and link to the interactive publication when a link is available.

## Security, privacy, and retention

An export is a data-disclosure event. Before generation, the system must evaluate the user's role, the publication's visibility, source-asset download restrictions, guest-comment data policy, and any organization data-export policy. The UI must warn that a static bundle or downloaded file can be redistributed outside MockupFX's access controls.

Exports include no raw access code, password verifier, API key, session, internal-only audit field, or asset that the exporter is not authorized to download. Guest reviewer email addresses are excluded from general CSV, Word, PDF, and Markdown reports by default; organization administrators may receive a documented, privacy-reviewed option for restricted operational export.

## Test fixtures and acceptance tests

The implementation must include a compact public fixture containing two pages, a mobile override, nested components, a conditional interaction, two comments, a permitted image asset, and a hidden component. Tests must validate that each selected export includes the expected publication ID; CSV values parse without corruption; DOCX opens in a compatible reader; PDF contains expected headings; the static bundle opens from a local HTTP server; Markdown links resolve within its package; hashes are stable for deterministic builds; and unauthorized fields are absent.

## References

[1]: ../product/PRODUCT-REQUIREMENTS.md "MockupFX Product Requirements"
[2]: ../architecture/ARCHITECTURE.md "MockupFX Target Architecture"
