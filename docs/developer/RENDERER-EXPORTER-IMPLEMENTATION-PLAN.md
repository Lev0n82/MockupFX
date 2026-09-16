# MockupFX Renderer and Exporter Implementation Plan

## 1. Delivery sequence

The second executable slice preserves the existing engine boundary. First, the project format and runtime obtain panel-state support. Second, an advanced fixture proves state transitions. Third, a pure renderer serializes the effective snapshot to safe, accessible HTML; only after that does the browser mount adapter connect native button activation to `PlayerEngine`. Fourth, the exporter generates static packages through the renderer entry point, plus flattened CSV and DOCX reports. No module begins as a browser-dependent or hosted implementation.

| Task | Source-first test | Minimal implementation | Required verification |
|---|---|---|---|
| R1 | Format tests reject unknown panel state and panel actions | Optional component metadata and semantic validation | format tests, typecheck |
| R2 | Runtime test expects a panel-state snapshot override | `setPanelState` action and snapshot support | runtime tests, typecheck |
| R3 | Complex fixture journey expects online master panel state | Complex dashboard fixture | fixture validation and runtime journey test |
| R4 | Renderer tests expect escaped, accessible HTML and state filtering | Pure `renderPreviewHtml` | renderer test suite |
| R5 | Mount adapter test expects click → engine → rerender | Browser adapter implementation | renderer suite in jsdom-like fake root or DOM harness |
| R6 | Exporter tests expect static manifest, CSV quoting, DOCX parts | Static, CSV, and DOCX generators | exporter suite |
| R7 | Root self-test expects all generation paths | Self-test expansion and documentation | full release commands |

## 2. Workspace layout

```text
packages/
├── format/                 # Extended versioned document contract
├── runtime/                # Existing deterministic state engine plus panel state
├── renderer/
│   ├── src/
│   │   ├── browser-entry.ts
│   │   ├── html.ts
│   │   ├── mount.ts
│   │   └── index.ts
│   └── tests/
├── exporter/
│   ├── src/
│   │   ├── csv.ts
│   │   ├── docx.ts
│   │   ├── static-bundle.ts
│   │   ├── manifest.ts
│   │   └── index.ts
│   └── tests/
└── test-fixtures/          # Checkout plus complex dashboard fixture
```

`@mockupfx/renderer` imports only project types and the player engine. `@mockupfx/exporter` uses the renderer browser entry point as its browser program and may add esbuild/JSZip as its only direct dependencies. Format validation remains independent of both packages.

## 3. Commands

```bash
pnpm install --frozen-lockfile
pnpm test:format
pnpm test:runtime
pnpm test:renderer
pnpm test:exporter
pnpm test
pnpm typecheck
pnpm build
pnpm self-test
pnpm validate:docs
```

The root self-test must prove the complex panel transition and each export artifact in addition to the original checkout journey. A DOCX check inspects the generated ZIP rather than claiming an unavailable GUI Office reader was opened.

## 4. Test matrix

| Test area | Evidence |
|---|---|
| Project extension | Validator rejects unknown parent/state/action target while accepting the existing checkout fixture unchanged |
| Runtime extension | Snapshot carries `panelStateId`; invalid dynamic-panel action remains typed and transactional |
| Renderer | Text escaping, semantic buttons, stable IDs, inactive-state omission, effective-state visibility, no HTML execution tokens |
| Mount adapter | Native activation dispatches the engine and rerenders; `destroy` removes the event listener |
| Static exporter | Index uses only relative resources, project is serialized safely, manifest has expected IDs/hashes, injected bundler called once |
| CSV exporter | RFC 4180 quoting, CRLF records, all required datasets, redacted variables, documented limitation |
| Word exporter | Valid ZIP parts, project heading, scope, page headings, interaction heading, accessibility statement |
| System | Complex fixture engine and renderer agree on master panel state; root self-test validates every generated artifact |

## 5. Risk controls

| Risk | Mitigation |
|---|---|
| Renderer creates a parallel event implementation | Renderer delegates every activation to `PlayerEngine.dispatch`; static bundle bundles renderer/runtime entry |
| Untrusted authored strings inject markup | Escape HTML/XML and expose only safe primitive style fields |
| Word output is a nonconforming placeholder | Generate the required OOXML package parts with JSZip and inspect them in tests |
| CSV misrepresents project semantics | Include limitations README and export only flattened inventory rows |
| Dynamic panel state leaks into page rendering | Derive visibility from one snapshot override and validated immediate parent state |
| New package dependency breaks reproducibility | Lock direct dependencies; run frozen install, build, tests, and self-test before publishing |

## 6. Boundaries

**Always:** maintain DOM-free runtime behavior, test new production behavior before implementation, escape generated markup, validate panel references, keep static outputs offline, run all release commands, and update architecture/testing documentation.

**Ask first:** adding any dependency beyond esbuild/JSZip, changing format version or existing runtime semantics, importing a browser library/framework, exporting any user/comment/secret data, enabling external assets, or changing license/CI policy.

**Never:** evaluate authored code, put raw author HTML/CSS/JS in output, recreate runtime conditions/actions in exporter code, serialize sensitive state to URLs or report exports, add silent omission paths, or represent CSV as a lossless project interchange.

## 7. Completion evidence

Completion requires a clean Git tree after a pushed commit, 100% passing tests, type check/build/self-test/doc validation success, a generated static package manifest with hashes, CSV and DOCX structural assertions, and the published revision URL. The final response must state the exact test count and self-test evidence without claiming a browser screenshot, PDF report, or external service integration that was not implemented.

## References

[1]: ../architecture/RENDERER-AND-EXPORTER.md "MockupFX Renderer and Exporter Specification"
[2]: ../architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md "MockupFX Interactive Preview Player Engine Specification"
