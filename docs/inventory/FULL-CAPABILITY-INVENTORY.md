# MockupFX Full Capability Inventory

## Purpose and status

This document is the **complete reference-derived capability inventory** for MockupFX as of 2026-09-15. It translates the public Axure documentation archive and the current public documentation to an independent, vendor-neutral, open-source product scope. It is a planning and traceability artifact, **not a claim that the listed features are implemented**.

Each row is a capability that a mature prototyping offering exposes or that is necessary to make the equivalent MockupFX capability credible as open source. The **Phase** column records the recommended disposition. **Foundation** means the capability is required before dependent product work. **MVP** is required for the first usable local-first release. **Post-MVP** is planned but intentionally deferred. **Optional** is an adapter or service that must not become a dependency of local projects or static exports. **Support** is a required quality/operational capability rather than a customer-facing feature.

The inventory is organized by product plane. Supporting artifacts, release gates, and built-in test requirements are specified in [Supporting Artifact Manifest](SUPPORTING-ARTIFACT-MANIFEST.md) and [Conformance and Self-Testing](../developer/CONFORMANCE-AND-SELF-TESTING.md).

## 1. Open-source product boundary

MockupFX will own an open, versioned project bundle; a browser editor and preview runtime; static output; inspection and documentation artifacts; and a self-hostable optional service layer. It must not reproduce a proprietary source format, editor interface, branding, licensing model, or closed hosting dependency. Imported material must enter through documented adapters and retain provenance. A static export must remain usable on ordinary web infrastructure without a MockupFX service.

| Capability | MockupFX disposition | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Open, versioned project bundle with stable IDs and asset references | Canonical local-first artifact | Foundation | `ART-01`, `ART-02`, `TST-01` |
| Immutable publication and static web bundle | Separate editable intent from review output | MVP | `ART-05`, `ART-09`, `TST-04` |
| Provider-neutral APIs and optional adapters | Hosting, identity, import, and chat services remain replaceable | Foundation | `ART-04`, `ART-14`, `SEC-01` |
| Local project ownership and ordinary static hosting | No mandatory SaaS runtime | Foundation | `ART-05`, `OPS-01` |
| Explicit compatibility and deprecation policy | Schema, renderer, library, and adapter versions are declared | Foundation | `ART-02`, `REL-01` |

## 2. Project lifecycle and editor environment

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Create, open, save, save-as, duplicate, and recover projects | Atomic, versioned project lifecycle with safe interrupted-save recovery | Foundation | `ART-01`, `MOD-01`, `TST-01` |
| Recent projects and portable preferences | Store user-local recent list and editor preferences outside the project bundle | MVP | `MOD-02`, `DOC-01`, `TST-02` |
| Dockable, hideable, resettable editor panes | Canvas, page tree, outline, library, properties, interactions, notes, and diagnostics panes | MVP | `MOD-02`, `A11Y-01`, `TST-02` |
| Hierarchical pages and folders | Add, rename, reorder, nest, search, tab, overview, and choose a landing page | MVP | `MOD-01`, `TST-02`, `DOC-02` |
| Canvas and viewport control | Bounded/unbounded canvas, pan, zoom, ruler, coordinate readout, center, fit, and hit testing | Foundation | `MOD-03`, `SEM-01`, `TST-03` |
| Selection model | Single, marquee, additive, subtractive, deep, outline, text-edit, and accessible selection state | Foundation | `MOD-03`, `A11Y-01`, `TST-03` |
| Core component insertion | Text, shapes, lines/connectors, images, containers, buttons/links, inputs, list/select, and table primitives | MVP | `MOD-04`, `ART-01`, `TST-02` |
| Geometry editing | Numeric position/size, drag/resize, nudge, aspect lock, multi-selection transform, undo/redo | MVP | `MOD-03`, `SEM-01`, `TST-03` |
| Groups, containers, outline and layers | Named nesting, search, collapse, explicit z-order, editor locking, and render visibility | MVP | `MOD-01`, `SEM-01`, `TST-02` |
| Alignment and distribution | Edge/center alignment, equal spacing, grid distribution, front/back ordering, undoable commands | MVP | `MOD-03`, `TST-03`, `DOC-03` |
| Grid, rulers, guides, snapping, distance aids | Page/global guides, configurable grids, lock/snap tolerance, editor-only rendering policy | MVP | `MOD-03`, `SEM-01`, `TST-03` |
| Page dimensions and page styles | Presets, custom dimensions, background, low-fidelity mode, reusable page styles, local overrides | MVP | `MOD-05`, `SEM-02`, `TST-05` |
| Widget appearance and effects | Typography, paints, borders, corners, padding, opacity, shadows, blur, style copy, state layers | MVP | `MOD-05`, `SEM-02`, `TST-05` |
| Keyboard command system | Discoverable/remappable commands, conflict detection, safe text-entry behavior, keyboard-only core workflow | Foundation | `MOD-02`, `A11Y-01`, `TST-02` |
| Autosave and recovery | Checkpoint valid documents, provide recovery decision and preserve last valid state | Foundation | `MOD-01`, `OPS-04`, `TST-01` |

