# MockupFX Conformance and Self-Testing

## Objective

MockupFX will treat testing as a product capability, not a release-only activity. Every supported feature must have success criteria and built-in evidence at **four levels**:

1. **Function:** A deterministic unit of behavior accepts valid input, rejects invalid input safely, and returns an observable result.
2. **Class or component:** A module/class preserves its invariants across its public operations and collaborates correctly with its direct dependencies.
3. **Module:** A package/service fulfills its documented contract, including persistence, authorization, compatibility, errors, diagnostics, and performance boundaries.
4. **System:** A user journey works across editor, project model, runtime/export, review, handoff, identity, and operations surfaces without data loss or privilege escalation.

This plan is mandatory for every item marked Foundation, MVP, Post-MVP, Optional, or Support in the [Full Capability Inventory](../inventory/FULL-CAPABILITY-INVENTORY.md). The [Supporting Artifact Manifest](../inventory/SUPPORTING-ARTIFACT-MANIFEST.md) defines the test corpus and tool artifacts needed to produce the evidence.

## Success-criteria template

Every capability issue and pull request must include a record that follows this pattern.

```markdown
### Feature: <capability name>

**Requirements:** MFX-... / inventory row

**Function criteria**
- FC-<id>-01: <input → expected output/error>

**Component criteria**
- CC-<id>-01: <invariant under state transition>

**Module criteria**
- MC-<id>-01: <public contract, integration, authorization, migration, diagnostic, or performance condition>

**System criteria**
- SC-<id>-01: <end-to-end user/admin journey>

**Built-in self-test**
- Fixture: <fixture path>
- Automated commands: <commands>
- Evidence: <trace/snapshot/manifest/report path>
- Failure recovery: <safe handling and diagnostic>
```

## Required self-testing architecture

The future codebase must expose repeatable test seams. A feature is incomplete if it can only be checked manually in an unrepeatable browser session.

| Test layer | Built-in mechanism | Required outputs |
|---|---|---|
| Schema and format | JSON Schema validator, semantic validator, migration validator, manifest verifier | Structured error codes, migration reports, canonical serialized output |
| Command/editor model | Deterministic command runner, undo/redo checker, focus/keyboard harness | Command trace, before/after project snapshots, focus route |
| Geometry/style/rendering | Scene snapshot, layout resolver, visual-diff harness, inspection comparator | Bounds/style values, render snapshots, tolerance report |
| Interaction runtime | Event dispatcher trace, fake clock, state snapshot/reset, replay runner | Ordered trace, branch outcomes, emitted effects, replay result |
| Static export | Reproducible build hash, local static server harness, asset/route/link verifier | Bundle manifest, hash report, network/console result |
| Import/interoperability | Adapter contract fixtures, provenance/diff evaluator, fidelity report | Normalized import, unsupported-feature diagnostics, re-import comparison |
| Review/collaboration | Multi-principal integration harness, policy simulator, notification fake | Authorization matrix, comment/revision anchor, delivery event ledger |
| Inspection/handoff | Geometry/text/style/asset comparator and clipboard/export checks | Inspection manifest, redline evidence, downloadable asset hash |
| Operations | Disposable deployment, preflight, health probes, migration/backup/restore harness | Install report, readiness result, backup manifest, recovery evidence |
| Security/accessibility/release | Threat-model tests, SAST/dependency/license scan, accessibility runner, reproducibility script | Security findings, SBOM, accessibility report, signed/checksummed artifacts |

## Definition of supported

A feature may be called **Supported** only when all of the following are true.

- Its public schema/API/user behavior is documented and versioned.
- It has function, component, module, and system-level acceptance criteria.
- Its fixtures run in continuous integration and include at least one failure/negative case.
- Compatibility, migration, authorization, privacy, and accessibility effects have been assessed.
- Its diagnostic and recovery behavior is documented.
- It has a performance budget or explicit reason that a budget is not applicable.
- It is covered by release notes, user documentation, and operator documentation where those audiences exist.

