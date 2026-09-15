# Archive Coverage Matrix

## Purpose

This matrix demonstrates how every top-level category in the public Axure documentation archive is represented in the MockupFX inventory and supporting-artifact plan. It is a coverage and traceability matrix, not a claim of feature parity or implementation.

The archive separates a desktop authoring product from cloud publishing, artboard publishing, sharing, discussions, inspection, troubleshooting, end-user administration, and business administration.[1] MockupFX uses that information architecture as a completeness check while deliberately adopting original terminology, an open data format, a local-first core, and optional replaceable providers.

| Archive domain | Capability families reconciled | MockupFX inventory sections | Required evidence families |
|---|---|---|---|
| **Authoring reference and tutorials** | Project lifecycle; workspace/panes; pages; canvas; selection; core controls; geometry; grouping; layers; alignment; grids/guides; page/widget styles; notes; shortcuts; libraries; templates; documentation | §§1–3 | `ART-01`, `ART-02`, `ART-06`, `ART-07`, `MOD-01`–`MOD-10`, `TST-01`–`TST-06`, `A11Y-01` |
| **Interactions and prototype logic** | Trigger/branch/effect graph; event catalog; predicates; variables; expressions; runtime state; containers; gestures; data views; repeaters; responsive views; animations; debug trace | §4 | `ART-03`, `MOD-11`–`MOD-18`, `TST-07`–`TST-08`, `SEC-03`, `A11Y-02` |
| **RP preview and local HTML output** | Browser preview; launch configuration; runtime console; static HTML/CSS/JS; selective routes; output profiles; fonts; player; URL state; local distribution; troubleshooting | §5 | `ART-05`, `MOD-18`–`MOD-20`, `TST-04`, `TST-09`, `OPS-04` |
| **HTML/CSS/JavaScript customization** | Scoped extensions; deterministic load order; scope; sandbox; failure diagnostics; CSP | §5 | `ART-06`, `MOD-22`, `SEC-02`, `SEC-03` |
| **Publishing artboard projects** | Artboard projects; screen assets; thumbnails; design-tool import; resumable publishing; hotspots; master interactions; fixed regions; design inspection; re-import provenance | §6 | `ART-10`, `MOD-23`–`MOD-27`, `TST-10`, `REL-02` |
| **Sketch publishing** | Selected-artboard optional adapter, dimensions/order/provenance, failure safety | §6 | `ART-10`, `ART-14`, `MOD-25`, `TST-10` |
| **Adobe XD publishing** | Legacy optional adapter, editable versus flattened outcome, compatibility diagnostic | §6 | `ART-10`, `ART-14`, `MOD-25`, `TST-10`, `REL-02` |
| **Figma publishing** | Optional frame/layer adapter, source IDs, compatibility/rate errors, re-import policy | §6 | `ART-10`, `ART-14`, `MOD-25`, `TST-10`, `REL-02` |
| **Sharing and organizing projects** | Immutable publications; share URLs; visibility; access codes; deep links; workspaces/folders; invitations; roles; ownership; move/archive/delete; mobile review; offline policy | §7 | `ART-09`, `MOD-21`, `MOD-28`, `MOD-29`, `TST-11`, `SEC-01`, `OPS-05` |
| **Mobile access** | Responsive browser viewer; touch/keyboard usability; explicit optional cache/download behavior | §§5, 7 | `MOD-20`, `TST-04`, `A11Y-02`, `SEC-01` |
| **Project discussions** | Revision-pinned comment threads; coordinate/element anchors; guest policy; mentions; attachments; resolution; review setting | §7 | `ART-09`, `MOD-24`, `MOD-30`, `TST-11`, `SEC-01` |
| **Discussion and activity notifications** | In-product/email notifications; digests; mutes; delivery status; retry/dead-letter; optional chat adapters | §7 | `ART-09`, `MOD-31`, `TST-11`, `OPS-03`, `ART-14` |
| **Inspecting designs** | Inspection entry points; compatibility gate; redlines; geometry; typography; fills; text copy; assets; bulk download; CSS-like hints; limitations; authorization | §8 | `ART-11`, `MOD-32`–`MOD-34`, `TST-12`, `SEC-01`, `A11Y-01` |
| **Troubleshooting connection issues** | Editor/runtime/export/deployment diagnostics; DNS/firewall/proxy/CSP/CORS checks; redacted support bundle; failure injection | §§5, 10 | `MOD-39`, `TST-09`, `OPS-04`, `SEC-01` |
| **Business end-user guides** | Organizations; invitations; account status; local auth; workspace policy; role/capability boundary; notification preferences; data lifecycle | §§7, 9 | `ART-09`, `MOD-28`–`MOD-31`, `TST-11`, `OPS-05` |
| **Creating private instances** | Optional provider-neutral private provisioning, hostname/bootstrap workflow, entitlement boundary | §§9, 10 | `ART-14`, `MOD-36`, `OPS-01`, `TST-13` |
| **Installing on-premises** | Deployable topology; resource matrix; database/storage; config; first-run; TLS; mail; health; diagnostics | §10 | `ART-12`, `MOD-37`–`MOD-39`, `OPS-01`–`OPS-04`, `TST-13` |
| **Upgrading on-premises** | Compatibility matrix; migrations; maintenance; rollback; database and object backups; recovery verification | §10 | `ART-02`, `ART-12`, `MOD-37`, `OPS-01`, `TST-13`, `REL-01` |
| **On-premises custom settings** | Typed configuration schema; validation; precedence; secret redaction; output/security/hosting options | §10 | `ART-12`, `OPS-02`, `MOD-39`, `TST-09`, `TST-13` |
| **SAML setup guides** | Optional standards-based SAML integration; metadata/certificates; secure assertion validation; rotation and recovery | §§9, 10 | `ART-14`, `MOD-35`, `TST-13`, `SEC-01`, `DOC-10` |
| **Accounts and permissions** | Tenant/workspace RBAC; invitation lifecycle; active/suspended accounts; directory identity; audit; ownership continuity | §9 | `ART-09`, `MOD-28`, `MOD-29`, `MOD-35`, `TST-11`, `TST-13`, `SEC-01` |

## Deliberate adaptations

Several archive capabilities were adapted to preserve MockupFX's open-source boundary. Vendor-hosted functionality becomes an **optional provider adapter**. Native-mobile workflows become responsive browser/PWA-compatible behavior. Proprietary import paths become optional adapters to a normalized interchange schema. Vendor-specific business licensing is excluded from authorization logic. Generated CSS is explicitly limited to inspectable implementation hints, not a claim of production-ready code generation.

## Coverage completion rule

A matrix row is not complete merely because a plan exists. It becomes supported only after the linked contracts, modules, fixtures, test evidence, operations/security documentation, and user-facing guidance meet the required phase gate in [Supporting Artifact Manifest](SUPPORTING-ARTIFACT-MANIFEST.md) and [Conformance and Self-Testing](../developer/CONFORMANCE-AND-SELF-TESTING.md).

## References

[1]: https://archive.axure.com/all-documentation/ "Axure documentation archive"
[2]: FULL-CAPABILITY-INVENTORY.md "MockupFX Full Capability Inventory"
[3]: SUPPORTING-ARTIFACT-MANIFEST.md "MockupFX Supporting Artifact Manifest"