## 3. Reuse, style, annotation, and project knowledge

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Reusable component definitions and instances | Create from selection or empty definition; place, edit source, discover usage, override, detach | MVP | `MOD-06`, `SEM-02`, `TST-05` |
| Component variants and inheritance | Named variants with property-level inheritance and cycle/deletion safety | Post-MVP | `MOD-06`, `SEM-02`, `TST-05` |
| Shared styles and state styles | Style tokens, base/state cascade, impact analysis, local detachment, contrast checks | Foundation | `MOD-05`, `SEM-02`, `A11Y-02` |
| Library packages | Open manifests, categories, thumbnails, documentation, styles, safe optional behaviors, local import/export | MVP | `ART-06`, `MOD-07`, `SEC-02` |
| Templates and starter projects | Open template bundles with regenerated project IDs and documented provenance | Post-MVP | `ART-06`, `DOC-04`, `TST-01` |
| Page/component annotations | Multiple ordered/nested annotations, stable target binding, links to requirements/change records | MVP | `MOD-08`, `ART-07`, `TST-02` |
| Typed annotation fields and fieldsets | Text, select, numeric and future types; validation, filtering, deprecation/migration behavior | MVP | `ART-07`, `MOD-08`, `TST-01` |
| Project specification generation | Selectable scopes and deterministic Markdown, HTML, CSV, PDF, DOCX, image, and open JSON outputs | MVP | `ART-08`, `MOD-09`, `TST-06` |
| Documentation configuration and templates | Screen hierarchy, notes, interaction summaries, screenshots, tables, filters and reusable report templates | Post-MVP | `ART-08`, `MOD-09`, `TST-06` |
| Revision history and rollback | Immutable snapshots/change sets, actor/note metadata, export and selective recovery | Foundation | `ART-02`, `MOD-01`, `TST-01` |
| Selective project import/export | Dry-run, dependency closure, collision policy, pages/components/styles/annotations/datasets selection | MVP | `ART-01`, `MOD-10`, `TST-01` |

