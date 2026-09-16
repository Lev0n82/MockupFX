# MockupFX Initial Runtime Tasks

- [x] **P0 — Document the runtime contract and plan**
  - Acceptance: The specification, implementation plan, module map, task list, boundaries, and four-level acceptance criteria are committed before source code.
  - Verify: Markdown links resolve and the plan covers format, runtime, fixture, self-test, testing, errors, security, performance, and accessibility.
  - Files: `docs/architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md`, `docs/developer/PLAYER-ENGINE-IMPLEMENTATION-PLAN.md`, `tasks/plan.md`, `tasks/todo.md`.

- [x] **P1 — Create the pnpm workspace**
  - Acceptance: Root commands and package boundaries are configured for format, runtime, and fixtures.
  - Verify: `pnpm install`, `pnpm typecheck`, and `pnpm test` execute.
  - Files: root manifests/configuration and three package manifests.

- [x] **P2 — Write failing format and fixture tests**
  - Acceptance: Tests express valid document and semantic validation failures before validator code exists.
  - Verify: Focused test fails for the expected missing implementation reason.
  - Files: format tests and fixture source.

- [x] **P3 — Implement format validation**
  - Acceptance: Project types and semantic validator make P2 green with stable errors.
  - Verify: focused format tests and `pnpm typecheck` pass.
  - Files: `packages/format/src/*`.

- [x] **P4 — Write failing runtime tests**
  - Acceptance: Tests specify all initial runtime transitions, trace, queue, URL, reset, and failure behavior before runtime source exists.
  - Verify: Focused runtime test fails for the expected missing implementation reason.
  - Files: `packages/runtime/tests/*`.

- [x] **P5 — Implement runtime primitives**
  - Acceptance: Conditions, actions, errors, and trace meet their unit contracts.
  - Verify: focused primitive tests pass.
  - Files: `packages/runtime/src/conditions.ts`, `actions.ts`, `errors.ts`, `trace.ts`.

- [x] **P6 — Implement player engine and URL codec**
  - Acceptance: Queue/transaction engine, snapshots, navigation, reset, URL state, and trace satisfy runtime tests.
  - Verify: `pnpm test:runtime` and `pnpm typecheck` pass.
  - Files: `packages/runtime/src/engine.ts`, `url-state.ts`, `index.ts`.

- [x] **P7 — Add built self-test and onboarding**
  - Acceptance: A compiled-package self-test proves the reference journey; README represents scope truthfully.
  - Verify: `pnpm build && pnpm self-test` passes.
  - Files: `scripts/self-test.mjs`, `README.md`, `docs/README.md`.

- [x] **P8 — Validate and publish the initial implementation**
  - Acceptance: All documented checks are green and the repository is clean after commit.
  - Verify: `pnpm validate:docs && pnpm test && pnpm typecheck && pnpm build && pnpm self-test && git diff --check`.
  - Files: release/status documentation only if required.

## Renderer, Exporter, and Advanced Fixture Delivery

- [x] **R0 — Document renderer/exporter architecture and plan**
  - Acceptance: The package boundary, data extension, public contracts, multi-level criteria, test strategy, and security/accessibility constraints are documented before source changes.
  - Verify: `pnpm validate:docs` resolves all new documentation links.
  - Files: `docs/architecture/RENDERER-AND-EXPORTER.md`, `docs/developer/RENDERER-EXPORTER-IMPLEMENTATION-PLAN.md`, `tasks/todo.md`.

- [x] **R1 — Extend the validated format and runtime panel-state contract**
  - Acceptance: Dynamic panels, master metadata, layout/style primitives, and `setPanelState` work without breaking the original project format.
  - Verify: `pnpm test:format && pnpm test:runtime && pnpm typecheck`.
  - Files: format/runtime types, validation, action, tests.

- [x] **R2 — Create complex public fixture coverage**
  - Acceptance: A dashboard fixture includes nested controls, dynamic panels, and a multi-state master view with expected runtime journeys.
  - Verify: focused runtime journey test and format validation.
  - Files: `packages/test-fixtures/src/*`, fixture tests.

- [x] **R3 — Implement the HTML preview renderer**
  - Acceptance: Safe deterministic HTML reflects effective state and the mount adapter delegates activation to the engine.
  - Verify: `pnpm test:renderer && pnpm typecheck`.
  - Files: `packages/renderer/src/*`, renderer tests.

- [x] **R4 — Implement static, CSV, and DOCX exporters**
  - Acceptance: Offline package, manifest, CSV data dictionary, and structurally valid DOCX report are generated from one project source.
  - Verify: `pnpm test:exporter && pnpm build`.
  - Files: `packages/exporter/src/*`, exporter tests.

- [x] **R5 — Expand self-test, validate, and publish**
  - Acceptance: Root self-test proves all journeys and export artifacts; all repository checks pass before push.
  - Verify: `pnpm test && pnpm typecheck && pnpm build && pnpm self-test && pnpm validate:docs && git diff --check`.
  - Files: root self-test, README/index updates, release commit.
