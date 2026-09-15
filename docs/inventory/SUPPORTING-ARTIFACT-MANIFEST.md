# MockupFX Supporting Artifact Manifest

## Purpose

MockupFX cannot be credibly open source with a feature list alone. Each capability must have public contracts, fixtures, automated conformance evidence, operational procedures, and user documentation. This manifest records the **supporting artifacts required before a capability may be represented as supported**.

All entries are currently **planned**, unless a future release directory marks them implemented and links the commit, release, and test evidence. Artifact identifiers are referenced from the [Full Capability Inventory](FULL-CAPABILITY-INVENTORY.md).

## Artifact status and ownership model

| Status | Meaning |
|---|---|
| **Planned** | Required for a future phase; no implementation or support claim exists |
| **Draft** | Initial document/specification exists but conformance evidence is incomplete |
| **Implemented** | Source and interface exist; automated evidence links to a release |
| **Supported** | Implemented artifact meets the published support, security, accessibility, and operations bar |
| **Deprecated** | Supported only for the declared compatibility window; migration path is documented |

No capability is **Supported** until all applicable product, technical, security, accessibility, and operational artifact families are complete.

## A. Canonical model and semantic contracts

| ID | Required artifact | Planned repository path | Purpose and acceptance evidence |
|---|---|---|---|
| `ART-01` | Canonical project bundle specification | `specs/project-bundle/` | Versioned JSON Schema for project, page, component, asset, variable, annotation, dataset, responsive view and project manifest. Includes stable-ID, reference, serialization, migration, deletion, and asset-layout rules. Validator fixtures must prove valid/invalid bundles and round-trip preservation. |
| `ART-02` | Compatibility, revision, and migration policy | `specs/compatibility/` | Semantic version policy, backward/forward compatibility, migration contract, immutable revision/snapshot manifest, rollback and deprecation windows. Migration test corpus proves every supported predecessor upgrade. |
| `ART-03` | Runtime behavior contract | `specs/runtime/` | Normative event, branch, condition, effect, state, expression, timer, navigation, responsive transition, error and trace-replay semantics. Executable examples define ordering and reentrancy limits. |
| `ART-04` | Public API and adapter contract | `specs/api/` | Versioned API schemas for editor/server/CLI interactions plus capability negotiation for optional providers. Contract tests demonstrate no provider is required for local operation. |
| `ART-05` | Publication and static bundle specification | `specs/publication/` | Immutable publication manifest, static directory layout, route/asset resolution, URL state, profile configuration, debug exclusion, font policy, hashes and archive layout. Browser fixture proves ordinary static hosting. |
| `ART-06` | Package ecosystem contract | `specs/packages/` | Library/template/extension/font/asset manifest, semver, dependency/lockfile, provenance/license, trust/signing, sandbox/CSP, revocation, compatibility and vulnerability policy. |
| `ART-07` | Annotation and documentation IR | `specs/annotations-and-docs/` | Typed field model, annotations, fieldsets, report intermediate representation, scope/filter semantics, screenshot metadata and deterministic document templates. |
| `ART-08` | Export format contract | `specs/exports/` | Open project archive, publication JSON, CSV dictionaries, DOCX/PDF report semantics, Markdown, image and asset package manifests, authorization, privacy, accessibility and reproducibility requirements. |
| `ART-09` | Collaboration, identity, and audit model | `specs/collaboration/` | Tenant/workspace/membership/grant, publication/share/comment/thread/notification, access-code, revision anchoring, lifecycle, retention and append-only audit event schemas. |
| `ART-10` | Interoperability and provenance contract | `specs/interoperability/` | Normalized screen/layer schema, adapter interface, source-node mapping, fidelity levels, import diagnostics, editable/flattened fallback, re-import/diff and local-change conflict policy. |
| `ART-11` | Inspection and handoff metadata contract | `specs/inspection/` | Authored/computed geometry/style/text/asset metadata, redline semantics, units/rounding, node-to-render mapping, CSS-like declaration limitations, authorization and export policy. |
| `ART-12` | Deployment configuration contract | `specs/deployment/` | Typed configuration schema, secret policy, topology, preflight, database/storage abstraction, health/readiness, migration, backup/restore and support-matrix interface. |
| `ART-13` | Accessibility conformance baseline | `specs/accessibility/` | Keyboard command map, focus/announcement contract, contrast/motion requirements, semantic export rules, custom-widget obligations, supported assistive-technology matrix and exception process. |
| `ART-14` | Optional provider adapter contract | `specs/providers/` | Hosting, SAML, directory, notification and external-design adapter interfaces, credential handling, scopes, failure/retry/revocation, compatibility and support lifecycle. |

## B. Reference modules and tooling

