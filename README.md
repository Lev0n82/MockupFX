# MockupFX

**MockupFX** is a documentation-first, open-source proposal for a browser-based UX prototyping, review, and developer-handoff platform. It is designed to make interactive mockups portable, inspectable, shareable, and self-hostable without requiring a proprietary project format or hosted service.

> **Status:** This repository currently contains the product specification, architecture, governance, and contributor materials required to begin an open-source implementation. It does not yet ship an editor, renderer, hosted service, or production API.

## Product scope

MockupFX is organized around one durable workflow: teams author an interactive project, preview it in a browser, publish an immutable reviewable artifact, gather traceable feedback, and hand the result to developers with measurements, styles, assets, and a stable project model. The intended open format and static export mean that users retain control of their work and may host outputs on ordinary web infrastructure.

| Product area | MVP commitment | Planned direction |
|---|---|---|
| **Prototype authoring** | Pages, reusable components, canvas primitives, typed state, responsive layout overrides | Variants, component libraries, richer data and animation models |
| **Interaction runtime** | Deterministic event → branch → action behavior with conditions and debug traces | Timers, mock requests, advanced expressions, automated interaction assertions |
| **Preview and export** | Local preview, self-contained static web bundles, open JSON, CSV, Word, PDF, Markdown, and asset/image packages | Hosted channels, custom domains, deployment integrations |
| **Review and feedback** | Page-coordinate comment threads, resolution state, access-aware sharing | Assignments, approvals, visual annotations, tracker integrations |
| **Developer handoff** | Element metadata, measurements, typography, color, CSS hints, asset downloads | Token extraction, revision diffs, framework adapters |
| **Workspaces and self-hosting** | Tenant isolation, roles, invitations, audit logs, documented reference deployment | Enterprise identity, SCIM, high availability, advanced retention controls |

The complete requirements and acceptance criteria are in [Product Requirements](docs/product/PRODUCT-REQUIREMENTS.md). The repository deliberately keeps the product **vendor-neutral**. It uses the public documentation archive named below only as a capability reference, not as code, design, terminology, or content to reproduce.[1]

## Documentation map

| Document | Purpose |
|---|---|
| [Documentation index](docs/README.md) | Navigation and reading order for the full package |
| [Product Requirements](docs/product/PRODUCT-REQUIREMENTS.md) | Scope, requirements, acceptance criteria, and non-goals |
| [Full Capability Inventory](docs/inventory/FULL-CAPABILITY-INVENTORY.md) | Complete feature inventory across authoring, runtime, export, import, sharing, handoff, administration, and operations |
| [Archive Coverage Matrix](docs/inventory/ARCHIVE-COVERAGE-MATRIX.md) | Traceable reconciliation from the source archive to MockupFX inventory and evidence artifacts |
| [Supporting Artifact Manifest](docs/inventory/SUPPORTING-ARTIFACT-MANIFEST.md) | Required contracts, modules, fixtures, tests, runbooks, and user guides for supportable features |
| [Conformance and Self-Testing](docs/developer/CONFORMANCE-AND-SELF-TESTING.md) | Four-level success criteria and continuous validation requirements |
| [Publishing and Export Formats](docs/product/EXPORT-FORMATS.md) | Interactive web, open JSON, CSV, Word, PDF, Markdown, image, and asset exports |
| [User Documentation Plan](docs/product/USER-DOCUMENTATION-PLAN.md) | End-user documentation required before releases |
| [Architecture](docs/architecture/ARCHITECTURE.md) | Target system design, open project format, and trust boundaries |
| [Implementation Plan](docs/developer/IMPLEMENTATION-PLAN.md) | Module map, milestones, interfaces, and test strategy |
| [Self-Hosting Guide](docs/operations/SELF-HOSTING.md) | Reference operations model, configuration, backup, and upgrades |
| [Roadmap](docs/governance/ROADMAP.md) | Release sequence and contribution priorities |
| [Contributing Guide](CONTRIBUTING.md) | Participation, issue, review, and pull-request process |
| [Security Policy](SECURITY.md) | Private reporting and disclosure expectations |
| [Governance](GOVERNANCE.md) | Decision-making and maintainer responsibilities |

## Open-source commitments

MockupFX is licensed under the [MIT License](LICENSE). The planned project format, static export structure, and protocol contracts are intended to remain public and versioned. The project encourages forks, alternative hosts, independent renderers, and compatible plugins, provided they respect user data and declared format compatibility.

The project is **not affiliated with, endorsed by, or a derivative implementation of Axure Software Solutions, Inc.** “Axure” is a trademark of its respective owner and is used here only to identify public reference documentation.

## Getting started with the proposal

1. Read the [Product Requirements](docs/product/PRODUCT-REQUIREMENTS.md) to understand the target MVP and explicitly excluded work.
2. Review the [Architecture](docs/architecture/ARCHITECTURE.md) before proposing an implementation or format change.
3. Select a scoped work item from the [Roadmap](docs/governance/ROADMAP.md) or open a discussion/issue using the templates.
4. Follow [Contributing](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) when participating.

## References

[1]: https://archive.axure.com/all-documentation/ "Axure documentation archive"
