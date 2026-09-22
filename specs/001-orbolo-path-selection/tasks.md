---

description: "Task list for feature implementation"
---

# Tasks: Orbolo Website — Home Page Audience-Path Selector

**Input**: Design documents from `/specs/001-orbolo-path-selection/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included — the constitution's Principle II ("Every Requirement Has Its Test") and the single verification command `pnpm run verify` (`astro check && eslint . && vitest run && playwright test`) make tests a project-wide requirement, not optional for this feature. `quickstart.md`'s 11 scenarios are the source for the Playwright/Vitest tasks below.

**Organization**: Tasks are grouped by user story (from `spec.md`) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1–US4)
- File paths are exact, per `plan.md`'s Project Structure

## Path Conventions

Single Astro project at the repo root (per `plan.md`): `src/`, `tests/`, `public/` — no `frontend/`/`backend/` split.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Stand up the Astro project structure declared in `plan.md`, completing the constitution-mandated migration off the legacy Next.js scaffold (`plan.md` Complexity Tracking).

- [X] T001 Create the Astro project directory structure per `plan.md` Project Structure: `src/components/home/`, `src/lib/paths/`, `src/pages/`, `src/scripts/`, `src/styles/`, `src/content/paths/`, `public/images/paths/`, `tests/unit/`, `tests/e2e/`
- [X] T002 Initialize `package.json`/`astro.config.mjs` for a TypeScript-strict Astro project with Tailwind CSS integration and pnpm as the package manager; remove the `next`, `react`, `react-dom`, and `framer-motion` entries (superseded per the constitution's 2026-09-19 Astro amendment)
- [X] T003 [P] Remove the legacy Next.js scaffold: `app/`, `components/`, `lib/`, `next.config.ts`, `next-env.d.ts` (justified in `plan.md` Complexity Tracking as this feature absorbing the already-ratified stack migration)
- [X] T004 [P] Configure ESLint + Prettier for Astro/TypeScript files per constitution (`eslint.config.js` flat config — ESLint 10 requires flat config, superseding `.eslintrc.json`; `.prettierrc.json`)
- [X] T005 [P] Configure Vitest for the Astro project in `vitest.config.ts` (via `astro/config`'s `getViteConfig`, so `astro:content` resolves in tests)
- [X] T006 [P] Configure Playwright in `playwright.config.ts` to run against the Astro dev server (port 4321)
- [X] T007 Update `package.json` scripts to `dev`/`build`/`start`/`lint`/`typecheck` (`astro check`)/`test:unit` (`vitest run`)/`test:e2e` (`playwright test`)/`verify` (`astro check && eslint . && vitest run && playwright test`), matching the constitution's single verification command (depends on T002, T005, T006)

**Checkpoint**: `pnpm install && pnpm run verify` runs (even if there's nothing to test yet) against a clean Astro project.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The data layer every user story reads from. **No user story work can begin until this phase is complete.**

- [X] T008 Define the `paths` Astro Content Collection in `src/content.config.ts` per `contracts/data-layer.md`'s schema, using Zod validation rules quoted verbatim from `data-model.md`: `id` — "non-empty, unique across all entries, URL-safe slug (`^[a-z0-9-]+$`)"; `title`, `description`, `targetAudience` — "non-empty strings"; `image.src` — "non-empty string"; `image.alt` — "non-empty string (FR-017 — alt text is mandatory, not optional)"; `destination` — "non-empty string, must start with `/`"; `order` — "if present, a finite number" (depends on T001, T002). Refined during implementation: the schema itself lives in `src/lib/paths/schema.ts` (imported by both `content.config.ts` and the unit tests below) so validation can be tested without mutating the real content fixture.
- [X] T009 [P] Create `src/content/paths/paths.json` with the three entries from `data-model.md`'s Path Configuration table (`investors`/Investors/Invest (Remote Rancher)/`/invest`, `buyers`/Buyers/Beef/`/beef`, `landowners`/Landowners/Land/`/land`), with placeholder `image.src`/`image.alt` pending T011 (depends on T008)
- [X] T010 [P] Implement `getPaths(): Promise<PathCard[]>` in `src/lib/paths/path-repository.ts`, wrapping `getCollection('paths')`, mapping to the plain `PathCard`/`PathImage` shape, sorted "by `order` ascending where present, falling back to file order otherwise" per `data-model.md` (depends on T008)
- [X] T011 Ran the `image-to-code` skill evaluation (Constitution Principle X) against `.specify/references/cow.png`, `green_ranch.png`, `green_ranch_2.png`, `nature.png`, `nature_agriculture.png`, `beef_meet.png`, `beef_related.png` against FR-020. Excluded `green_ranch.png`/`green_ranch_2.png` — both show European/North-American farm architecture (steep gabled roofs, grain-elevator silos), inconsistent with "authentic photographs of Paraguay." Selected `cow.png` → investors, `beef_related.png` → buyers, `nature_agriculture.png` → landowners (all flat-pasture cattle-country compositions). Placed as `public/images/paths/{investors,buyers,landowners}.png`; `image.src`/`image.alt` updated in `paths.json`. **Caveat**: actual shoot-location provenance of the source files could not be verified from pixels alone — flagged to the user for confirmation before ship, not asserted as fact (depends on T009; see `research.md` §9)
- [X] T012 [P] Authored `src/styles/global.css` with Tailwind v4 (`@import "tailwindcss"`) plus the constitution's fixed design tokens via `@theme`: colors (`--color-orbolo-green: #516b3e`, `--color-orbolo-cream: #f8f4e9`) and four typography role tokens. **Deviation**: no licensed/free-substitute font *files* exist in the repo yet (HeliosExtC/Suisse Int'l/Verbena/Roslindale Cyr Deck Narrow are commercial and not bundled); each role currently falls back to a close system-font approximation with a comment flagging this, rather than fabricating `@font-face` references to files that don't exist. Sourcing real font files is follow-up work outside this task's ability to fetch external assets.
- [X] T013 [P] Vitest test in `tests/unit/path-repository.test.ts`: `getPaths()` returns exactly the 3 configured entries correctly sorted, and the `pathCardSchema` rejects an entry whose `destination` doesn't start with `/` or whose `id`/`title`/`description`/`image.alt` is empty (data-model.md Validation rules; quickstart.md Scenario 11) (depends on T008, T009, T010). **Infrastructure note**: `astro:content` in Vitest only resolves from the dev-mode `.astro/data-store.json`, which is written only when an `astro dev` session shuts down cleanly — added `scripts/warm-content-store.mjs` as a `pretest:unit` hook so this works from a clean checkout, not just a machine that already ran `astro dev`.

