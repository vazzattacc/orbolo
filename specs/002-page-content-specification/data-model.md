# Phase 1 Data Model: Invest, Beef & Land Page Content Structure

Six new content collections (`invest`, `beef`, `land`, `metrics`, `ranches`, `settings`), loaded via Astro's `file()` content loader exactly like the existing `paths` collection. `SiteNav` and `PageSection` from `spec.md`'s Key Entities are **not** implemented as code entities — see `research.md` §1/§3 for why.

## Metric

Backs every dated/sourced number on the three pages (`FR-GEN-005`). One collection, referenced by `key` from any page.

| Field | Type | Required | Notes |
|---|---|---|---|
| `key` | string | yes | Lowercase camelCase identifier, unique (e.g. `elTapirHectares`) |
| `value` | number \| string | yes | The displayed figure (`1000`, `"500+"`) |
| `unit` | string | no | e.g. `"ha"`, `"animals"` — omitted when the value is self-describing |
| `asOfDate` | string (ISO date) | yes | `getMetric()` returns `undefined` if missing |
| `sourceDocumentRef` | string | yes | Human-readable source citation; `getMetric()` returns `undefined` if missing |

**Known values at launch** (all Vaz-confirmed):

| key | value | unit | asOfDate | sourceDocumentRef |
|---|---|---|---|---|
| `elTapirHectares` | 1000 | ha | 2026-09-23 | "Live site fetch 2026-09-22 (`/el-tapir`), confirmed by Vaz 2026-09-23 (OQ-012)" |
| `gappHectares` | 35000 | ha | 2026-09-23 | "Live site fetch 2026-09-22 (`/copy-of-el-tapir-2`), confirmed by Vaz 2026-09-23 (OQ-014)" |
| `animalCount` | "500+" | animals | 2026-09-24 | "Vaz, direct input, 2026-09-24" |