| ID | Required module/tool | Planned repository path | Purpose and acceptance evidence |
|---|---|---|---|
| `MOD-01` | Document engine | `packages/document-engine/` | Read/write/validate/migrate/atomic-save/autosave/revision/undo core. Unit, property, recovery and round-trip tests are mandatory. |
| `MOD-02` | Editor shell and command system | `apps/editor/`, `packages/commands/` | Dockable panes, preferences, page/tree navigation, keyboard command registry, key conflict handling and accessible focus restoration. Browser accessibility tests are mandatory. |
| `MOD-03` | Canvas and geometry engine | `packages/canvas/` | Viewport, hit testing, selection, transform, groups, guides, snapping, alignment, distribution and layers. Geometry/property fuzzing plus visual regression are mandatory. |
| `MOD-04` | Core widget registry | `packages/widgets/` | Built-in component schemas, insertion/renderer/editor adapters and safe unknown-type fallback. Every widget has serialization and render fixtures. |
| `MOD-05` | Style and layout resolver | `packages/style-layout/` | Tokens, effects, page styles, property cascade, responsive layout, text/font metrics and contrast checks. Browser screenshots and precedence tests are mandatory. |
| `MOD-06` | Component system | `packages/components/` | Definitions, instances, variants, override/detach, dependency graph and cycle checks. Fixture tests cover propagation, deletion and nested use. |
| `MOD-07` | Library/package manager | `packages/library-manager/` | Import, validation, browsing/search, metadata/thumbs, provenance and package sandbox enforcement. Malicious package fixtures are mandatory. |
| `MOD-08` | Annotation service | `packages/annotations/` | Notes, typed fields, fieldsets, assignment/reordering/filtering and report bindings. Schema/migration/export tests are mandatory. |
| `MOD-09` | Documentation/report renderer | `packages/reporting/` | Canonical report IR plus CSV/DOCX/PDF/Markdown/image/asset outputs. Golden output, document accessibility and deterministic hash tests are mandatory. |
| `MOD-10` | Selective import/export pipeline | `packages/interchange/` | Dependency closure, dry-run, collision policy, merge/replace/skip/abort and partial import behavior. Mutation safety tests are mandatory. |
| `MOD-11` | Interaction dispatcher | `packages/runtime/` | Event dispatch, ordered branches/effects, timers, synthetic events, trace and reentrancy guard. Trace-replay fixtures are mandatory. |
| `MOD-12` | State and expression engine | `packages/runtime-state/` | Scopes, values, bindings, predicates, sandboxed expression evaluation and reset. Parser fuzzing/security tests are mandatory. |
| `MOD-13` | Action/effect adapters | `packages/runtime-effects/` | Navigation, presentation, geometry, focus, scroll and component effects with typed errors. Browser integration fixtures are mandatory. |
| `MOD-14` | Stateful container runtime | `packages/containers/` | States, overlays, scroll/drag/swipe/pinning/fit-content and accessibility-aware focus management. Touch/keyboard test matrix is mandatory. |
| `MOD-15` | Repeating data runtime | `packages/data-views/` | Dataset, bindings, CSV/JSON inputs, layout/pagination/sorting/filtering/mutation. Stable ordering and malformed-data tests are mandatory. |
| `MOD-16` | Responsive resolver | `packages/responsive/` | Breakpoints, inheritance, overrides, manual/automatic mode and view-change events. Boundary-width fixtures are mandatory. |
| `MOD-17` | Transition adapter | `packages/motion/` | Optional animation, duration/easing/cancellation, reduced motion and performance controls. Motion/interruption tests are mandatory before release. |
| `MOD-18` | Preview and diagnostic runtime | `packages/preview/` | Local preview, profiles, state inspector, trace viewer and redacted diagnostics. Production build exclusion must be tested. |
| `MOD-19` | Static exporter | `packages/exporter/` | Browser bundle, assets, fonts, routes, profiles and manifests. Reproducible output and static-host tests are mandatory. |
| `MOD-20` | Player/viewer | `apps/viewer/` | Accessible route/player shell, scaling, overlays, URL state, responsive/mobile behavior and offline boundary. Browser/device tests are mandatory. |
| `MOD-21` | Publication service | `services/publication/` | Immutable publication lifecycle, host adapter boundary, deep linking, update/replace/rollback. Authorization/audit tests are mandatory. |
| `MOD-22` | Extension runtime | `packages/extensions/` | Optional safe module/style integration, scope/order, CSP/sandbox/capability controls and failure diagnostics. |
| `MOD-23` | Artboard project service | `packages/artboards/` | Screen/viewport/thumbnail organization and asset/project lifecycle. |
| `MOD-24` | Asset service | `services/assets/` | Secure upload, media validation, hashing, thumbnailing, scanning, authorized asset access and retention. |
| `MOD-25` | External design importer | `packages/importers/` | Normalized adapters, provenance, re-import/diff, fidelity diagnostics and no silent overwrite. |
| `MOD-26` | Import/publish job runner | `services/jobs/` | Idempotent, resumable, observable, cancellable import/export tasks with safe retry. |
| `MOD-27` | Click-through builder | `packages/clickthrough/` | Hotspots, screen navigation, gesture/back/external URL behavior and master interaction groups. |
| `MOD-28` | Authorization and account service | `services/identity/` | Authentication, account status, RBAC, access codes, publication policy, sessions, audit hooks and least privilege. |
| `MOD-29` | Workspace service | `services/workspaces/` | Tenants, hierarchy, membership, invitations, ownership, discovery/join and lifecycle. |
| `MOD-30` | Review service | `services/review/` | Revision-anchored comments, element/pin anchors, guest policy, attachments, moderation, mentions and thread states. |
| `MOD-31` | Notification service | `services/notifications/` | Event fan-out, preferences/digests/mutes, delivery retries and optional channel adapters. |
| `MOD-32` | Inspection engine | `packages/inspection/` | Node selection, redlines, geometry/style/text/paint metadata, handoff states and accessibility. |
| `MOD-33` | Handoff asset exporter | `packages/handoff-assets/` | Individual/bulk asset selection, package generation, filename collisions, hashes and authorization. |
| `MOD-34` | Declaration serializer | `packages/handoff-declarations/` | CSS-like implementation hint output, clipboard copy and node/render mapping caveats. |
| `MOD-35` | Enterprise identity adapter | `services/identity-providers/` | Optional SAML/directory implementation with certificate/secret safety and recovery. |
| `MOD-36` | Provisioning service | `services/provisioning/` | Optional private instance/domain/bootstrap flow separated from licensing/entitlement adapter. |
| `MOD-37` | Database migration tool | `tools/migrations/` | Schema preflight, controlled migration, version history and recovery reporting. |
| `MOD-38` | Storage adapter | `packages/storage/` | Local and optional object storage backends, tenancy keys, capacity/error/restore behavior. |
| `MOD-39` | Operational diagnostics | `packages/ops-diagnostics/` | Health/readiness/version/migration endpoints, structured/redacted logs, support bundles and troubleshooting checks. |