**Checkpoint**: `getPaths()` returns 3 valid, schema-checked `PathCard` entries with real images — every user story phase below can now proceed.

---

## Phase 3: User Story 1 - Discover and select an audience path (Priority: P1) 🎯 MVP

**Goal**: Hero/intro renders first; scrolling reveals the 3-card selection section; flipping a card reveals detail + "Discover more"; activating "Discover more" navigates to the correct destination.

**Independent Test**: Load the Home page, confirm hero renders with no cards in the initial viewport, scroll to see 3 cards, click a card to see it flip and reveal "Discover more", activate it and confirm navigation to the correct destination (quickstart.md Scenarios 1–5, 10).

### Tests for User Story 1

- [X] T014 [P] [US1] Playwright e2e test in `tests/e2e/home-hero-cards.spec.ts`: hero/intro renders as first content with no cards in the initial viewport (FR-001); scrolling ~half the page reveals exactly 3 cards, each with image/title/description on its front face (FR-002) — quickstart.md Scenario 1
- [X] T015 [P] [US1] Playwright e2e test in `tests/e2e/path-card-flip.spec.ts`: clicking a card's front face flips it (animated) to its back face revealing the expanded description and "Discover more," with no navigation/URL change (FR-004) — quickstart.md Scenario 2
- [X] T016 [P] [US1] Playwright e2e test in `tests/e2e/path-card-flip.spec.ts`: clicking a flipped card anywhere other than "Discover more" flips it back to its front face (FR-005) — quickstart.md Scenario 3. Added a third test covering the explicit "Back" control (see T021 note).
- [X] T017 [P] [US1] Playwright e2e test in `tests/e2e/path-card-navigation.spec.ts`: activating "Discover more" on a flipped card navigates to that card's internal destination (FR-006, FR-023), and pressing browser Back returns to the Home page (FR-024) — quickstart.md Scenario 4. **Added minimal stub pages** `src/pages/{invest,beef,land}.astro` (placeholder content only, explicitly not the real destination pages, which stay out of scope) so this feature's own navigation contract is genuinely end-to-end testable instead of navigating to a 404.
- [X] T018 [P] [US1] Playwright e2e test in `tests/e2e/path-card-fallback.spec.ts`: a card whose `image.src` fails to load renders the shared branded fallback background instead of a broken-image icon, with title/description/flip/discover interaction fully intact (FR-022) — quickstart.md Scenario 10

