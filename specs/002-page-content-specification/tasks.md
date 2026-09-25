# Tasks: Orbolo Website — Invest, Beef & Land Page Content Structure

**Input**: Design documents from `/specs/002-page-content-specification/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: Included and **required**, not optional — Constitution Principle II ("every requirement has its test") and Principle X (`playwright` skill MUST add e2e coverage) make test tasks mandatory for this project.

**Organization**: Tasks are grouped by user story (from `spec.md`) so each story is independently implementable, testable, and shippable as its own increment. Invest and Beef are both P1; Land is P2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: US1 (Invest, P1) / US2 (Beef, P1) / US3 (Land, P2)
- File paths are relative to the repository root (`plan.md` Project Structure).

---

## Phase 1: Foundational (Shared Infrastructure)

**Purpose**: The `Metric` and `RanchCard` entities (shared by Invest and Land), the new persistent nav bar (shared by all four pages), and the Contact stub it links to. **No user story work can begin until this phase is complete.**

- [X] T001 [P] Create `src/lib/metrics/schema.ts` — Zod schema for `Metric` (`key`, `value`, `unit?`, `asOfDate`, `sourceDocumentRef`) per `data-model.md`
- [X] T002 [P] Create `src/content/metrics/metrics.json` seeded with the 3 known values — `elTapirHectares` (1000 ha, as-of 2026-09-23), `gappHectares` (35000 ha, as-of 2026-09-23), `animalCount` ("500+", as-of 2026-09-24) — exact `sourceDocumentRef` text per `data-model.md`'s Metric table
- [X] T003 Register the `metrics` collection in `src/content.config.ts` (alongside the existing `paths` collection)
- [X] T004 Implement `src/lib/metrics/metrics-repository.ts`: `getMetric(key)` — returns `undefined` (never a partial object) if `asOfDate` or `sourceDocumentRef` is missing, per `contracts/page-content-schema.md`
- [X] T005 [P] Unit test the omit-if-unsourced rule in `tests/unit/metrics-repository.test.ts`: a metric missing `asOfDate` → `undefined`; missing `sourceDocumentRef` → `undefined`; a complete metric → the full object; an unknown key → `undefined`
- [X] T006 [P] Create `src/lib/ranches/schema.ts` — Zod schema for `RanchCard` (codename, region, hectares, grazingSystem, yearsInTransition, mpcsStatus, checklistFlags, threshold, committedUnderLoi, status enum, updatedDate) per `data-model.md`
- [X] T007 [P] Create `src/content/ranches/ranches.json` = `[]` (OQ-008/OQ-013, confirmed 2026-09-24: deliberately no data, not invented)
- [X] T008 Register the `ranches` collection in `src/content.config.ts`
- [X] T009 Implement `src/lib/ranches/ranches-repository.ts`: `getRanches()` — returns `[]` when the collection is empty, per `contracts/page-content-schema.md`
- [X] T010 [P] Unit test empty-collection tolerance in `tests/unit/ranches-repository.test.ts`: `getRanches()` against the real (empty) fixture returns `[]` without throwing
- [X] T011 [P] Create `src/components/shared/MetricValue.astro`: renders a metric's value plus its visible date + source (calls `getMetric(key)`); renders nothing when the metric is `undefined` — per `contracts/nav-and-hidden-sections.md`
- [X] T012 [P] Create `src/components/shared/CrossLink.astro`: the one-cross-link-per-page component (label + href), used by Invest→Beef (FR-INV-013) and Beef→Invest (FR-BEEF-009)
- [X] T013 Create `src/components/Nav.astro`: persistent top nav bar with the fixed link set (Home/Invest/Beef/Land/Contact per `contracts/nav-and-hidden-sections.md`) — semantic `<nav aria-label="Primary">`, every link a real `<a href>` reachable by native Tab order, an accessible mobile-collapse pattern that keeps links keyboard-reachable when expanded, `aria-current="page"` on the active link (Constitution Principle IX)
- [X] T014 Modify `src/components/Layout.astro` to render `<Nav>` — it currently has no header/nav at all (FR-GEN-009)
- [X] T015 [P] Create `src/pages/contact.astro`: minimal stub page reusing the exact "This is a placeholder destination..." pattern `001` used for Invest/Beef/Land before this feature (`research.md` §7) — the nav's Contact link target until OQ-015's real destination exists
- [X] T016 [P] Run the `web-design-guidelines` skill against `Nav.astro` and `contact.astro` (Constitution Principle X)

**Checkpoint**: Nav bar renders and is reachable from any page that includes `<Layout>`; `Metric`/`RanchCard` infrastructure is ready for story-specific content to consume.

---

## Phase 2: User Story 1 - Investor funnel: evaluate Remote Rancher (Priority: P1) 🎯 MVP

**Goal**: A visitor who reaches `/invest` can understand what they'd own, how the process works, why it's real, and what could go wrong — ending with a clear way to get the investor pack or book a call.

**Independent Test**: Load `/invest`, confirm every FR-INV section with real content renders in order per `quickstart.md` scenario 1; confirm no invented terms/example figures; confirm the Deployment Pipeline stays hidden.

### Tests for User Story 1 ⚠️ write first, confirm they fail before implementing

- [X] T017 [P] [US1] Unit test `getInvestPage()`'s schema in `tests/unit/invest-repository.test.ts`: required fields present in the real fixture; optional fields (`deploymentPipeline`, `whoVerifies.verifiers`) correctly absent
- [X] T018 [P] [US1] Playwright e2e in `tests/e2e/invest-page.spec.ts`: every FR-INV-001–013 section with real content renders in order (hero, offer box, is-this-real, who-buys-at-end, what-if-not-enough, what-if-wrong, how-it-works, what-you-own, who-verifies, FAQ, closing, cross-link); offer box states terms-on-request with no invented ticket/return/fee figures and no "[X] head" example; risks section states specifics live in the NDA-gated data room; FAQ's eligibility answer directs the visitor to contact Orbolo; Deployment Pipeline section absent from the DOM; El Tapir hectares + animal-count metrics render with visible date/source; closing footer line names "Orbolo"; exactly one cross-link to Beef — per `quickstart.md` scenario 1

### Implementation for User Story 1

- [X] T019 [P] [US1] Create `src/lib/invest/schema.ts` — Zod schema for `InvestPage` per `data-model.md` (every optional field `.optional()`)
- [X] T020 [P] [US1] Create `src/lib/settings/schema.ts` — Zod schema for `Settings` (`contractingEntityName`) per `data-model.md`
- [X] T021 [US1] Create `src/content/invest/invest.json` with resolved content per `spec.md` FR-INV-001–013: hero, offer-box (terms-on-request note, no example figures — OQ-004/OQ-005), is-this-real (referencing `elTapirHectares`/`animalCount` metric keys), who-buys-at-end, what-if-not-enough, what-if-wrong (risk categories + data-room note — OQ-006), how-it-works (7 steps — OQ-016), what-you-own, who-verifies (generic Code-reference note only — OQ-003 partial), FAQ (eligibility answer directs to contact — OQ-007), closing, cross-link to Beef — omit `deploymentPipeline` and `whoVerifies.verifiers` entirely (OQ-008/OQ-002)
- [X] T022 [P] [US1] Create `src/content/settings/settings.json`: `{"contractingEntityName": "Orbolo"}` (OQ-001)
- [X] T023 [US1] Register the `invest` and `settings` collections in `src/content.config.ts`
- [X] T024 [US1] Implement `src/lib/invest/invest-repository.ts`: `getInvestPage()`
- [X] T025 [US1] Implement `src/lib/settings/settings-repository.ts`: `getContractingEntityName()` — throws if the settings entry is missing, per `contracts/page-content-schema.md`
- [X] T026 [P] [US1] Create `src/components/invest/Hero.astro` (FR-INV-001)
- [X] T027 [P] [US1] Create `src/components/invest/OfferBox.astro` (FR-INV-002)
- [X] T028 [P] [US1] Create `src/components/invest/IsThisReal.astro`, using `MetricValue` for El Tapir hectares + animal count (FR-INV-003)
- [X] T029 [P] [US1] Create `src/components/invest/WhoBuysAtEnd.astro` (FR-INV-004)
- [X] T030 [P] [US1] Create `src/components/invest/WhatIfNotEnough.astro` (FR-INV-005)
- [X] T031 [P] [US1] Create `src/components/invest/WhatIfWrong.astro` (FR-INV-006)
- [X] T032 [P] [US1] Create `src/components/invest/HowItWorks.astro` (FR-INV-007)
- [X] T033 [P] [US1] Create `src/components/invest/DeploymentPipeline.astro`, using `getRanches()` — renders nothing when empty (FR-INV-008)
- [X] T034 [P] [US1] Create `src/components/invest/WhatYouOwn.astro` (FR-INV-009)
- [X] T035 [P] [US1] Create `src/components/invest/WhoVerifies.astro` — the generic Code-reference sentence always renders; the verifier list renders only when present (FR-INV-010)
- [X] T036 [P] [US1] Create `src/components/invest/Faq.astro` (FR-INV-011)
- [X] T037 [US1] Create `src/components/invest/Closing.astro`, using `getContractingEntityName()` (FR-INV-012)
- [X] T038 [US1] Replace the `src/pages/invest.astro` stub: assemble all Invest section components in FR-INV order, each conditional on its backing field's presence, `CrossLink` for FR-INV-013
- [X] T039 [US1] Run the `web-design-guidelines` skill against every new Invest component (Constitution Principle X)

**Checkpoint**: `/invest` is fully functional per User Story 1, independently testable, and demoable on its own.

---

## Phase 3: User Story 2 - Buyer funnel: evaluate and sample Orbolo's beef (Priority: P1)

**Goal**: A visitor who reaches `/beef` can understand what's sold today, what's being built, and why trading now earns first pick — ending with a way to request a spec sheet or sample.

**Independent Test**: Load `/beef`, confirm every FR-BEEF section with real content renders per `quickstart.md` scenario 2; confirm "regenerative" and named customers never appear; confirm the roadmap stays hidden.

### Tests for User Story 2 ⚠️ write first, confirm they fail before implementing

- [X] T040 [P] [US2] Unit test `getBeefPage()`'s schema in `tests/unit/beef-repository.test.ts`: required fields present; `roadmap`/`whoVerifies.verifiers` correctly absent
- [X] T041 [P] [US2] Playwright e2e in `tests/e2e/beef-page.spec.ts`: every FR-BEEF-001–010 section with real content renders in order; "regenerative" never appears anywhere on the page; no named customer appears anywhere; roadmap section absent from the DOM; exactly one cross-link to Invest — per `quickstart.md` scenario 2

### Implementation for User Story 2

- [X] T042 [P] [US2] Create `src/lib/beef/schema.ts` — Zod schema for `BeefPage` per `data-model.md`
- [X] T043 [US2] Create `src/content/beef/beef.json` with resolved content per `spec.md` FR-BEEF-001–010: hero (alliance note), what-we-sell-today (baseline only, no added specifics — OQ-009), promise (wording consistent with Home's own — FR-BEEF-003), first-pick, why-supply-different, who-verifies (generic Code-reference note only — OQ-003 partial, no named customers — OQ-011), ctas, cross-link to Invest — omit `roadmap` and `whoVerifies.verifiers` entirely (OQ-010/OQ-002)
- [X] T044 [US2] Register the `beef` collection in `src/content.config.ts`
- [X] T045 [US2] Implement `src/lib/beef/beef-repository.ts`: `getBeefPage()`
- [X] T046 [P] [US2] Create `src/components/beef/Hero.astro` (FR-BEEF-001)
- [X] T047 [P] [US2] Create `src/components/beef/WhatWeSellToday.astro` (FR-BEEF-002)
- [X] T048 [P] [US2] Create `src/components/beef/Promise.astro` (FR-BEEF-003)
- [X] T049 [P] [US2] Create `src/components/beef/Roadmap.astro`, using `getBeefPage()`'s `roadmap.milestones` — renders nothing when absent/empty (FR-BEEF-004)
- [X] T050 [P] [US2] Create `src/components/beef/FirstPick.astro` (FR-BEEF-005)
- [X] T051 [P] [US2] Create `src/components/beef/WhySupplyDifferent.astro` (FR-BEEF-006)
- [X] T052 [P] [US2] Create `src/components/beef/WhoVerifies.astro` — generic Code-reference sentence always renders, no customer field exists at all (FR-BEEF-007)
- [X] T053 [US2] Replace the `src/pages/beef.astro` stub: assemble all Beef section components in FR-BEEF order, `CrossLink` for FR-BEEF-009
- [X] T054 [US2] Run the `web-design-guidelines` skill against every new Beef component (Constitution Principle X)

**Checkpoint**: `/beef` is fully functional per User Story 2, independently testable; both P1 stories complete.

---

## Phase 4: User Story 3 - Landowner/exploration: understand Land and get involved (Priority: P2)

**Goal**: A visitor who reaches `/land` understands El Tapir, Ganadería a Pasto, and finds a "Work with us" path.

**Independent Test**: Load `/land`, confirm El Tapir/Ganadería a Pasto/Work-with-us render per `quickstart.md` scenario 3; confirm El Tapir's expansion-target line and Partner ranches both stay hidden.

### Tests for User Story 3 ⚠️ write first, confirm they fail before implementing

- [X] T055 [P] [US3] Unit test `getLandPage()`'s schema in `tests/unit/land-repository.test.ts`: required fields present; `elTapir.expansionTargetNote`/`partnerRanches` correctly absent
- [X] T056 [P] [US3] Playwright e2e in `tests/e2e/land-page.spec.ts`: El Tapir (with hectares metric, dated/sourced), Ganadería a Pasto (with hectares metric, dated/sourced), and Work-with-us all render; El Tapir's expansion-target line absent from the DOM; Partner ranches section absent from the DOM — per `quickstart.md` scenario 3

### Implementation for User Story 3

- [X] T057 [P] [US3] Create `src/lib/land/schema.ts` — Zod schema for `LandPage` per `data-model.md`
- [X] T058 [US3] Create `src/content/land/land.json` with resolved content per `spec.md` FR-LAND-001–004: El Tapir intro + `elTapirHectares` metric key (no `expansionTargetNote` — still unanswered), Ganadería a Pasto body + `gappHectares` metric key (OQ-014), work-with-us CTA — omit `partnerRanches` entirely (OQ-013)
- [X] T059 [US3] Register the `land` collection in `src/content.config.ts`
- [X] T060 [US3] Implement `src/lib/land/land-repository.ts`: `getLandPage()`
- [X] T061 [P] [US3] Create `src/components/land/ElTapir.astro`, using `MetricValue` for hectares, expansion-target line conditional (FR-LAND-001)
- [X] T062 [P] [US3] Create `src/components/land/PartnerRanches.astro`, using `getRanches()` — renders nothing when empty (FR-LAND-002)
- [X] T063 [P] [US3] Create `src/components/land/GanaderiaAPasto.astro`, using `MetricValue` for GAPP hectares (FR-LAND-003)
- [X] T064 [P] [US3] Create `src/components/land/WorkWithUs.astro` (FR-LAND-004)
- [X] T065 [US3] Replace the `src/pages/land.astro` stub: assemble all Land section components in FR-LAND order
- [X] T066 [US3] Run the `web-design-guidelines` skill against every new Land component (Constitution Principle X)

**Checkpoint**: All three pages are functional; the full P1+P2 scope of `spec.md` is complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Coverage that spans multiple pages/stories, plus the mandatory skill passes and closing verification.

- [X] T067 [P] Playwright e2e in `tests/e2e/nav-bar.spec.ts`: from each of Home/Invest/Beef/Land, every other page and Contact are reachable in one click (SC-007); `/contact` renders as the stub page, not a 404
- [X] T068 [P] Playwright e2e in `tests/e2e/content-compliance.spec.ts`: banned-word scan (§B2.6, SC-002) across all three pages' rendered text; "regenerative"/"guaranteed" scan (SC-003); every rendered number carries a visible date and source (SC-004)
- [X] T069 Add a hidden-section-becomes-visible fixture test (extends `tests/e2e/invest-page.spec.ts`/`land-page.spec.ts` or a new spec, mirroring `001`'s `path-card-config-driven.spec.ts` pattern): with a test fixture populating `deploymentPipeline`/`roadmap`/`partnerRanches`, confirm the corresponding section renders correctly — proving the hide/show logic is genuinely conditional, per `contracts/nav-and-hidden-sections.md`'s test-coverage requirement
- [X] T070 Run the `taste` skill as a final aesthetic pass on Invest and Beef (Constitution Principle X)
- [X] T071 Run `pnpm run verify` (`astro check && eslint . && pnpm run test:unit && pnpm run test:e2e`) and confirm 0 regressions — Constitution Principle II closing condition
- [X] T072 Walk through `quickstart.md`'s full manual validation checklist end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — BLOCKS all three user stories (Nav/Contact are on every page; `Metric`/`RanchCard` are consumed by Invest and Land)
- **User Story 1 — Invest (Phase 2)**: Depends on Phase 1. No dependency on US2/US3.
- **User Story 2 — Beef (Phase 3)**: Depends on Phase 1. No dependency on US1/US3 (its own `CrossLink` instance is independent of Invest's).
- **User Story 3 — Land (Phase 4)**: Depends on Phase 1 (specifically `RanchCard`/`Metric` from Foundational). No dependency on US1/US2.
- **Polish (Phase 5)**: Depends on all three user stories being complete (nav reachability and content-compliance scans need all pages built).

### Within Each User Story

- Tests (T017/T018, T040/T041, T055/T056) MUST be written and confirmed failing before their story's implementation tasks.
- Schema before content JSON before collection registration before repository function before components before the page assembly task.
- `content.config.ts` registration tasks (T023, T044, T059) touch the same file as T003/T008 — not parallelizable with each other, but each is a single, small, additive edit.

### Parallel Opportunities

- All Foundational `[P]` tasks (T001, T002, T005, T006, T007, T010, T011, T012, T015, T016) can run in parallel once their own small dependency chain (e.g. T001 before T002) is satisfied.
- Once Phase 1 is complete, **User Stories 1, 2, and 3 can proceed fully in parallel** — they touch disjoint component directories (`invest/`, `beef/`, `land/`) and disjoint content files, with `content.config.ts` as the only shared-file touchpoint per story.
- Within each story, every component-creation task is `[P]` (disjoint files); the page-assembly task is not (it imports all of them).

---

## Parallel Example: User Story 1

```bash
# Launch every Invest section component in parallel once T024/T025 (repository functions) exist:
Task: "Create src/components/invest/Hero.astro"
Task: "Create src/components/invest/OfferBox.astro"
Task: "Create src/components/invest/IsThisReal.astro"
Task: "Create src/components/invest/WhoBuysAtEnd.astro"
Task: "Create src/components/invest/WhatIfNotEnough.astro"
Task: "Create src/components/invest/WhatIfWrong.astro"
Task: "Create src/components/invest/HowItWorks.astro"
Task: "Create src/components/invest/DeploymentPipeline.astro"
Task: "Create src/components/invest/WhatYouOwn.astro"
Task: "Create src/components/invest/WhoVerifies.astro"
Task: "Create src/components/invest/Faq.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Foundational
2. Phase 2: User Story 1 (Invest)
3. **STOP and VALIDATE**: run `tests/e2e/invest-page.spec.ts` and confirm `quickstart.md` scenario 1 by hand
4. Demo if ready — a visitor can already complete the investor funnel's content story, even before Beef/Land exist

### Incremental Delivery

1. Foundational → nav bar and shared entities ready
2. + Invest (US1) → validate → demo (MVP)
3. + Beef (US2) → validate independently → both P1 pages complete
4. + Land (US3) → validate independently → full spec scope complete
5. + Polish (nav reachability, content compliance, hidden-section proof, mandatory skill passes, `pnpm run verify` green) → feature complete

### Notes

- `[P]` tasks touch different files and have no unmet dependencies.
- `pnpm run verify` (T071) going green is the actual closing condition per Constitution Principle II, not optional cleanup.
- The mandatory skills (Constitution Principle X) are captured as explicit tasks (T016, T039, T054, T066, T070) so they aren't silently skipped. `image-to-code` has no task — no reference image was supplied for this feature (`plan.md` Mandatory skill usage).
- This feature never fabricates content for a still-open item (OQ-002, OQ-008, OQ-010, OQ-013) — every task touching one of those sections builds it to render conditionally-absent, not with placeholder or invented data.
- Commit after each task or logical group, per the project's per-phase-gate workflow.
