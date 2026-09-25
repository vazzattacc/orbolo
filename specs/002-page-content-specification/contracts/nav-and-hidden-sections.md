# Contract: Navigation Bar & Hidden-Section Rendering

## Navigation bar (`FR-GEN-009`, `SC-007`)

`Nav.astro` renders a fixed, hardcoded link list (see `research.md` §3 for why it's not content):

```ts
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Invest", href: "/invest" },
  { label: "Beef", href: "/beef" },
  { label: "Land", href: "/land" },
  { label: "Contact", href: "/contact" },
] as const;
```

**Contract**:
- Rendered as a semantic `<nav aria-label="Primary">`, present on all four pages (Home, Invest, Beef, Land) via `Layout.astro`.
- Every link is a real `<a href>` — keyboard-reachable via native Tab order, no `onClick`-only interaction (Constitution Principle IX).
- At mobile widths, the bar MUST NOT overlap or crowd out the page's hero content (`spec.md` Edge Cases) — a collapsed/hamburger pattern is acceptable, implementation left to the task that builds `Nav.astro`, but whatever pattern is chosen must keep every link keyboard-reachable when expanded.
- The active page's link SHOULD be visually distinguishable (e.g. `aria-current="page"`) — not spec-mandated, but the immediate, low-cost accessibility win the constitution's Principle IX release-gate expects by default.
- `Contact` always renders and links to `/contact` (the stub page) — it is not conditional on any content existing, per `research.md` §4's exception for the nav bar (`OQ-015`'s destination is still pending, but the link's *presence* is not).

## Hidden-section rendering (`spec.md` Clarifications, Session 2026-09-24)

**Contract**: A section whose backing content is absent (per `data-model.md`'s optional fields) is omitted from the rendered DOM entirely — not rendered with `display:none`, not `aria-hidden`, not a skeleton/placeholder component. This applies to:

| Section | Page | Hidden when |
|---|---|---|
| Deployment Pipeline | Invest | `investPage.deploymentPipeline` absent or `ranchSlugs` resolves to 0 ranches |
| "Who verifies what" verifier list | Invest, Beef | `whoVerifies.verifiers` absent (the generic Code-reference sentence still renders unconditionally — `OQ-003` partial) |
| Partner ranches | Land | `landPage.partnerRanches` absent or `ranchSlugs` resolves to 0 ranches |
| El Tapir expansion-target line | Land, Invest | `elTapir.expansionTargetNote` absent |
| Roadmap | Beef | `beefPage.roadmap` absent or `milestones` is empty |

**Test implication**: every e2e spec for a page with a conditionally-hidden section MUST assert both states are reachable in principle — the "present when content exists" case (using a test fixture with the field populated, matching `001`'s own `path-card-config-driven.spec.ts` pattern of mutating a JSON fixture under test) and the "absent when content doesn't exist" case (the real, shipped content today, since every one of the sections above genuinely has no data yet). Do not assert only the current real-content state — that would leave the "must hide correctly" behavior itself untested.
