# Implementation Plan: Orbolo Website — Invest, Beef & Land Page Content Structure

**Branch**: `002-page-content-specification` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-page-content-specification/spec.md`

## Summary

Build the Invest, Beef, and Land pages — currently 13-line placeholder stubs — per spec.md's approved section structure and the Open Questions now resolved with Vaz (2026-09-22 through 2026-09-24). Each page's content lives in one versioned JSON file, read through a dedicated repository function and rendered by page-specific Astro components — the same content-isolation pattern `001-orbolo-path-selection` already proved with `paths.json` / `path-repository.ts` / `PathCard.astro`, extended here to three new page-content collections plus a small shared `Metric` collection (backing every dated/sourced number — El Tapir's 1,000 ha, Ganadería a Pasto's 35,000 ha, the group's 500+-animal count) and an empty-today `RanchCard` collection (ready for the Deployment Pipeline / Partner ranches sections once real ranch data exists). A new persistent top navigation bar (Home/Invest/Beef/Land/Contact) is added to `Layout.astro`, which currently has no header/nav at all. Every section still blocked on a deliberately-deferred Open Question (OQ-002, OQ-008, OQ-010, OQ-013) renders nothing — confirmed 2026-09-24 as a hard requirement, not a placeholder UI. No new dependencies, no design-token changes, no CMS.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode (existing project setting, unchanged)

**Primary Dependencies**: Astro 7.x (Content Layer API — `defineCollection`/`file()` loader, `astro:content`), Tailwind CSS 4.x (`@theme` CSS-first tokens in `global.css`) — both already installed; this feature adds no new dependency (Principle V: nothing to justify)

**Storage**: Versioned JSON files under `src/content/<collection>/`, loaded via Astro's `file()` content loader at build time — identical mechanism to the existing `paths` collection; no database

**Testing**: Vitest (unit — repository/query functions, the Metric omit-if-unsourced rule, hidden-when-empty logic) + Playwright (e2e — per-page structural checklist against each FR group, banned-word/regenerative/guaranteed scans, nav reachability, cross-link rules)

**Target Platform**: Web (desktop/tablet/mobile), English only (per spec.md's language-scope clarification — Spanish/German are separate future phases)

**Project Type**: Web — single existing Astro project; no new project/package

**Performance Goals**: Inherits the existing static-Astro-build baseline (no client JS added by this feature beyond the nav bar's mobile-collapse toggle, if the chosen pattern needs one); no new performance target

**Constraints**: Every displayed number MUST carry a visible date + source or MUST NOT render (FR-GEN-005) — implemented via the `Metric` entity, reusing the "omit if unsourced" rule pattern; banned-word list enforced site-wide (FR-GEN-003); a section with no real backing data renders **hidden entirely**, never a "coming soon" placeholder (confirmed 2026-09-24); Orbolo itself is never described as collecting/managing investor capital (FR-GEN-004); "regenerative" never describes current-state beef (FR-BEEF-010)

**Scale/Scope**: 3 pages (Invest: 13 FRs, Beef: 10, Land: 4) + 1 shared nav amendment (Home/Invest/Beef/Land/Contact) + a `Metric` collection (3 known values today, more added as Vaz supplies them) + an empty-today `RanchCard` collection (0 real entries; both the Deployment Pipeline and Partner-ranches sections stay hidden until it has entries)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec Before Code | `spec.md` Approved 2026-09-24, all 17 Open Questions addressed, human-reviewed at every step | PASS |
| II. Every Requirement Has Its Test | Every FR maps to a `tasks.md` implementation task plus a unit/e2e test task; `pnpm run verify` is the closing gate | PASS (exact mapping finalized in `tasks.md`) |
| III. Human Review at Every Checkpoint | This plan is a checkpoint artifact awaiting review before `/speckit-tasks` | PASS (pending review) |
| IV. Minimal, Curated Context | No `CLAUDE.md` changes needed — this feature doesn't introduce anything that isn't inferable from the repo | PASS |
| V. No New Dependencies Without Justification | Zero new dependencies added | PASS (N/A — nothing to justify) |
| VI. Declared Architecture Is Respected | Extends `001`'s exact content-isolation pattern (repository function + colocated Zod schema + JSON `file()` collection) — no competing pattern introduced | PASS |
| VII. Scope Changes Land as a Delta | The nav-bar/Contact-link amendment to `FR-GEN-001`'s original header/nav freeze is already captured as a labeled 2026-09-22/23 Clarification in `spec.md`, not a silent addition | PASS |
| VIII. Content/Presentation/Interaction Decoupled | Every page's copy lives in JSON, read through a `getXPage()` repository function; components receive typed props and contain zero per-page branching — adding/editing a fact requires no component change | PASS |
| IX. Accessibility Is a Release Gate | New nav bar needs a semantic `<nav aria-label>`, full keyboard operability, visible focus states, and an accessible mobile-collapse pattern; hidden sections are literally absent from the DOM (conditional render), not `aria-hidden`-masked — carried into `tasks.md` as explicit tasks | PASS |
| X. Installed Skills Are Mandatory | See "Mandatory skill usage" below | PASS (commitment recorded; execution happens in `/speckit-implement`) |

**No violations to justify — Complexity Tracking table is empty/omitted.**

### Mandatory skill usage (Constitution Principle X)

- `web-design-guidelines` — MUST be consulted while building the new nav bar (the one new piece of chrome this feature adds) and all three page templates, especially the offer box, risk section, and every form-adjacent CTA.
- `image-to-code` — no new reference image/mockup was supplied for this feature (spec.md's content comes from the written brief plus the live site's text content, not a visual reference); N/A for this pass, consistent with Constitution Principle X's "whenever a reference image... is available" trigger not firing here.
- `taste` — MUST run as a final aesthetic pass on Invest (highest-stakes, most content-dense page) and at least one of Beef/Land before this feature is presented as done.
- `playwright` (skill) — MUST be used to add the e2e coverage for the quickstart scenarios below.

## Project Structure

### Documentation (this feature)

```text
specs/002-page-content-specification/
├── spec.md                  # Feature spec (Approved 2026-09-24)
├── plan.md                  # This file
├── research.md              # Phase 0 output
├── data-model.md            # Phase 1 output
├── quickstart.md            # Phase 1 output
├── contracts/
│   ├── page-content-schema.md
│   └── nav-and-hidden-sections.md
└── tasks.md                 # Phase 2 output (/speckit-tasks — not created by this plan)
```

### Source Code (repository root — extends the existing single Astro project)

```text
src/
├── components/
│   ├── Layout.astro                    # MODIFIED: adds <Nav> (currently has no header/nav at all)
│   ├── Nav.astro                       # NEW: persistent top nav bar (Home/Invest/Beef/Land/Contact)
│   ├── home/                           # UNCHANGED (PathCard.astro, PathGrid.astro — Home is frozen)
│   ├── invest/                         # NEW: one component per Invest section (OfferBox, Risks, Pipeline, Faq, ...)
│   ├── beef/                           # NEW: one component per Beef section (Roadmap, WhoVerifies, ...)
│   ├── land/                           # NEW: one component per Land section (ElTapir, PartnerRanches, Gapp, ...)
│   └── shared/                         # NEW: CrossLink.astro, MetricValue.astro (date+source display)
├── content.config.ts                   # MODIFIED: registers 5 new collections alongside `paths`
├── content/
│   ├── paths/                          # UNCHANGED
│   ├── invest/invest.json              # NEW
│   ├── beef/beef.json                  # NEW
│   ├── land/land.json                  # NEW
│   ├── metrics/metrics.json            # NEW — the Metric entity's real values (3 known today)
│   ├── ranches/ranches.json            # NEW — RanchCard entity, 0 entries today
│   └── settings/settings.json          # NEW — ContractingEntity name ("Orbolo")
├── lib/
│   ├── paths/                          # UNCHANGED
│   ├── invest/{schema.ts,invest-repository.ts}   # NEW
│   ├── beef/{schema.ts,beef-repository.ts}       # NEW
│   ├── land/{schema.ts,land-repository.ts}       # NEW
│   ├── metrics/{schema.ts,metrics-repository.ts} # NEW — getMetric(key): omits if asOfDate/source missing
│   ├── ranches/{schema.ts,ranches-repository.ts} # NEW — getRanches(): [] today, tolerant of empty
│   └── settings/{schema.ts,settings-repository.ts} # NEW — getContractingEntityName()
├── pages/
│   ├── invest.astro                    # REPLACED (was a 13-line stub)
│   ├── beef.astro                      # REPLACED
│   ├── land.astro                      # REPLACED
│   └── contact.astro                   # NEW — minimal stub page (same placeholder pattern 001 used for Invest/Beef/Land before this feature), the nav's Contact link target until OQ-015's real destination exists
└── styles/global.css                   # UNCHANGED (no new design tokens — FR-GEN-001)

