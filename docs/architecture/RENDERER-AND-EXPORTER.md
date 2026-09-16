# MockupFX Renderer and Exporter Specification

> **Status:** Approved implementation scope for the second executable slice. This specification extends the existing deterministic player engine; it does not replace its state, interaction, or validation contracts.

## 1. Objective

This delivery adds three cooperating capabilities. The `@mockupfx/renderer` package converts a validated project and immutable `RuntimeSnapshot` into accessible HTML and provides a browser mount adapter that normalizes DOM activation into `PlayerEngine.dispatch`. The `@mockupfx/exporter` package produces offline static packages, CSV inventories, and Office Open XML Word handoff reports from the same open project document. The expanded `@mockupfx/test-fixtures` package provides advanced, public conformance data for these paths.

The primary success condition is behavioral consistency: a click in a mounted preview and a click in an exported standalone package must flow through `@mockupfx/runtime`, produce the same resulting snapshot, and render the same effective view. Exporters must report the source document; they must not implement their own interaction interpreter.

## 2. Capability map and dependency direction

| Module ID | Responsibility | Depends on |
|---|---|---|
| `format-panel-state` | Extend the versioned project model and validator with bounds, safe authored styles, dynamic-panel state metadata, master metadata, and `setPanelState` | `format-core` |
| `runtime-panel-state` | Apply a validated panel-state override to a runtime snapshot | `format-panel-state`, `runtime-core` |
| `html-renderer` | Pure HTML serialization plus optional browser mount/event adapter | `format-panel-state`, `runtime-panel-state` |
| `exporter-static` | Generate manifest-backed offline HTML package using the renderer/runtime browser bundle | `html-renderer`, `runtime-panel-state` |
| `exporter-reports` | Generate UTF-8 CSV inventory set and DOCX handoff report | `format-panel-state` |
| `advanced-fixtures` | Public complex dashboard fixture and expected behavior states | `format-panel-state`, `runtime-panel-state` |

**Build order:** `format-panel-state` → `runtime-panel-state` → `advanced-fixtures` → `html-renderer` → `exporter-static` and `exporter-reports`.

The `renderer` may depend on the runtime; the runtime may never depend on the renderer. The `exporter` may call the renderer and bundle runtime/renderer browser code; it may never independently evaluate conditions or actions.

## 3. Data-model extension

The `0.1.0` format gains optional, backward-compatible component fields. Existing fixtures remain valid without changes.

```ts
interface ComponentBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ComponentStyle {
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  padding?: number;
  textAlign?: 'left' | 'center' | 'right';
}

interface PanelState { id: string; name: string; }

interface Component {
  // Existing fields omitted
  type: 'text' | 'button' | 'container' | 'image' | 'dynamicPanel' | 'master' | 'input' | 'checkbox';
  name?: string;
  parentComponentId?: string;
  panelStateId?: string;
  panelStates?: PanelState[];
  initialPanelStateId?: string;
  bounds?: ComponentBounds;
  style?: ComponentStyle;
  ariaLabel?: string;
  altText?: string;
  value?: string;
}

interface SetPanelStateAction {
  id: string;
  type: 'setPanelState';
  componentId: string;
  stateId: string;
}
```

The validator requires unique panel-state IDs per dynamic panel, validates the dynamic panel's `initialPanelStateId`, requires `panelStateId` to refer to a state on its immediate dynamic-panel parent, validates every parent relationship, and rejects a `setPanelState` action whose target is not a known dynamic panel or whose state is unavailable on that panel. Style values are restricted to explicit primitive values; authored HTML, CSS strings, script, URL handlers, and arbitrary style property names are not represented.

The runtime snapshot obtains an optional `panelStateId` component override. `setPanelState` updates exactly that override. Any failed state action leaves the queued-event draft uncommitted.

## 4. Renderer contract

### 4.1 Pure renderer

`renderPreviewHtml(project, snapshot, options?)` returns a complete HTML fragment for the active page. It is deterministic and browser-neutral: it does not access the DOM, the clock, local storage, network, or a global runtime. It escapes authored text and labels, applies only the safe style vocabulary, assigns stable `data-mfx-id` attributes, and reflects effective text, visibility, and panel state from the snapshot.

The renderer produces native controls. A `button` renders as `<button type="button">`; an `image` renders as `<img>` with required fallback alt text; `input` and `checkbox` expose a label; grouping types render as labelled `<section>` elements. This guarantees pointer and keyboard activation parity through native HTML semantics. The rendering layer must preserve keyboard focus after an interaction when the prior component remains rendered, and must move focus to the main preview landmark after page navigation.

A dynamic panel renders only child components whose `panelStateId` matches its effective panel state. Child components without `panelStateId` are shared across every panel state. A master is a semantic group that may contain a dynamic panel and ordinary components; it does not clone an object model or invent a second state machine.

### 4.2 Browser mount adapter

`mountPreview(root, project, options?)` constructs one `PlayerEngine`, renders the initial snapshot, delegates native `click` events from elements carrying `data-mfx-event="click"`, dispatches `{ ownerId, name: 'click' }`, then rerenders from the returned snapshot. It returns `{ engine, render, destroy }`. The adapter has no persistence or URL-writing behavior. It exposes any runtime error in an `aria-live="polite"` status element and does not inject raw trace payloads into the page.

`startStandalonePreview(root, project)` is a thin wrapper used by static bundles. It must call the same mount implementation.

## 5. Exporter contract

### 5.1 Static package

