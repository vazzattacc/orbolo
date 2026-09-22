# Phase 0 Research: Orbolo Website — Home Page Audience-Path Selector

**Feature**: `001-orbolo-path-selection` | **Date**: 2026-09-19

All Technical Context items are fixed by `.specify/memory/constitution.md` (Additional Constraints, amended 2026-09-19 to Astro) rather than left open — there are no `NEEDS CLARIFICATION` markers to resolve. This phase instead covers the architecture/interaction-pattern decisions needed to implement the spec's two-step flip-then-discover selection inside that fixed stack.

## 1. Stack confirmation (no NEEDS CLARIFICATION remain)

- **Decision**: TypeScript 5.x (strict) · Astro · Tailwind CSS · pnpm · Vitest · Playwright · ESLint + Prettier — exactly as declared in the constitution's 2026-09-19 amendment.
- **Rationale**: Constitution Principle V assigns stack ownership to the project, not the agent; the constitution has already made this decision, superseding the feature's original Next.js/React/Framer Motion plan.
- **Alternatives considered**: None evaluated — re-litigating the stack here would violate Principle V and the constitution's own governance clause.

## 2. Flip/disclosure interaction mechanism

- **Decision**: A small vanilla-TypeScript `<script>` module (`src/scripts/path-card-flip.ts`), loaded once and operating on all `PathCard` instances via a shared class/data-attribute contract — not a native `<details>`/`<summary>` element, and not a mounted island framework.
- **Rationale**: FR-025 explicitly allows "a minimal island, a native disclosure pattern (e.g. `<details>`), or a small client-side script." `<details>`/`<summary>` was evaluated first since it's the cheapest option, but two hard requirements rule it out: (a) FR-016 requires the flip trigger to be a real `<button>` exposing `aria-expanded`, which is the correct pattern for a *toggle* but is not how `<summary>` behaves (browsers expose `<summary>` with `aria-expanded` only inconsistently, and its default keyboard/focus behavior doesn't match "focus moves to 'Discover more' on open" from FR-004/acceptance scenario 1 of User Story 2); (b) the "flip back on Escape, focus returns to the trigger" acceptance scenario needs custom `keydown` handling `<details>` doesn't provide for free. A vanilla script satisfies both without pulling in a component framework, keeping FR-025's "not a full application framework" constraint intact.
- **Alternatives considered**:
  - *Native `<details>`/`<summary>`* — rejected per above; kept as the documented "simpler alternative" per FR-025's own phrasing, but its accessibility/focus gaps against this spec's specific acceptance criteria are the reason it's not chosen.
  - *A React/Preact/Svelte island just for the card* — rejected: violates FR-025's "not by mounting a full application framework for this section alone," and the constitution's Astro amendment explicitly frames islands as "used only where a component genuinely needs client-side interactivity" at minimal scope — a toggle + focus move does not need a component framework's reactivity model.

## 3. Flip animation & the "Discover more" destination transition

- **Decision**: The card flip is a CSS 3D transform (`perspective` + `rotateY`) driven by a single boolean data-attribute/class the script toggles; the transition into the destination page uses Astro's native View Transitions (`<ClientRouter />`, `astro:transitions`), not Framer Motion.
- **Rationale**: The constitution's amendment explicitly redirects prior Framer-Motion-based animation plans to "Astro's native View Transitions API or plain CSS transitions... unless a specific feature's `plan.md` justifies mounting an island framework for that one piece of UI" — no such justification exists here, so the default applies. Astro's View Transitions respect `prefers-reduced-motion` automatically at the framework level, directly satisfying the destination-transition half of FR-019 with no extra code; the flip's CSS transition is gated separately (see §6) for the same requirement's other half.
- **Alternatives considered**: Framer Motion — rejected, requires a React runtime the stack no longer uses (constitution). A JS-driven flip animation (manually tweening rotation) — rejected as unnecessary complexity; CSS `transition`/`transform` already achieves the required effect with the browser's own compositor, and is trivially disabled under reduced motion via a media query.

## 4. Content/presentation decoupling mechanism