## C. Fixtures, test evidence, and self-testing

| ID | Required evidence family | Planned repository path | Minimum evidence |
|---|---|---|---|
| `TST-01` | Bundle, migration, and recovery corpus | `fixtures/document/`, `tests/document/` | Valid/invalid/malformed/broken-reference projects, old versions, interrupted saves, selective export/import, rollback and content hash checks. |
| `TST-02` | Editor workflow and accessibility corpus | `fixtures/editor/`, `tests/e2e/editor/` | Keyboard-only project/page/component/style/note workflows, focus order, screen-reader names, pane reset and route navigation. |
| `TST-03` | Geometry and canvas conformance corpus | `fixtures/geometry/`, `tests/geometry/` | Transform, selection, snapping, guides, z-order, alignment/distribution, nested/rotated component and property-based tests. |
| `TST-04` | Player/static output browser matrix | `fixtures/publication/`, `tests/e2e/viewer/` | Static-server opening, route/URL state, fonts/fallbacks, mobile widths, resize, archive checks, no-debug/no-secret assertions. |
| `TST-05` | Reuse/style/responsive visual corpus | `fixtures/reuse/`, `tests/visual/` | Components, variants, token cascades, page styles, breakpoint inheritance and screenshot tolerance comparison. |
| `TST-06` | Documentation/export golden corpus | `fixtures/reports/`, `tests/reports/` | CSV parse/data dictionary, DOCX opening, PDF headings, Markdown links, asset package and deterministic report model checks. |
| `TST-07` | Runtime trace/replay corpus | `fixtures/runtime/`, `tests/runtime/` | Events, branches, actions, timers, expressions, state reset, dynamic states, condition errors, replay and sandbox fuzzing. |
| `TST-08` | Data/gesture/motion browser corpus | `fixtures/data-motion/`, `tests/e2e/behavior/` | Repeaters, gestures, scrolling, fixed regions, pagination, transition cancellation and reduced-motion behavior. |
| `TST-09` | Failure-injection and diagnostic corpus | `fixtures/failure/`, `tests/ops-diagnostics/` | Missing assets, invalid config, DNS/proxy/CSP/CORS, storage full/read-only, database unavailable and redaction tests. |
| `TST-10` | Importer fidelity corpus | `fixtures/importers/`, `tests/importers/` | Licensed/open source reference payloads, editable/flattened outcomes, provenance, re-import diff, adapter compatibility and diagnostic tests. |
| `TST-11` | Authorization/review/collaboration corpus | `fixtures/collaboration/`, `tests/integration/services/` | Tenant isolation, roles, invitations, links, access codes, revisions, comments, mentions, mute/digest, delete/restore and audit. |
| `TST-12` | Inspection/handoff conformance corpus | `fixtures/inspection/`, `tests/inspection/` | Geometry/redlines/text/type/paint/assets/declaration output, public/private access and node/render context tests. |
| `TST-13` | Deployment and identity integration corpus | `infra/test/`, `tests/ops/` | Clean install, upgrade/rollback, backup/restore, TLS/proxy, health, database/storage outages, SAML/directory mocks and role lifecycle. |
| `TST-14` | Release and supply-chain corpus | `scripts/release/`, `tests/release/` | Reproducible builds, checksum/signature verification, SBOM, dependency/license scan, artifact provenance and release smoke tests. |

