# Tasks: Orbolo Website — Full Site

**Input**: Design documents from `/specs/002-orbolo-website/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: Included and **required**, not optional — Constitution Principle II and Principle X (`playwright` skill MUST add e2e coverage) make test tasks mandatory for this project.

**Organization**: Tasks are grouped by user story (from `spec.md`) so each story is independently implementable, testable, and shippable as its own increment. This feature is independent of `001-orbolo-path-selection` — no task here touches `app/`, `components/`, or `lib/paths/` at the repo root.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: US1–US8, per `spec.md` priorities (P1/P1/P1/P2/P2/P2/P3/P3 respectively)
- File paths are relative to the Astro project root at the repository root (`plan.md` Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the independent Astro project. Greenfield — the project does not exist yet.

- [X] T001 Create the Astro project skeleton at the repository root per `plan.md` Project Structure (`src/pages`, `src/components`, `src/content`, `src/lib/content`, `src/i18n`, `tests/unit`, `tests/e2e`, `public`)
- [X] T002 Initialize `package.json` with pnpm and install exactly the constitution-declared/`research.md`-justified dependencies: `astro`, `@astrojs/sitemap`, `@astrojs/tailwind`, `tailwindcss`, `@keystatic/core`, `@keystatic/astro`, `typescript` (+ dev: `vitest`, `@playwright/test`, `eslint`, `eslint-plugin-astro`, `prettier`, `prettier-plugin-astro`) — no component-framework island runtime added (`research.md` §3)
- [X] T003 [P] Configure ESLint (`eslint-plugin-astro`) + Prettier (`prettier-plugin-astro`) in `.eslintrc.json` / `.prettierrc.json`
- [X] T004 [P] Configure Vitest in `vitest.config.ts` and Playwright in `playwright.config.ts`
- [X] T005 [P] Configure `tailwind.config.mjs` and `astro.config.mjs` (static output, i18n locales `en`/`es`/`de` with `en` default and `Accept-Language` root redirect per `research.md` §6, sitemap integration)
- [X] T006 [P] Create `keystatic.config.ts` declaring one collection/singleton per Entity in `data-model.md` (Page, Partner, Term, Rule, Metric, Ranch, LOI, RoadmapMilestone, TeamMember, BlogPost, Settings singleton)
- [X] T007 [P] Create `src/content/config.ts` with Astro Content Collections + Zod schemas mirroring `data-model.md` exactly (field names/types/required-ness), for every entity T006 declares
- [X] T008 Add repo-root `firebase.json` (two hosting targets: production, preview; static `dist` publish directory; a `redirects` array wired for FR-041's legacy-domain 301s, entries pending real URL list — see `spec.md` Non-goals)
- [X] T009 Add repo-root `.gitlab-ci.yml`: merge request → Firebase Hosting preview-channel deploy; `main` → production deploy; Firebase service account as a masked/protected CI variable (`research.md` §8)
- [X] T010 Add the single verification script to `package.json`: `"verify": "astro check && vitest run && playwright test && pnpm run lint:content && astro build"`, plus a `"lint:content"` script stub (implemented in T032) (Constitution Principle II closing condition)

**Checkpoint**: Astro project boots (`pnpm dev`), Keystatic admin loads at `/keystatic`, empty content collections typecheck.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The content-access isolation layer, shared layout/i18n/nav, and the ranch-status logic every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Implement `src/lib/content/pages.ts`: `getPage(slug, locale)` per `contracts/content-layer.md` — published-only per locale, falls back to default locale with `isFallback: true` flag, never returns a draft as if finished (FR-003)
- [X] T012 Implement `src/lib/content/metrics.ts`: `getMetricValue(key)` per `contracts/content-layer.md` — returns `undefined` (not a partial object) when `asOfDate` or `source` is missing (FR-031)
- [X] T013 Implement `src/lib/content/ranches.ts`: `computeRanchStatus(ranch, activeLois, now)` and `getPublishedRanches()` per `contracts/content-layer.md` — structurally excludes private-layer fields from the return type (FR-014); implements the monotonic status progression and the 60%-release/never-demote rule (FR-009–FR-013)
- [X] T014 [P] Unit test `computeRanchStatus` exhaustively in `tests/unit/ranches.test.ts`: every status transition, the exact 60% boundary, the 90-day LOI expiry boundary, an LOI that expires post-release does not demote the ranch, `getPublishedRanches()` never includes private-layer fields in its TypeScript return type or runtime output
- [X] T015 [P] Unit test `getMetricValue`'s omit-if-unsourced rule in `tests/unit/metrics.test.ts`
- [X] T016 [P] Implement `src/lib/content/glossary.ts`: `getGlossaryTerm(term)`, case-insensitive lookup
- [X] T017 Implement `src/lib/content/compliance.ts`: `assertContentCompliance(renderedText)` scanning for the banned-word list, "regenerative" outside Glossary context, and "guaranteed" in returns context (`research.md` §7); wire it into the `lint:content` package script from T010
- [X] T018 [P] Unit test `assertContentCompliance` in `tests/unit/compliance.test.ts`: each banned word individually, "regenerative" flagged outside Glossary markup but allowed inside it, "guaranteed" flagged in returns context
- [X] T019 Implement `src/i18n/routing.ts`: locale config, hreflang tag generation, `Accept-Language` root redirect, manual switcher data (FR-038)
- [X] T020 [P] Implement `src/components/Nav.astro` and `src/components/Footer.astro`: primary nav (`Invest · Beef · Land · The Code · About` + highlighted "Invest in a herd" button, FR-001) and footer (`Glossary · The Opportunity · Data room · Contact · Orbolo Bridge · Blog · Imprint · Terms · Privacy · newsletter · LinkedIn · Instagram`); both link The Code/Glossary/Contact from every page (FR-022)
- [X] T021 Create the shared base layout `src/layouts/BaseLayout.astro`: Nav, Footer, per-page `<title>`/SEO/OG tags (FR-040), hreflang tags (T019), locale-aware `<html lang>`

**Checkpoint**: Foundation ready — user story implementation can now begin. `lib/content/*` is the only way any page template will ever read content.

---

## Phase 3: User Story 1 - Home: understand the two engines and find a path (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor understands Orbolo's two engines and can reach Invest or Beef within one click.

**Independent Test**: Load `/en/`, confirm every section from FR-005 renders in order with real content, and that both audience-card CTAs navigate correctly.

### Tests for User Story 1 ⚠️ write first, confirm they fail before implementing

- [X] T022 [P] [US1] Playwright e2e in `tests/e2e/home.spec.ts`: hero + two buttons, loop (4 linked stages), trust strip (each partner shows a role), two audience cards (each with 3 dated numbers), "why this why now" (7 arguments each with adjacent proof), Code-in-five-lines linking to `/the-code`, dated "where we are", "what we don't do yet" (explicitly states Orbolo doesn't collect investor capital directly), and the audience-split closing CTA — quickstart.md scenario 1
- [X] T023 [P] [US1] Component test for `PartnerStrip.astro` in `tests/unit/partner-strip.test.ts`: never renders a partner without a role (FR-035)

### Implementation for User Story 1

- [X] T024 [P] [US1] Implement `src/components/sections/Hero.astro`, `Loop.astro`, `NumbersRow.astro`, `PartnerStrip.astro` per `data-model.md`'s Section union, each driven entirely by props/content — no Home-specific branching inside a generic section component (mirrors FR-005/Constitution Principle VIII)
- [X] T025 [P] [US1] Implement `src/components/sections/CodeStrip.astro` and `WhereWeAre.astro`
- [X] T026 [US1] Implement `src/pages/[locale]/index.astro`: assemble Home's sections in FR-005's order via `getPage("home", locale)`
- [X] T027 [US1] Populate Keystatic content for the Home page in English: hero copy, loop stages, trust-strip partners, two audience cards with three dated Metrics each, the seven "why this why now" arguments with proof, Code-in-five-lines, "where we are" (Operating/Building/Next, each dated), "what we don't do yet" — sourced from brief §B4, compliant with FR-032/FR-031

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Investor funnel through a Letter of Intent (Priority: P1)

**Goal**: An investor can evaluate Remote Rancher, get the investor pack, and reach a real ranch card's LOI flow.

**Independent Test**: Load `/en/invest` directly; confirm the offer box/pipeline/risks/FAQ render, a ranch card's progress bar matches active-LOI math, and "Get the investor pack" requires only an email.

### Tests for User Story 2 ⚠️ write first, confirm they fail before implementing

- [X] T028 [P] [US2] Playwright e2e in `tests/e2e/invest.spec.ts`: offer box states "specific tagged animals... never land, never a fund unit" and never phrases investing "with Orbolo" (FR-007); a fixture ranch card shows all required fields (FR-008); progress bar reflects only signed/unexpired LOI head counts (FR-009); "released at 60%... no capital called before release" line present; "Get the investor pack" link/form requires only email — quickstart.md scenario 2
- [X] T029 [P] [US2] Playwright e2e in `tests/e2e/invest-risks.spec.ts`: every risk category from brief §B5 (animal loss, drought, currency, policy/export, liquidity, returns) appears with its mitigation or stated absence; no "guaranteed" language anywhere on the page (FR-015)
- [X] T030 [P] [US2] Component test for `RanchCard.astro` in `tests/unit/ranch-card.test.ts`: renders `displayName` as codename unless `ownerConsent.named`, never renders private-layer fields even if present on the input object (defense in depth alongside T013's structural exclusion)

### Implementation for User Story 2

- [X] T031 [US2] Implement `src/components/RanchCard.astro` per `contracts/content-layer.md`'s `RanchView` shape and FR-008/FR-012
- [X] T032 [US2] Implement `src/components/sections/Pipeline.astro`: renders `RanchCard` per ranch from `getPublishedRanches()`, safe for zero ranches (mirrors `001`'s empty-grid pattern)
- [X] T033 [US2] Implement `src/components/sections/Faq.astro` and the offer-box/risks text sections (as `TextBlock.astro` instances driven by content, not hardcoded copy in the component)
- [X] T034 [US2] Implement `src/pages/[locale]/invest.astro`: assemble per FR-007, including the contracting-entity footer line (FR-034) and link-outs to the light/full data rooms and the Dropbox Sign-hosted LOI flow (`research.md` §2, §5 — external link only, no signing logic built here)
- [X] T035 [US2] Populate Keystatic content for Invest in English: offer box, "what you own precisely", how-it-works steps, risks, FAQ, and at least one realistic fixture Ranch + associated LOI records for testing/demo purposes, sourced from brief §B5, compliant with FR-032/FR-015

**Checkpoint**: User Stories 1 and 2 both work independently — the two highest-priority pages are live.

---

## Phase 5: User Story 3 - Buyer funnel: evaluate and sample Orbolo's beef (Priority: P1)

**Goal**: A buyer understands today/building/target staging and can request a spec sheet and a sample.

**Independent Test**: Load `/en/beef` directly; confirm staged content, no "regenerative" claim, and both request actions work.

### Tests for User Story 3 ⚠️ write first, confirm they fail before implementing

- [X] T036 [P] [US3] Playwright e2e in `tests/e2e/beef.spec.ts`: now/building/target staging visually distinct and dated; "regenerative" absent from current-product copy; conventional-price and first-pick promises both present; spec-sheet and sample-request actions submit independently of the Invest page — quickstart.md scenario 3
- [X] T037 [P] [US3] Unit test in `tests/unit/compliance.test.ts` (extends T018): the populated Beef page content itself passes `assertContentCompliance` (a real-content regression test, not just synthetic fixtures)

### Implementation for User Story 3

- [X] T038 [US3] Implement `src/components/sections/Roadmap.astro` (now/building/target staging, each milestone dated)
- [X] T039 [US3] Implement `src/pages/[locale]/beef.astro`: assemble per FR-016, including the single "Own the herd behind this beef" cross-link to Invest (FR-037)
- [X] T040 [US3] Populate Keystatic content for Beef in English per brief §B6, compliant with FR-017/FR-018/FR-032

**Checkpoint**: All three P1 stories (Home, Invest, Beef) are independently functional — the core conversion paths are complete.

---

## Phase 6: User Story 4 - Landowner funnel: explore Land and get in touch (Priority: P2)

**Goal**: A landowner sees El Tapir named, partner ranches anonymised, and can submit "Work with us".

### Tests for User Story 4 ⚠️ write first, confirm they fail before implementing

- [X] T041 [P] [US4] Playwright e2e in `tests/e2e/land.spec.ts`: El Tapir section is named with a dated expansion target and "open by appointment"; partner ranch cards show no owner name/exact location unless `ownerConsent.named`; "Work with us" submits and confirms — quickstart.md scenario 4

### Implementation for User Story 4

- [X] T042 [US4] Implement `src/pages/[locale]/land.astro`: El Tapir block, partner-ranch cards (reusing `RanchCard.astro`'s anonymisation logic where applicable), Ganadería a Pasto block, "Work with us" form (`FormEmbed.astro`, audience `"landowner"`)
- [X] T043 [US4] Populate Keystatic content for Land in English per brief §6/§8, compliant with FR-019/FR-020/FR-032

**Checkpoint**: User Stories 1–4 all independently functional.

---

## Phase 7: User Story 5 - Trust layer: The Code, Glossary, and Opportunity (Priority: P2)

**Goal**: Any visitor can reach The Code/Glossary/Contact from any page and see full sourced evidence on The Opportunity.

### Tests for User Story 5 ⚠️ write first, confirm they fail before implementing

- [X] T044 [P] [US5] Playwright e2e in `tests/e2e/trust-layer.spec.ts`: from Home, Invest, and Beef, The Code/Glossary/Contact are each reachable in one interaction (FR-022); on The Code, every rule names a verifier (FR-023); a glossary term's first occurrence on a page shows the tooltip with definition/measured-by/not-this (FR-024) — quickstart.md scenario 5
- [X] T045 [P] [US5] Playwright e2e in `tests/e2e/the-opportunity.spec.ts`: all seven arguments render with charts/cited sources traceable to a data-room document reference (FR-025)

### Implementation for User Story 5

- [X] T046 [US5] Implement `src/components/GlossaryTooltip.astro`: wraps a defined term on first occurrence per page, native `<details>`/popover-based (no framework runtime, `research.md` §3)
- [X] T047 [US5] Implement `src/pages/[locale]/the-code.astro` (6-8 rules, each with verifier) and `src/pages/[locale]/glossary.astro` (all Terms, grouped)
- [X] T048 [US5] Implement `src/pages/[locale]/the-opportunity.astro`: full seven-argument version with chart placeholders and Metric-sourced figures
- [X] T049 [US5] Populate Keystatic content: at minimum the 5 required Glossary Terms (FR-024: grass-fed, grass-finished, MPCS standard, in transition, regenerative), 6-8 Code Rules each with a verifier, and The Opportunity's seven arguments per brief §9

**Checkpoint**: User Stories 1–5 all independently functional.

---

## Phase 8: User Story 6 - Content editor manages the site without code changes (Priority: P2)

**Goal**: Prove the CMS-friendliness contract holds across every content type, not just one.

### Tests for User Story 6 ⚠️ write first, confirm they fail before implementing

- [X] T050 [P] [US6] Playwright e2e in `tests/e2e/cms-friendliness.spec.ts`: add a Partner, a sourced Metric, and update a Ranch's LOI-driving data purely through content files (mirroring `001`'s file-mutation-test pattern), confirm each renders with zero page-template edits, then restore fixtures — quickstart.md scenario 6
- [X] T051 [P] [US6] Unit test in `tests/unit/metrics.test.ts` (extends T015): a Metric missing `asOfDate` or `source` never renders anywhere it's referenced, across at least two different Section types

### Implementation for User Story 6

- [X] T052 [US6] Verify (and fix if needed) that every Section component from Phases 3–7 resolves Partners/Terms/Rules/Metrics/Ranches exclusively through `lib/content/*` accessors — a final audit pass closing any direct-Keystatic-read that snuck in during earlier phases (Constitution Principle VIII)

**Checkpoint**: All P1/P2 stories (US1–US6) independently functional — this is a strong, demoable increment even before the P3 stories.

---

## Phase 9: User Story 7 - About, Orbolo Bridge, and Contact (Priority: P3)

### Tests for User Story 7 ⚠️ write first, confirm they fail before implementing

- [X] T053 [P] [US7] Playwright e2e in `tests/e2e/supporting-pages.spec.ts`: About shows team/story/group-structure/where-we-are/careers; Orbolo Bridge shows education/site-visit/non-profit content; Contact's four routed forms (investor/buyer/landowner/general) each submit to the correct destination — quickstart.md scenario 7

### Implementation for User Story 7

- [X] T054 [P] [US7] Implement `src/pages/[locale]/about.astro`
- [X] T055 [P] [US7] Implement `src/pages/[locale]/orbolo-bridge/index.astro`, structured so a future sub-page is a new file under `orbolo-bridge/` with no Nav/Footer changes required (FR-004)
- [X] T056 [US7] Implement `src/pages/[locale]/contact.astro`: four `FormEmbed.astro` instances (investor/buyer/landowner/general) plus Google Calendar scheduling link
- [X] T057 [US7] Populate Keystatic content for About/Bridge/Contact per brief §6, compliant with FR-032

**Checkpoint**: User Stories 1–7 all independently functional.

---

## Phase 10: User Story 8 - Multilingual rollout mechanism (Priority: P3)

**Goal**: Prove the i18n mechanism works correctly even before ES/DE content itself is fully translated (translation content is a `spec.md` non-goal; the mechanism is not).

### Tests for User Story 8 ⚠️ write first, confirm they fail before implementing

- [X] T058 [P] [US8] Playwright e2e in `tests/e2e/i18n.spec.ts`: an `Accept-Language: es` request redirects toward `/es/` where content exists; a page with only an English published version does not present as a finished Spanish page to that visitor (FR-003/T011's fallback flag surfaced correctly); hreflang tags present on at least two pages; manual switcher always available regardless of the auto-redirect — quickstart.md scenario 8
- [X] T059 [P] [US8] Playwright e2e in `tests/e2e/sitemap.spec.ts`: per-language sitemap includes only published pages for that language (FR-040)

### Implementation for User Story 8

- [X] T060 [US8] Wire `getPage`'s `isFallback` flag (T011) into `BaseLayout.astro` to show a clear "not yet available in this language" notice when a fallback is served, rather than presenting it silently as finished
- [X] T061 [US8] Populate a minimal Spanish translation for The Code and the Glossary only (FR-039 — translated first and fully, ahead of every other page), proving the mechanism without committing to full-site translation in this feature

**Checkpoint**: All 8 user stories independently functional.

---

## Phase 11: Polish & Cross-Cutting Concerns

- [X] T062 [P] Implement the Firebase Hosting `redirects` config for the legacy domains and current `orbolo.com` URLs in `firebase.json` (FR-041) — exact URL list pending ops input per `spec.md` Non-goals; wire the mechanism with at least one real example redirect
- [X] T063 [P] Playwright e2e in `tests/e2e/redirects.spec.ts`: the example redirect from T062 resolves correctly (quickstart.md scenario 10)
- [X] T064 [P] Run the `web-design-guidelines` skill against every page template and form component, and address findings (Constitution Principle X)
- [X] T065 Run the `taste` skill as a final aesthetic pass on Home and Invest at minimum, and address findings (Constitution Principle X)
- [X] T066 Verify Lighthouse mobile scores for Home, Invest, and Beef meet the ≥90 target (SC-008) using a local Lighthouse CI run against the built site
- [X] T067 Run `pnpm run verify` (`astro check && vitest run && playwright test && pnpm run lint:content && astro build`) and fix any failures until it passes clean — the closing condition for this feature (Constitution Principle II)
- [X] T068 [P] Manually execute the full `quickstart.md` validation checklist (all 10 scenarios) as a final sanity pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. **BLOCKS all user stories** — every page needs `lib/content/*`, the base layout, and i18n routing.
- **User Story 1 — Home (Phase 3)**: Depends only on Foundational. Delivers the MVP.
- **User Story 2 — Invest (Phase 4)**: Depends on Foundational. Independently testable via `/invest` directly (does not require Home to exist first, though Home links to it).
- **User Story 3 — Beef (Phase 5)**: Depends on Foundational. Independently testable via `/beef` directly. Its one cross-link to Invest (FR-037) is a link, not a build dependency.
- **User Story 4 — Land (Phase 6)**: Depends on Foundational and reuses `RanchCard.astro` from Phase 4 for partner-ranch cards — a soft dependency on US2's component existing, not its content.
- **User Story 5 — Trust layer (Phase 7)**: Depends on Foundational. Its e2e tests (T044) reference Home/Invest/Beef existing, so runs best after Phases 3–5, though its own pages (`the-code`, `glossary`, `the-opportunity`) build independently.
- **User Story 6 — CMS-friendliness (Phase 8)**: Depends on Foundational and benefits from Phases 3–7 existing (T052 audits all of them) — naturally runs last among P1/P2 stories.
- **User Story 7 — Supporting pages (Phase 9)**: Depends on Foundational only.
- **User Story 8 — i18n mechanism (Phase 10)**: Depends on Foundational (T019's routing) and on The Code/Glossary (Phase 7) existing, since FR-039 requires those translated first.
- **Polish (Phase 11)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- T003–T007 (Setup config files) — different files.
- T014, T015, T018 (Foundational unit tests) — different files.
- T020 (Nav/Footer) can proceed alongside T011–T019.
- Once Foundational is done, US1/US2/US3 (all P1) can proceed in parallel by different people; US4–US8 similarly parallelizable across their own files once Foundational lands.
- Every story's own test tasks (e.g. T028/T029/T030) are parallelizable against each other.

---

## Phase 9: Visual Identity Refresh (Delta, 2026-09-17)

**Purpose**: Implement `spec.md` FR-042–FR-046 / SC-011 per `plan.md`'s "Design System (Visual Identity Delta, 2026-09-17)" section — a presentation-layer reskin driven by `.specify/references/Orbolo_Editorial_Continuous.pdf`. No IA, content, or naming changes (FR-046).

- [X] T069 [P] Update `tailwind.config.mjs`: change `colors.paper` to `#F8F4E9`, `colors.ink` to `#47592F`, `colors.verified` to `#2E3B20`, add `colors.sage: "#6D7063"`; add `fontFamily["display-bold"]` (Archivo + fallbacks, paired with a `.font-display-bold { font-stretch: expanded }` rule in `global.css`) and `fontFamily.accent` (Caveat + cursive fallback) — exact values per `plan.md` Design System tables
- [X] T070 [P] In `src/layouts/BaseLayout.astro`, add Google Fonts `<link>` tags for Archivo (variable `wdth,wght@125,700;125,800`, verified to return `font-stretch: expanded`) and Caveat (both `display=swap`, alongside the existing Fraunces/Inter links) so the two new `tailwind.config.mjs` font families actually load
- [X] T071 Apply the `font-display-bold` treatment (FR-044) to the Home hero's or closing-CTA section's full-bleed statement headline — the section-opening-declaration-over-photography pattern the moodboard shows — reusing an existing section rather than adding a new one
- [X] T072 Add a `font-accent`/`text-sage` cursive tagline (FR-045) to the Home `Hero.astro` deck, at most one short line, reusing existing content copy rather than inventing new copy
- [X] T073 Verify the new token contrast values against `plan.md`'s Contrast Verification table (SC-011) — no regression from the shipped values
- [X] T074 Run the `web-design-guidelines` skill against every file touched in T069–T072 (Constitution Principle X)
- [X] T075 Run the `taste` skill as a final aesthetic pass on Home and Invest with the refreshed palette/type (Constitution Principle X) — **deviation, flagged per Principle X**: the `taste` skill's pipeline requires the Playwright MCP server against a live URL, which is disconnected in this environment (`claude mcp list` shows `CONNECTION_CLOSED`), a pre-existing infrastructure issue, not a choice; substituted a manual aesthetic review of both pages' rendered screenshots (captured via the project's own local `@playwright/test`, not the MCP) against the same restraint/hierarchy/consistency criteria. Re-run `/taste` formally once the MCP reconnects.
- [X] T076 Confirm existing Playwright e2e coverage still passes with the new fonts/colors (no new interactive behavior is introduced, so no new spec files are required — Constitution Principle X's playwright mandate is satisfied by the unchanged suite staying green)
- [X] T077 Run `pnpm run verify` (full suite: `astro check`, Vitest, Playwright, content-compliance lint, `astro build`) and confirm 0 regressions

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup
2. Phase 2: Foundational (blocks everything else)
3. Phase 3: User Story 1 (Home)
4. **STOP and VALIDATE**: run `tests/e2e/home.spec.ts` and T023 independently
5. Demo if ready — a visitor can already understand Orbolo's two engines, even before Invest/Beef exist as full pages

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. + Home (US1) → validate → demo
3. + Invest (US2) + Beef (US3) → validate each independently → the three P1 pages complete the core conversion paths
4. + Land (US4) + Trust layer (US5) + CMS audit (US6) → validate → all P1/P2 stories complete
5. + Supporting pages (US7) + i18n mechanism (US8) → validate → full spec scope complete
6. + Polish (redirects, mandatory skill passes, Lighthouse, `pnpm run verify` green) → feature complete

### Notes

- [P] tasks touch different files and have no unmet dependencies.
- `pnpm run verify` (T067) going green — including the content-compliance lint — is the actual closing condition per Constitution Principle II, not optional cleanup.
- The four mandatory skills (Constitution Principle X) are captured as explicit tasks (T064–T065, plus Playwright tasks throughout) so they aren't silently skipped.
- This feature's codebase never implements the Papermark/Make/Sheets/Slack/e-signature automation itself (`spec.md` Non-goals, `research.md` §5) — tasks that touch those flows (T034) are link-outs only.
- Commit after each task or logical group, per the project's per-phase-gate workflow.