### Implementation for User Story 1

- [X] T019 [US1] Built `src/pages/index.astro`: hero/intro section (FR-001) above the fold, calls `getPaths()` and renders `<PathGrid paths={...} />` roughly half a scroll down (FR-002) (depends on T010)
- [X] T020 [P] [US1] Built `src/components/home/PathGrid.astro` per `contracts/component-props.md`: purely presentational, one `PathCard` per entry, no per-audience branching, renders nothing for an empty array
- [X] T021 [P] [US1] Built `src/components/home/PathCard.astro` per `contracts/component-props.md`, refined by the T025 design-guidelines pass: the flip trigger is a **transparent overlay `<button>` positioned `absolute inset-0`** over the front face (not a button wrapping the visible title/description) — a `<button>`'s content model is phrasing content only, so the original plan of nesting an `<h3>` title inside it was invalid HTML and broke heading semantics. The heading/text/image now render as normal siblings, with the button carrying `aria-expanded`/`aria-controls`/`aria-label` (FR-016). Back face `id="{path.id}-back"` has the expanded description, a real `<a href={path.destination}>Discover more</a>` always present in the DOM (FR-024), and an added explicit **"Back" button** (`data-path-card-close`) — a dedicated keyboard-reachable close control distinct from Escape, since the front-face trigger sits behind the flipped card (`backface-visibility: hidden`) and isn't a realistic "reactivate its flip control" target once flipped. Image `onerror` fallback per `research.md` §5.
- [X] T022 [US1] Implemented `src/scripts/path-card-flip.ts`: toggles the trigger's `aria-expanded`, shows/hides the back face, moves focus to "Discover more" on open (FR-004, per `research.md` §2) (depends on T021). **Bug caught by smoke-testing before writing formal tests**: the trigger's own click bubbles to the card-level "click elsewhere flips back" handler, which — since `aria-expanded` is now `"true"` by the time it runs — immediately re-closed the card it had just opened. Fixed with an explicit `target.closest('[data-path-card-trigger]')` guard.
- [X] T023 [US1] Wired `path-card-flip.ts` into `PathCard.astro`; implemented the CSS 3D flip (`perspective` + `rotateY`) in `src/styles/global.css`, gated to near-instant under `prefers-reduced-motion: reduce` (FR-019, `research.md` §3) (depends on T022, T012)
- [X] T024 [US1] Enabled Astro View Transitions (`<ClientRouter />` from `astro:transitions`) in `src/components/Layout.astro` so "Discover more" navigation communicates progression rather than an abrupt jump (FR-006, `research.md` §3) (depends on T019)
- [X] T025 [US1] Ran the `web-design-guidelines` skill (Constitution Principle X) against `PathCard`/`PathGrid`/the hero section. Findings applied: (1) heading-inside-button invalid content model, fixed via the T021 overlay-button restructure; (2) `<img>` was missing explicit `width`/`height` (CLS risk) — added; (3) no `line-clamp` on card text — added `line-clamp-3`/`line-clamp-4` so long content-driven text can't overflow the fixed-height flip card; (4) no explicit `hover:` feedback beyond `focus-visible` (FR-010 requires a visible hover state) — added; (5) no `touch-action: manipulation` on tap targets — added (`touch-manipulation`); (6) straight apostrophes in hero copy — switched to curly (`&rsquo;`); (7) headings lacked `text-wrap: balance` — added Tailwind's `text-balance`. Verified `pnpm run lint` and `astro check` stay clean, and re-ran the flip smoke test after the restructure.

