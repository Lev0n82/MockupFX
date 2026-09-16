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