## 4. Interaction, state, dynamic behavior, and responsive design

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Declarative interaction graph | Typed trigger → ordered branch → ordered action graph; stable IDs, enablement, serializable behavior | Foundation | `ART-03`, `MOD-11`, `TST-07` |
| Broad event family | Pointer, keyboard, focus, input, load, resize, scroll, selection, lifecycle, gesture, collection, and breakpoint events | MVP | `ART-03`, `MOD-11`, `TST-07` |
| Conditions and validation | Typed predicates, all/any composition, empty/valid helpers, errors with diagnostic context | MVP | `SEM-03`, `MOD-12`, `TST-07` |
| Ordered branching | Deterministic first-match chains, independent chains, short-circuit, conflict policy, trace evidence | MVP | `SEM-03`, `MOD-11`, `TST-07` |
| Effect vocabulary | Navigation, scroll, show/hide, text/value/style, enabled/error/selection, geometry, layer, opacity, focus, expand/collapse | MVP | `ART-03`, `MOD-13`, `TST-07` |
| Timers, synthetic events, component-to-host events | Sandboxed delay/dispatch, cancellation/reentrancy limits, scoped instance handlers | MVP | `SEM-03`, `MOD-11`, `TST-07` |
| Typed state variables | Project/page/component/action scopes, defaults, bindings, reset, mutation events, no secret leakage | Foundation | `ART-01`, `MOD-12`, `TST-07` |
| Expression language | Sandboxed literals, math, comparisons, Booleans, interpolation and pure whitelisted functions | MVP | `ART-03`, `MOD-12`, `SEC-03` |
| Multi-state containers | Named states, active-state control, transitions, state events, carousel/modal patterns | MVP | `MOD-14`, `SEM-03`, `TST-07` |
| Scrollable, draggable and pinned containers | Overflow, touch/pointer gestures, fit-content, fixed region, progressive fallback | MVP | `MOD-14`, `TST-08`, `A11Y-02` |
| Data-driven repeat views | Item template, typed rows, field binding, imports, wrapping, pagination and empty/error behavior | MVP | `ART-01`, `MOD-15`, `TST-08` |
| Dataset sorting/filtering/mutation | Stable sorting, safe filters, marking, transactions, lifecycle events, undo/replay | Post-MVP | `MOD-15`, `SEM-03`, `TST-08` |
| Responsive views and inheritance | Breakpoint ranges, resolver, parent/child overrides, reset override, shared vs responsive property policy | MVP | `ART-01`, `MOD-16`, `TST-05` |
| Manual/automatic responsive switching | Runtime selection, manual override, resize debounce, view-change events | MVP | `MOD-16`, `TST-07`, `DOC-05` |
| Transitions and animation | Duration/easing/transform, cancellation, reduced-motion behavior | Post-MVP | `MOD-17`, `A11Y-02`, `TST-08` |
| Preview inspector and trace replay | State inspection/reset, event/branch/action trace, filtering/export, development-only gate | Support | `ART-03`, `MOD-18`, `TST-07` |

## 5. Preview, player, publishing, static output, and exports

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Local browser preview | Selected route preview, source watch/reload, local-only default, browser launch adapter | MVP | `MOD-18`, `TST-04`, `DOC-06` |
| Named preview/output profiles | Portable per-project profiles for route, player, scale, notes, fonts and export policy | Foundation | `ART-05`, `MOD-18`, `TST-01` |
| Runtime console and interaction diagnostics | State/reset, trace, conditional evaluation, load-time capture, debug-off production policy | MVP | `MOD-18`, `SEC-03`, `TST-07` |
| Static web generation | Reproducible HTML/CSS/JavaScript/assets plus manifest, no mandatory service dependency | MVP | `ART-05`, `MOD-19`, `TST-04` |
| Selective route export | All routes or allowlist; dependency validator and omitted-reference report | MVP | `MOD-19`, `TST-04`, `DOC-06` |
| Player shell | Route tree, keyboard navigation, manual breakpoints, scale modes, debug overlays | MVP | `MOD-20`, `A11Y-01`, `TST-04` |
| Shareable URL state | Canonical safe route/pane/scale/overlay URL state; reject secrets from URL serialization | MVP | `ART-05`, `MOD-20`, `SEC-01` |
| Font loading and mapping | External font declaration, offline fallback, licensing/CSP policy, output-only mapping | MVP | `ART-05`, `MOD-19`, `SEC-03` |
| Annotation panels/markers in output | Configurable inclusion with keyboard-accessible markers and no empty panel | Post-MVP | `MOD-20`, `A11Y-01`, `TST-04` |
| Static archive and ordinary hosting | Destination/overwrite policy, ZIP integrity, generic web-server deployment guide | MVP | `ART-05`, `OPS-01`, `TST-04` |
| Open project, publication JSON, CSV, DOCX, PDF, Markdown, image, asset packages | Authorized selected-scope reporting and handoff outputs with manifests/limitations | MVP | `ART-08`, `MOD-09`, `TST-06` |
| Hosted publication provider adapter | Stable deployment ID, update/replace/rollback semantics, optional external host | Optional | `ART-14`, `MOD-21`, `SEC-01` |
| Runtime extension packages | Sandboxed, scoped and ordered CSS/JS/module hooks with CSP and capability manifest | Post-MVP | `ART-06`, `MOD-22`, `SEC-02` |
| Mobile/offline viewer | Responsive web first; explicit cache/archive policy and revision invalidation | Post-MVP | `MOD-20`, `TST-04`, `SEC-01` |
| Publishing/runtime diagnostics | Missing asset, host/proxy/CSP/CORS, browser and configuration diagnosis with redaction | Support | `OPS-04`, `MOD-18`, `TST-09` |

