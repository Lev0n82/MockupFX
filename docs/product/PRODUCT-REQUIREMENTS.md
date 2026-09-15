# MockupFX Product Requirements

## 1. Objective and boundaries

MockupFX will be an open-source, browser-first platform for designing interactive mockups, reviewing them with stakeholders, and handing them to developers. Its central promise is **portable interactive intent**: a mockup should remain usable as an open project artifact, as a static exported prototype, and as an inspectable handoff surface.

The project begins with a web application and self-hosted reference deployment. Native desktop applications, a proprietary binary project format, and a mandatory hosted cloud are out of scope for the MVP. The reference capability map is informed by public documentation that separates authoring, browser preview, publication, feedback, inspection, and administration into distinct but connected workflows.[1] [2]

### Success criteria

The MVP is complete when a small team can create a multi-page responsive prototype, define and debug simple interactions, export a reproducible static bundle, share a protected review link, collect coordinate-aware comments, inspect an element's handoff data, and run the same project on a documented self-hosted deployment.

## 2. Personas and core journeys

| Persona | Core need | Successful outcome |
|---|---|---|
| Product designer | Express flow and responsive behavior without writing application code | An interactive prototype is clear enough for stakeholder review |
| Product manager or reviewer | Test a specific journey and leave actionable feedback | A comment is attached to the right page, coordinate, and release version |
| Front-end developer | Reconstruct the intended interface with fewer ambiguities | Measurements, text, style values, assets, and interaction context are available in one place |
| Workspace administrator | Give the right people access and retain control of deployment data | Users, workspaces, roles, logs, backups, and retention are manageable |
| Open-source contributor | Extend the project without a hidden file format or cloud dependency | The project format and core contracts are documented and versioned |

## 3. Functional requirements

### 3.1 Authoring and project model

An author creates a project containing pages, component instances, assets, state variables, and interactions. Every addressable object must receive a stable identifier. The initial component vocabulary includes text, shape, image, frame/container, button/link, input, and list. A component may be nested in a frame and can expose a semantic label for accessibility and handoff.

**MVP requirements**

- **MFX-AUTH-001:** A project must store pages, a default start page, named components, assets, typed variables, and project metadata in a documented open format.
- **MFX-AUTH-002:** Components must have stable IDs that survive routine property changes and are used by interaction targets, comments, and inspection links.
- **MFX-AUTH-003:** The canvas must support ordered layers, nesting, selection, grouping, duplication, deletion, and visible component names.
- **MFX-AUTH-004:** Project state must support string, number, Boolean, and collection values with project, page, and component scope.
- **MFX-AUTH-005:** Authors must be able to define named viewport ranges and create inherited responsive overrides for layout geometry, visibility, and presentation style.
- **MFX-AUTH-006:** The authoring surface must identify inherited properties, local overrides, and the action that resets an override.

The responsive model is deliberately based on inheritance rather than separately authored copies of each page. Public reference material describes a similar distinction between view-specific layout changes and behavior that stays associated with the shared component identity.[3]

### 3.2 Interaction runtime

MockupFX will represent behavior as an explicit execution model: **event → ordered branch → ordered action**. This makes behavior inspectable, serializable, and testable without embedding arbitrary code in a project. The model is derived from the event/case/action separation documented in the reference material, but uses original terminology and data contracts.[2]

**MVP requirements**

- **MFX-INT-001:** A trigger may be attached to a page or component and must support click/tap, double-click, pointer enter/leave, focus/blur, value change, submit, drag lifecycle, page load, and keyboard shortcut events.
- **MFX-INT-002:** An event must contain one or more ordered branches. The runtime must document a deterministic first-matching-branch evaluation policy.
- **MFX-INT-003:** A branch must contain an ordered action sequence. Actions execute from top to bottom, and an action failure must be recorded in the preview trace.
- **MFX-INT-004:** Core actions must include navigate, show/hide, set enabled state, move/resize, set text/value/style, focus, scroll, open/close overlay, and emit custom event.
- **MFX-INT-005:** Branch conditions must evaluate against typed state, component values, route/page context, and viewport metadata without executing arbitrary host-language code.
- **MFX-INT-006:** Authors must be able to disable an event, branch, or action without deleting it. Disabled nodes must remain visible and must not execute.
- **MFX-INT-007:** Preview must expose the current route, viewport, state values, emitted events, evaluated branches, actions, and errors as an interaction trace.

### 3.3 Preview, publication, and sharing

Preview is a local editing aid; publication creates a versioned artifact suitable for another device, reviewer, or hosting provider. Static export must not require MockupFX infrastructure.

**MVP requirements**