**Validation**: `key` matches `/^[a-z][a-zA-Z0-9]*$/`; `value` non-empty; `asOfDate` a valid ISO date string; `sourceDocumentRef` non-empty. A `Metric` failing any of these fails the build loudly (Astro Content Collections' own schema validation), never silently.

## RanchCard

The public-facing representation of one ranch, shared conceptually between Invest's Deployment Pipeline and Land's Partner ranches (`spec.md` §7). **Zero entries at launch** (`OQ-008`/`OQ-013`, confirmed 2026-09-24 — deliberately no data).

| Field | Type | Required | Notes |
|---|---|---|---|
| `codename` | string | yes | Unique, e.g. `"ranch-04"` |
| `region` | string | yes | Department-level only, never exact location |
| `hectares` | number | yes | |
| `grazingSystem` | string | yes | |
| `yearsInTransition` | number | yes | |
| `mpcsStatus` | string | yes | e.g. `"member"` |
| `checklistFlags` | object | yes | `{mpcsMember, minYearsTransition, waterSecurity, deforestationFreeSatellite, contractInPlace}`, all boolean |
| `threshold` | number | yes | Animals needed to release |
| `committedUnderLoi` | number | yes | Defaults to `0` for a new entry |
| `status` | enum | yes | `Planned \| Due diligence \| Open for LOI \| Released \| Filling \| Full \| Deployed` |
| `updatedDate` | string (ISO date) | yes | |

No private-layer fields (exact name, exact location, owner, contracts) — those are explicitly out of scope for these public pages (`spec.md` §7, Key Entities).

## Settings (Contracting Entity)

Single-object collection, one entry.

| Field | Type | Required | Notes |
|---|---|---|---|
| `contractingEntityName` | string | yes | `"Orbolo"` — `OQ-001`, resolved 2026-09-24. No legal-form suffix or jurisdiction beyond "Paraguay" supplied. |

## InvestPage

One object per the `Invest (Remote Rancher)` FR group (`FR-INV-001`–`013`). Every field below is either present with real content, or the whole page-content object simply omits it (see `research.md` §4 for the hidden-when-absent rule — enforced by making each optional field `.optional()` in the Zod schema, so an absent key is valid, not an error).

| Field | Type | Required | FR | Notes |
|---|---|---|---|---|
| `hero.headline` | string | yes | FR-INV-001 | States the core proposition |
| `hero.releaseRule` | string | yes | FR-INV-001 | The 60%-release / no-capital-before-release line |
| `hero.ctaLabel` / `hero.ctaHref` | string | yes | FR-INV-001 | "See the next ranch" |
| `offerBox.included[]` | string[] | yes | FR-INV-002 | What's included, as a list |
| `offerBox.termsOnRequestNote` | string | yes | FR-INV-002 | States terms vary per deal / legally can't be published — `OQ-004` resolved |
| `isThisReal.elTapirIntro` | string | yes | FR-INV-003 | |
| `isThisReal.animalCountMetricKey` | string | yes | FR-INV-003 | `"animalCount"` — references `Metric` |
| `isThisReal.elTapirHectaresMetricKey` | string | yes | FR-INV-003 | `"elTapirHectares"` |
| `isThisReal.visitBookingCtaLabel/Href` | string | yes | FR-INV-003 | |
| `whoBuysAtEnd.body` | string | yes | FR-INV-004 | |
| `whatIfNotEnough.releaseRuleBody` / `.loiExpiryBody` | string | yes | FR-INV-005 | |
| `whatIfWrong.categories[]` | `{label, body}[]` | yes | FR-INV-006 | Plain-language categories; `.dataRoomNote` states specifics live in the NDA-gated room — `OQ-006` resolved |
| `howItWorks.steps[]` | `{step, body}[]` (7) | yes | FR-INV-007 | `OQ-016` resolved — Verdant proof material usable |
| `deploymentPipeline.ranchSlugs[]` | string[] | no | FR-INV-008 | Omitted/empty today — `OQ-008`; section hidden when empty |
| `whatYouOwn.body` | string | yes | FR-INV-009 | |
| `whoVerifies.codeReferenceNote` | string | yes | FR-INV-010 | Generic Code mention — `OQ-003` partial |
| `whoVerifies.verifiers[]` | `{role, name}[]` | no | FR-INV-010 | Omitted today — `OQ-002` |
| `faq.items[]` | `{question, answer}[]` | yes | FR-INV-011 | Eligibility item states "contact us" — `OQ-007` resolved |
| `closing.releaseLine` | string | yes | FR-INV-012 | "Released at 60%. No capital before then." |
| `closing.ctas[]` | `{label, href}[]` | yes | FR-INV-012 | Get the investor pack / Book a call |
| `crossLinkToBeef.label/href` | string | yes | FR-INV-013 | "See where your beef is sold" |

## BeefPage

| Field | Type | Required | FR | Notes |
|---|---|---|---|---|
| `hero.headline` | string | yes | FR-BEEF-001 | |
| `hero.allianceNote` | string | yes | FR-BEEF-001 | 300,000-head producer alliance being built |
| `whatWeSellToday.body` | string | yes | FR-BEEF-002 | Baseline only — `OQ-009` resolved, no added specifics |
| `whatWeSellToday.noFullHistoryNote` | string | yes | FR-BEEF-002 | |
| `promise.body` | string | yes | FR-BEEF-003 | Must match Home's own promise wording |
| `roadmap.milestones[]` | `{stage, body, targetDate?}[]` | no | FR-BEEF-004 | Omitted/empty today — `OQ-010`; section hidden when empty |
| `firstPick.body` | string | yes | FR-BEEF-005 | |
| `whySupplyDifferent.body` | string | yes | FR-BEEF-006 | |
| `whoVerifies.codeReferenceNote` | string | yes | FR-BEEF-007 | `OQ-003` partial |
| `whoVerifies.verifiers[]` | `{role, name}[]` | no | FR-BEEF-007 | Omitted today — `OQ-002` |
| `ctas[]` | `{label, href}[]` | yes | FR-BEEF-008 | Get the spec sheet / Request a sample |
| `crossLinkToInvest.label/href` | string | yes | FR-BEEF-009 | "Own the herd behind this beef" |

No `namedCustomers` field exists at all — `OQ-011` resolved definitively "No," not a placeholder (`FR-BEEF-007`).

## LandPage

| Field | Type | Required | FR | Notes |
|---|---|---|---|---|
| `elTapir.intro` | string | yes | FR-LAND-001 | Group's own farm, open by appointment |
| `elTapir.hectaresMetricKey` | string | yes | FR-LAND-001 | `"elTapirHectares"` |
| `elTapir.expansionTargetNote` | string | no | FR-LAND-001 | Omitted — expansion target/date still unanswered |
| `partnerRanches.ranchSlugs[]` | string[] | no | FR-LAND-002 | Omitted/empty today — `OQ-013`; section hidden when empty |
| `ganaderiaAPasto.body` | string | yes | FR-LAND-003 | 35,000 ha, four-step methodology — `OQ-014` resolved |
| `ganaderiaAPasto.hectaresMetricKey` | string | yes | FR-LAND-003 | `"gappHectares"` |
| `workWithUs.ctaLabel/Href` | string | yes | FR-LAND-004 | |

## Shared cross-cutting rule

Every field marked "no" (not required) above is `.optional()` in its Zod schema. A page component renders its corresponding section **iff** the field (or, for list-backed sections, a non-empty array) is present — the absence itself is the hidden-section signal; no separate `status: "hidden"` flag is needed anywhere (confirming `research.md` §4's plain-conditional-rendering decision at the schema level, not just the component level).
