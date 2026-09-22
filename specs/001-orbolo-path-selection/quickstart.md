# Quickstart: Validating the Home Page Audience-Path Selector

**Feature**: `001-orbolo-path-selection` | **Date**: 2026-09-19

This is a validation guide, not an implementation guide — it lists runnable scenarios that prove the feature works end-to-end. Full component/service code lives in the implementation itself; test code lives in `tests/e2e` and `tests/unit` (see `tasks.md` for the task breakdown).

## Prerequisites

- `pnpm install`
- `pnpm run dev` — starts the Astro dev server (see `plan.md` Project Structure for the expected `astro.config.mjs`/`src/` layout once implemented)
- `src/content/paths/paths.json` populated with the three cards from `data-model.md` (`investors`, `buyers`, `landowners`)

## Automated verification

```bash
pnpm run verify   # astro check && eslint . && vitest run && playwright test
```

This single command is the constitution's closing condition (Principle II) — all scenarios below should also exist as Playwright specs under `tests/e2e/` and, where applicable, Vitest specs under `tests/unit/` for the data layer.

## Scenario 1 — Hero first, cards half a scroll down (User Story 1, FR-001/FR-002)

1. Open `/` at a desktop viewport.
2. **Expect**: a hero/intro renders as the first content; no cards are visible in the initial viewport.
3. Scroll down roughly half the page height.
4. **Expect**: the audience-selection section comes into view with exactly three cards — Investors, Buyers, Landowners — each showing an image, title, and short description on its front face.

## Scenario 2 — Flip open reveals detail + "Discover more" (User Story 1, FR-004)

1. From Scenario 1's state, click the Buyers card's front face.
2. **Expect**: the card flips (animated) to its back face, revealing the expanded description (same text as the front-face teaser, per `data-model.md`) and a "Discover more" action.
3. **Expect**: no navigation occurred — the URL is unchanged.

## Scenario 3 — Flip back (FR-005)

1. From Scenario 2's flipped state, click the card again anywhere other than "Discover more".
2. **Expect**: the card flips back to its front-facing state.

## Scenario 4 — "Discover more" navigates (FR-006, FR-023, FR-024)

1. Flip the Buyers card open, then activate "Discover more".
2. **Expect**: the browser navigates to the Beef destination (an internal route, not an external redirect), with a transition that communicates progression rather than an abrupt jump.
3. Press the browser Back button.
4. **Expect**: the visitor returns to the Home page.

## Scenario 5 — Data-driven rendering (User Story 4, FR-008/FR-015)

1. Edit only `src/content/paths/paths.json` (e.g. change the Buyers card's title).
2. Reload `/`.
3. **Expect**: the corresponding card reflects the change with zero edits to `PathCard`/`PathGrid` component source.

## Scenario 6 — Keyboard-only flow (User Story 2, FR-009/FR-011/FR-016)

1. Using only Tab/Shift+Tab/Enter/Space (no mouse), Tab to a card's flip trigger.
2. Press Enter.
3. **Expect**: the card flips open (`aria-expanded="true"` on the trigger) and focus moves to "Discover more".
4. Press Enter again.
5. **Expect**: navigation to that card's destination occurs.
6. Repeat from a fresh flip: after opening, press Escape.
7. **Expect**: the card flips back and focus returns to the flip trigger.

## Scenario 7 — Touch flow (User Story 2, FR-009)

1. On a touch-emulated viewport (Playwright touch emulation), tap a card.
2. **Expect**: it flips open without any prior hover event, and tapping "Discover more" navigates.

## Scenario 8 — Reduced motion (User Story 2, FR-019)

1. Emulate `prefers-reduced-motion: reduce`.
2. Flip a card open, then activate "Discover more".
3. **Expect**: the flip transition is near-instant/non-animated, and the destination transition is likewise minimized.

## Scenario 9 — Responsive layout (User Story 3, FR-012/FR-013)

1. Load `/` at desktop, tablet, and mobile breakpoints.
2. **Expect**: at each breakpoint, the card layout is purpose-fit (not a scaled clone) — readability, touch target size, image visibility, and hierarchy hold at all three, and the flip interaction remains comfortable at each.
3. At a tablet viewport, rotate portrait → landscape.
4. **Expect**: the layout readjusts without breaking readability, the flip interaction, or focus states.

## Scenario 10 — Broken image fallback (Edge Case, FR-022)

1. Point one card's `image.src` at a non-existent asset.
2. Reload `/`.
3. **Expect**: that card renders the shared branded fallback background (not a broken-image icon), with title, description, and flip/discover interaction fully intact.

## Scenario 11 — Content validation gate (data-model.md)

1. In `src/content/paths/paths.json`, set one card's `destination` to an external URL (e.g. `https://example.com`).
2. Run `pnpm run verify` (or `astro check`).
3. **Expect**: the build/check fails loudly (schema validation error), not a silently-shipped external redirect.
