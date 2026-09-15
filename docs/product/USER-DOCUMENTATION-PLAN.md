# MockupFX User Documentation Plan

This document defines the user-facing documentation that must ship with, or precede, each MockupFX release. It is not a claim that the listed user interfaces already exist. Its purpose is to prevent the project from delivering a capability without a learnable, accessible, and self-hostable explanation.

## Documentation principles

Every guide must start with the reader's outcome, identify prerequisites, use an original MockupFX example project, describe how to recover from a common mistake, and state whether a feature is local-only, published, or administrator-controlled. Tutorials must not require a proprietary hosted service or a closed project file.

The reference archive groups documentation into product reference, tutorials, publishing, organization, discussion, inspection, troubleshooting, and administration. MockupFX adopts that breadth as a documentation standard while defining its own terminology and workflows.[1]

## Required documentation by release

| Release gate | Required user documents | Completion signal |
|---|---|---|
| **Format alpha** | Project file reference, versioning policy, migration guide, example project catalog | A contributor can create and validate a project without relying on an unpublished schema |
| **Authoring alpha** | Quickstart, canvas/components reference, pages/layers guide, variables guide, interaction guide, responsive-view guide, preview debugging guide | A new author can create a two-page responsive interactive mockup in 30 minutes or less |
| **Review beta** | Export guide, publication/sharing guide, access-code guide, comment guide, reviewer guide, accessibility guide | A reviewer can access a protected link and resolve a coordinate-aware comment without live support |
| **Handoff beta** | Inspection guide, asset download guide, style/measurement reference, implementation caveats, developer FAQ | A developer can retrieve dimensions, text, color, and allowed assets from a test project |
| **Self-hosted 1.0** | Installation, configuration, authentication, roles, workspaces, backup/restore, upgrades, observability, troubleshooting, security hardening | An administrator can deploy and restore the reference stack in a clean environment |

## Planned information architecture

### Getting started

The getting-started path will contain a five-minute overview, local prerequisites, first project creation, first component, first interaction, browser preview, and static export. It will end with a clear decision: share a bundle locally, use a future managed host, or deploy a self-hosted instance.

### Authoring reference

The reference section will define the canvas, project tree, components, components' stable IDs, grouping, layers, pages, assets, variables, interactions, conditions, action ordering, error tracing, and responsive inheritance. Each page must distinguish persistent project data from view-specific overrides.

### Review and collaboration

Review documentation will explain publication versions, share modes, access code handling, feedback pins, comment threads, guest identity settings, mention notifications, resolution state, version warnings, and content moderation. It will tell reviewers how to preserve useful context when filing a comment and administrators how to disable or scope guest feedback.

### Publishing and export

Export documentation will explain when to use an interactive static web bundle, canonical open project archive, publication JSON, CSV datasets, Word handoff report, PDF record, Markdown report, image package, or asset package. It will make clear that CSV and reports are derived views rather than editable or lossless prototype interchange formats. Each guide will cover selection scope, access enforcement, expected metadata, confidentiality warnings, and recovery from unavailable or unsupported content.

### Developer handoff

The handoff section will explain what inspection values mean, the coordinate origin and units, how spacing is calculated, how to download assets, why CSS hints are not production code, and how to link an issue to a selected component or published version. It will document what the platform cannot infer, including backend behavior, semantic intent absent from the project, and exact final application implementation.

### Administration and self-hosting

Administrator documentation will cover tenant structure, workspace roles, membership lifecycle, visibility policies, audit events, storage, email, TLS, database migration, backup, restore, upgrade, incident response, and data deletion. Procedures must include command-level examples only after the reference deployment is implemented and tested.

## Documentation quality gates

- Each guide must have a stable URL, a title that describes the task, a compatible product/version range, and a last-tested release.
- Each product feature must link to its reference page from the relevant UI and from the release notes.
- Screenshots, video, and diagrams must have text alternatives and must not be the only source of task-critical instructions.
- Every command must be copyable, specify its operating-system assumptions, and state expected success or error output.
- Tutorial fixtures must be open, versioned, small enough to download quickly, and licensed for redistribution.
- Troubleshooting pages must name observable symptoms, likely causes, safe diagnostics, recovery steps, and escalation boundaries.

## Proposed documentation backlog

| ID | Title | Owner type | Depends on |
|---|---|---|---|
| DOC-001 | First prototype quickstart | Product documentation | Project format and canvas alpha |
| DOC-002 | Interaction model reference | Runtime documentation | Event/branch/action schema |
| DOC-003 | Responsive inheritance guide | Product documentation | Responsive resolver |
| DOC-004 | Publish and static-export guide | Release documentation | Bundle generator |
| DOC-004A | CSV, Word, PDF, Markdown, image, and asset export guide | Release documentation | Canonical report model and renderers |
| DOC-005 | Review and comment guide | Collaboration documentation | Comment service and viewer |
| DOC-006 | Inspect and handoff guide | Developer experience documentation | Inspection metadata API |
| DOC-007 | Workspace administration guide | Administrator documentation | RBAC and audit API |
| DOC-008 | Self-hosted installation guide | Operations documentation | Reference deployment |
| DOC-009 | Backup, restore, and upgrade runbook | Operations documentation | Migration and object-store design |
| DOC-010 | Accessibility conformance statement | Accessibility lead | Viewer and editor audit |

## References

[1]: https://archive.axure.com/all-documentation/ "Axure documentation archive"
