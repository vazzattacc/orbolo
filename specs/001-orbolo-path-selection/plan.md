# Implementation Plan: Orbolo Website — Interactive Path Selection Experience

**Branch**: `001-orbolo-path-selection` | **Date**: 2026-09-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-orbolo-path-selection/spec.md`

## Summary

Build the Orbolo site's first-load experience: a data-driven "choose your path" grid (`PathGrid` of `PathCard`s) instead of a conventional homepage, styled per the provided moodboard. Path content (El Tapir, Orbolo Bridge, Remote Rancher, Ganadería a Pasto, and Beef — see `spec.md`'s Delta for the Verdant→Remote Rancher and Business/Meat→Beef renames) lives in a versioned `paths.json`, accessed only through a `PathRepository` isolation layer so it can later be swapped for Firebase with no component changes. Selecting a card is a real internal navigation (`/paths/{id}`) to a shared destination-stub template — not a client-only overlay — satisfying the clarified back-button and no-JS requirements. The grid and cards are fully keyboard/touch operable, respect reduced-motion, and adapt (not scale) across desktop/tablet/mobile. Full per-path destination *content* beyond the shared stub is explicitly out of scope for this feature (see `research.md` §2) — this feature delivers the selection mechanism and the navigation contract, not the five products' full pages.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode (per constitution)

**Primary Dependencies**: Next.js (App Router) · React · Tailwind CSS · Framer Motion · pnpm (package manager) — no additional runtime dependencies required (see `research.md` §8 on why no schema-validation library is added)

**Storage**: Versioned JSON file (`lib/paths/paths.json`), accessed only through `lib/paths/path-repository.ts`; architecture isolates this so it is swappable for a Firebase database later with no changes to `PathCard`/`PathGrid` (FR-020)

**Testing**: Vitest (unit/component — `PathRepository`, `PathCard`, `PathGrid`), Playwright (end-to-end — the 8 quickstart scenarios)

**Target Platform**: Web (all modern evergreen browsers, desktop/tablet/mobile viewports)

**Project Type**: Web — single Next.js application (no separate backend service; the data layer is an internal module, not a network API)

**Performance Goals**: No explicit numeric target in the spec (not requested); general good practice (avoid layout shift from images, use `next/image` sizing) applies but is not a gate for this feature — noted so it isn't silently promoted into an unstated requirement

**Constraints**: Real internal routes only (no external redirects, FR-022) · no interaction hover-only (FR-009) · reduced-motion respected (FR-017) · WCAG-adequate contrast, no color-only signaling (FR-016) · images must be authentic Paraguay photography, not forced into one terrain type (FR-019)

**Scale/Scope**: 5 published paths at launch (El Tapir, Orbolo Bridge, Remote Rancher, Ganadería a Pasto, Beef); architecture must not assume the count is fixed at 5 (FR-006, SC-001)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec Before Code | `spec.md` exists, has been through `/speckit-clarify` (5/5 questions resolved), no code written before this plan | PASS |
| II. Every Requirement Has Its Test | Every FR/user story maps to a quickstart scenario (§ below) and will map to a `tasks.md` test task; `pnpm run verify` is the closing gate | PASS (test mapping finalized in `tasks.md`, not here) |
| III. Human Review at Every Checkpoint | This plan is a checkpoint artifact awaiting human approval before `/speckit-tasks` | PASS (procedural, pending your review) |
| IV. Minimal, Curated Context | No `CLAUDE.md` changes made by this plan; none needed yet | PASS |
| V. No New Dependencies Without Justification | Zero dependencies added beyond the constitution's declared stack; the one considered-and-rejected addition (a runtime schema validator) is justified in `research.md` §8 | PASS |
| VI. Declared Architecture Is Respected | This feature *establishes* the architecture (first feature in the repo) — Project Structure below is that declaration | PASS (baseline-setting, not a violation) |
| VII. Scope Changes Land as a Delta | N/A — no prior spec version to delta against | N/A |
| VIII. Content/Presentation/Interaction Decoupled | `PathRepository` isolation layer (contracts/data-layer.md) + zero per-path branching in components (contracts/component-props.md) directly implement this | PASS |
| IX. Accessibility Is a Release Gate | Real `<Link>` anchors, `:focus-visible` styles, `prefers-reduced-motion` gating, non-color-only state, mandatory alt text — all specified in `research.md` §6 and carried into `tasks.md` as first-class tasks, not backfill | PASS |
| X. Installed Skills Are Mandatory | See "Mandatory skill usage" below | PASS (commitment recorded; execution happens in `/speckit-implement`) |

**No violations to justify — Complexity Tracking table is empty/omitted.**

### Mandatory skill usage (Constitution Principle X)

Recorded here so it isn't lost between planning and implementation:
- `web-design-guidelines` — MUST be consulted while building `PathCard`/`PathGrid`/the destination stub (accessibility + UX review).
- `image-to-code` — MUST be used against `.specify/references/Orbolo_Editorial_Continuous.pdf` when implementing the moodboard's visual language (the token hypothesis in `research.md` §7 is a starting point for that skill, not a substitute for it).
- `taste` — MUST run as a final aesthetic pass on the built selection screen before it's presented as done.
- `playwright` (skill) — MUST be used to add the e2e coverage for the quickstart scenarios (Constitution Principle II's test gate for this UI feature).

## Project Structure

### Documentation (this feature)

```text
specs/001-orbolo-path-selection/
├── spec.md               # Feature spec (approved, clarified)
├── plan.md                # This file
├── research.md            # Phase 0 output
├── data-model.md           # Phase 1 output
├── quickstart.md           # Phase 1 output
├── contracts/
│   ├── data-layer.md
│   └── component-props.md
└── tasks.md               # Phase 2 output (/speckit-tasks — not created by this plan)
```

### Source Code (repository root)

This is a greenfield repository — no app scaffold exists yet. `/speckit-implement` creates the following structure (Option: single Next.js web application; no separate backend, since the "backend" here is an internal data module, not a service):

```text
app/
├── layout.tsx              # Root layout (fonts, global providers)
├── page.tsx                # "/" — path-selection screen; calls getPublishedPaths(), renders PathGrid
├── globals.css              # Tailwind base + design tokens from research.md §7
└── paths/
    └── [pathId]/
        └── page.tsx          # Dynamic destination stub; calls getPathById(), notFound() if missing/pending

components/
├── PathGrid.tsx
└── PathCard.tsx

lib/
└── paths/
    ├── types.ts              # PathCard / PathImage interfaces (contracts/data-layer.md)
    ├── paths.json             # Versioned content — the 5 paths, all published (see spec.md Delta)
    └── path-repository.ts      # getPublishedPaths() / getPathById() — sole JSON access point

public/
└── images/paths/             # Path photography referenced by paths.json (never inlined in components)

tests/
├── unit/                    # Vitest: path-repository, PathCard, PathGrid
└── e2e/                     # Playwright: the 8 quickstart.md scenarios

next.config.ts
tailwind.config.ts
tsconfig.json
package.json
```

**Structure Decision**: Single Next.js App Router project at the repo root (no `frontend/`/`backend/` split — there is no separate backend service for this feature; `lib/paths/` is an internal module, not an API). The dynamic `app/paths/[pathId]/` segment is what makes the architecture data-driven at the routing layer, not just the component layer — matching FR-006/FR-013's "no code changes to add a path" requirement.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
