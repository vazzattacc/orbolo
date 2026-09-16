# Tasks: Orbolo Website — Interactive Path Selection Experience

**Input**: Design documents from `/specs/001-orbolo-path-selection/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: Included and **required**, not optional — Constitution Principle II ("Every Requirement Has Its Test") and Principle X (the `playwright` skill MUST add e2e coverage for new interactive flows) make test tasks mandatory for this project, not a default template option.

**Organization**: Tasks are grouped by user story (from `spec.md`) so each story is independently implementable, testable, and shippable as its own increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: US1 / US2 / US3 / US4, per `spec.md` priorities (P1/P2/P2/P3 respectively)
- File paths are exact and match `plan.md`'s Project Structure

## Path Conventions

Single Next.js App Router project at the repository root, per `plan.md`: `app/`, `components/`, `lib/paths/`, `tests/unit/`, `tests/e2e/`. No `frontend/`/`backend/` split — `lib/paths/` is the internal data-access module, not a separate service.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — this is a greenfield repository; no app scaffold exists yet.

- [X] T001 Create the Next.js App Router project skeleton per `plan.md` Project Structure (`app/`, `components/`, `lib/paths/`, `public/images/paths/`, `tests/unit/`, `tests/e2e/`, `next.config.ts`, `tsconfig.json`)
- [X] T002 Initialize `package.json` with pnpm and install exactly the constitution-declared dependencies: `next`, `react`, `react-dom`, `framer-motion`, `tailwindcss`, `typescript` (+ dev: `vitest`, `@playwright/test`, `eslint`, `prettier`) — no additional runtime dependencies, per `research.md` §8
- [X] T003 [P] Configure ESLint + Prettier per the constitution's declared linting/formatting stack in `.eslintrc.json` / `.prettierrc`
- [X] T004 [P] Configure Vitest in `vitest.config.ts` and Playwright in `playwright.config.ts`
- [X] T005 [P] Configure `tailwind.config.ts` with the moodboard-derived design tokens from `research.md` §7 (cream ground ~`#F4F0E6`, deep forest/olive accent ~`#2E4034`, muted gold/sky photography-sampled tones, display serif + body sans + italic-serif accent type scale)
- [X] T006 Add the single verification script to `package.json`: `"verify": "next lint && tsc --noEmit && vitest run && playwright test"` (Constitution Principle II closing condition)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The data-access isolation layer and base app shell that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Define `PathImage`/`PathCard` TypeScript interfaces in `lib/paths/types.ts` exactly per `contracts/data-layer.md` (`id`, `title`, `description`, optional `longDescription`, `image: {src, alt}`, `destination`, optional `targetAudience`, optional `order`)
- [X] T008 Create `lib/paths/paths.json` with the 5-entry scaffold (`el-tapir`, `orbolo-bridge`, `verdant`, `ganaderia-a-pasto`, `business-meat`) matching the shape in `data-model.md` "Example `paths.json` shape" (structure only at this point — real content is populated in T034)
- [X] T009 Implement `lib/paths/path-repository.ts` exporting `getPublishedPaths()` and `getPathById(id)` per `contracts/data-layer.md`: an entry is *published* only when `title`, `description`, `image.src`, `image.alt`, and `destination` are **all non-empty strings** (data-model.md "Derived state" rule) — anything else is excluded, never shown as a placeholder; enforce `id` matches `^[a-z0-9]+(-[a-z0-9]+)*$`; enforce a published entry's `destination` equals `/paths/${id}` exactly (never a free-typed value); enforce `image.alt` is non-empty after trimming
- [X] T010 [P] Unit test `lib/paths/path-repository.ts` covering: published-vs-pending filtering, `order`-then-declaration-order sorting, and the `id`/`destination`/`alt` validation rules above, in `tests/unit/path-repository.test.ts`
- [X] T011 Create `app/layout.tsx` root layout: global providers, moodboard typography font setup (display serif + body sans + italic-serif accent, per `research.md` §7)
- [X] T012 [P] Configure `app/globals.css` with the Tailwind base layer wired to the tokens from T005

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Discover and select a path (Priority: P1) 🎯 MVP

**Goal**: The path-selection screen renders one card per configured path and selecting a card navigates into that path's section — the entire premise of the feature.