**Checkpoint**: User Story 1 is fully functional and independently testable — `pnpm run verify` passes for T014–T018.

---

## Phase 4: User Story 2 - Fully keyboard- and touch-accessible selection (Priority: P2)

**Goal**: The same flip/discover flow works completely via keyboard and touch, with visible focus states and no hover-only interaction.

**Independent Test**: Navigate the card section using only Tab/Shift+Tab/Enter/Space/Escape, and separately via touch emulation, confirming full parity with mouse interaction (quickstart.md Scenarios 6–8).

### Tests for User Story 2

- [X] T026 [P] [US2] Playwright e2e test in `tests/e2e/path-card-keyboard.spec.ts`: Tab to a card's trigger, Enter opens it with focus moving to "Discover more," Enter again navigates; from a fresh flip, Escape flips back and returns focus to the trigger (FR-009, FR-016) — quickstart.md Scenario 6
- [X] T027 [P] [US2] Playwright e2e test in `tests/e2e/path-card-touch.spec.ts`, run under the `mobile-chrome` project (touch-emulated): tapping a card flips it open without any prior hover event, and tapping "Discover more" navigates (FR-009, FR-011) — quickstart.md Scenario 7
- [X] T028 [P] [US2] Playwright e2e test in `tests/e2e/reduced-motion.spec.ts`, run under the dedicated `reduced-motion` project (`prefers-reduced-motion: reduce` emulated via `playwright.config.ts`): the flip transition is near-instant and the destination transition completes normally (FR-019) — quickstart.md Scenario 8

### Implementation for User Story 2

- [X] T029 [US2] `Escape` flip-back + return focus to the trigger was implemented as part of `src/scripts/path-card-flip.ts` in T022 (single `keydown` listener alongside the click/open logic, rather than a separate later pass) (User Story 2 acceptance scenario 2)
- [X] T030 [US2] Verified 44×44px minimum touch targets (`min-h-[44px]`/`min-w-[44px]` + `touch-manipulation`) on the flip trigger, "Discover more," and "Back" — added during the T025 design-guidelines pass — and that hover/focus/flipped states each have a non-hover-triggered equivalent (`aria-expanded` attribute + `focus-visible` outline, not CSS `:hover`-only) in `PathCard.astro` (FR-011)

**Checkpoint**: User Stories 1 AND 2 both work independently — `pnpm run verify` passes for T026–T028.

---

## Phase 5: User Story 3 - Responsive experience across devices (Priority: P2)

**Goal**: The card section adapts (not scales) across desktop, tablet, and mobile.

**Independent Test**: Load the Home page at desktop/tablet/mobile breakpoints and rotate a tablet viewport, confirming purpose-fit layout at each (quickstart.md Scenario 9).

### Tests for User Story 3