- **MFX-PUB-001:** The editor must preview the active page in a browser-like runtime with configurable start page, viewport, scale, and auxiliary UI.
- **MFX-PUB-002:** Preview must clearly state whether it is local-only or published and must provide the interaction trace described in MFX-INT-007.
- **MFX-PUB-003:** Publishing must generate a self-contained static bundle comprising HTML, CSS, JavaScript, assets, and a manifest with project ID, publication ID, format version, timestamp, and reproducible build identifier.
- **MFX-PUB-004:** A publication must be immutable. Republishing creates a new version while preserving the prior version for rollback or review.
- **MFX-PUB-005:** A share link may target a project, publication, page, and optional initial prototype state. It must support public, link-only, and authenticated modes.
- **MFX-PUB-006:** Optional access codes must be stored only as secure verifiers. Raw access codes must not appear in URLs, logs, or analytics.
- **MFX-PUB-007:** The viewer must work in current desktop and mobile browsers and provide an accessible unsupported-feature state.

Public reference documentation describes browser preview, generated web output, hosted sharing, and local distribution as separate modes. MockupFX adopts that separation so exports remain useful even without a hosted service.[4]

### 3.4 Feedback and review

Feedback must remain bound to the artifact that a reviewer actually saw. A comment is not merely free text; it is a record of publication version, page, location, author identity, and status.

**MVP requirements**

- **MFX-REV-001:** An authorized reviewer must be able to place a page-coordinate marker and create a threaded text comment.
- **MFX-REV-002:** A comment must retain project, publication, page, coordinate, author, creation time, and open/resolved state.
- **MFX-REV-003:** Comment authors may edit their own comments; moderators may remove comments according to workspace role.
- **MFX-REV-004:** Users must be able to filter comment threads by page, author, and resolution state without losing resolved history.
- **MFX-REV-005:** Each project must support configurable commenting: disabled, authenticated members, or guest reviewers with recorded identity and rate limits.
- **MFX-REV-006:** The system must notify users in-product for mentions and thread activity. Email delivery is configurable and must not block comment creation.
- **MFX-REV-007:** When a new publication exists, the viewer must display the publication version on which a comment is being made and warn reviewers when viewing an older version.

### 3.5 Developer handoff and inspection

Handoff is an evidence surface, not a code generator. It must show what is represented in the prototype while avoiding a claim that generated CSS or markup is production-ready.

**MVP requirements**

- **MFX-HAND-001:** An inspection viewer must identify the selected component, its stable ID, parent/container, bounds, rotation, radius, opacity, and visible/hidden state.
- **MFX-HAND-002:** Selecting two components must expose pairwise spacing with a documented coordinate origin and unit.
- **MFX-HAND-003:** Text inspection must expose copyable content, font family, size, alignment, and color. Color values must use a documented normalized notation.
- **MFX-HAND-004:** Style inspection must expose fill, border, shadow, radius, opacity, and copyable CSS hints marked as implementation guidance.
- **MFX-HAND-005:** Asset inspection must expose a preview, intrinsic dimensions, content type, and individual or bulk download where the viewer is authorized.
- **MFX-HAND-006:** Handoff links must be read-only and follow the same access policy as the publication from which they are derived.
- **MFX-HAND-007:** Selection, copy, measurements, and downloads must be keyboard-operable and announced to assistive technology.

The reference materials describe element-based measurements, text/style values, spacing guides, and asset access as part of inspection. Those observations support the scope above without requiring any vendor-specific output or interface.[5]

### 3.6 Workspaces, access control, and self-hosting

MockupFX uses a layered access model. A tenant/organization controls membership and policies. A workspace groups projects. A publication is a versioned artifact belonging to a project. Authorization occurs server-side on every request and storage operation.

**MVP requirements**

- **MFX-OPS-001:** The system must isolate each tenant's users, workspaces, projects, publications, assets, comments, and audit records.
- **MFX-OPS-002:** Built-in roles must include platform owner, organization administrator, workspace owner, workspace administrator, editor, viewer, and guest. Organization roles and workspace grants must remain distinct.
- **MFX-OPS-003:** Administrators must be able to invite, accept, remove, deactivate, reactivate, and change the role of a user. Deactivation must revoke active sessions and token refresh promptly.
- **MFX-OPS-004:** Workspace visibility policy must support discoverable, automatic viewer, automatic editor, and invite-only membership. Changing a default must not silently replace explicit grants.
- **MFX-OPS-005:** Audit logs must record authentication, invitations, role or grant changes, ownership transfers, deletion attempts, configuration changes, and publication actions with actor, target, timestamp, outcome, and correlation ID.
- **MFX-OPS-006:** Destructive actions must require an explicit confirmation and offer configurable soft-delete retention before permanent purge.
- **MFX-OPS-007:** The self-hosted reference deployment must support a PostgreSQL-compatible database, persistent object/file storage, environment-based secrets, HTTPS termination, health/readiness checks, and a bootstrap administrator.
- **MFX-OPS-008:** Deployment documentation must cover backup, restore, configuration, migration, upgrade, and rollback procedures for both metadata and assets.

Public reference documentation separates organization membership, workspace permissions, authentication options, private deployment, upgrade, and administrator functions. MockupFX treats this operational layer as a first-class open-source requirement rather than a later add-on.[1] [6]

