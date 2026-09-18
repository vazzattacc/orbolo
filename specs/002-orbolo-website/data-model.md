# Phase 1 Data Model: Orbolo Website — Full Site

**Feature**: `002-orbolo-website` | **Date**: 2026-09-16

Each entity below is a Keystatic collection (or singleton, for `Settings`) consumed at build time through Astro Content Collections with a Zod schema. No page template reads Keystatic's raw files directly — every read goes through a typed accessor in `lib/content/` (mirrors `001-orbolo-path-selection`'s `PathRepository` isolation pattern, constitution Principle VIII).

## Entity: Page

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | `string` | yes | Route path, unique per locale. |
| `locale` | `"en" \| "es" \| "de"` | yes | One document per locale per logical page. |
| `title` | `string` | yes | Also feeds `<title>` unless `seo.title` overrides. |
| `sections` | `Section[]` (ordered) | yes | Ordered list of typed content blocks (see Section below). |
| `seo` | `{ title?, description?, ogImage? }` | no | Defaults derived from `title`/first section if absent. |
| `status` | `"published" \| "draft"` | yes | Per-locale. A `draft` page for a locale MUST NOT be served to a visitor of that locale as if finished (FR-003, edge case). |

## Entity: Section

A typed union, discriminated by `type`:

| `type` | Key fields |
|---|---|
| `hero` | `headline`, `deck`, `buttons[]` (`{label, href}`), `image`, `tagline` (optional, FR-045: a short cursive accent line, added 2026-09-17) |
| `loop` | `stages[4]` (`{label, href}`), `whyTogetherLines[2]` |
| `numbers` | `metrics[]` (→ `Metric` refs) |
| `partnerStrip` | `partners[]` (→ `Partner` refs) |
| `codeStrip` | `rules[]` (→ `Rule` refs, summary mode) |
| `pipeline` | `ranches[]` (→ `Ranch` refs) |
| `roadmap` | `milestones[]` (→ `RoadmapMilestone` refs) |
| `whereWeAre` | `operating[]`, `building[]`, `next[]` (each `{text, date}`), `lastUpdated` |
| `text` | `body` (rich text) |
| `faq` | `items[]` (`{question, answer}`) |
| `formEmbed` | `formId`, `audience` (`"investor" \| "buyer" \| "landowner" \| "general"`) |

All sections are translatable per Page's locale.

## Entity: Partner

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | yes | |
| `logo` | `image` | yes | No bare logo walls (FR-035) — `role` is mandatory precisely to prevent this. |
| `role` | `string` | yes | e.g. "vet/audit partner", "off-taker". |
| `quote` | `string` | no | Translatable. Requires written permission (brief §8) — tracked outside the CMS (legal process), not modeled as a field. |
| `pages` | `string[]` (Page slugs) | no | Where this partner is displayed. |

## Entity: Term (Glossary)

| Field | Type | Required | Notes |
|---|---|---|---|
| `term` | `string` | yes | e.g. "grass-fed". |
| `definition` | `string` | yes | Translatable. |
| `measuredBy` | `string` | yes | Translatable. |
| `notThis` | `string` | yes | Explicitly what the term is *not* (FR-024). |
| `group` | `string` | no | For grouping in the Glossary page. |

**Validation**: `grass-fed`, `grass-finished`, `MPCS standard`, `in transition`, and `regenerative` MUST exist as Terms before launch (FR-024) — enforced by a content-completeness check, not a type constraint.

## Entity: Rule (The Code)

| Field | Type | Required | Notes |
|---|---|---|---|
| `number` | `integer` | yes | 1-8 (brief §6: "6-8 numbered rules"). |
| `rule` | `string` | yes | Translatable. |
| `verifiedHow` | `string` | yes | Translatable. |
| `verifier` | `Partner` ref | yes | FR-023: every rule names its verifier. |
| `terms` | `Term[]` refs | no | Related glossary terms. |

## Entity: Metric

| Field | Type | Required | Notes |
|---|---|---|---|
| `key` | `string` | yes | Unique identifier referenced from Sections. |
| `value` | `number \| string` | yes | |
| `unit` | `string` | no | e.g. "t cwe", "%". |
| `asOfDate` | `date` | yes | **Required** — FR-031: a Metric without both `asOfDate` and `source` MUST NOT render. |
| `source` | `string` (document reference/URL) | yes | Traces to a data-room document (brief §3). |
| `label` | `string` | yes | Translatable; the number/date/source are not. |

## Entity: Ranch

