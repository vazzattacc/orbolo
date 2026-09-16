# Phase 0 Research: Orbolo Website — Interactive Path Selection Experience

**Feature**: `001-orbolo-path-selection` | **Date**: 2026-09-14

This is a greenfield feature — no existing app scaffold exists in the repository yet. All Technical Context items are fixed by `.specify/memory/constitution.md` (Additional Constraints) rather than left open, so this phase focuses on architecture/pattern decisions within that fixed stack, plus design-token extraction from the moodboard the spec requires (`.specify/references/Orbolo_Editorial_Continuous.pdf`).

## 1. Stack confirmation (no NEEDS CLARIFICATION remain)

- **Decision**: TypeScript 5.x (strict) · Next.js (App Router) · React · Tailwind CSS · Framer Motion · pnpm · Vitest · Playwright · ESLint + Prettier — exactly as declared in the constitution.
- **Rationale**: Constitution Principle V ("No New Dependencies Without Justification") assigns stack ownership to the project, not the agent; the constitution has already made this decision.
- **Alternatives considered**: None evaluated — re-litigating the stack here would violate Principle V and the constitution's own governance clause.

## 2. Routing model for path → destination

- **Decision**: A single dynamic route, `app/paths/[pathId]/page.tsx`, resolves any path's destination by looking up `pathId` against the JSON-backed data layer and rendering a shared, generic destination-stub template (hero image, title, description, "more coming soon" body). No per-path route file is created.
- **Rationale**: FR-006/FR-013 require that adding or editing a path (including finishing "Business/Meat") requires zero component/route code changes. A dynamic segment satisfies this: a new JSON entry with `destination: "/paths/verdant"` is immediately routable with no new file. It also directly satisfies the newly-clarified requirements: destinations are real internal routes (FR-022), each `PathCard` renders as a real `<a href>` so it works with JS disabled (FR-023), and the browser back button naturally returns to `/` (the selection screen) because navigation is a real route change, not client-only state.
- **Alternatives considered**:
  - *One static route file per path* — rejected: violates FR-006/013 (new path ⇒ new file ⇒ code change).
  - *Client-side overlay/state machine with no URL change* — rejected by the clarification: user explicitly chose real URL navigation over an in-page overlay.
