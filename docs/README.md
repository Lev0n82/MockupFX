# MockupFX Documentation

This documentation set is the initial source of truth for MockupFX. It defines a proposed open-source product before implementation begins. Statements using **MVP requirement** describe a commitment for the first usable release; statements using **later release** identify intentionally deferred work.

## Recommended reading order

| Order | Document | Read this when |
|---:|---|---|
| 1 | [Product Requirements](product/PRODUCT-REQUIREMENTS.md) | Defining scope, evaluating a feature request, or planning an MVP slice |
| 2 | [Full Capability Inventory](inventory/FULL-CAPABILITY-INVENTORY.md) | Reviewing the complete feature inventory reconciled from the public reference archive |
| 3 | [Archive Coverage Matrix](inventory/ARCHIVE-COVERAGE-MATRIX.md) | Checking every top-level archive domain against MockupFX capability and artifact coverage |
| 4 | [Supporting Artifact Manifest](inventory/SUPPORTING-ARTIFACT-MANIFEST.md) | Identifying the schemas, modules, tests, runbooks, and guides required for each capability |
| 5 | [Conformance and Self-Testing](developer/CONFORMANCE-AND-SELF-TESTING.md) | Defining four-level acceptance criteria and built-in validation for all features |
| 6 | [Publishing and Export Formats](product/EXPORT-FORMATS.md) | Designing static web, open JSON, CSV, Word, PDF, Markdown, image, or asset outputs |
| 7 | [Architecture](architecture/ARCHITECTURE.md) | Designing the project model, runtime, backend, API, or export format |
| 8 | [Interactive Preview Player Engine](architecture/INTERACTIVE-PREVIEW-PLAYER-ENGINE.md) | Implementing or reviewing deterministic preview runtime behavior and host boundaries |
| 9 | [Renderer and Exporter Architecture](architecture/RENDERER-AND-EXPORTER.md) | Implementing HTML preview, offline packages, CSV, DOCX, or advanced fixture behavior |
| 10 | [Implementation Plan](developer/IMPLEMENTATION-PLAN.md) | Starting development, selecting a module, or creating a milestone issue |
| 11 | [Player Engine Implementation Plan](developer/PLAYER-ENGINE-IMPLEMENTATION-PLAN.md) | Reviewing initial monorepo structure, test-first runtime tasks, and verification gates |
| 12 | [Renderer and Exporter Implementation Plan](developer/RENDERER-EXPORTER-IMPLEMENTATION-PLAN.md) | Reviewing test-first renderer/exporter build order and release evidence |
| 13 | [Self-Hosting Guide](operations/SELF-HOSTING.md) | Designing deployment, data protection, administration, or operations |
| 14 | [User Documentation Plan](product/USER-DOCUMENTATION-PLAN.md) | Writing tutorials, reference pages, onboarding, or release documentation |
| 15 | [Roadmap](governance/ROADMAP.md) | Understanding phases, dependencies, and the next contribution areas |

Repository-wide policies are available in [Contributing](../CONTRIBUTING.md), [Security](../SECURITY.md), [Governance](../GOVERNANCE.md), and the [Code of Conduct](../CODE_OF_CONDUCT.md).

## Documentation conventions

Requirements use the identifier `MFX-<area>-<number>`. An implementation proposal or pull request should cite the applicable identifiers and describe how its tests verify them. Architecture decisions that change data ownership, the public project format, access control, or compatibility must update the architecture document and the relevant product requirement in the same pull request.

The package separates capability observation from product commitment. Public materials from a related prototyping product informed the breadth of the capability map, but MockupFX does not reuse its source code, project format, proprietary terminology, or interface design.[1]

## References

[1]: https://archive.axure.com/all-documentation/ "Axure documentation archive"
