# Contributing to MockupFX

Thank you for helping build an open, portable prototyping platform. MockupFX is presently documentation-first: design, specification, fixtures, tests, and operational contributions are as valuable as implementation code.

## Before starting work

Read the [Product Requirements](docs/product/PRODUCT-REQUIREMENTS.md), [Architecture](docs/architecture/ARCHITECTURE.md), [Implementation Plan](docs/developer/IMPLEMENTATION-PLAN.md), [Roadmap](docs/governance/ROADMAP.md), and [Code of Conduct](CODE_OF_CONDUCT.md). Search existing issues and discussions before opening a new proposal.

For a feature that changes behavior, begin with a short issue that names the relevant `MFX-*` requirement identifiers, describes the user outcome, lists format/API/security/accessibility effects, and proposes an acceptance test. Changes to the canonical project format, interaction semantics, sharing policy, authorization model, or static bundle require maintainer agreement before implementation begins.

## Contribution workflow

1. Fork the repository and create a focused branch.
2. Keep one logical problem per pull request.
3. Add or update tests and fixtures with behavior changes.
4. Update user, architecture, or operations documentation when the public contract changes.
5. Run the documented validation commands once the build scaffold is present.
6. Open a pull request using the template and respond constructively to review.

Do not put access codes, credentials, personal data, copied proprietary files, or licensed assets without redistribution rights in an issue, fixture, commit, or pull request.

## Documentation contributions

Use plain, precise language. Write from the reader's objective to the supporting detail. Distinguish implemented behavior from proposed behavior, and distinguish assumptions from commitments. Include a reference-style source citation for an external factual claim. Do not copy vendor documentation or UI text; summarize capability observations in your own words and link the source.

## Code and test expectations

The project plans to use TypeScript across the editor, viewer, API, format tools, and test utilities. Code must validate untrusted input at the boundary, keep authorization server-side, avoid hidden mutable behavior in the prototype runtime, and preserve stable identifiers. New public fields need schema/versioning consideration. New UI must be keyboard operable, have accessible labels, retain visible focus, and honor reduced-motion preferences.

A complete implementation pull request includes relevant unit tests, integration tests for persistence/authorization boundaries, and browser tests for user-visible flows. Export, format, and migration work should include durable fixtures that can be inspected without a live service.

## Pull request checklist

- [ ] The pull request links to an issue or requirement identifier.
- [ ] The scope is focused and does not include unrelated formatting or refactors.
- [ ] Input validation and error behavior are covered.
- [ ] Authorization is enforced on the server or documented local equivalent.
- [ ] Tests or fixtures demonstrate the changed behavior.
- [ ] Public contracts, examples, and release notes are updated when required.
- [ ] Keyboard, focus, semantic labeling, and reduced-motion effects were considered.
- [ ] No secrets, access codes, personal data, or unlicensed assets were added.

## Commit and review etiquette

Use short, imperative commit subjects such as `Add project format validation`. Review the behavior, security, accessibility, compatibility, and test evidence rather than the author. Maintainers may request a smaller pull request, a design issue, or a migration plan when a change expands public scope.

## Reporting vulnerabilities

Do not open a public issue for a suspected vulnerability. Follow [SECURITY.md](SECURITY.md).
