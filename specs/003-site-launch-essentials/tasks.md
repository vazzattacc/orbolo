# Tasks: Orbolo Website — Site Launch Essentials

**Input**: Design documents from `/specs/003-site-launch-essentials/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: Included and **required**, not optional — Constitution Principle II ("every requirement has its test") and Principle X (`playwright` skill MUST add e2e coverage) make test tasks mandatory for this project.

**Organization**: Tasks are grouped by user story (from `spec.md`) so each story is independently implementable, testable, and shippable as its own increment. 404 (US1) and SEO/Social (US2) are P1; Legal/Footer (US3) and Alt-text/Responsive QA (US4) are P2; Analytics (US5) is P3.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: US1 (404, P1) / US2 (SEO/Social, P1) / US3 (Legal/Footer, P2) / US4 (QA, P2) / US5 (Analytics, P3)
- File paths are relative to the repository root (`plan.md` Project Structure).

---

## Phase 1: Foundational (Shared Infrastructure)

**Purpose**: `astro.config.mjs`'s `site`/sitemap wiring, the four content-layer additions every story reads from, and the `settings` extension. **No user story work can begin until this phase is complete.**

- [X] T001 Set `site: "https://orbolo.com"` in `astro.config.mjs` (`research.md` §1 — resolves `FR-SEO-008`'s open `NEEDS CLARIFICATION` from the brief, not invented)
- [X] T002 Add `@astrojs/sitemap` to `package.json` and `astro.config.mjs`'s `integrations`, configured with a `filter` excluding `/404` (`research.md` §2) — justified new dependency per Constitution Principle V
- [X] T003 [P] Create `src/lib/pageMeta/schema.ts` — Zod schema for `PageMeta` (`id`, `route`, `description` 120–160 chars, `indexable`) per `data-model.md`
- [X] T004 [P] Create `src/lib/notFound/schema.ts` — Zod schema for `NotFoundContent` (`id` literal, `heading`, `body`, `homeLinkLabel`) per `data-model.md`
- [X] T005 [P] Create `src/lib/legal/schema.ts` — Zod schema for `LegalDocument` (`id` enum `privacy`/`terms`, `sourceUrl`, `fetchedOn`, `sourceLastUpdated?`, `body[]` with `heading`/`paragraphs[]`, `approved`, `reviewNotes[]`) per `data-model.md`
- [X] T006 Extend `src/lib/settings/schema.ts` with 3 new required fields (`siteName`, `socialImagePath`, `socialImageAlt`) alongside the existing `contractingEntityName` — schema only, `getContractingEntityName()` itself is not touched (`contracts/page-meta-schema.md`)
- [X] T007 [P] Create `src/content/pageMeta/pageMeta.json` — **empty array for now**; populated with real entries in US2 (T020)
- [X] T008 [P] Create `src/content/notFound/notFound.json` — populated with real copy in US1 (T013)
- [X] T009 [P] Create `src/content/legal/legal.json` = `[]` — populated (if fetchable) in US3 (T029)
- [X] T010 Update `src/content/settings/settings.json`: add `siteName: "Orbolo"`, `socialImagePath`/`socialImageAlt` placeholders (real values finalized in US2, T024)
- [X] T011 Register `pageMeta`, `notFound`, and `legal` collections in `src/content.config.ts` (alongside `paths`/`metrics`/`ranches`/`invest`/`settings`/`beef`/`land`)
- [X] T012 Implement `src/lib/pageMeta/page-meta-repository.ts`: `getPageMeta(route)` per `contracts/page-meta-schema.md`
- [X] T013 Implement `src/lib/notFound/not-found-repository.ts`: `getNotFoundContent()` — throws if missing, per `contracts/page-meta-schema.md`
- [X] T014 Implement `src/lib/legal/legal-repository.ts`: `getLegalDocument(kind)` — returns `undefined` if absent **or** `approved` is `false`, never exposes `approved` itself (`research.md` §5, `contracts/page-meta-schema.md`)
- [X] T015 Implement `getSocialPreviewDefaults()` in `src/lib/settings/settings-repository.ts`, alongside (not replacing) the existing `getContractingEntityName()`

**Checkpoint**: Content layer ready for every story; `astro build` still succeeds with empty/placeholder content (no story has shipped real content yet).

---

## Phase 2: User Story 1 - A lost visitor lands on a branded 404 (Priority: P1) 🎯 MVP

**Goal**: A request for a non-existent path returns a real 404 status and a branded, on-nav, no-photography page with a way back to Home.

**Independent Test**: Request `/this-does-not-exist`; confirm 404 status, nav present, heading + one line + Home link, `noindex`, excluded from the sitemap.

### Tests for User Story 1 ⚠️ write first, confirm they fail before implementing

- [X] T016 [P] [US1] Unit test `getNotFoundContent()` + schema validation in `tests/unit/not-found-repository.test.ts`
- [X] T017 [P] [US1] Playwright e2e in `tests/e2e/not-found-page.spec.ts`: requesting a non-existent path returns HTTP 404; the existing top nav bar renders; a heading, one short sentence, and a Home link are present and keyboard-reachable; the response carries a `noindex` directive; `/sitemap.xml` does not list the not-found route — per `quickstart.md` scenario 1

### Implementation for User Story 1

- [X] T018 [US1] Write real copy into `src/content/notFound/notFound.json` (heading, one-sentence body, Home-link label) — no invented claims or numbers (`FR-404-004`)
- [X] T019 [US1] Create `src/components/notfound/Hero.astro`: renders `NotFoundContent`, no photography, only the constitution's palette (text in `#516b3e`/`#f8f4e9`; `#bfd55d` permitted only as a non-text fill if used at all)
- [X] T020 [US1] Create `src/pages/404.astro`: uses the existing `Layout`, sets its own `<title>` ("Page not found — Orbolo") and a `noindex` meta tag directly (not via `pageMeta` — `data-model.md`), renders `notfound/Hero.astro`
- [X] T021 [US1] Confirm `@astrojs/sitemap`'s `/404` filter (T002) actually excludes the route in a real `astro build` output — adjust the filter if Astro still emits it (`contracts/footer-and-legal-gating.md`'s explicit verification note)
- [X] T022 [US1] Run the `web-design-guidelines` skill against `404.astro` and `notfound/Hero.astro` (Constitution Principle X)