tests/
├── unit/
│   ├── invest-repository.test.ts       # NEW
│   ├── beef-repository.test.ts         # NEW
│   ├── land-repository.test.ts         # NEW
│   ├── metrics-repository.test.ts      # NEW — omit-if-unsourced rule
│   └── ranches-repository.test.ts      # NEW — empty-collection tolerance
└── e2e/
    ├── invest-page.spec.ts             # NEW
    ├── beef-page.spec.ts               # NEW
    ├── land-page.spec.ts               # NEW
    ├── nav-bar.spec.ts                 # NEW — reachability (SC-007), Contact link
    └── content-compliance.spec.ts      # NEW — banned words (SC-002), "regenerative"/"guaranteed" (SC-003)
```

**Structure Decision**: Single existing Astro project, no new package. Each of the three pages gets its own content collection (not one generic "sections[]" array) because `spec.md`'s own `PageSection` entity is explicitly described as "the spec's own bookkeeping construct, not a proposal for a new code entity," and because `FR-GEN-002` requires a **fixed** section order per page (not CMS-reorderable) — a flat, per-page-typed JSON shape is simpler and more directly Zod-validatable than a generic section-renderer, and matches the granularity `001` already established. `SiteNav` is likewise spec-level bookkeeping, not a content collection — the nav's link set is small, fixed, and grows only when a new page ships (a code change), so it's hardcoded in `Nav.astro` per `research.md`.

## Complexity Tracking

*No violations — table intentionally empty.*
