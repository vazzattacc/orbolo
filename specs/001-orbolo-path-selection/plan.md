# Implementation Plan: Orbolo Website — Home Page Audience-Path Selector

**Branch**: `001-orbolo-path-selection` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-orbolo-path-selection/spec.md`

## Summary

Build the audience-selection section of the real Orbolo Home page: a hero/intro renders first, and roughly half a scroll down, a data-driven `PathGrid` of three `PathCard`s (Investors, Buyers, Landowners) lets a visitor flip a card to reveal an expanded description and a "Discover more" link into that audience's destination section (Invest/Remote Rancher, Beef, Land). Card content lives in a versioned `paths.json`, consumed only through an isolated data-access layer so it can later be swapped for Firebase with no component changes (Constitution Principle VIII, FR-021). This plan supersedes the feature's prior (2026-09-14) Next.js/React/Framer Motion plan: the client's builder brief mandates Astro, the premise changed from "5 paths replace the homepage" to "3 audience cards within the real Home page," and selection is now two-step (flip, then "Discover more") rather than a direct click-to-navigate. Building the Invest/Beef/Land destination pages themselves is out of scope — this feature delivers the selector section and its navigation contract only.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode (per constitution)

**Primary Dependencies**: Astro (with i18n routing scaffolding present but not exercised by this feature — see Assumptions) · Tailwind CSS · pnpm (package manager) — no client-side framework (React/Vue/Svelte) island is added; the flip/disclosure interaction is a small vanilla-TS Astro `<script>`, not a mounted component framework (FR-025). No new runtime dependency is introduced beyond the constitution's declared stack.

**Storage**: Versioned JSON file (`src/content/paths/paths.json`), accessed only through an Astro Content Collection (`src/content.config.ts`, collection `paths`) plus a thin `src/lib/paths/path-repository.ts` wrapper; isolates the read so the loader can be swapped for a Firebase-backed one later with no changes to `PathCard`/`PathGrid` (FR-021, Constitution Principle VIII)

**Testing**: Vitest (unit — the path data module's shape/validation), Playwright (end-to-end — the quickstart scenarios covering flip/keyboard/touch/reduced-motion/navigation)

**Target Platform**: Web (all modern evergreen browsers, desktop/tablet/mobile viewports)

**Project Type**: Web — single Astro application (no separate backend service; the data layer is an internal content collection, not a network API)

**Performance Goals**: No explicit numeric target in the spec; general good practice (no layout shift from card images, lazy-load below-the-fold card imagery) applies but is not a gate for this feature

**Constraints**: Destinations are internal routes only, no external redirects (FR-023) · "Discover more" MUST be a real anchor present in the DOM regardless of flip/JS state (FR-024) · no interaction hover-only (FR-011) · reduced-motion respected for both the flip and the destination transition (FR-019) · WCAG-adequate contrast, no state communicated by color alone (FR-010/FR-018) · card images must be authentic Paraguay photography, not forced into one terrain type (FR-020) · flip trigger must be a real `<button aria-expanded>` (FR-016)

**Scale/Scope**: 3 published cards at launch (Investors/Buyers/Landowners); architecture must not assume the count is structurally fixed at 3 (FR-008, SC-001, spec Assumptions)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec Before Code | `spec.md` exists, has been through `/speckit-clarify` (5/5 questions resolved) and a recorded Scope Change delta; no feature code written before this plan | PASS |
| II. Every Requirement Has Its Test | Every FR/user story maps to a `quickstart.md` scenario and will map to a `tasks.md` test task; `pnpm run verify` is the closing gate | PASS (test mapping finalized in `tasks.md`, not here) |
| III. Human Review at Every Checkpoint | This plan is a checkpoint artifact awaiting human approval before `/speckit-tasks` | PASS (procedural, pending review) |
| IV. Minimal, Curated Context | No `CLAUDE.md` changes made by this plan | PASS |
| V. No New Dependencies Without Justification | Zero dependencies added beyond the constitution's declared Astro stack; Astro Content Collections and their schema validation ship as part of the framework, not as an added package — no separate justification entry needed | PASS |
| VI. Declared Architecture Is Respected | The constitution ratified the Astro stack switch on 2026-09-19; this plan is the first feature plan to execute under it. It supersedes (does not silently coexist with) the legacy Next.js/React/Framer Motion scaffold already committed to the repo (`app/`, `components/`, `lib/`, `next.config.ts`, and the `next`/`react`/`framer-motion` entries in `package.json`) — see Complexity Tracking | JUSTIFIED (see Complexity Tracking) |
| VII. Scope Changes Land as a Delta | Done — see `spec.md`'s "Scope Change — 2026-09-19" section, recorded as an explicit delta rather than a silent rewrite | PASS |
| VIII. Content/Presentation/Interaction Decoupled | `paths` content collection + `path-repository.ts` isolation layer (contracts/data-layer.md) + zero per-audience branching in components (contracts/component-props.md) directly implement this | PASS |
| IX. Accessibility Is a Release Gate | Real `<a href>` for "Discover more", `<button aria-expanded>` for the flip trigger, `:focus-visible` styles, `prefers-reduced-motion` gating on both flip and destination transition, non-color-only state, mandatory alt text — all specified in `research.md` §6 and carried into `tasks.md` as first-class tasks | PASS |
| X. Installed Skills Are Mandatory | See "Mandatory skill usage" below | PASS (commitment recorded; execution happens in `/speckit-implement`) |

### Mandatory skill usage (Constitution Principle X)

Recorded here so it isn't lost between planning and implementation:
- `web-design-guidelines` — MUST be consulted while building `PathCard`/`PathGrid` and the Home page hero (accessibility + UX review).
- `image-to-code` — MUST be used: `.specify/references/` contains real candidate photography (`cow.png`, `green_ranch.png`, `green_ranch_2.png`, `nature.png`, `nature_agriculture.png`, `beef_meet.png`, `beef_related.png`), the brand mark (`orbolo-logo.png`), and the prior moodboard (`Orbolo_Editorial_Continuous.pdf`, superseded for typography/color per the constitution but still relevant for photographic treatment). During implementation, this skill run must (a) evaluate these images against FR-020's "authentic Paraguay photography, no forced terrain uniformity" requirement, (b) select/crop the actual `image.src` assets for the three `PathCard` entries from this set where suitable (or source additional photography if none fits), and (c) place the chosen files under `public/images/paths/` per the constitution's Assets note (images serve the dual purpose of live-site asset and style reference — there is no separate references-only folder for this imagery). `orbolo-logo.png` is site branding, not card photography, and is out of this feature's scope beyond noting its existence.
- `taste` — MUST run as a final aesthetic pass on the built Home page section before it's presented as done.
- `playwright` (skill) — MUST be used to add the e2e coverage for the quickstart scenarios (Constitution Principle II's test gate for this UI feature).

## Project Structure

### Documentation (this feature)

```text
specs/001-orbolo-path-selection/
├── spec.md                # Feature spec (approved, clarified, delta-tracked)
├── plan.md                 # This file
├── research.md              # Phase 0 output
├── data-model.md             # Phase 1 output
├── quickstart.md              # Phase 1 output
├── contracts/
│   ├── data-layer.md
│   └── component-props.md
└── tasks.md                # Phase 2 output (/speckit-tasks — not created by this plan)
```

### Source Code (repository root)

Single Astro web application. The repository currently still carries the legacy Next.js scaffold (`app/`, `components/`, `lib/`, `next.config.ts`, `tailwind.config.ts` targeting Next's content globs, Next/React/Framer-Motion entries in `package.json`) plus a partially-started, uncommitted Astro scaffold (`src/env.d.ts`, `.astro/`). This feature's implementation is what completes the Astro migration the constitution already ratified (2026-09-19); see Complexity Tracking for why that migration rides with this feature rather than a separate ticket.

```text
src/
├── content.config.ts          # Defines the `paths` collection (schema + loader) over paths.json
├── content/
│   └── paths/
│       └── paths.json          # Versioned content — the 3 audience cards
├── components/
│   └── home/
│       ├── PathGrid.astro
│       └── PathCard.astro
├── lib/
│   └── paths/
│       └── path-repository.ts   # getPaths() — sole non-collection access point, wraps getCollection('paths')
├── pages/
│   └── index.astro             # Home page — hero/intro, then <PathGrid paths={...} />
├── scripts/
│   └── path-card-flip.ts        # Vanilla-TS flip/disclosure + focus-management logic (FR-025)
├── styles/
│   └── global.css              # Tailwind base + design tokens (constitution Typography/Colors)
└── env.d.ts