- [X] T031 [P] [US3] Playwright e2e test in `tests/e2e/path-grid-responsive.spec.ts` across desktop (1280×900, 3 columns)/tablet portrait (834×1194, 2 columns)/tablet landscape (1194×834, 3 columns)/mobile (390×844, 1 column) viewports, plus the portrait→landscape rotation: confirms distinct column counts per breakpoint (not a single scaled layout), ≥44px touch targets on mobile, and the flip interaction working post-rotation (FR-012, FR-013) — quickstart.md Scenario 9

### Implementation for User Story 3

- [X] T032 [US3] Implemented the responsive grid in `src/components/home/PathGrid.astro` via explicit Tailwind breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) rather than literal CSS `auto-fit`/`minmax` — a deliberate refinement over `research.md` §8's literal suggestion: fixed breakpoints give art-directed control appropriate for "intentional, premium" cards (spec framing), while still satisfying the underlying requirement (no hardcoded assumption of exactly 3; a 2nd or 4th card reflows correctly, verified in T035) (FR-012) (depends on T020)
- [X] T033 [US3] Mobile-specific adjustments were already satisfied by the T020/T021/T025 implementation rather than needing a separate pass: the grid collapses to 1 column below the `sm` breakpoint, every interactive target is ≥44×44px project-wide (not just added for mobile), the card image keeps a fixed `h-56` (unscaled) at every breakpoint for consistent visibility, and `line-clamp`/`text-balance` (T025) keep hierarchy legible at narrow widths (FR-013) (depends on T021)

**Checkpoint**: User Stories 1, 2, AND 3 all work independently — `pnpm run verify` passes for T031.

---

## Phase 6: User Story 4 - Update card content without touching component code (Priority: P3)

**Goal**: A content owner can add/remove/edit a card purely via `paths.json`, with zero `PathCard`/`PathGrid` code changes.

**Independent Test**: Edit only `src/content/paths/paths.json` and confirm the rendered card updates; add a hypothetical 4th entry and confirm it renders correctly, flip included (quickstart.md Scenario 5).

### Tests for User Story 4

- [X] T034 [P] [US4] **Changed from a Vitest test to a Playwright e2e test** (`tests/e2e/path-card-config-driven.spec.ts`, first test): editing `title` in `src/content/paths/paths.json` is reflected on page reload, with zero changes to `path-repository.ts`/`PathCard.astro`/`PathGrid.astro` (FR-008, FR-015) — quickstart.md Scenario 5. **Why the change**: Astro Content Collections are a build/dev-sync-time data source — `getCollection()` reads a pre-built snapshot (see T013's `.astro/data-store.json` note), so mutating the JSON fixture and calling `getPaths()` again in the same Vitest process would never observe the change. The real "content owner edits JSON, reloads the page" workflow only works through the running `astro dev` server's file-watcher resync, which an e2e test against a live page can actually exercise; a Vitest unit test cannot.
- [X] T035 [P] [US4] Playwright e2e test in `tests/e2e/path-card-config-driven.spec.ts` (second test): a temporary 4th `paths.json` entry renders correctly alongside the existing three, flip interaction included, with no component code changes (User Story 4 acceptance scenario 2). Both tests in this file mutate the shared `paths.json` fixture and restore it in `afterEach`; `test.describe.configure({ mode: "serial" })` prevents them from racing each other.

### Implementation for User Story 4

- [X] T036 [US4] **Changed from a header comment to `src/content/paths/README.md`**: JSON has no comment syntax, so a "header comment in paths.json" as originally scoped isn't achievable without switching the file format (which the schema/loader don't require) — a sibling README documents the field contract for content editors instead, referencing `data-model.md`

**Checkpoint**: All four user stories are independently functional — `pnpm run verify` passes for T034–T035.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gates spanning all user stories (Constitution Principle X, Principle II).