A passed happy-path test is insufficient. A feature must also prove that unsupported inputs, unavailable dependencies, expired permissions, malformed files, canceled work, and interrupted persistence do not corrupt data, bypass policy, or produce false success.

## Conformance suites

The repository will maintain the following executable suites. They correspond to `TST-*` entries in the supporting-artifact manifest.

| Suite | Focus | Release-blocking examples |
|---|---|---|
| `document` | Open bundle, IDs, migrations, recovery, import/export | Lost stable IDs, non-idempotent migrations, invalid references accepted |
| `editor` | Keyboard, page tree, canvas, selection, geometry, styles, notes | Pointer-only essential flow, broken undo, inaccessible focus, incorrect selection |
| `runtime` | Events, branches, effects, state, expressions, timing, responsive behavior | Nondeterministic trace, arbitrary code escape, branch ordering conflict |
| `publication` | Static output, routes, URL state, fonts, profiles, browser behavior | Missing asset, debug/secrets in export, output hash drift |
| `reports` | CSV/DOCX/PDF/Markdown/image/asset packages | Incorrect scope, malformed CSV, inaccessible report heading, private field leak |
| `importers` | External artifact parsing, provenance, fidelity and re-import | Silent overwrite of local change, unsupported feature crash, source ID loss |
| `collaboration` | Tenants, roles, links, comments, notifications, lifecycle | Cross-tenant read, expired share access, comment lacks revision anchor |
| `inspection` | Measurements, text/style data, assets, declaration caveats | Inaccurate redline, unauthorized asset download, misleading production-code claim |
| `operations` | Install, health, config, migration, backup/restore, identity | Unrecoverable failed migration, health reports ready with broken storage, credentials in logs |
| `release` | Reproducibility, SBOM, dependency/license/security checks | Unverifiable binary, unsupported dependency, unreviewed critical finding |

## Continuous validation gates

Every pull request must run a minimal affected-suite selection. Nightly and release jobs run the complete matrix, compatibility checks, visual tests, browser matrix, and disposable deployment recovery drill.

| Change type | Minimum required checks |
|---|---|
| Project schema or migration | `document`, migration fixtures, round-trip, compatibility report |
| Editor/canvas/style change | `editor`, `geometry`/`visual`, keyboard/accessibility checks |
| Interaction/state change | `runtime`, trace replay, expression fuzzing where applicable |
| Export/player change | `publication`, browser/static server, manifest/link/secret verifier |
| Export report change | `reports`, file-open/parse, scope/privacy/accessibility verifier |
| Importer/adapter change | `importers`, provenance/re-import, compatibility matrix update |
| Review/identity/authorization change | `collaboration`, negative authorization, audit/redaction checks |
| Inspection/handoff change | `inspection`, access policy and value/snapshot comparisons |
| Deployment/configuration change | `operations`, preflight, disposable install, rollback/restore if persistence changes |
| Dependency/release change | `release`, SBOM/license/security/reproducibility checks |

## Failure handling and iteration

When any self-test fails, the contributor must first preserve the failure artifact: fixture, command/trace, logs with secrets redacted, environment/version, and expected/actual output. The change is then corrected and the affected suite is rerun until all criteria pass. It is not acceptable to weaken a test, remove a fixture, or hide a diagnostic merely to achieve a passing result.

A flaky test is a release-quality defect. The owning module must either make the operation deterministic, use a controlled fake clock/network/storage seam, or document and enforce a justified tolerance. A test that cannot be made stable should not be used as positive evidence for a support claim.

## Traceability and public reporting

The project will publish a generated feature-to-evidence matrix linking every inventory capability to its requirements, source module, fixture, test suite, release state, support window, known limitation, and relevant documentation. Release notes will include migrations, removed/deprecated behavior, browser/operating-system/accessibility matrix updates, security changes, and self-test summary.

## References

[1]: ../inventory/FULL-CAPABILITY-INVENTORY.md "MockupFX Full Capability Inventory"
[2]: ../inventory/SUPPORTING-ARTIFACT-MANIFEST.md "MockupFX Supporting Artifact Manifest"
