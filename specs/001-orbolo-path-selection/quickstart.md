# Quickstart: Validating the Path Selection Experience

**Feature**: `001-orbolo-path-selection`

## Prerequisites

- Node.js + pnpm installed.
- Repo scaffolded per `plan.md` Project Structure (created during `/speckit-implement`, not by this plan).

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm dev
# open http://localhost:3000
```

## Verification command (Constitution Principle II — closing condition)

```bash
pnpm run verify   # next lint && tsc --noEmit && vitest run && playwright test
```

## Manual/E2E validation scenarios

Each maps to an acceptance scenario in `spec.md`; each should also exist as an automated Playwright/Vitest test per Constitution Principle II before the feature is considered done (tracked in `tasks.md`).

1. **Grid renders from data (User Story 1, SC-001)**
   - Load `/`. Confirm one card per *published* entry in `lib/paths/paths.json` (5 at current launch — El Tapir, Orbolo Bridge, Remote Rancher, Ganadería a Pasto, Beef — see `spec.md` Delta for the Verdant→Remote Rancher and Business/Meat→Beef renames).
   - Edit `paths.json` to add a 6th complete entry. Reload. Confirm 6 cards render with zero changes to `PathCard.tsx`/`PathGrid.tsx`.

2. **Selection navigates (User Story 1)**
   - Click the "Remote Rancher" card. Confirm the URL changes to `/paths/remote-rancher` and the destination stub renders Remote Rancher's title/description.
   - Press the browser Back button. Confirm you return to `/` (selection screen).

3. **Keyboard-only flow (User Story 2, SC-002)**
   - Using only Tab/Shift+Tab/Enter, reach and activate every published card without a mouse. Confirm a visible focus indicator at each step.
   - Confirm no card is reachable/selectable only via `:hover`.

4. **Reduced motion (User Story 2)**
   - Enable OS "reduce motion". Reload. Confirm transition/hover animation is simplified/removed, not merely slowed.

5. **Responsive layout (User Story 3, SC-003)**
   - Resize/emulate desktop, tablet, and mobile viewports. Confirm the layout adapts (column count, image treatment, touch-target size) rather than uniformly scaling the desktop layout.

6. **CMS-friendliness (User Story 4)**
   - Add a new entry to `paths.json` with its required fields left empty (a pending path). Reload `/`. Confirm it does not appear. Fill in its remaining fields. Reload `/`. Confirm the card now appears with no component code changes.

7. **Broken image fallback (Edge case, FR-021)**
   - Point one entry's `image.src` at a non-existent file. Reload. Confirm the card shows the shared branded fallback background, remains selectable, and still navigates correctly.

8. **No-JS navigation (Edge case, FR-023)**
   - Disable JavaScript. Load `/`. Confirm each card is still a real clickable link that navigates to its destination (without the animated transition).

## Out of scope for this quickstart

Full destination-page content per path (beyond the shared stub template) — tracked as future feature work per `research.md` §2.
