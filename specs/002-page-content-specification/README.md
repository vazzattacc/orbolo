# 002 — Invest, Beef & Land page content (shipped)

Condensed 2026-11-17 from the original spec, plan, research, data model, contracts, quickstart and tasks (72/72 done). The full originals, including the OQ-001…017 answer history, are in git history (`git show 7ee5391:specs/002-page-content-specification/spec.md`). Copy was rewritten later by 004; the section structure below is still current.

## Rules still in force (sources: client brief `specs/_shared/references/orbolo-website-brief.md`)
- **FR-GEN-003** — no §B2.6 banned word on Invest/Beef/Land (list enforced by `content-compliance.spec.ts`). **FR-BEEF-010** — never "regenerative" about today's beef.
- **FR-GEN-004** — Orbolo never collects, holds or manages money; the contracting party is always the Paraguayan operating company.
- **FR-GEN-005** — every number shows its date and source via `MetricValue`, or isn't shown. `getMetric()` returns `undefined` when `asOfDate` or `sourceDocumentRef` is missing.
- **Hidden, never placeholder** (Vaz, 2026-09-24) — a section without real data is left out of the DOM: no "coming soon", no skeleton, no invented example figure.
- **FR-GEN-009** — Primary nav on every page: Home, Remote Rancher (`/invest`), Beef, Land, Contact (+ About, added later).
- **FR-INV-013 / FR-BEEF-009** — exactly one cross-link Invest ↔ Beef (brief §5, "two roles, one contact").

## Answers that still shape the pages
- Commercial terms (ticket, cycle, return, fee, payout) and eligibility are never published; visitors ask Orbolo (OQ-004, OQ-005, OQ-007).
- Risk specifics live in the NDA-gated data room; the page lists risk categories only (OQ-006).
- No named customers on Beef (OQ-011). Partners/verifiers are not named yet (OQ-002, OQ-003 open). The page may say "raised/sold under the Orbolo Code".
- Contracting entity: "Orbolo" (OQ-001, `settings.json`).
- Remote Rancher is the same product the old site called Verdant (OQ-016). Never use "Verdant" on the site.
- Data still missing, so these stay hidden: Deployment Pipeline ranches (OQ-008), Beef roadmap dates (OQ-010), partner ranches (OQ-013), El Tapir expansion target (OQ-012).

## Hidden sections (the contract `hidden-sections-config-driven.spec.ts` tests both ways)
| Section | Page | Hidden when |
|---|---|---|
| Deployment Pipeline | Invest | `deploymentPipeline` absent or 0 ranches resolved |
| "Who verifies what" verifier list | Invest, Beef | `whoVerifies.verifiers` absent (the generic Code sentence always renders) |
| Partner ranches | Land | `partnerRanches` absent or 0 ranches resolved |
| El Tapir expansion line | Land, Invest | `elTapir.expansionTargetNote` absent |
| Roadmap | Beef | `roadmap` absent or no milestones |

Ranch cards hold public-layer fields only (codename, region, hectares, …). No exact name, location, owner or contracts, ever (brief §7).

## Decisions (code comments cite these as R1–R6)
- **R1** — one typed JSON per page (`invest.json`, `beef.json`, `land.json`), top-level keys = sections; schemas in `src/lib/<page>/schema.ts`.
- **R2** — shared `metrics` collection keyed by `key`.
- **R3** — nav links are a code-level list, not content.
- **R4** — hidden = plain conditional rendering on optional schema fields.
- **R5** — `ranches.json` starts `[]`; schema ready so real data needs no code change.
- **R6** — contracting entity read from `settings.json` via `getContractingEntityName()`.

## Tests
`invest-page.spec.ts` (FR-INV-*), `beef-page.spec.ts` (FR-BEEF-*), `land-page.spec.ts` (FR-LAND-*), `hidden-sections-config-driven.spec.ts`, `content-compliance.spec.ts` (FR-GEN-003/005, SC-002…004), `nav-bar.spec.ts` (SC-007), unit tests for each repository.