- **Decision**: An Astro Content Collection named `paths` (`src/content.config.ts`, backed by `src/content/paths/paths.json` via Astro's built-in `file()` loader) is the sole point where card content enters the system. A thin `src/lib/paths/path-repository.ts` module wraps `getCollection('paths')` and exposes `getPaths(): Promise<PathCard[]>`; `PathGrid`/`PathCard` accept already-resolved `PathCard[]`/`PathCard` props and never import the collection or JSON directly.
- **Rationale**: Constitution Principle VIII and FR-021 require an isolated data-access layer so JSON can be swapped for Firebase later "with no structural changes to `PathCard` or `PathGrid`." Content Collections are the idiomatic Astro mechanism for exactly this: the collection's `loader` is the only piece that would change to point at a Firebase-backed source later (Astro loaders are a documented extension point for custom data sources), while `getPaths()`'s signature and every component consuming it stay identical. This also gives schema validation (via Astro's bundled Zod) "for free," directly supporting the data-model's validation rules without adding a new dependency (Zod ships as part of Astro's content layer, not as a project-added package).
- **Alternatives considered**: A hand-rolled `fs.readFileSync` + `JSON.parse` module (as the original Next.js-era plan used) — viable and simpler, but rejected in favor of Content Collections because the swappable-loader story is more direct evidence of satisfying FR-021's explicit "swappable for a Firebase database" requirement, and schema validation would otherwise have to be hand-written or given its own new dependency.

## 5. Broken-image fallback

- **Decision**: Each `PathCard`'s image sits in a wrapper element carrying a CSS class that paints the constitution's fallback background (built from the two ratified brand colors) behind the `<img>`. The `<img>` carries an inline `onerror` attribute that adds a `--fallback` modifier class to the wrapper, hiding the broken `<img>` box in favor of the CSS background. No second image asset is required per card.
- **Rationale**: Directly satisfies FR-022 without requiring content editors to author a per-card fallback asset. An inline `onerror` handler is the minimal-JS option consistent with FR-025's "small client-side script, not a framework" spirit, and works even though the flip script itself does not need to be involved.
- **Alternatives considered**: A JS `<script>`-based `error` event listener attached after hydration — rejected as unnecessarily indirect for a single-purpose, per-image concern; the inline handler is simpler and has no dependency on script load timing.

## 6. Accessibility & motion mechanics

- **Decision**:
  - Flip trigger: a real `<button type="button" aria-expanded="false">` wrapping the card's front face; the script toggles `aria-expanded` and moves focus to the "Discover more" anchor on open (FR-004, FR-016, User Story 2 scenario 1).
  - Flip-back: reactivating the trigger, or pressing `Escape` while the card is open, flips it back and returns focus to the trigger (FR-005, User Story 2 scenario 2).
  - "Discover more": a real `<a href="{destination}">`, always present in the DOM regardless of flip state, so it's reachable without JS (FR-024).
  - `prefers-reduced-motion: reduce` collapses the flip's CSS transition to near-instant (duration ≈ 0) and relies on Astro View Transitions' own reduced-motion handling for the destination transition (FR-019).
  - Flipped/selected/focus states are each communicated with a visible outline/label change, never color alone (FR-010/FR-018).
  - `alt` text is a required, non-empty field on every `PathCard` JSON entry (FR-017), enforced by the content collection's Zod schema (non-optional `z.string().min(1)`).
- **Rationale**: These map 1:1 onto FR-004/005/010/016/017/018/019/024 and Constitution Principle IX (accessibility as a release gate, not a polish pass). `web-design-guidelines` (installed skill, Principle X) is the authority for exact contrast ratios and semantic-markup review during implementation, not re-derived here.

## 7. Design tokens

- **Decision**: Typography and color tokens are taken as already-fixed by the constitution (2026-09-19 amendment): titles in HeliosExtC, body in Suisse Int'l, quotes in Verbena, subtitles in Roslindale Cyr Deck Narrow (all four referential/substitutable); `#516b3e` (green, primary accent) and `#f8f4e9` (whitish, primary background) as the two fixed colors. No moodboard *token* extraction is performed in this pass.
- **Rationale**: The prior plan's Phase 0 extracted tokens from `Orbolo_Editorial_Continuous.pdf`; the constitution now states those extracted values, and the brief's own suggested palette, are both explicitly superseded ("Resolved 2026-09-19" in spec.md's Scope Change). Re-deriving typography/color tokens from the old moodboard would reintroduce values the project has already overridden.
- **Alternatives considered**: N/A — token *values* are a project-level decision already made in the constitution, not an open research question for this feature (Principle V's "stack decided by the project" logic extends to declared design tokens). This does **not** extend to card photography selection — see §9.

## 9. Card imagery sourcing

- **Decision**: The three cards' `image.src` assets are sourced from `.specify/references/` — `cow.png`, `green_ranch.png`, `green_ranch_2.png`, `nature.png`, `nature_agriculture.png`, `beef_meet.png`, `beef_related.png` are candidate photographs, evaluated and selected (or replaced with better-fitting sourced photography) during implementation via the mandatory `image-to-code` skill pass (Constitution Principle X), then copied into `public/images/paths/` — the live, versioned location `image.src` in `paths.json` points to. `orbolo-logo.png` is the site's brand mark, unrelated to card imagery, and out of this feature's scope. `Orbolo_Editorial_Continuous.pdf` remains relevant only for photographic treatment/tone (framing, color grading), not for the typography/color tokens it also contains, which are superseded (§7).
- **Rationale**: FR-020 requires "authentic photographs of Paraguay" without forcing uniform terrain across the three cards, and explicitly forbids imposing a single landscape type (e.g. mountainous) since Paraguayan terrain is predominantly flat/low-relief. The candidate set's varied compositions (open pasture, grazing cattle, farmhouse-in-fields) are consistent with that requirement in kind, but a specific per-card assignment (e.g. `green_ranch.png` → Landowners, `cow.png`/`beef_related.png` → Buyers) is a content decision for implementation, not this planning phase — Constitution Principle VIII keeps that decision in the data layer (`paths.json`), not hardcoded into a component, and the `image-to-code` skill (not this document) is the constitution's designated authority for the actual visual judgment call.
- **Alternatives considered**: Assigning specific files to specific cards now, in this plan — rejected: premature, since none of these files are yet confirmed to be genuine Paraguay photography versus generic/stock placeholders (their content should be verified, not assumed from filename alone), and Principle X reserves that judgment for the `image-to-code` skill pass during implementation, not the planning phase.

## 8. Card-count degradation (fewer than 3 configured)

- **Decision**: `PathGrid` renders whatever `PathCard[]` it receives — 0, 1, 2, 3, or more — with no assumption the count is exactly 3; the grid layout uses a responsive auto-fit/wrap strategy rather than a hardcoded 3-column layout, so it degrades gracefully rather than leaving visibly empty slots.
- **Rationale**: Spec Assumptions and FR-008/SC-001 explicitly require the architecture not assume "3" is structurally fixed, even though 3 is the full initial set. This resolves the still-open Edge Case ("Should the section always assume exactly three, or degrade gracefully to fewer?") in favor of graceful degradation, consistent with how the same open question was resolved for the prior 5-path version of this spec.
- **Alternatives considered**: Hardcoding a 3-up grid — rejected, directly conflicts with FR-008's data-driven requirement and would require a code change if a 4th audience/card were ever added, which the spec explicitly anticipates as a possibility (User Story 4, acceptance scenario 2).
