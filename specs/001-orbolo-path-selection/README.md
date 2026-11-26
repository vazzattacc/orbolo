# 001 — Home audience-path selector (shipped)

Condensed 2026-11-17 from the original spec, plan, research, data model, contracts, quickstart and tasks (41/41 done). The full originals are in git history (`git show 7ee5391:specs/001-orbolo-path-selection/spec.md`).

## Scope
Home opens with a hero; below it, three flip cards (Remote Rancher → `/invest`, Beef → `/beef`, Land → `/land`) built from `src/content/paths/paths.json` through `getPaths()` (`src/lib/paths/`). Field rules: `src/lib/paths/schema.ts` and `src/content/paths/README.md`.

## Requirements still in force → tests
| ID | Rule | Test |
|---|---|---|
| FR-001/002 | Hero first; cards not in the first viewport; exactly the configured cards, each with image, title, description | `home-hero-cards.spec.ts` |
| FR-004/005 | Click flips to the back (description + "Discover more"); the flip never navigates; clicking again flips back | `path-card-flip.spec.ts` |
| FR-006/023/024 | "Discover more" is a real `<a href>` to an internal route, in the DOM in every state, works without JS | `path-card-navigation.spec.ts` |
| FR-007/008/014/015/021 | One generic `PathCard`; cards come only from JSON; editing JSON needs no component change | `path-card-config-driven.spec.ts`, `tests/unit/path-repository.test.ts` |
| FR-009/011/016 | Mouse, keyboard and touch for flip-open, flip-back, Discover; trigger is a `<button aria-expanded>`; nothing hover-only | `path-card-keyboard.spec.ts`, `path-card-touch.spec.ts` |
| FR-012/013 | Layout adapted (not scaled) for desktop/tablet/mobile; grid tolerates any card count | `path-grid-responsive.spec.ts` |
| FR-017 | Non-empty alt on every card image (schema-enforced) | `path-repository.test.ts` |
| FR-019 | Reduced motion: flip near-instant, page transition minimised | `reduced-motion.spec.ts` |
| FR-022 | Broken image → branded fallback background, card still works | `path-card-fallback.spec.ts` |

FR-003 (cream/green tokens) is superseded by the CLAUDE.md design (2026-10-10). Flip state is never persisted. No analytics on the cards.

## Decisions (code comments cite these as R2, R3, R6)
- **R2 — flip script.** Vanilla TS in `src/scripts/path-card-flip.ts`, not `<details>` (needs a real `<button aria-expanded>` and focus moves) and not a framework island.
- **R3 — animation.** Flip = CSS 3D transform (`perspective` + `rotateY`) toggled by one data attribute. Page transition = Astro View Transitions (`<ClientRouter />`).
- **R4 — data layer.** Astro content collection `paths` + `getPaths()`; components never import JSON.
- **R5 — fallback.** Inline `onerror` adds `path-card__image-wrap--fallback`; the wrapper paints the brand background.
- **R6 — a11y/motion.** Opening moves focus to "Discover more"; Escape or the trigger flips back and returns focus to the trigger; reduced motion collapses the flip transition; states never shown by colour alone.