**Independent Test**: Load `/`, confirm one card per entry in `lib/paths/paths.json` (image + title + description), click a card, confirm navigation to its `destination` route; add/remove an entry in the JSON, reload, confirm the card count changes with zero edits to `PathCard`/`PathGrid` source.

### Tests for User Story 1 ⚠️ write first, confirm they fail before implementing

- [X] T013 [P] [US1] Component test: `PathCard` renders `title`, `description`, an image with non-empty `alt`, and a real `<a href={path.destination}>` (not a `div onClick`) in `tests/unit/PathCard.test.tsx`
- [X] T014 [P] [US1] Component test: `PathGrid` renders exactly one `PathCard` per entry in its `paths` prop, and renders a safe empty grid (no crash, no placeholder) for an empty array, in `tests/unit/PathGrid.test.tsx`
- [X] T015 [P] [US1] Playwright e2e: the selection screen at `/` renders one card per *published* entry from `lib/paths/paths.json`; selecting a card navigates to `/paths/{id}` with a visible progression-communicating transition; temporarily adding a 6th complete entry to the JSON fixture makes a 6th card appear with no component changes, in `tests/e2e/path-selection.spec.ts`

### Implementation for User Story 1

- [X] T016 [US1] Implement `components/PathCard.tsx` per `contracts/component-props.md`: root element is `<Link href={path.destination}>`, renders `path.image`/`path.title`/`path.description` verbatim, contains no path-specific branching (FR-002, FR-005, FR-012, FR-014)
- [X] T017 [US1] Implement `components/PathGrid.tsx` per `contracts/component-props.md`: maps the `paths` prop to a list of `PathCard`s, does no data-fetching of its own, safe for an empty array (FR-006)
- [X] T018 [US1] Implement `app/page.tsx`: call `getPublishedPaths()` and render `<PathGrid paths={...} />` as the site's first-load screen instead of a conventional homepage (FR-001)
- [X] T019 [US1] Implement `app/paths/[pathId]/page.tsx`: read `params.pathId`, call `getPathById`, call Next.js `notFound()` when the result is missing or pending, otherwise render the shared destination-stub template (`image`, `title`, `description`, optional `longDescription`) per `contracts/component-props.md`
- [X] T020 [US1] Implement the Framer Motion progression transition between the selection screen and a destination stub (shared layout/page transition in `app/layout.tsx` or `app/page.tsx`), communicating "enters → sees paths → selects → progresses" (FR-004)

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Fully keyboard- and touch-accessible selection (Priority: P2)

**Goal**: The selection screen is completely usable via keyboard or touch alone, with visible focus states and no hover-dependent interaction.

**Independent Test**: Navigate the entire screen with only Tab/Shift+Tab/Enter/Space, confirming every card is reachable, selectable, and visibly focused; confirm the same flow works via a touch tap with no prior hover; confirm reduced-motion preference simplifies the transition.

### Tests for User Story 2 ⚠️ write first, confirm they fail before implementing

- [X] T021 [P] [US2] Playwright e2e: keyboard-only Tab/Shift+Tab traversal reaches every published card in a logical order, Enter and Space each activate a focused card, and a visible focus indicator is present at every step, in `tests/e2e/keyboard-accessibility.spec.ts`
- [X] T022 [P] [US2] Playwright e2e (touch emulation): tapping a card selects its path correctly with no prior hover event dispatched, in `tests/e2e/touch-accessibility.spec.ts`
- [X] T023 [P] [US2] Playwright e2e: with the OS "reduce motion" preference enabled, the selection transition is simplified/removed rather than merely slowed, in `tests/e2e/reduced-motion.spec.ts`

### Implementation for User Story 2

- [X] T024 [US2] Add `focus-visible:` styles to `components/PathCard.tsx` so focus is always visibly indicated and never dependent on `:hover` (FR-008, FR-009, FR-014)
- [X] T025 [US2] Add a `keydown` handler for Space-key activation to `components/PathCard.tsx` (the native `<a>` already activates on Enter) so both keys work per FR-007
- [X] T026 [US2] Gate all Framer Motion transition/hover-scale animation in `components/PathCard.tsx` and the page transition (T020) behind `useReducedMotion()` (FR-017)
- [X] T027 [US2] Ensure the selected/active state in `components/PathCard.tsx` is communicated with a visible non-color indicator (outline + label change), never color alone (FR-016)

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Responsive experience across devices (Priority: P2)

