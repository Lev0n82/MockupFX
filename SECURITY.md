# Security Policy

## Supported versions

MockupFX is in the documentation and design phase. No production version is currently released or supported. Once implementation begins, supported release lines and their end-of-support dates will be listed here.

## Reporting a vulnerability

Please do **not** open a public issue for a suspected security vulnerability. Send a private report to the repository owner through GitHub's private security advisory reporting feature when it is enabled. If that channel is unavailable, contact the project steward through the private contact published in the repository's Security tab.

Include the affected version or commit, a clear description, reproduction steps or proof of concept, likely impact, attack preconditions, and suggested mitigation if known. Do not include real credentials, access codes, or personal information.

## Response expectations

Maintainers will acknowledge a good-faith report as soon as practical, investigate privately, coordinate a fix and release plan, and credit reporters who wish to be credited after disclosure. The project will not make promises about a fixed response time until an operational security team and supported release process exist.

## Security design commitments

The project aims to preserve tenant isolation, enforce authorization server-side, protect sessions and secrets, avoid placing secrets in static bundles, treat share access codes as verifiers rather than URL material, sanitize untrusted content, support auditable administrative actions, and publish upgrade/rollback guidance for security fixes. Vulnerability disclosures may lead to a private embargo, an emergency release, and post-incident documentation.