## 6. Artboard projects and external design import

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Artboard-oriented projects | Screen ordering, viewport presets, screen thumbnails and asset/project metadata | Foundation | `ART-01`, `MOD-23`, `TST-02` |
| Raster/vector asset ingestion | MIME validation, hashing, thumbnailing, removal, limits and accessible failures | MVP | `ART-01`, `MOD-24`, `SEC-02` |
| Normalized external frame/layer import | Provider-neutral trees for geometry, text, paints, assets, links and unsupported features | Foundation | `ART-10`, `MOD-25`, `TST-10` |
| Sketch adapter | Optional, selected-artboard import via documented adapter contract | Optional | `ART-10`, `MOD-25`, `TST-10` |
| Figma adapter | Optional frame/layer import, source provenance, rate/error policy, editable/fallback paths | Optional | `ART-10`, `MOD-25`, `TST-10` |
| Legacy Adobe XD adapter | Optional maintenance-limited adapter, rendered fallback, explicit unsupported-effect report | Optional | `ART-10`, `MOD-25`, `TST-10` |
| Resumable publish/import jobs | Destination selection, idempotency, progress/cancel/retry, post-job import summary | MVP | `MOD-26`, `OPS-03`, `TST-10` |
| Click-through prototype builder | Hotspots, pointer/touch/double activation/swipe triggers, navigation/back/external URL validation | MVP | `ART-03`, `MOD-27`, `TST-07` |
| Reusable hotspot groups | Attached shared interactions, anchoring, fork/detach and dependency visibility | Post-MVP | `MOD-27`, `SEM-02`, `TST-05` |
| Fixed screen regions | Optional fixed top/bottom regions, scroll contract, focus and viewport behavior | Post-MVP | `MOD-14`, `A11Y-02`, `TST-08` |
| Source provenance and re-import | Source node mappings, adapter/version records, compare/diff, local change protection | Foundation | `ART-10`, `MOD-25`, `TST-10` |
| Compatibility/degradation matrix | Editable, approximated and flattened outcomes; fail-soft per-node diagnostics | Foundation | `ART-10`, `REL-02`, `TST-10` |