**Checkpoint**: `/404` fully functional, independently testable, demoable as the MVP.

---

## Phase 3: User Story 2 - Search engines and social shares represent every page correctly (Priority: P1)

**Goal**: Every public page has a unique title/description, a complete social-preview set, working favicons, and discoverable `robots.txt`/`sitemap.xml`.

**Independent Test**: Per `quickstart.md` scenario 2 — unique titles/descriptions, byte-identical existing titles, favicon/manifest requests all 200, `robots.txt`/`sitemap.xml` correct, a social-preview debugger renders a correct card.

### Tests for User Story 2 ⚠️ write first, confirm they fail before implementing

- [X] T023 [P] [US2] Unit test `getPageMeta()` + schema validation (description length 120–160, uniqueness is an e2e-level concern) in `tests/unit/page-meta-repository.test.ts`
- [X] T024 [P] [US2] Playwright e2e in `tests/e2e/seo-meta.spec.ts`: every public page has a title and description unique site-wide; existing titles are byte-identical to today's ("Orbolo", "Invest — Orbolo", "Beef — Orbolo", "Land — Orbolo", "Contact — Orbolo"); every page exposes `og:title`/`og:description`/`og:url`/`og:type`/`og:site_name`/`og:image`/`og:image:alt`/`twitter:card=summary_large_image`; every page declares a canonical URL on `https://orbolo.com` — per `quickstart.md` scenario 2
- [X] T025 [P] [US2] Playwright e2e in `tests/e2e/crawler-files.spec.ts`: `/robots.txt` allows all crawlers and references the sitemap; `/sitemap.xml` lists exactly the shipped public pages and excludes `/404`
- [X] T026 [P] [US2] Playwright e2e (extends `seo-meta.spec.ts` or its own test): requesting `/favicon.ico`, `/apple-touch-icon.png`, `/icon-192.png`, `/icon-512.png`, `/site.webmanifest`, and the OG image all return 200

