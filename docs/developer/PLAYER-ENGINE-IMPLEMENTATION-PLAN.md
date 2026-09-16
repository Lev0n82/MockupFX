# MockupFX Player Engine Implementation Plan

> **Status:** Initial implementation plan. This plan is complete before source code is created and is constrained by the [Interactive Preview Player Engine Specification](../architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md).

## 1. Initial delivery

The first implementation creates a TypeScript monorepo with one validated project-format package, one deterministic runtime package, a shared fixture package, and a Node-based self-test command. It demonstrates an interactive prototype as data and runtime behavior, without prematurely committing to React, a visual canvas, a database, a hosted API, or a browser renderer.

This slice is intentionally small but vertical. It can validate a project, initialize a player, dispatch an interaction, commit a transactional state transition, navigate, process a queued emitted event, produce a trace, encode a safe page URL state, and self-test the reference scenario. The next milestone can add a viewer adapter without rewriting behavior semantics.

## 2. Assumptions and decisions

| Decision | Chosen approach | Rationale |
|---|---|---|
| Language and runtime | TypeScript with Node.js 22 | Strict types and browser-compatible source with reliable test support |
| Package manager | pnpm workspaces | Fast, deterministic workspace installation and explicit package boundaries |
| Test runner | Vitest | TypeScript-native test execution, concise assertions, coverage support, and browser-ready future path |
| Build tool | TypeScript compiler | Minimal first scaffold; avoids coupling core runtime to a web bundler |
| Source format | ES modules | Native modern Node/browser module semantics |
| Validation | Hand-written structural/semantic validator | Keeps initial format transparent and avoids schema runtime coupling; JSON Schema may be added alongside it later |
| Engine state | Immutable external snapshots with transactional draft per queued event | Prevents partial action mutation and supports deterministic trace replay |
| Error model | Typed returned runtime errors; construction-time validation errors | Allows player hosts to render errors without unhandled interaction exceptions |
| Renderer | Explicitly excluded from the initial slice | Keeps the runtime DOM-neutral and allows later UI technology selection |

## 3. Executable commands