## 7. Sharing, workspaces, comments, and notifications

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Immutable publication and share URL | Publish revision, return browser URL, share-safe manifest and audit event | MVP | `ART-09`, `MOD-21`, `TST-11` |
| Access-code protection | Salted verifier, rate limiting, rotation/revocation, no plaintext credential in URL/logs | MVP | `SEC-01`, `MOD-28`, `TST-11` |
| Publication visibility | Public, protected and workspace-only states with safe transitions | MVP | `ART-09`, `MOD-28`, `TST-11` |
| Deep page links | Published route anchor and revision-correct fallback for removed pages | MVP | `MOD-20`, `MOD-21`, `TST-11` |
| Separate capabilities | Explicit view/comment/inspect/edit/publish/source-download/admin permissions | Foundation | `SEC-01`, `MOD-28`, `TST-11` |
| Workspace/folder hierarchy | Tenant-scoped workspaces, folders, projects, move, paging and tree invariants | Foundation | `ART-09`, `MOD-29`, `TST-11` |
| Invitations and membership | Role-at-acceptance invitation, expiration/revoke/resend, ownership transfer and removal | Foundation | `ART-09`, `MOD-29`, `TST-11` |
| Discovery and join policy | Open-to-tenant, default view/edit, invite-only, direct vs inherited effective grants | MVP | `MOD-29`, `SEC-01`, `TST-11` |
| Archive/restore/delete lifecycle | Soft archive, retention/purge, dependency checks, export-before-delete | Post-MVP | `OPS-05`, `MOD-29`, `TST-11` |
| Publication update/replace lifecycle | New/update/replace semantics, comments migration/detachment policy, rollback | MVP | `ART-09`, `MOD-21`, `TST-11` |
| Responsive mobile review | Browser-based review works at phone sizes without a separate native dependency | MVP | `MOD-20`, `A11Y-02`, `TST-04` |
| Offline review cache | Explicit local storage, encryption, revision metadata, deletion and invalidation | Post-MVP | `MOD-20`, `SEC-01`, `TST-04` |
| Coordinate/element anchored comment threads | Page/revision anchor, text, author, timestamps, normalized coordinates and permissions | MVP | `ART-09`, `MOD-30`, `TST-11` |
| Guest comments | Project opt-in, session identity, consent/retention, moderation and rate limiting | Post-MVP | `MOD-30`, `SEC-01`, `TST-11` |
| Mentions | Permission-aware member search, stable mention tokens and notification event | MVP | `MOD-30`, `MOD-31`, `TST-11` |
| Comment image attachments | Authorized upload, scan, thumbnail, privacy and retention policy | Post-MVP | `MOD-24`, `MOD-30`, `SEC-02` |
| Thread lifecycle | Edit, moderation/delete policy, resolve/reopen/filter, concurrency and audit | MVP | `MOD-30`, `ART-09`, `TST-11` |
| Project comment policy | Enable/disable comments with immediate enforcement and cache invalidation | MVP | `MOD-30`, `TST-11`, `SEC-01` |
| In-product/email activity notifications | Event records, recipient rules, preferences, retries and dead-letter visibility | MVP | `ART-09`, `MOD-31`, `OPS-03` |
| Frequency, digest and mute preferences | All/reduced/none modes, timezone-safe digest and per-project mute precedence | MVP | `MOD-31`, `TST-11`, `DOC-07` |
| Chat notification adapters | Optional webhook/OAuth integrations with encrypted credentials, scoped subscriptions and revocation | Optional | `ART-14`, `MOD-31`, `SEC-01` |

## 8. Design inspection and developer handoff

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Inspection surface | Screen/canvas inspection route, node selection, details panel and keyboard operation | MVP | `ART-11`, `MOD-32`, `TST-12` |
| Public inspection option | Explicit publication flag and permission-aware share-link inspection | Post-MVP | `ART-09`, `MOD-32`, `SEC-01` |
| Inspection compatibility gate | Versioned metadata manifest, migration guidance and accurate unsupported state | Foundation | `ART-11`, `REL-01`, `TST-12` |
| Single-node redlines | Hover/focus distances and overlay with documented units/zoom policy | MVP | `MOD-32`, `SEM-01`, `TST-12` |
| Pairwise redlines | Anchor/comparison relation, gaps, alignment, overlap, nested/rotation policy | MVP | `MOD-32`, `SEM-01`, `TST-12` |
| Geometry and transform values | x/y, size, rotation, radius, opacity with authored/computed distinction | Foundation | `ART-11`, `SEM-01`, `TST-12` |
| Asset previews and download | Asset inventory, intrinsic dimensions, preview, authorized individual/bulk download, hashes | MVP | `ART-11`, `MOD-33`, `TST-12` |
| Copyable text | Semantic content with line breaks/direction, clipboard fallback and redaction policy | MVP | `ART-11`, `MOD-32`, `A11Y-01` |
| Typography and paint inspection | Font resolution, size, alignment, color, solid/translucent/gradient paint typed values | MVP | `ART-11`, `MOD-32`, `TST-12` |
| CSS-like declaration view | Sanitized, stable implementation hints and whole/partial copy operations | Post-MVP | `MOD-34`, `TST-12`, `DOC-08` |
| Implementation-context limitation | Node-to-render-tree mapping and clear statement that output is not production-ready code | Foundation | `ART-11`, `DOC-08`, `TST-12` |
| Inspection data authorization | Per-project/link/asset policy, audit exports, no node/asset enumeration after revoke | Foundation | `SEC-01`, `MOD-28`, `TST-12` |