public/
└── images/paths/               # Card photography referenced by paths.json (never inlined in components)

tests/
├── unit/                      # Vitest: path-repository / collection schema
└── e2e/                       # Playwright: the quickstart.md scenarios

astro.config.mjs
tailwind.config.ts
tsconfig.json
package.json
```

**Structure Decision**: Single Astro project at the repo root, replacing the Next.js App Router layout it supersedes. No `frontend/`/`backend/` split — there is no separate backend service; `src/lib/paths/` and `src/content/paths/` are internal modules, not an API. The `paths` Astro Content Collection is what makes the architecture swappable at the data layer (a Firebase-backed loader can replace the JSON loader later without touching `PathCard`/`PathGrid`), matching FR-021/Constitution Principle VIII. Flip/disclosure interactivity is a scoped `<script>` per FR-025, not an island framework — this feature mounts no React/Vue/Svelte component.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| This feature's implementation also removes/replaces the legacy Next.js scaffold (`app/`, `components/`, `lib/`, `next.config.ts`, Next/React/Framer-Motion deps) rather than treating the migration as a separate feature (Principle VI generally requires structural refactors to be their own feature) | The constitution was already amended (2026-09-19, v1.1→1.3) to mandate Astro *for this project*, specifically because of this feature's own Scope Change; there is no prior Astro feature to have done the migration first, and no separate migration ticket exists. Leaving both stacks committed side-by-side would leave the repo in a state where `pnpm run verify`'s single command (`astro check && eslint . && vitest run && playwright test`) cannot pass against Next.js-era code paths | A separate "migrate to Astro" feature was considered but rejected: it would produce an intermediate commit where the constitution's declared stack and the committed code disagree, violating Principle VI in the opposite direction (declared architecture not respected) for longer than doing the swap in this feature's own task list |