| Field | Type | Required | Notes |
|---|---|---|---|
| `codename` | `string` | yes | e.g. "Ranch 04". Public. |
| `region` | `string` | yes | Department level only. Public. |
| `hectares` | `number` | yes | Public. |
| `system` | `string` | yes | Grazing system. Public. |
| `yearsInHolisticManagement` | `number` | yes | Public. |
| `mpcsStatus` | `"member" \| "in transition" \| "not yet"` | yes | Public. |
| `checklist` | `{mpcsMember, minYearsTransition, waterSecurity, deforestationFreeSatellite, contractInPlace}` (booleans) | yes | Public. |
| `threshold` | `integer` (head count) | yes | Public. |
| `committedUnderLoi` | `integer` (head count) | yes (derived) | **Computed** from active LOI records (see `LOI` entity), not hand-entered — FR-009. |
| `releaseThreshold` | `0.6` (constant) | yes | Fixed by FR-010; modeled as a constant, not a per-ranch override, so it can't be silently changed per ranch. |
| `cycleLength` | `string` | yes | Public. |
| `status` | `"Planned" \| "Due diligence" \| "Open for LOI" \| "Released" \| "Filling" \| "Full" \| "Deployed"` | yes (derived) | **Computed** by `computeRanchStatus()` (research.md §4) from `committedUnderLoi`/`threshold`/dates — never hand-set to "Released" below 60% (FR-010). |
| `opensDate` | `date` | yes | Public. |
| `updatedDate` | `date` | yes | Public; MUST refresh at least weekly (FR-013). |
| `photos` | `image[]` | no | Public only if `ownerConsent.named === true`. |
| *(private, never public)* | | | |
| `exactName` | `string` | no | Full data room only. |
| `exactLocation` | `string` | no | Full data room only. |
| `owner` | `string` | no | Full data room only. |
| `ownerConsent` | `{named: boolean, photographed: boolean}` | yes | Gates `photos` and any name display, including post-"Deployed" (FR-012). |
| `contracts`, `pastureAssessment`, `waterInfrastructure`, `vetHistory`, `visitBooking` | various | no | Full data room only (FR-014). |

## Entity: LOI

| Field | Type | Required | Notes |
|---|---|---|---|
| `ranch` | `Ranch` ref | yes | |
| `signer` | `ContactRecord` ref | yes | |
| `headCount` | `integer` | yes | |
| `ticket` | `number` | yes | |
| `signedDate` | `date` | yes | |
| `expiryDate` | `date` | yes (derived) | `signedDate + 90 days` (FR-009). |
| `status` | `"active" \| "expired" \| "converted"` | yes (derived) | `expired` once `now > expiryDate` and not yet `converted`; drops out of `Ranch.committedUnderLoi` the moment it expires. |

## Entity: RoadmapMilestone

| Field | Type | Required | Notes |
|---|---|---|---|
| `stage` | `string` | yes | e.g. "now", "building", "target" (Beef page) or a named stage (brief §15). |
| `title` | `string` | yes | Translatable. |
| `targetDate` | `date` | yes | |
| `doneDate` | `date` | no | Set once complete. |
| `status` | `"planned" \| "in-progress" \| "done"` | yes | |

## Entity: TeamMember

`name`, `role`, `background` (translatable bio), `photo`.

## Entity: BlogPost

Standard translatable content type: `title`, `slug`, `body`, `publishedDate`, `author` (→ TeamMember).

## Entity: ContactRecord (CRM)

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | `string` | yes | Unique key. |
| `name` | `string` | no | |
| `roles` | `("investor" \| "buyer" \| "landowner")[]` | yes | Multi-value — one person MAY hold more than one role (FR-037, edge case). |
| `stage` | `string` | yes | Funnel stage per FR-036 (awareness/interest/evaluation/commitment/retention, per-funnel). |

*(This entity is primarily owned by the external CRM (Google Sheets) per `research.md` §5 — modeled here only to make FR-037's "one person, multiple roles" requirement concrete and testable, not to imply this feature's codebase owns a database of contacts.)*

## Entity: Settings (singleton)

`productName` ("Remote Rancher"), `contractingEntityLine`, `contactEmails`, `socialsLine`.

## Cross-cutting validation rules

- **FR-031 enforcement**: any Section referencing a `Metric` by `key` MUST resolve to a Metric with non-empty `asOfDate` and `source`, or the accessor omits that metric's value from the render (never renders a numberless/dateless stub).
- **FR-020/FR-012 enforcement**: `Ranch` rendering (public view) MUST check `ownerConsent` before including `exactName`/`photos`, regardless of `status` (including `Deployed`).
- **FR-009/FR-010 enforcement**: `Ranch.committedUnderLoi` and `Ranch.status` are never hand-authored in the CMS — both are computed at build/request time from the `LOI` collection, per `research.md` §4's pure function, so a content editor cannot accidentally (or deliberately) misstate release status.