## 9. Identity, administration, and governance

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Tenant/organization boundary | Member, policy and workspace ownership context; server-enforced isolation | Foundation | `ART-09`, `SEC-01`, `TST-11` |
| Organization lifecycle | Create, leave, ownership transfer, export-before-delete, soft delete/purge | MVP | `MOD-29`, `OPS-05`, `TST-11` |
| Invitation onboarding | Signed expiring single-use invites, acceptance/revoke/resend, audit and abuse control | MVP | `MOD-29`, `MOD-31`, `SEC-01` |
| Account state | Pending, active, suspended; session revocation and recovery path | MVP | `MOD-28`, `SEC-01`, `TST-11` |
| Layered RBAC | Platform/organization/workspace roles and capability grants; deny by default | Foundation | `SEC-01`, `MOD-28`, `TST-11` |
| Bulk role administration | Preview/commit, idempotency, partial result clarity, last-admin protection | Post-MVP | `MOD-28`, `ART-09`, `TST-11` |
| Local authentication | Modern password hashing, reset tokens, forced reset, throttling, breach-aware policy | MVP | `SEC-01`, `MOD-28`, `TST-11` |
| SAML identity | Standards-based optional service provider, certificates, claims, safe recovery | Optional | `ART-14`, `MOD-35`, `TST-13` |
| Directory identity | Optional LDAP/AD class adapter, TLS/bind/attribute/group mapping, local recovery | Optional | `ART-14`, `MOD-35`, `TST-13` |
| Managed private instance | Optional tenant/domain provisioning and bootstrap administrator without coupling billing to authorization | Post-MVP | `OPS-01`, `MOD-36`, `TST-13` |
| Audit stream | Append-only security/admin/publication/export events with redaction, retention and access control | Foundation | `ART-09`, `SEC-01`, `TST-11` |
| Data lifecycle | Retention classes, archive/restore/export/purge, legal-hold hook, dependency graph | MVP | `OPS-05`, `ART-09`, `TST-11` |
| Ownership continuity | Sole-owner and suspended/deleted owner recovery with atomic reassignment | Foundation | `MOD-29`, `SEC-01`, `TST-11` |

## 10. Self-hosting, operations, and release engineering

| Capability | MockupFX scope | Phase | Primary evidence/artifacts |
|---|---|---:|---|
| Private deployment topology | One-host evaluation and split app/database/storage topology | Foundation | `OPS-01`, `ART-12`, `TST-13` |
| Compatibility/support matrix | OS/runtime/database/browser/assistive-tech/resource policy and preflight checker | Foundation | `REL-01`, `OPS-02`, `TST-13` |
| Database bootstrap and least privilege | New/existing database, migration user vs runtime user, secret management | Foundation | `OPS-02`, `MOD-37`, `TST-13` |
| Object/file storage abstraction | Local persistent storage plus optional S3-compatible adapter, capacity/error handling | Foundation | `OPS-02`, `MOD-38`, `TST-13` |
| Bootstrap administrator and recovery | One-time secure setup, reset/recovery flow, test-mail operation and audit | MVP | `MOD-28`, `OPS-01`, `TST-13` |
| External configuration | Typed config, precedence, validation, safe defaults, secret redaction and restart/reload semantics | Foundation | `OPS-02`, `TST-13`, `DOC-09` |
| TLS/reverse proxy/security headers | Certificates, rotation, trusted proxy, secure cookies, CSP and headers | MVP | `OPS-01`, `SEC-01`, `TST-13` |
| Public URL/hostname policy | Allowed host validation, proxy headers, generated link correctness and optional subdomain model | MVP | `MOD-21`, `OPS-02`, `TST-13` |
| Diagnostics/support bundle | Structured logs, correlation IDs, redacted export, operator-only verbose diagnostics | MVP | `OPS-04`, `MOD-39`, `TST-09` |
| Schema upgrade/migration | Preflight, maintenance mode, version matrix, controlled migration/rollback instructions | Foundation | `ART-02`, `OPS-01`, `TST-13` |
| Backup and disaster recovery | Database plus object storage snapshots, encryption, checksums, retention, restore drills | Foundation | `OPS-01`, `OPS-05`, `TST-13` |
| Connectivity troubleshooting | Bind/port conflict, DNS, firewall, proxy, TLS and dependency troubleshooting | MVP | `OPS-04`, `MOD-39`, `TST-09` |
| Health/readiness/status endpoints | Liveness, readiness, dependency, release and migration state with least-privilege responses | MVP | `OPS-03`, `MOD-39`, `TST-13` |
| Optional SAML setup guides | Provider-neutral protocol guidance, certificate rotation, assertion validation and lockout prevention | Post-MVP | `ART-14`, `DOC-10`, `TST-13` |
| Optional directory setup guides | Adapter, TLS/bind, precedence/outage/recovery guidance | Optional | `ART-14`, `DOC-10`, `TST-13` |
| Reproducible releases and supply chain | Build scripts, checksums/signatures, SBOM, dependency/license reports, vulnerability policy | Foundation | `REL-01`, `SEC-02`, `TST-14` |