**Goal**: The card layout adapts — not merely scales — across desktop, tablet, and mobile, preserving readability, touch-target size, image visibility, and hierarchy.

**Independent Test**: Load the screen at desktop, tablet, and mobile breakpoints and confirm the layout, touch-target sizes, and content hierarchy are each purpose-fit rather than a scaled clone; rotate a tablet viewport and confirm the grid readjusts without breaking.

### Tests for User Story 3 ⚠️ write first, confirm they fail before implementing

- [X] T028 [P] [US3] Playwright e2e: at desktop, tablet, and mobile viewport widths, the grid's column count/card treatment visibly adapts (not a uniformly scaled desktop layout), mobile touch targets meet a minimum tap-size threshold, and a simulated tablet portrait→landscape rotation does not break layout or interactive states, in `tests/e2e/responsive-layout.spec.ts`

### Implementation for User Story 3

- [X] T029 [US3] Implement responsive column/layout breakpoints in `components/PathGrid.tsx` via Tailwind responsive classes (desktop/tablet/mobile) (FR-010)
- [X] T030 [US3] Implement mobile-specific card treatment in `components/PathCard.tsx`: minimum touch-target size, image visibility, and content hierarchy prioritized for small screens (FR-011)
- [X] T031 [US3] Verify and adjust tablet portrait↔landscape reflow in `components/PathGrid.tsx` so rotation never breaks readability or interactive states

**Checkpoint**: User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - Update path content without touching component code (Priority: P3)

**Goal**: A content owner can add, remove, or finalize a path (including "Business/Meat") purely through `lib/paths/paths.json`, with zero `PathCard`/`PathGrid` code changes.

**Independent Test**: Edit only the JSON configuration — add a 6th path, or fill in `business-meat`'s remaining fields — and confirm the change appears correctly on the site with no component-source edits.

### Tests for User Story 4 ⚠️ write first, confirm they fail before implementing

- [X] T032 [P] [US4] Unit test `lib/paths/path-repository.ts`: an entry with any one required field (`title`/`description`/`image.src`/`image.alt`/`destination`) empty is excluded by `getPublishedPaths()`, and the same entry appears once every required field is filled in, in `tests/unit/path-repository.test.ts` (extends T010)
- [X] T033 [P] [US4] Playwright e2e: editing only `lib/paths/paths.json` — adding a new complete entry, and completing the `business-meat` entry's fields — changes the rendered grid with zero changes to `PathCard.tsx`/`PathGrid.tsx`, in `tests/e2e/cms-friendliness.spec.ts`

### Implementation for User Story 4

- [X] T034 [US4] Populate `lib/paths/paths.json` with real content for the 4 launch paths (`el-tapir`, `orbolo-bridge`, `verdant`, `ganaderia-a-pasto`): `title`, `description`, `image` (`src` + descriptive `alt`), `destination` (`/paths/{id}`), `targetAudience` — photography must be authentic Paraguay pasture/cattle imagery and must NOT be forced into one terrain type across paths (FR-019)
- [X] T035 [US4] Leave the `business-meat` entry in `lib/paths/paths.json` with its required fields empty (pending state, hidden from the grid per FR-018) until real content is supplied later

**Checkpoint**: All four user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge-case handling and quality gates that span every story, plus the constitution's mandatory skill passes.

