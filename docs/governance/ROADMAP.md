# MockupFX Roadmap

## Product direction

MockupFX will progress from an open, validated project model to a fully reviewable and self-hostable prototype workflow. The roadmap favors reliability, portability, and contributor clarity over surface-area parity with any commercial tool. The project will not use a proprietary file format or require a hosted vendor service to export and view a prototype.

## Release phases

| Phase | Outcome | Principal deliverables | Entry condition |
|---|---|---|---|
| **0. Proposal** | Documentation-first project definition | Product requirements, architecture, governance, licensing, contribution rules | Current repository baseline |
| **1. Format alpha** | An open artifact that can be validated and migrated | JSON schema, fixtures, validator, format versioning, ID rules | Maintainers agree on schema and compatibility process |
| **2. Runtime alpha** | A small prototype runs deterministically | Event/branch/action runtime, state, trace, sample projects | Format alpha passes fixture tests |
| **3. Authoring alpha** | A user builds a simple responsive prototype | Canvas, page tree, components, properties, interaction editor, local preview | Runtime trace is stable |
| **4. Publication beta** | A prototype can travel independently | Static bundle generator, open project archive, manifest, share policy, protected viewer, CSV/Word/PDF/Markdown/image/asset export contracts | Same runtime works locally and in export |
| **5. Review and handoff beta** | Reviewers and developers have traceable evidence | Comments, notification events, inspection, measurements, asset downloads | Publication snapshots and authorization are audited |
| **6. Self-hosted 1.0** | Organizations can operate MockupFX responsibly | Reference containers, configuration, roles, backups, restore, upgrades, operations docs | Installation and recovery drills pass |
| **7. Ecosystem** | External extension and enterprise capabilities | Plugin contracts, integrations, SSO/SCIM, tokens, visual diffs, deployment options | Core contracts are stable and versioned |

## Priority rules

1. **Format before editor:** No interface feature may introduce undocumented, unrecoverable project data.
2. **Runtime before visual polish:** The editor and exported viewer must agree on interaction semantics before design refinements are accepted.
3. **Authorization before collaboration:** Shared links, comments, and asset downloads must enforce policy from the first public release.
4. **Operations before enterprise claims:** Self-hosting is not complete until backup, restore, upgrade, and incident procedures are rehearsed.
5. **Accessibility throughout:** Keyboard behavior, semantic names, focus recovery, and reduced-motion support belong in every UI milestone.

## Deferred feature queue

The following are valuable but not suitable for the earliest release: real-time co-authoring; arbitrary JavaScript plugins; importing proprietary source formats; production-code generation; native mobile apps; analytics by default; enterprise SSO/SCIM; custom roles; advanced review workflow; visual revision diffing; and high-availability deployment patterns.

## How to contribute to the roadmap

Maintainers prioritize proposals that unblock a phase exit criterion, reduce format ambiguity, improve test fixtures, close an accessibility gap, improve self-hosting safety, or make an existing workflow clearer without broadening scope. Submit a feature request using the repository template and include the affected requirement IDs, user journey, data-model impact, security implications, accessibility considerations, and an acceptance test.

## References

[1]: ../product/PRODUCT-REQUIREMENTS.md "MockupFX Product Requirements"
[2]: ../developer/IMPLEMENTATION-PLAN.md "MockupFX Implementation Plan"