## 11. Cross-domain decisions required before implementation

The audit identified twelve decisions that cannot be postponed without causing incompatible modules. They are summarized here and specified as required artifacts in the supporting manifest.

1. **Canonical kernel:** one versioned model must own scene data, stable IDs, assets, components, styles, annotations, datasets, interactions, responsive overrides, provenance, revisions, publications, and permissions.
2. **Override algebra:** page responsiveness, component variants, style tokens, imported layers, and runtime transient state require one written precedence, inheritance, cycle, and deletion policy.
3. **Layout contract:** canvas geometry, text measurement, responsive constraints, overflow, fixed regions, transforms, and inspection values require shared semantics.
4. **Deterministic runtime:** events, branches, effects, timers, navigation, breakpoint transitions, collection mutation, animation cancellation, errors, and replay require a normative execution contract.
5. **Preview/export boundary:** offline guarantees, manifest layout, URL state, debug exclusion, asset addressing, and publication immutability require a portable build contract.
6. **Revision anchoring:** comments, annotations, inspection, deep links, exports, downloads, and notifications must point to a publication revision and define migration/detach behavior.
7. **Unified threat model:** expressions, packages, imports, static output, links, assets, comments, identity, storage, and tenant isolation must share security assumptions and controls.
8. **Package governance:** libraries, templates, extensions, fonts, and assets need provenance, licensing, compatibility, trust, sandbox, signing/revocation and malicious-package policies.
9. **Import fidelity:** all external adapters need a normalized interchange model, provenance, editable/flattened contract, source rights, re-import and diagnostic policy.
10. **Collaboration model:** local-first changes, reservations or merge strategy, offline behavior, identity boundary, conflict recovery, and server protocol must be selected before multiwriter claims.
11. **Accessibility baseline:** editor, player, inspector, review, generated documents, custom widgets, focus, screen-reader behavior, contrast and motion require one testable conformance target.
12. **Release/operations policy:** reproducible builds, SBOMs, support windows, security updates, migration compatibility, disaster recovery, observability and performance budgets require release-grade evidence.

## 12. Source coverage

The public archive itself divides the offering into authoring reference/tutorial material and cloud material for publishing prototype projects, publishing artboard projects, sharing/workspaces/mobile, discussions/notifications, design inspection, troubleshooting, business end-user functions, and business administration.[1] The detailed rows above were reconciled against the relevant current/archived reference pages for authoring and interactions,[2] [3] browser preview/output,[4] sharing and discussions,[5] inspection,[6] accounts/workspaces,[7] and installation/administration.[8]

## References

[1]: https://archive.axure.com/all-documentation/ "Axure documentation archive"
[2]: https://docs.axure.com/axure-rp/reference/ "Axure RP reference documentation"
[3]: https://docs.axure.com/axure-rp/reference/events-cases-actions/ "Axure Docs: Events, cases, and actions"
[4]: https://docs.axure.com/axure-rp/reference/viewing-sharing-prototypes/ "Axure Docs: Viewing and sharing prototypes"
[5]: https://docs.axure.com/axure-cloud/reference/discussions/ "Axure Docs: Discussion comments"
[6]: https://docs.axure.com/axure-cloud/reference/inspect/ "Axure Docs: Inspecting designs"
[7]: https://docs.axure.com/axure-cloud/business/accounts-and-permissions/ "Axure Docs: Accounts and permissions"
[8]: https://docs.axure.com/axure-cloud/business/install-on-premises/ "Axure Docs: Installing on-premises"