After the scaffold is complete, these commands are normative:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm test:runtime
pnpm typecheck
pnpm lint
pnpm build
pnpm self-test
pnpm validate:docs
```

`pnpm test` runs the full Vitest workspace. `pnpm test:runtime` runs only the runtime test package. `pnpm typecheck` runs `tsc --noEmit` across packages. `pnpm lint` uses TypeScript-aware static checking via the configured lint script. `pnpm build` emits package outputs to `dist/`. `pnpm self-test` executes the reference project and asserts its expected final state and trace sequence.

## 4. Repository structure after initial delivery

```text
MockupFX/
├── docs/
│   ├── architecture/
│   │   └── INTERACTIVE-PREVIEW-PLAYER-ENGINE.md
│   └── developer/
│       ├── PLAYER-ENGINE-IMPLEMENTATION-PLAN.md
│       └── CONFORMANCE-AND-SELF-TESTING.md
├── packages/
│   ├── format/
│   │   ├── src/
│   │   │   ├── errors.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── validate.ts
│   │   ├── tests/
│   │   └── package.json
│   ├── runtime/
│   │   ├── src/
│   │   │   ├── actions.ts
│   │   │   ├── conditions.ts
│   │   │   ├── engine.ts
│   │   │   ├── errors.ts
│   │   │   ├── index.ts
│   │   │   ├── trace.ts
│   │   │   └── url-state.ts
│   │   ├── tests/
│   │   └── package.json
│   └── test-fixtures/
│       ├── src/
│       │   ├── checkout-project.ts
│       │   └── index.ts
│       └── package.json
├── scripts/
│   └── self-test.mjs
├── tasks/
│   ├── plan.md
│   └── todo.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── vitest.workspace.ts
```

The dependency direction is `test-fixtures → format`, `runtime → format`, and tests/self-test → runtime + fixtures. The format package must never import the runtime package. The runtime package must never import a fixture package. This prevents documentation examples and UI work from becoming a hidden production dependency.

## 5. Public module contracts

### 5.1 `@mockupfx/format`

The package exposes project types and `validateProject(project)`. Validation returns a normalized immutable project or raises `ProjectValidationError` with a stable code, path, and actionable message. The first implementation validates the narrow engine subset only. New document features must be additive and versioned.

### 5.2 `@mockupfx/runtime`

The package exposes `PlayerEngine`, `RuntimeError`, `parseUrlState`, and runtime type definitions. `PlayerEngine` receives only a validated project and options. It returns `DispatchResult` for all expected runtime failures. It does not emit console output, create timers, mutate input, access a browser API, or require a server.

### 5.3 `@mockupfx/test-fixtures`

The package exposes one compact `checkoutProject` and expected state constants. The fixture has two pages and demonstrates variable mutation, conditional branch selection, navigation, visibility update through `emit`, and one failing action scenario added directly inside test data. It contains no user data, proprietary design, production asset, or secret.

### 5.4 Self-test CLI

The self-test script imports compiled package outputs after `pnpm build`. It runs the reference journey, checks final page, variables, component visibility, event count, and trace sequence, and exits nonzero on mismatch. It is a built-in release smoke test, not a replacement for Vitest.

## 6. Test-first implementation order

The following order is mandatory. A production module is not created until its corresponding test is written and observed to fail for the intended reason.

| Step | Test first | Minimal implementation | Verification checkpoint |
|---|---|---|---|
| 1 | Project accepts valid fixture and rejects duplicate IDs | Project types and semantic validator | Format tests turn green; `pnpm typecheck` succeeds |
| 2 | Literal and variable conditions evaluate correctly | Condition evaluator | Runtime unit tests turn green |
| 3 | Variable type mismatch and missing targets return typed errors | Error class and action applier | Error assertions pass without partial draft mutation |
| 4 | Engine selects only the first matching enabled branch | Queue and dispatch logic | Trace records false then selected branch deterministically |
| 5 | Actions commit atomically and navigate correctly | Draft/commit engine transaction | Navigation and rollback tests pass |
| 6 | Emit queues an event after commit and honors limit | FIFO scheduler | Queue ordering and event-limit tests pass |
| 7 | URL state accepts known page and rejects unknown page | URL state codec | Codec tests pass; no variable appears in result |
| 8 | Reset and snapshots cannot leak internal mutability | Snapshot copying/reset | Mutation-isolation tests pass |
| 9 | Reference fixture completes full journey | Fixture and self-test CLI | `pnpm self-test` passes after build |

## 7. Acceptance-criteria mapping

| Specification criterion | Initial test file | Evidence |
|---|---|---|
| `AC-PE-F-001` and `AC-PE-F-002` | `packages/runtime/tests/conditions.test.ts` and `actions.test.ts` | Condition truth table and type rejection tests |
| `AC-PE-F-003` and `AC-PE-F-005` | `packages/runtime/tests/engine.test.ts` | Navigation/history and transactional rollback tests |
| `AC-PE-F-004` | `packages/runtime/tests/url-state.test.ts` | Known/unknown page and allowlist tests |
| `AC-PE-C-001` through `AC-PE-C-004` | `packages/runtime/tests/engine.test.ts` | Snapshot mutation, order, FIFO, trace sequence tests |
| `AC-PE-M-001` through `AC-PE-M-004` | Root workspace configuration plus runtime tests | Dependency boundary, Node test and trace redaction checks |
| `AC-PE-M-005` | Deferred benchmark marker in `packages/runtime/tests/performance.test.ts` | Initial fixture completes below guardrail when CI calibration exists |
| `AC-PE-S-001` through `AC-PE-S-004` | `packages/runtime/tests/player-journey.test.ts` and `scripts/self-test.mjs` | End-to-end expected snapshot and trace state |

## 8. File-by-file task plan

### Task P0 — Commit technical contracts

**Acceptance:** The engine specification, implementation plan, root task plan, and task checklist define scope, APIs, test strategy, acceptance criteria, commands, constraints, and complete build order.

**Verification:** Markdown link validation and review of all referenced paths.

**Files:** `docs/architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md`, this document, `tasks/plan.md`, `tasks/todo.md`.

### Task P1 — Create workspace and quality commands

**Acceptance:** pnpm recognizes the three packages and each root command executes or fails only because implementation tests are intentionally red.

**Verification:** `pnpm install`, `pnpm typecheck`, `pnpm test`.

**Files:** `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `vitest.workspace.ts`, package manifests.

