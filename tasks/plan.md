# MockupFX Initial Runtime Delivery Plan

## Goal

Create the initial TypeScript monorepo and a deterministic interactive preview player core. The delivery is successful when a versioned fixture project can be validated, executed in Node.js, traced, navigated, reset, and checked by a built-in self-test without a DOM, server, or external service.

## Module map

| Module ID | Responsibility | Depends on |
|---|---|---|
| `format-core` | Project types, semantic validation, stable error contract | — |
| `runtime-core` | Conditions, actions, queue, transaction, state, trace, URL codec | `format-core` |
| `fixture-core` | Compact project and expected journey for tests/self-test | `format-core` |
| `runtime-self-test` | Built package smoke test | `runtime-core`, `fixture-core` |

**Build order:** `format-core` → `fixture-core` and `runtime-core` → `runtime-self-test`.

## Delivery boundaries

The work includes only a data-driven engine. It excludes the editor, DOM renderer, persistence, server APIs, exporter, access control, comments, timers, animation, plugin execution, and expression language. Those later modules must consume the stable types and traces produced here.

## Verification gates

1. **Format gate:** A known-good fixture validates. Duplicate IDs, dangling references, bad variable types, and unsupported actions fail predictably.
2. **Runtime gate:** Conditions, first-match branch selection, action order, navigation, atomic rollback, emitted FIFO events, queue limit, reset, snapshot copy, trace, and URL state pass focused tests.
3. **System gate:** The fixture journey sets a variable, navigates, emits an event, changes visibility, and has the expected trace/state in the self-test.
4. **Quality gate:** Type check, full test suite, production build, self-test, Markdown validation, and Git whitespace check all pass.

## Source of truth

The full design is [Interactive Preview Player Engine Specification](../docs/architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md). The file-level plan, commands, risk controls, and acceptance mapping are in [Player Engine Implementation Plan](../docs/developer/PLAYER-ENGINE-IMPLEMENTATION-PLAN.md).