- **Full destination content is out of scope for this feature.** The stub template proves the navigation contract (User Story 1's acceptance criteria: "transitions them into that path's corresponding section"). Building out El Tapir/Verdant/Orbolo Bridge/Ganadería a Pasto's actual product content is separate, future feature work — noted as a scope boundary in `plan.md`.

## 3. Content/presentation decoupling mechanism

- **Decision**: A `PathRepository` module (`lib/paths/path-repository.ts`) is the sole access point to path content. It reads `lib/paths/paths.json` at build/request time and exposes `getPublishedPaths()` and `getPathById(id)`. `PathCard`/`PathGrid`/the destination page import only this module — never the JSON file directly.
- **Rationale**: Constitution Principle VIII and spec FR-020 require an isolated data-access layer so JSON can be swapped for Firebase later "with no structural changes to `PathCard` or `PathGrid`." Concentrating all reads behind one module is the minimal structure that satisfies this — swapping the JSON read for a Firebase read later touches only this one file.
- **Alternatives considered**: Importing the JSON directly into components — rejected, directly violates FR-020/Principle VIII (the swap would then touch every component).

## 4. "Published" / placeholder filtering (Business/Meat)

- **Decision**: `getPublishedPaths()` filters out any entry whose required fields (`title`, `description`, `image`, `destination`) are empty/`null`/placeholder-marked. A path becomes visible automatically once its JSON entry is completed — no code change.
- **Rationale**: Directly implements the clarified FR-018 (hidden, not placeholder-card, until complete).
- **Alternatives considered**: An explicit boolean `published` flag per entry — viable and arguably more explicit; rejected in favor of field-completeness checking because it removes one more manual step a content editor could forget (flip the flag) and ties visibility directly to data completeness, matching "appears automatically once its configuration is filled in" (FR-018 exact wording). Noted as a reasonable alternative if content editors find completeness-inference surprising.

## 5. Broken-image fallback

- **Decision**: `PathCard`'s image uses `next/image` with an `onError` handler that swaps to a shared fallback treatment: a CSS gradient/solid fill built from the moodboard's palette tokens (see §7), rendered behind the title/description, with no second image asset required per path.
- **Rationale**: Satisfies the clarified FR-021 without requiring content editors to supply a second "fallback image" per path (rejected option B from clarification).

## 6. Accessibility & motion mechanics

- **Decision**:
  - Each `PathCard` root element is a real `<a>` (Next.js `<Link>`), not a `<div onClick>` — gives keyboard operability (native Tab/Enter/Space activation... note: native `<a>` activates on Enter, not Space; Space-activation is added via a `keydown` handler only as a progressive enhancement, since FR-007/FR-009 require both keys to work, matching native `<button>` semantics layered onto a navigable link) with visible `:focus-visible` styles (Tailwind `focus-visible:` variants — never relying on `:hover` alone, satisfying FR-009/FR-014).
  - Framer Motion's `useReducedMotion()` hook gates all transition/hover-scale animation; when `prefers-reduced-motion: reduce` is set, transitions collapse to an instant/opacity-only change (FR-017).
  - Selected/active state is communicated via a visible outline/underline + text label change, never color alone (FR-016).
  - Alt text is a required field on every `PathCard` JSON entry (FR-015), enforced by the TypeScript type (non-optional `string`).
- **Rationale**: These map 1:1 onto FR-007/009/014/015/016/017 and Constitution Principle IX (accessibility as a release gate). `web-design-guidelines` (installed skill, constitution Principle X) is the authority for exact contrast ratios and semantic-markup review during implementation, not re-derived here.

## 7. Design tokens from the moodboard

Extracted from `.specify/references/Orbolo_Editorial_Continuous.pdf` (single-page editorial board). These are a **starting hypothesis** for `tailwind.config.ts` design tokens — the constitution's mandatory `image-to-code` and `taste` skills (Principle X) are the authority that refines/validates exact values during implementation, not this document.

- **Palette**: warm off-white/cream ground (~`#F4F0E6`), deep forest/olive green for text-on-photo banners and accents (~`#2E4034`), muted gold/dry-grass and sky-blue tones sampled from photography — no saturated/synthetic colors. Confirms FR-019: photography is authentic Paraguay pasture/cattle/low-relief terrain, not mountainous, so card imagery should not be forced into a single landscape type.
- **Typography**: a high-contrast serif/slab display face for large tracked-out headline caps (the "ORBOLO" wordmark, hero statements); a clean sans-serif for body copy; italic serif for short accent taglines ("rooted in the land"); small tracked-out uppercase sans labels used as eyebrow/section labels.
- **Composition**: generous whitespace, thin hairline-bordered photo cards (not heavy shadows/rounded-card-UI), editorial full-bleed photography sections alternating with cream text sections, physical-product mockups (canvas tote, kraft box) reinforcing a natural/sustainable, non-"video-game" tone — directly supports the constitution's "subtle, sophisticated gamification, not literal" non-goal.
- **Rationale**: FR-003 requires the site to follow this moodboard's visual language; extracting concrete tokens now lets `data-model.md`/Tailwind config reference real values instead of placeholders.

**Addendum — corrected by the `image-to-code` skill pass during implementation (Constitution Principle X):** a closer read of the actual moodboard corrected three assumptions from the original hypothesis above:
1. The "ORBOLO" wordmark itself is **bold tracked sans-serif**, not serif — the serif face is reserved for smaller tracked-caps captions (e.g. "HELIOS EXT ROSLINDALE") and the pull-quote, not the primary logotype. Implementation now sets the site's `<h1>ORBOLO</h1>` in `font-body font-bold tracking-widest2`, and reserves `font-display` (serif) for `PathCard`/destination-page titles — matching the board's "serif caps for place names" convention, since path titles (Verdant, El Tapir, …) are exactly that.
2. The flat UI palette is **cream + deep forest green only** — gold/sky/tan tones appear exclusively inside photography, never as flat fills or accent colors. The originally-hypothesized `gold`/`sky` Tailwind tokens were invented, not sourced from the board, and have been removed; the underline accent and focus ring now use `cream` (on the dark card) instead.
3. Cards/photos in the board are separated by **whitespace, not visible borders** — the initial `border border-forest/20` on `PathCard`'s root was dropped in favor of grid `gap-*` spacing alone.

The broken-image fallback (`research.md` §5) was updated to a tonal forest gradient instead of the original invented sky→gold→forest gradient, for the same palette-fidelity reason.

## 8. Runtime data validation

- **Decision**: No runtime schema-validation library (e.g. zod) is introduced. `paths.json` is authored/versioned by the team (not user-submitted), and is statically typed via a shared `PathCard` TypeScript interface that the JSON is asserted against at import time (`satisfies PathCard[]`).
- **Rationale**: Constitution Principle V requires justification for new dependencies; trusted, versioned, build-time content doesn't need runtime validation the way user input or a future external Firebase source would. Revisit this decision when the data source migrates to Firebase (§3) — an external/mutable source is exactly the point where runtime validation becomes justified.
- **Alternatives considered**: zod/valibot schema validation — rejected for this phase per above; flagged as a likely future addition at Firebase-migration time, not introduced speculatively now.

## 9. Deployment target

- **Status**: Left open, per constitution ("**[NOT YET DECIDED — confirm before the first production deploy]**"). Not a blocker for this feature's plan/tasks/implementation, since it only affects hosting configuration, not application architecture. Vercel remains the constitution's noted natural default for this Next.js stack.

## Outcome

All Technical Context fields are resolved (no `NEEDS CLARIFICATION` remain). Proceeding to Phase 1.