## D. Security, accessibility, operations, release, and user-facing artifacts

| ID | Required artifact family | Planned repository path | Required content |
|---|---|---|---|
| `SEC-01` | Threat model and authorization policy | `docs/security/` | Tenant isolation, role matrix, share links/access codes, assets, comments, sessions, CSRF, XSS/CSP, rate limits, audit/redaction and incident response. |
| `SEC-02` | Package/import/asset supply-chain policy | `docs/security/supply-chain.md` | File and package validation, sandboxing, licenses/attribution, signing/trust/revocation, malware scanning and provider credential safety. |
| `SEC-03` | Runtime and export security policy | `docs/security/runtime.md` | Expression sandbox, extension limits, static bundle injection prevention, URL state, font/CSP, debug gating and secret exclusions. |
| `A11Y-01` | Editor/player/inspector accessibility architecture | `docs/accessibility/` | Command/focus/announcement map, semantic roles, keyboard/no-pointer acceptance, contrast, error recovery, assistive-tech baseline. |
| `A11Y-02` | Content/runtime accessibility policy | `docs/accessibility/content-runtime.md` | Reduced motion, touch gestures alternatives, generated document semantics, custom widget requirements and accessibility exception process. |
| `OPS-01` | Installation, upgrade, backup, restore, and rollback runbooks | `docs/operations/` | Supported topology, prerequisites, TLS/proxy, migration, backups, recovery drill, capacity and maintenance procedure. |
| `OPS-02` | Configuration and preflight reference | `docs/operations/configuration.md`, `tools/preflight/` | Typed settings, precedence, secrets, storage, database, mail, hostname, CSP, validation and support bundle behavior. |
| `OPS-03` | Observability and jobs operations | `docs/operations/observability.md` | Health/readiness, metrics/logs/traces, queues, retries, dead letters, alert conditions and runbook links. |
| `OPS-04` | Troubleshooting guide | `docs/operations/troubleshooting.md` | Symptom, diagnosis, safe checks, remediation and escalation for editor/runtime/export/hosting/deployment failures. |
| `OPS-05` | Retention and data lifecycle policy | `docs/operations/data-lifecycle.md` | Archive/delete/restore/purge, legal hold hook, privacy, export, retention windows and audit handling. |
| `REL-01` | Release engineering policy | `docs/release/` | Support matrix, versioning, reproducible build, changelog, signing/checksums, SBOM, vulnerability response and compatibility windows. |
| `REL-02` | Interoperability support matrix | `docs/interoperability/compatibility.md` | Adapter versions, fidelity levels, unsupported features, provider lifecycle and deprecation/migration rules. |
| `DOC-01` to `DOC-10` | End-user and operator guides | `docs/guides/` | Quickstart, editor/pages, styles/layout, templates, responsive behavior, preview/export, review, handoff, configuration and identity guides; all must be release-tested against fixtures. |

## Required artifact checklist by phase

| Phase | A feature may enter the phase only when |
|---|---|
| Foundation | Public semantic/schema contract exists; module boundary is defined; validator/fixture coverage exists; security/accessibility effects are assessed; migration/compatibility impact is documented. |
| MVP | Feature has an end-to-end user path, local/static behavior where applicable, automated unit/integration/browser evidence, user documentation, diagnostics, and no unresolved critical security/accessibility failure. |
| Post-MVP | Foundation/MVP dependencies are supported, performance/capacity behavior is measured, migration and fallback behavior are proven, and deferred scope has an owner/release gate. |
| Optional | Provider adapter is isolated, capability-negotiated, secret-safe, independently testable, removable without data loss, and accurately represented in the compatibility matrix. |
| Support | Runbook, health/diagnostic evidence, failure injection, redaction, recovery procedure and release/support owner exist. |

## References

[1]: FULL-CAPABILITY-INVENTORY.md "MockupFX Full Capability Inventory"
[2]: ../developer/CONFORMANCE-AND-SELF-TESTING.md "MockupFX Conformance and Self-Testing"