- [X] T037 [P] **Blocked, flagged per Constitution Principle X** ("an applicable skill that goes unused... must be flagged and justified, not silently skipped"): the `taste` skill requires the Playwright MCP server, confirmed disconnected in this environment (`claude mcp list` → `playwright: ... ✘ Failed to connect — CONNECTION_CLOSED`). The skill's own error-handling table explicitly forbids falling back to WebFetch as a substitute. Ran a manual aesthetic self-review instead (informed by the same anti-slop standard — specific, evidenced judgments, not generic "clean/modern" praise) against live screenshots: hero and card-grid render correctly against the constitution's fixed tokens (`#516b3e`/`#f8f4e9`); the flip/back-face contrast (cream-on-green vs. green-on-cream) is the one deliberate visual "event" on an otherwise restrained page — consistent with spec's "intentional, premium... not a conventional video game" framing. **Not equivalent to a real `taste` run** — recommend the user reconnect Playwright MCP and re-run `/taste http://localhost:4321` before this ships.
- [X] T038 Confirmed Playwright e2e coverage maps 1:1 to all 11 `quickstart.md` scenarios: 1→`home-hero-cards.spec.ts`, 2-3→`path-card-flip.spec.ts`, 4→`path-card-navigation.spec.ts`, 5→`path-card-config-driven.spec.ts` (test 1), 6→`path-card-keyboard.spec.ts`, 7→`path-card-touch.spec.ts`, 8→`reduced-motion.spec.ts`, 9→`path-grid-responsive.spec.ts`, 10→`path-card-fallback.spec.ts`. Scenario 11 (schema rejects an external `destination`) is intentionally covered by the Vitest `pathCardSchema` tests (T013), not Playwright — it's a build-time validation gate (`astro check`/build failing loudly), not a runtime browser behavior, consistent with quickstart.md's own "Run `pnpm run verify` (or `astro check`)" instruction for that scenario.
- [X] T039 Ran `pnpm run verify` (`astro check && eslint . && pnpm run test:unit && pnpm run test:e2e` — chained via `pnpm run` rather than calling `vitest run`/`playwright test` directly, so each command's own `pretest:*` warm-up hook fires) from a fully clean cache (`rm -rf .astro node_modules/.astro dist`, dev daemon stopped): **0 errors/warnings/hints** from `astro check`, clean `eslint .`, **6/6** Vitest, **28/29** Playwright (1 correctly skipped — the touch scenario only runs under `mobile-chrome`). Verified clean on 3 repeated cold-cache runs, not just once.
- [X] T040 [P] Staged (`git add`, not committed) the sourced card images in `public/images/paths/{investors,buyers,landowners}.png` and their `.specify/references/*.png` sources (previously only `.specify/references/Orbolo_Editorial_Continuous.pdf` was tracked)
- [X] T041 All 11 `quickstart.md` scenarios are exercised by the automated suite (T038) and were additionally spot-checked manually via Playwright screenshots/scripted interaction during implementation (hero-then-cards layout, flip-open/focus-move, flip-back via click-elsewhere and the Back button, real navigation to the stub destination pages with working browser Back, and the image-fallback CSS) before the formal specs were written — see the T022 bug note for one real issue this manual pass caught before it reached the test suite.

### Notable deviations from the original task plan (for human review)

- **Bug found via manual testing, not by a written test**: the trigger's click bubbling into the card-level "flip back" handler (T022) was caught by ad hoc scripted interaction *before* `path-card-flip.spec.ts` existed — worth knowing the fix predates, rather than was discovered by, the formal test.
- **`astro:content` + Vitest**: required an undocumented workaround (`scripts/warm-content-store.mjs`) because this Astro build's dev-mode content store only persists on a clean `astro dev` shutdown, and Vitest's `getViteConfig` always presents as `command: "serve"` to the content virtual-mod plugin regardless of intent. Flagging in case a future Astro upgrade changes this and the workaround becomes unnecessary (or breaks).
- **`astro dev` self-daemonizes** in this build (always forks and exits, even in Playwright's spawned child), which is incompatible with Playwright's `webServer` option — worked around with `scripts/ensure-dev-server.mjs` instead of `webServer`.
- **Content-mutation e2e tests are timing-sensitive**: `path-card-config-driven.spec.ts` depends on Astro dev's own HMR reload after a `paths.json` write; an earlier version that manually called `page.reload()` in a polling loop raced that autonomous reload and was genuinely flaky. The current version trusts Playwright's auto-retrying `expect(...).toBeVisible()`/`toHaveCount()` instead of reloading manually, and stress-tested clean across repeated cold-cache runs — but this class of test is inherently more timing-sensitive than the rest of the suite and worth watching in CI.

### Post-implementation: real `taste` run + user-reported bug (2026-09-21)

Playwright MCP was reconnected after T037 was written, so the real `/taste` pipeline ran against `http://localhost:4321` (single-page + 2-page multi-page crawl of `/invest`, `/beef`). Output: `orbolo-localhost.md`/`.json` (repo root) plus a condensed `CLAUDE.md` Design Taste section (kept under the constitution's ~15-line cap per explicit user direction — full detail lives in `orbolo-localhost.md`, not duplicated into `CLAUDE.md`). This supersedes T037's manual self-review as the real aesthetic pass; sharpest finding: the flip's cream-on-green inversion is the page's only contrast event, everything else stays flat by design.

Two issues surfaced and were fixed, not just noted:

- **Bug (user-reported)**: flipping a card, activating "Discover more," then pressing the browser Back button returned to the Home page but the flip interaction no longer worked on any card. **Root cause**: `<ClientRouter />` (Astro View Transitions, added in T024) only executes a page's `<script>` tags on the very first load — subsequent SPA-style navigations (including Back) swap in a fresh DOM without re-running them, so `path-card-flip.ts`'s top-level `querySelectorAll(...).forEach(initPathCard)` never re-attached listeners to the swapped-in cards. **Fix**: moved initialization into an `astro:page-load` listener (Astro's post-swap lifecycle event, fires on every navigation including the first), in `src/scripts/path-card-flip.ts`. Reproduced the exact user-reported sequence via Playwright (flip → Discover more → Back → flip again) both before (failed: `aria-expanded` stayed `false`) and after (passed) the fix.
- **Minor finding (from the `taste` run's own console-error check)**: a `favicon.ico` 404 on every page load. No square brand-mark asset exists yet (`.specify/references/orbolo-logo.png` is a wide wordmark lockup, illegible at favicon size), so added a minimal placeholder `public/favicon.svg` (a solid `#516b3e` circle) plus a `<link rel="icon">` in `Layout.astro`, rather than either leaving the 404 or fabricating a fake "real" icon.

Full suite re-verified after both fixes: `astro check` 0/0/0, `eslint .` clean, Vitest 6/6, Playwright 28/29 (1 correctly skipped), including a direct Playwright reproduction of the reported back-navigation sequence.

### Post-implementation: hero background + real logo (2026-09-21), and a self-introduced perf regression

Per explicit user request: added a full-bleed hero background photo (`nature_agriculture.png` from `.specify/references/`, the same source already used for the `landowners` card) confined to the hero section only, with a cream scrim (`.hero--background` in `global.css`) that fades to solid `#F8F4E9` at the section's bottom edge so it blends into the card section rather than ending on a hard cut. Replaced the plain-text "Orbolo" eyebrow with the real `orbolo-logo.png` mark (has an alpha channel, confirmed via `sips -g hasAlpha` before using it over a photo background).

**Self-introduced regression, caught immediately by a full-suite timing check**: the first version used the source PNGs as-is. `hero-background.png` alone was 6.2MB and — unlike the card images (`loading="lazy"`) — is a CSS `background-image`, so it's in the critical path on every single page load. The full Playwright suite went from ~8s to **5.8 minutes** and the already-flaky `config-driven-mutation` test failed outright, purely from 28+ test navigations each re-fetching a 6.2MB+3MB+6.2MB+1.3MB image set with no HTTP caching in dev mode. **Fix**: resized (`sips -Z`) and converted all four images (hero background + 3 card photos) from PNG to JPEG — `hero-background.jpg` 538KB (was 6.2MB), card images 147–171KB each (were 1.3–6.2MB) — updated every reference (`paths.json`, `global.css`, and the test files that hardcode an image path: `path-repository.test.ts`, `path-card-config-driven.spec.ts`, `path-card-fallback.spec.ts`). Re-verified: full suite back to **8.2s**, 28/29 passing (1 correctly skipped), visually indistinguishable from the uncompressed originals at their rendered sizes.

**Takeaway for future image additions to this project**: source files from `.specify/references/` are camera-original PNGs (1–6MB+) and must always be resized/compressed before landing in `public/images/`, never copied in as-is — this wasn't caught by any automated check, only by noticing the suite's wall-clock time balloon.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — no dependency on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational; its implementation tasks extend files US1 creates (`path-card-flip.ts`, `PathCard.astro`), so in practice follows US1, but its *tests* are independently meaningful once US1 exists
- **User Story 3 (Phase 5)**: Depends on Foundational; extends `PathGrid.astro`/`PathCard.astro` from US1
- **User Story 4 (Phase 6)**: Depends on Foundational only — genuinely independent of US1–US3's component work, since it tests the data layer's content-driven contract
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### Within Each User Story

- Tests are written before implementation and should fail first
- Data/schema before repository functions before components before scripts/interaction before page wiring
- Story complete before moving to the next priority (if executing sequentially rather than in parallel)

### Parallel Opportunities

- Setup: T003, T004, T005, T006 in parallel (after T001/T002)
- Foundational: T009, T010, T012 in parallel (after T008); T013 after T009/T010
- US1 tests T014–T018 in parallel; T020/T021 in parallel (after T010/T019 context is available, though as `.astro` files they can be scaffolded in parallel with T019)
- US2 tests T026–T028 in parallel
- US3 test T031 has no parallel sibling in its phase but can run in parallel with US2/US4 tasks if staffed separately
- US4 tests T034–T035 in parallel
- Polish: T037 and T040 in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together:
Task: "Playwright e2e test in tests/e2e/home-hero-cards.spec.ts"
Task: "Playwright e2e test in tests/e2e/path-card-flip.spec.ts (flip open)"
Task: "Playwright e2e test in tests/e2e/path-card-flip.spec.ts (flip back)"
Task: "Playwright e2e test in tests/e2e/path-card-navigation.spec.ts"
Task: "Playwright e2e test in tests/e2e/path-card-fallback.spec.ts"

# Launch PathGrid and PathCard together:
Task: "Build src/components/home/PathGrid.astro"
Task: "Build src/components/home/PathCard.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories; includes real card images via T011)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run `pnpm run verify` for T014–T018, then quickstart.md Scenarios 1–5 and 10 manually
5. Demo if ready — this is the entire premise of the feature (spec.md, User Story 1's "Why this priority")

### Incremental Delivery

1. Setup + Foundational → data layer ready with real images
2. Add User Story 1 → validate independently → MVP demo
3. Add User Story 2 → validate independently (keyboard/touch/reduced-motion parity)
4. Add User Story 3 → validate independently (responsive adaptation)
5. Add User Story 4 → validate independently (content-driven update + 4th-card scenario)
6. Phase 7 Polish → `pnpm run verify` green, `taste`/`playwright` skill passes, full quickstart walkthrough

---

## Notes

- [P] tasks touch different files with no dependency on an incomplete task
- [Story] labels map every user-story-phase task to spec.md's US1–US4 for traceability
- Commit after each task or logical group, per the constitution's "one commit per phase" workflow guidance
- Avoid: vague tasks, same-file conflicts marked [P], cross-story dependencies that break independent testability