- [X] T036 [P] Implement the broken-image fallback in `components/PathCard.tsx`: an `onError` handler swaps to a shared branded fallback background (moodboard palette/texture from `research.md` §7), title/description stay visible, and the card remains fully selectable (FR-021)
- [X] T037 [P] Playwright e2e: an entry with an unresolvable `image.src` still renders a selectable card showing the branded fallback background, in `tests/e2e/image-fallback.spec.ts`
- [X] T038 [P] Playwright e2e: with JavaScript disabled, every published card is still a real clickable link that navigates to its destination (without the animated transition), in `tests/e2e/no-js-navigation.spec.ts` (FR-023)
- [X] T039 [P] Run the `web-design-guidelines` skill against `components/PathCard.tsx`, `components/PathGrid.tsx`, `app/page.tsx`, and `app/paths/[pathId]/page.tsx`, and address its findings (Constitution Principle X)
- [X] T040 [P] Run the `image-to-code` skill against `.specify/references/Orbolo_Editorial_Continuous.pdf` to validate/refine the `tailwind.config.ts` tokens (T005) against the `research.md` §7 hypothesis, and apply corrections (Constitution Principle X)
- [X] T041 Run the `taste` skill as a final aesthetic/quality pass on the built selection screen and address its findings (Constitution Principle X)
- [X] T042 Run `pnpm run verify` (`next lint && tsc --noEmit && vitest run && playwright test`) and fix any failures until it passes clean — the closing condition for this feature (Constitution Principle II)
- [X] T043 [P] Manually execute the full `quickstart.md` validation checklist (all 8 scenarios) as a final sanity pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup. **BLOCKS all user stories** — `PathCard`/`PathGrid`/route work cannot start without `lib/paths/types.ts` and `path-repository.ts`.
- **User Story 1 (Phase 3)**: Depends only on Foundational. Delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational **and** on `components/PathCard.tsx` existing (T016) — it adds focus/keyboard/motion behavior to that same file. Independently testable once US1 is in place.
- **User Story 3 (Phase 5)**: Depends on Foundational **and** on `components/PathGrid.tsx`/`PathCard.tsx` existing (T016–T017). Independently testable once US1 is in place. Can proceed in parallel with US2 (different concerns, mostly non-overlapping style rules) if staffed separately — coordinate on `PathCard.tsx` edits.
- **User Story 4 (Phase 6)**: Depends on Foundational (`path-repository.ts`'s published-filter logic, T009) and on US1's grid/page existing to visually confirm the JSON-only change. Content population (T034–T035) has no code dependency on US2/US3 and can run in parallel with them.
- **Polish (Phase 7)**: Depends on all four user stories being complete.

### Within Each User Story

- Tests are written first and must fail before their corresponding implementation task.
- `PathCard`/`PathGrid` (US1) before any story that extends them (US2, US3).
- `path-repository.ts` (Foundational) before any story that relies on its filtering behavior (US4).

### Parallel Opportunities

- T003, T004, T005 (Setup) — different config files, no dependencies between them.
- T010, T012 (Foundational) — different files, can run alongside T011.
- T013, T014, T015 (US1 tests) — different test files.
- T021, T022, T023 (US2 tests) — different test files.
- T032, T033 (US4 tests) — different test files.
- T036–T038, T039–T041, T043 (Polish) — mostly independent; T042 (`pnpm run verify`) should run last, after the others land.
- Once Foundational is done, US2, US3, and US4's *test* and *content* tasks (T021–T023, T028, T032–T035) can be drafted in parallel with US1 implementation by different people, though their assertions won't pass until the US1 components they target actually exist.

---

## Parallel Example: User Story 1

```bash
# Tests for User Story 1 together:
Task: "Component test PathCard in tests/unit/PathCard.test.tsx"
Task: "Component test PathGrid in tests/unit/PathGrid.test.tsx"
Task: "Playwright e2e path-selection flow in tests/e2e/path-selection.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup
2. Phase 2: Foundational (blocks everything else)
3. Phase 3: User Story 1
4. **STOP and VALIDATE**: run `tests/e2e/path-selection.spec.ts` and the T013/T014 unit tests independently; confirm the grid renders from `paths.json` and selection navigates correctly
5. Demo if ready — this alone delivers "a visitor identifies and reaches the right part of the Orbolo ecosystem through an intentional selection moment," the spec's stated core value

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. + User Story 1 → validate independently → MVP demo
3. + User Story 2 → validate independently (keyboard/touch/reduced-motion) → demo
4. + User Story 3 → validate independently (responsive breakpoints) → demo
5. + User Story 4 → validate independently (JSON-only content changes) → demo
6. + Polish (fallback image, no-JS, mandatory skill passes, `pnpm run verify` green) → feature complete

### Notes

- [P] tasks touch different files and have no unmet dependencies.
- Constitution Principle II makes `pnpm run verify` going green the actual closing condition — T042 is not optional cleanup, it's the gate.
- Constitution Principle X's four mandatory skills (`web-design-guidelines`, `image-to-code`, `taste`, `playwright`) are captured as explicit tasks (T039–T041, and the Playwright tasks throughout) precisely so they aren't silently skipped during implementation.
- Commit after each task or logical group, per the project's per-phase-gate workflow.