### Implementation for User Story 2

- [X] T027 [US2] Write real `src/content/pageMeta/pageMeta.json` entries for `home`/`invest`/`beef`/`land`/`contact` — each description 120–160 chars, drawn only from that page's already-approved content, no new claims/numbers (`FR-SEO-002`) — **flag each for Vaz's approval at the implementation review gate**, per the FR's own requirement
- [X] T028 [US2] Finalize `src/content/settings/settings.json`'s `socialImagePath`/`socialImageAlt` (T010's placeholders) once T030's image exists
- [X] T029 [US2] Modify `src/components/Layout.astro`: accept a `route` (or derive from `Astro.url.pathname`), call `getPageMeta(route)` + `getSocialPreviewDefaults()`, render `<meta name="description">`, `<link rel="canonical">`, the full OG/Twitter tag set, per `FR-SEO-001`–`005` — existing `title` prop usage on every page call site is **unchanged**
- [X] T030 Generate the favicon raster set (`public/favicon.ico`, `public/apple-touch-icon.png` 180×180, `public/icon-192.png`, `public/icon-512.png`) from the existing `public/favicon.svg`, using `sharp` (already present — `research.md` §4), one-off during implementation, committed as static files — the tab icon visitors see today MUST NOT change shape/color (`FR-SEO-006`)
- [X] T031 [P] Create `public/site.webmanifest` referencing the T030 icon set
- [X] T032 [US2] Generate `public/images/social/og-default.png` (1200×630) from the existing `public/images/branding/orbolo-logo.png` + the constitution's color tokens only — no new photography, no text beyond the wordmark (`FR-SEO-004`) — write meaningful alt text into `settings.json`'s `socialImageAlt` (T028)
- [X] T033 [P] [US2] Create `public/robots.txt` (`research.md` §3's exact two-line contract)
- [X] T034 [US2] Run the `web-design-guidelines` skill against the OG image composition and any new favicon/manifest wiring in `Layout.astro`

**Checkpoint**: Every public page has correct metadata/social previews/favicons; crawler files are live; both P1 stories complete.

---

## Phase 4: User Story 3 - A visitor can read Orbolo's Privacy Policy and Terms (Priority: P2)

**Goal**: A minimal footer (Privacy · Terms) appears on every page; each link, when its document is approved, opens a page carrying the real text fetched from `orbolo.com`.

**Independent Test**: Per `quickstart.md` scenario 3 — footer shows only approved links, each traces to a recorded source/fetch date, unapproved/missing documents render no dead link.

### Tests for User Story 3 ⚠️ write first, confirm they fail before implementing

- [X] T035 [P] [US3] Unit test `getLegalDocument()`'s gating logic in `tests/unit/legal-repository.test.ts`: missing entry → `undefined`; entry present but `approved: false` → `undefined`; entry present and `approved: true` → the full document, `approved` itself never exposed on the return type
- [X] T036 [P] [US3] Playwright e2e in `tests/e2e/footer-and-legal.spec.ts`: the footer renders on every page with only "Privacy"/"Terms" (no other labels), keyboard-reachable, visible focus state; a link renders only when its document is approved; an approved legal page shows its fetched text, source URL (in `research.md`, not necessarily on-page), and a visible "last updated" line; nothing above the footer moved — per `quickstart.md` scenario 3

### Implementation for User Story 3

- [X] T037 [US3] **Content-sourcing task, not a code task** — at implementation time, go to `https://www.orbolo.com/` (and `https://orbolo.com/` if it redirects), locate the privacy policy and terms pages (footer, legal links, common paths per `FR-LEG-003`), fetch their full text. If either can't be found/fetched: do **not** write, generate, or paraphrase from any other source — leave that `LegalDocument` entry absent, note the gap for Vaz, and stop that half of this task (`FR-LEG-004`)
- [X] T038 [US3] For each successfully fetched document, record in `research.md` (new "Legal Content Sourcing" section, appended during implementation, not invented ahead of time): exact source URL, fetch date, fetch method, and the source's own stated "last updated" date if any (`FR-LEG-003`)
- [X] T039 [US3] Transcribe each fetched document into `src/content/legal/legal.json` as structured `body` (headings/clauses/lists preserved, not a single blob), with `approved: false` initially (`FR-LEG-007` — not shipped until Vaz approves)
- [X] T040 [US3] Produce the `FR-LEG-005` review list for each document — mentions of "Verdant," the old project set, the old hosting/platform, cookie/tracking statements, data-collection references, §B2.6 banned words — written into that document's `reviewNotes[]`, not silently corrected
- [ ] T041 [US3] **Human checkpoint** — present T039/T040's content and review list to Vaz; only once approved, flip `approved: true` for that document (Constitution Principle III — this task cannot be completed unilaterally)
- [X] T042 [P] [US3] Create `src/components/Footer.astro`: `<footer aria-label="Legal">`, calls `getLegalDocument("privacy")`/`getLegalDocument("terms")`, renders a link only for each that resolves (`contracts/footer-and-legal-gating.md`)
- [X] T043 [US3] Add `<Footer />` to `src/components/Layout.astro`, after the existing `<main>`/page content, verified not to alter/overlap/reflow anything above it
- [X] T044 [P] [US3] Create `src/pages/privacy.astro` and `src/pages/terms.astro`: call `getLegalDocument(kind)`; if `undefined`, render no fabricated content (minimal not-shipped state, never legal text); if present, render structured `body` as real headings/paragraphs plus the "last updated" line (`FR-LEG-006`)
- [ ] T045 [US3] Add `pageMeta` entries for `privacy`/`terms` (T027's pattern) **only** once each document is approved — keeps `SC-002`/sitemap inclusion consistent with the gating logic
- [X] T046 [US3] Run the `web-design-guidelines` skill against `Footer.astro`, `privacy.astro`, `terms.astro`

**Checkpoint**: Footer live on every page; Privacy/Terms ship exactly when (and only when) approved — all three P1/P2 content stories complete.

---

## Phase 5: User Story 4 - Every image is described and new pieces work on every screen (Priority: P2)

**Goal**: Zero images site-wide lack alt text; the 404/Footer/Privacy/Terms work at 5 defined widths with no horizontal scroll; existing pages are verified, never altered, here.

**Independent Test**: Per `quickstart.md` scenario 4 — automated alt-text sweep (0 failures), automated responsive sweep on new surfaces (0 failures) and on existing pages (verification-only, failures reported not fixed).

### Tests for User Story 4 ⚠️ write first, confirm they fail before implementing

- [X] T047 [P] [US4] Playwright e2e in `tests/e2e/image-alt-text.spec.ts`: sweep every `<img>` on every shipped page; fail if any lacks an `alt` attribute; content images must have non-empty alt, purely decorative images (none currently identified as needing empty alt, but the check must support it) must have an explicitly empty one — per `quickstart.md` scenario 4, `FR-QA-001`
- [X] T048 [P] [US4] Playwright e2e in `tests/e2e/responsive-qa.spec.ts`: at 360px/390px/768px/1024px/1440px, assert `document.documentElement.scrollWidth <= clientWidth` (no horizontal overflow) and link tap targets ≥ 44×44 CSS px on the 404/Privacy/Terms/Footer; run the **same** scrollWidth check against Home/Invest/Beef/Land/Contact as **verification-only** — a failure there is reported as a separate finding in the test output/task notes, not auto-fixed (`FR-QA-004`, `FR-GEN3-001`)

### Implementation for User Story 4

- [X] T049 [US4] Fix any real alt-text gap `T047` finds on the pages this feature adds (404/Privacy/Terms/Footer only — `FR-QA-001`/`FR-QA-002`, including the OG image's alt text already set in T032)
- [X] T050 [US4] Fix any real responsive-overflow gap `T048` finds on 404/Privacy/Terms/Footer specifically (`FR-QA-003`) — if `T048` finds a regression on an *existing* page, do **not** fix it here; record it as a reported finding for Vaz per `FR-QA-004`

**Checkpoint**: Accessibility/responsive guard in place and green for everything this feature ships; any pre-existing gap is reported, not silently patched.

---

## Phase 6: User Story 5 - Orbolo sees traffic without tracking visitors (Priority: P3)

**Goal**: Plausible records page views on the production domain, with zero cookies, zero consent UI, and zero effect if blocked.

**Independent Test**: Per `quickstart.md` scenario 5 — script present with correct `data-domain`, no cookies/banner, page unaffected if the request is blocked.

### Tests for User Story 5 ⚠️ write first, confirm they fail before implementing

- [X] T051 [P] [US5] Playwright e2e in `tests/e2e/analytics.spec.ts`: the Plausible `<script>` tag is present on every page with `data-domain="orbolo.com"` and `defer`; no cookies are set after a full page load; no consent-banner element exists in the DOM; with the Plausible request blocked (route interception), the page still renders and the Home flip cards still work, with no console errors — per `quickstart.md` scenario 5

### Implementation for User Story 5

- [X] T052 [US5] Add the Plausible `<script defer data-domain="orbolo.com" src="https://plausible.io/js/script.js">` tag to `src/components/Layout.astro`'s `<head>`, unconditionally (`research.md` §7 — Plausible's own domain-matching satisfies `FR-AN-003`, no custom environment-gating code needed)
- [X] T053 [US5] Confirm (manual note in `quickstart.md`'s "production-only" item, not an automated test) that the Plausible account/site registration for `orbolo.com` is Vaz/Orbolo's responsibility, not created by this task (spec.md Assumptions)

**Checkpoint**: All 5 user stories complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: The As-Is Freeze proof, the accent-color application pass, the mandatory `taste` pass, and closing verification.

- [X] T054 Capture a pre-implementation baseline (DOM structure + text content above the footer, at 390px/1440px) for Home/Invest/Beef/Land/Contact, **before** T043's `<Footer>` lands — needed as the "before" half of `as-is-freeze.spec.ts`
- [X] T055 Playwright e2e in `tests/e2e/as-is-freeze.spec.ts`: compare the T054 baseline against the same pages post-implementation; assert zero structural/text differences above the footer at both widths (`SC-001`) — color-only differences from T056 are expected and out of this test's scope (`contracts/footer-and-legal-gating.md`)
- [X] T056 Apply the `#bfd55d` accent (constitution, 2026-09-30) to existing fills — button backgrounds, borders, or decorative blocks on Home/Invest/Beef/Land/Contact and this feature's own new surfaces — as non-text fills only, never as text color (constitution's explicit exception, `global.css`'s existing `--color-orbolo-accent` token)
- [X] T057 Run the `taste` skill as a final aesthetic pass on the 404 page and the Footer (Constitution Principle X)
- [X] T058 Re-run `tests/e2e/as-is-freeze.spec.ts` after T056 to confirm the accent-color pass changed only fills, not structure/text
- [X] T059 Run `pnpm run verify` (`astro check && eslint . && vitest run && playwright test`) and confirm 0 regressions — Constitution Principle II closing condition
- [X] T060 Walk through `quickstart.md`'s full manual validation checklist end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — BLOCKS all five user stories (every story reads through `pageMeta`/`notFound`/`legal`/`settings`, or needs `site`/sitemap wiring).
- **User Story 1 — 404 (Phase 2)**: Depends on Phase 1. No dependency on US2–US5.
- **User Story 2 — SEO/Social (Phase 3)**: Depends on Phase 1. No dependency on US1/US3–US5 (its favicon/OG/crawler work is independent of 404 or legal content).
- **User Story 3 — Legal/Footer (Phase 4)**: Depends on Phase 1. T037–T041 (content sourcing + Vaz approval) are a real external dependency chain **within** this story, not on any other story.
- **User Story 4 — QA (Phase 5)**: Depends on Phase 1, and in practice runs most usefully once US1/US2/US3's new pages exist to sweep (T047/T048 sweep *every shipped page*) — sequence last among P1/P2 stories for full coverage, though its own test/fix tasks are mechanically independent of US1–US3's code.
- **User Story 5 — Analytics (Phase 6)**: Depends on Phase 1 only (adds one script tag to the shared `Layout.astro`).
- **Polish (Phase 7)**: Depends on all five user stories; T054 specifically must run **before** T043 ships (captures the pre-footer baseline).

### Within Each User Story

- Tests MUST be written and confirmed failing before their story's implementation tasks.
- US3's T037→T038→T039→T040→T041 is a strict content-sourcing chain (fetch → record → transcribe → review-list → Vaz approval) — not parallelizable with itself, though T042 (Footer component) and T044 (page shells) can be built in parallel with that chain since both tolerate `getLegalDocument()` returning `undefined`.

### Parallel Opportunities

- All Foundational `[P]` tasks (T003–T005, T007–T009) can run in parallel once the directories exist.
- Once Phase 1 is complete, **User Stories 1, 2, 3, and 5 can proceed in parallel** — disjoint files, with `Layout.astro` as a shared touchpoint across US2 (T029)/US3 (T043)/US5 (T052) that needs sequential small edits, not a blocking dependency.
- User Story 4 benefits from running after US1–US3 ship (more pages to sweep meaningfully) but is not technically blocked by them.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Foundational
2. Phase 2: User Story 1 (404)
3. **STOP and VALIDATE**: run `tests/e2e/not-found-page.spec.ts`, confirm `quickstart.md` scenario 1 by hand
4. Demo if ready — broken links already land somewhere branded, even before SEO/legal/QA/analytics ship

### Incremental Delivery

1. Foundational → content layer and sitemap/site config ready
2. + 404 (US1) → validate → demo (MVP)
3. + SEO/Social (US2) → validate independently → both P1 stories complete
4. + Legal/Footer (US3) → validate independently (content-sourcing + Vaz approval is the real gate, not code)
5. + QA (US4) → validate independently → all P1/P2 stories complete
6. + Analytics (US5) → validate independently → full spec scope complete
7. + Polish (as-is-freeze proof, accent-color pass, `taste` pass, `pnpm run verify` green) → feature complete

### Notes

- `pnpm run verify` (T059) going green is the actual closing condition per Constitution Principle II, not optional cleanup.
- The mandatory skills (Constitution Principle X) are captured as explicit tasks (T022, T034, T046, T057) so they aren't silently skipped.
- US3's content-sourcing tasks (T037–T041) are **not** ordinary code tasks — `FR-LEG-004` explicitly forbids inventing, paraphrasing, or substituting legal text if `orbolo.com` is unreachable or the pages can't be found; if that happens, T037 stops there, is reported to Vaz, and T039–T045 simply don't run for that document (its footer link never renders — no code branch to "turn off," the gating logic in T014/T042 already handles absence correctly).
- This feature never fabricates content for a still-open item (unapproved legal text, missing descriptions) — every task touching one of those renders conditionally-absent, matching `002`'s own precedent.
- Commit after each task or logical group, per the project's per-phase-gate workflow.