### 3.7 Publishing and export formats

Publishing creates an immutable release of a prototype. Exporting renders selected, authorized portions of that release for a particular recipient. MockupFX must support an interactive static web bundle as well as open project JSON, publication JSON, CSV datasets, Word documents, PDF, Markdown, image packages, and permitted asset packages. The canonical project archive remains the only lossless editable interchange format; reports and CSV outputs are intentionally derived views.

**MVP requirements**

- **MFX-EXP-001:** Every export must reference a specific immutable publication and include a manifest that identifies the project, publication, source format version, generator version, timestamp, output type, and hashes.
- **MFX-EXP-002:** Static web exports must contain HTML, CSS, JavaScript, permitted assets, and a manifest, and must render without a mandatory MockupFX API dependency.
- **MFX-EXP-003:** The open project archive must include the canonical `mockupfx.project.json` format and referenced assets in a documented layout sufficient for a compatible editor to validate and open.
- **MFX-EXP-004:** CSV exports must provide UTF-8, RFC 4180-compatible, documented inventories of selected pages, components, interactions, variables, comments, assets, and—where authorized—export events. They are not a lossless hierarchy or interaction interchange format.
- **MFX-EXP-005:** Word exports must use `.docx`; PDF exports must use the same canonical report model; both must include semantic headings, page/publication identity, accessible image alternatives, and a clear statement of scope and limitations.
- **MFX-EXP-006:** Markdown, image, and asset packages must identify their source pages/views and rendering/version information in their manifest. Asset packages must retain available attribution data and enforce download rights.
- **MFX-EXP-007:** Export requests must enforce the caller's role and sharing policy, omit secrets and restricted fields, create an audit event, allow selected-page/view/feedback scope, and fail transparently if included content cannot be rendered or accessed.

The full output contracts, CSV schema, Word/PDF report model, privacy controls, and acceptance tests are specified in [Publishing and Export Formats](EXPORT-FORMATS.md).

## 4. Non-functional requirements

| Area | MVP requirement |
|---|---|
| Accessibility | Editor-critical controls, viewer, feedback, and handoff must support keyboard operation, visible focus, semantic names, and reduced-motion preferences. WCAG conformance targets will be set before public beta. |
| Security | Server-side authorization, secure session handling, CSRF protection for browser flows, rate limits on guest feedback and authentication, sanitized comment rendering, and no plaintext secret logging. |
| Portability | Project artifacts and static bundles must use public, documented schemas and semantic versioning. No network service may be required to open a local exported bundle. |
| Reliability | Publication snapshots are immutable. Core mutation endpoints must be idempotent where retry is expected, and audit events must not be silently discarded. |
| Privacy | Analytics are opt-in. Access-code values, secrets, and unnecessary visitor content must not be included in telemetry. Retention and deletion behavior must be documented. |
| Performance | Initial targets: local preview becomes interactive in under two seconds for a representative 20-page project; a published viewer exposes a visible shell within three seconds on a moderate broadband connection. Targets must be validated before release. |
| Internationalization | All user-facing strings must be extractable. The core format stores text as Unicode and records locale metadata without prescribing a default language. |

## 5. Explicit non-goals

The MVP will not import or emulate proprietary design-file formats; generate production-ready application code; use arbitrary JavaScript execution in prototype files; provide native mobile applications; include a mandatory SaaS service; promise full visual fidelity with any commercial product; or implement enterprise SSO, SCIM, advanced audit retention, high availability, or real-time multiplayer editing.

## 6. Deferred capabilities

Later releases may add reusable libraries and variants, data-driven collections, mock API adapters, timers, visual diffing, token export, comments with image/drawing annotations, issue tracker integration, custom domains, SAML/OIDC/LDAP, SCIM, MFA, high-availability guidance, and custom role bundles. These features are intentionally deferred because they depend on the stable project model, render contract, publication model, and authorization foundation defined above.

## 7. Acceptance evidence

Every implemented requirement must be linked to automated evidence. Feature changes should include unit tests for data/validation rules, integration tests for authorization and publication boundaries, browser tests for authoring/viewer interactions, and an updated example project or fixture. The [Implementation Plan](../developer/IMPLEMENTATION-PLAN.md) maps this to modules and milestones.

## References

[1]: https://archive.axure.com/all-documentation/ "Axure documentation archive"
[2]: https://docs.axure.com/axure-rp/reference/events-cases-actions/ "Axure Docs: Events, cases, and actions"
[3]: https://docs.axure.com/axure-rp/reference/adaptive-views/ "Axure Docs: Adaptive views"
[4]: https://docs.axure.com/axure-rp/reference/viewing-sharing-prototypes/ "Axure Docs: Viewing and sharing prototypes"
[5]: https://docs.axure.com/axure-cloud/reference/inspect/ "Axure Docs: Inspecting designs"
[6]: https://docs.axure.com/axure-cloud/business/accounts-and-permissions/ "Axure Docs: Accounts and permissions"
