# MockupFX Implementation Plan

## 1. Development approach

MockupFX will be built in vertical slices around the public project format. The implementation must not start with a hosted dashboard or a polished canvas alone; those surfaces are valuable only when they read and produce a validated, portable project. Each slice includes format validation, runtime behavior, a fixture, tests, and user documentation.

The following commands are **proposed conventions** for the planned TypeScript monorepo. They become executable only when the project scaffold is added and must be tested before being presented as release instructions.

```text
pnpm install
pnpm dev
pnpm test
pnpm test:e2e
pnpm lint
pnpm typecheck
pnpm build
```

## 2. Capability map and build order

| Module ID | Responsibility | Depends on |
|---|---|---|
| `format-core` | Schema, IDs, validation, migration, fixtures | — |
| `runtime-core` | Event/branch/action execution, state, trace | `format-core` |
| `editor-shell` | Canvas, project tree, property panels, authoring commands | `format-core`, `runtime-core` |
| `exporter` | Deterministic static bundle, publication manifest, open project archive, and report data model | `format-core`, `runtime-core` |
| `report-renderers` | CSV, DOCX, PDF, Markdown, image, and asset-package generation | `exporter`, `publication-api` |
| `workspace-core` | Tenants, members, roles, workspace grants, audit events | — |
| `publication-api` | Immutable publication records, sharing policy, static object access | `exporter`, `workspace-core` |
| `review-service` | Comments, mentions, status, notification events | `publication-api`, `workspace-core` |
| `inspect-service` | Component metadata, measurements, style and asset APIs | `format-core`, `publication-api` |
| `admin-console` | Membership, settings, storage/email status, operations | `workspace-core`, `publication-api` |
| `self-hosting` | Containers, configuration, migrations, health, backup/runbooks | all server modules |

Build order: `format-core` and `workspace-core` in parallel; then `runtime-core`; then `editor-shell` and `exporter`; then `publication-api`; then `report-renderers`, `review-service`, and `inspect-service`; then `admin-console` and `self-hosting`.

## 3. Proposed repository layout

```text
apps/
  editor/                 Browser authoring application
  web/                    Hosted viewer, review, inspection, administration
services/
  api/                    HTTP API and authorization boundary
packages/
  format/                 Project schema, validation, migration
  runtime/                Deterministic prototype execution engine
  exporter/               Static bundle generation
  ui/                     Shared accessible component primitives
  sdk/                    Generated or maintained client SDK
  test-fixtures/          Open example projects and expected artifacts
infra/
  compose/                Reference self-hosted deployment
  helm/                   Deferred Kubernetes packaging
  migrations/             Database migrations
docs/                     Product, architecture, operations, governance
```

## 4. Milestones

### M0 — Foundations and trust boundaries

Deliver `format-core`, a public schema, JSON fixtures, validator CLI/library, migration framework, tenant/workspace schema, role checks, audit-event schema, and contribution automation. A project can be loaded and validated locally. No visual editor is required yet.

**Exit criteria:** Schema validation is deterministic; invalid references produce actionable errors; format fixtures round-trip; workspace authorization is covered by integration tests; no public API returns a secret field.

### M1 — Local interactive prototype

Deliver the runtime, basic authoring shell, components, pages, variables, responsive overrides, interaction editor, preview, and trace. A sample project demonstrates navigation, conditional behavior, show/hide, state change, and breakpoint inheritance.

**Exit criteria:** The same fixture has the same visible state and trace in editor preview and standalone runtime tests. Core keyboard paths have browser tests. Every M1 interaction requirement links to a fixture.

### M2 — Portable publication

Deliver static export, manifest validation, open project archives, immutable publication records, share policies, access-code verification, and viewer bootstrapping. Begin the shared report data model used by CSV, Word, PDF, Markdown, image, and asset-package renderers. A user can unzip an export and run it from a basic static server without an API dependency.

**Exit criteria:** Rebuilding unchanged input produces identical content hashes; a published viewer cannot retrieve unpublished revisions; expired/revoked policy denies access; export documentation is tested in a clean environment.

### M3 — Review and handoff

Deliver coordinate-aware comments, resolution state, notification events, element inspection, spacing, style/text metadata, and authorized asset downloads.

**Exit criteria:** A comment is always traceable to publication/page/coordinate; viewers cannot modify projects; selection metadata remains stable across reload; keyboard-only handoff use is covered by end-to-end tests.

### M4 — Operable self-hosting

Deliver reference containers, configuration validation, database migrations, bootstrap administrator, email test action, TLS guidance, health endpoints, backup/restore runbook, upgrade/rollback path, and operational dashboards/logging guidance.

**Exit criteria:** A clean deployment, backup, restore, upgrade, and rollback are rehearsed on supported environments. All operations documentation is versioned with the release.

## 5. Test strategy

| Test layer | Scope | Required examples |
|---|---|---|
| Unit | Schema validation, state resolver, condition evaluator, action executor, access-policy reducer | Missing target, disabled action, first matching branch, responsive override reset |
| Integration | API, database, object storage, authorization, migrations | Cross-tenant rejection, revoked access code, immutable publication, audit event written |
| Browser end-to-end | Canvas interaction, preview, viewer, comments, inspection, keyboard path | Create component, define interaction, publish, comment, inspect, download asset |
| Export compatibility | Static bundle and manifest | Open from local server, hash stability, current browser smoke tests |
| Accessibility | Keyboard, focus, semantic names, contrast, reduced motion | Comment creation, element selection, copy style, dialog dismissal |
| Operations | Container start, health, backup, restore, upgrade | Clean install and recovery of a fixture tenant |

Coverage must be assessed by behavior rather than a percentage alone. Each requirement identifier in [Product Requirements](../product/PRODUCT-REQUIREMENTS.md) must map to at least one automated test or an explicitly documented manual verification procedure before a stable release.

## 6. Implementation boundaries

**Always do:** Validate all untrusted inputs, keep public format changes versioned, test authorization server-side, include migration/rollback thinking in storage changes, preserve accessibility in user-facing flows, and update documentation alongside behavior.

**Ask before:** Adding a dependency with runtime impact, modifying a public schema, changing API versioning, changing role semantics, changing default retention, adding tracking/telemetry, changing CI release credentials, or introducing arbitrary script execution.

**Never do:** Commit secrets or access codes; make client-side authorization authoritative; mutate published artifacts; overwrite a user project during migration; remove a failing test to make CI pass; place private data in static exports or public fixtures.

## 7. Definition of done for a module

A module is ready to merge only when it has a documented interface, input validation, tests for normal and failure behavior, observability/error handling, updated fixtures where applicable, accessibility review for UI changes, and requirement traceability. If it changes a document or public contract, it must include migration or compatibility notes.

## References

[1]: ../product/PRODUCT-REQUIREMENTS.md "MockupFX Product Requirements"
[2]: ../architecture/ARCHITECTURE.md "MockupFX Target Architecture"