### Task P2 — Establish failing format tests and fixture

**Acceptance:** Tests describe valid project, duplicate IDs, dangling reference, invalid initial type, and unsupported action behavior. The tests fail because validator source does not exist.

**Verification:** Run the focused test and record an expected module-not-found or implementation failure.

**Files:** format test, fixture source, package test configuration.

### Task P3 — Implement format types and semantic validator

**Acceptance:** Format tests turn green. Validation does not mutate input and emits stable error codes/paths.

**Verification:** `pnpm test --filter @mockupfx/format` and `pnpm typecheck`.

**Files:** `packages/format/src/*`.

### Task P4 — Establish failing runtime behavior tests

**Acceptance:** Tests define conditions, action errors, first-match selection, atomic transactions, navigation, emitted queue, limits, URL state, reset, snapshot copy, and complete fixture journey.

**Verification:** Focused runtime tests fail because runtime source is absent.

**Files:** runtime test files only.

### Task P5 — Implement conditions, actions, errors, and trace

**Acceptance:** Unit behavior for conditions/action applications is green; no direct event loop exists yet.

**Verification:** Focused condition/action tests and type check.

**Files:** `conditions.ts`, `actions.ts`, `errors.ts`, `trace.ts`.

### Task P6 — Implement PlayerEngine and URL state

**Acceptance:** Engine queue, first-match policy, event transaction, navigation, reset, snapshot isolation, trace, URL state, and queue limit tests are green.

**Verification:** All runtime tests, type check, and project package build.

**Files:** `engine.ts`, `url-state.ts`, `index.ts`.

### Task P7 — Add reference self-test and documentation updates

**Acceptance:** The built artifact self-test completes the fixture journey and README announces initial runtime status and commands without implying a renderer or hosted service.

**Verification:** `pnpm build && pnpm self-test`.

**Files:** `scripts/self-test.mjs`, `README.md`, documentation index.

### Task P8 — Full validation and clean commit

**Acceptance:** Documentation validation, tests, type check, build, self-test, and workspace status succeed. Any failure is resolved before commit.

**Verification:** `pnpm validate:docs && pnpm test && pnpm typecheck && pnpm build && pnpm self-test && git diff --check`.

**Files:** Only test-result/status artifacts if needed; no source changes are accepted solely to bypass a failure.

## 9. Risks and mitigations

| Risk | Consequence | Mitigation |
|---|---|---|
| Runtime semantics drift from static viewer | Prototype behaves differently across delivery modes | One runtime package; fixture trace and snapshot conformance tests |
| Partial mutation after an effect error | Broken prototype state and irreproducible bug | Per-event draft/commit transaction with rollback test |
| Event emission loop | Browser lockup or test hang | FIFO queue plus configurable hard event limit and typed error |
| Browser coupling in core | Node tests and static exporter diverge | No DOM/global browser APIs in runtime; package-boundary check |
| Excessive scope in initial scaffold | Slow, untestable implementation | Explicit deferred list and vertical core slice only |
| Hidden unsafe evaluation | XSS or unpredictable behavior | Data-only condition algebra and no function/string evaluation |
| Accessibility deferred too far | Viewer built around pointer-only semantics | Normalized event contract and host requirements in core specification |

## 10. Development boundaries

**Always:** write a failing test before production code, validate input at package boundaries, return typed errors, keep project input immutable, run all checks before a commit, maintain traceability to this specification, and update documentation with behavior.

**Ask first:** adding a runtime dependency, changing any public project/runtime type, altering first-match or transaction semantics, adding a browser global to the core, changing the module boundary, adding telemetry, changing licensing, or accepting arbitrary expressions/scripts.

**Never:** commit secrets, evaluate author-provided code, access the network from the core, mutate a published/static project, suppress failing tests, make static output depend on a hosted service, or serialize variable values/access controls into URL state.

## References

[1]: ../architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md "MockupFX Interactive Preview Player Engine Specification"
[2]: CONFORMANCE-AND-SELF-TESTING.md "MockupFX Conformance and Self-Testing"
[3]: ../../tasks/plan.md "MockupFX Initial Runtime Delivery Plan"