`createStaticBundle(project, options)` returns an in-memory package containing `index.html`, `player.js`, `project.json`, and `mockupfx.manifest.json`. It calls a browser bundler to produce `player.js` from the renderer's standalone entry point. The HTML contains a JSON-serialized project in a non-executable data script and loads `player.js` with a relative URL. It makes no external network request, does not require a MockupFX API, and has no access to a publication back end.

The manifest includes project ID, caller-supplied publication ID, `0.1.0` source format version, exporter version, supplied generation timestamp, selected outputs, and SHA-256 hashes of all package files except the manifest itself. The default browser bundler is esbuild; a test caller may inject a deterministic bundle function.

### 5.2 CSV inventory set

`createCsvReport(project, options)` returns `pages.csv`, `components.csv`, `variables.csv`, `interactions.csv`, and `README.md`. All CSV files are UTF-8 without a BOM, use commas and RFC 4180-compatible quoting, contain stable headings, and normalize newlines to `\r\n`. The implementation does not claim to serialize a lossless hierarchy or interaction graph; it emits flattened inventories. Initial variable values are represented only as their type and an intentionally fixed `[redacted]` marker.

### 5.3 Word report

`createWordReport(project, options)` returns an in-memory `.docx` `Uint8Array` constructed as an Office Open XML package. The report contains a title, export-scope statement, publication metadata, a heading per page, an interaction summary, an accessibility statement, and limitations. It uses a real ZIP container with the Office content-type, relationship, core-property, and `word/document.xml` parts. Headings use built-in heading styles and report tables define first-row header semantics. It intentionally does not contain a rendered screenshot or a PDF implementation in this slice.

## 6. Security, privacy, and accessibility

Project text is always HTML- and XML-escaped. The renderer does not accept raw HTML, CSS URLs, JavaScript, inline event attributes, `srcdoc`, or an arbitrary serialized style string. Static exports contain only supplied project data and generated source; they contain no session, access-code, user, comment, audit, or back-end values.

The renderer targets **WCAG 2.2 AA** for the rendered component subset. It uses semantic landmarks, native controls, visible focus styling, text alternatives, named form controls, pointer/keyboard parity, and an `aria-live` runtime-error region. Components with non-text contrast chosen by an author cannot be corrected reliably by the core renderer, so the renderer provides safe default colors and exposes an authored-style contrast diagnostic for a future accessibility audit package.

## 7. Performance and compatibility

The HTML serializer must render the complex fixture in under 15 ms in Node.js 22 CI baseline. A static package must remain under 750 KB excluding generated bundler source-map output and any future asset file. The generated static bundle must execute from ordinary static hosting; automated tests inspect its offline HTML and bundled entrypoint without calling a service.

## 8. Acceptance criteria

### Function criteria

- **AC-RE-F-001:** The format validator accepts an existing `0.1.0` project and validates a dynamic panel's state references and `setPanelState` actions.
- **AC-RE-F-002:** `renderPreviewHtml` escapes component text and emits a native labelled button for a button component.
- **AC-RE-F-003:** `renderPreviewHtml` hides inactive dynamic-panel state children and renders the child of the effective state.
- **AC-RE-F-004:** `createCsvReport` outputs correctly escaped CSV and redacts initial variable values.
- **AC-RE-F-005:** `createWordReport` emits an OOXML ZIP containing `word/document.xml` and project title text.
- **AC-RE-F-006:** `createStaticBundle` produces a relative-resource, offline package with manifest hashes.

### Class and component criteria

- **AC-RE-C-001:** `PlayerEngine` applies `setPanelState` as a copied snapshot override and maintains event transaction behavior.
- **AC-RE-C-002:** `mountPreview` rerenders after a native button click and offers a `destroy` method that unregisters its handler.
- **AC-RE-C-003:** `createStaticBundle` uses its injected/default browser bundler and does not own an interaction evaluator.
- **AC-RE-C-004:** Every generated interactive control has a stable component ID attribute and accessible name.

### Module criteria

- **AC-RE-M-001:** `@mockupfx/renderer` depends on `@mockupfx/format` and `@mockupfx/runtime`, and has no exporter dependency.
- **AC-RE-M-002:** `@mockupfx/exporter` depends on format/renderer/runtime and uses the renderer's standalone entry point for static output.
- **AC-RE-M-003:** Advanced fixture validation covers dynamic panels, nested components, multi-state master views, and ordered state transitions.
- **AC-RE-M-004:** CSV/Word/static report paths are independently testable without a browser or service.

### System criteria

- **AC-RE-S-001:** The complex dashboard fixture changes a master status panel from offline to online, reveals the matching panel child in preview HTML, and gives the same state in the engine trace.
- **AC-RE-S-002:** A static bundle carries the complex project and a browser player bundle whose code imports the runtime/renderer entry rather than duplicating conditions or actions.
- **AC-RE-S-003:** CSV and DOCX reports identify the same project and publication and exclude raw variable initial values.
- **AC-RE-S-004:** The root self-test executes checkout and complex dashboard journeys plus static, CSV, and Word report generation.

## 9. Explicit deferrals

This slice does not provide a drag/drop authoring canvas, responsive breakpoints, rich-text editing, arbitrary HTML/CSS, live form-value capture, image asset packaging, comments, PDF, Markdown, ZIP-on-disk output, hosted publication access control, external dependencies, or visual screenshots. These are future modules and require their own acceptance criteria.

## References

[1]: INTERACTIVE-PREVIEW-PLAYER-ENGINE.md "MockupFX Interactive Preview Player Engine Specification"
[2]: ../product/EXPORT-FORMATS.md "MockupFX Publishing and Export Formats"
[3]: https://www.w3.org/WAI/WCAG22/quickref/ "WCAG 2.2 Quick Reference"
