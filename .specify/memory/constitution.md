# Orbolo Constitution

## Core Principles

### I. Spec Before Code
No feature enters development without a `spec.md` approved by a human. An ambiguous ticket is never handed directly to the agent: it first goes through refinement and the five pieces of natural-language input (objective, scope, acceptance criteria, non-goals, assumptions).

### II. Every Requirement Has Its Test
Every functional requirement is covered by at least one test that verifies it. The project's single verification command going green is the closing condition for any task — "looks like it works" is not a state.

### III. Human Review at Every Checkpoint
The agent writes; a person decides at every boundary: after specify, plan, tasks, and implement (see the kit's review checklist). Each approval is materialized as a commit. The same context that generated the work does not approve it.

### IV. Minimal, Curated Context
`CLAUDE.md` stays under ~15 lines and contains only what cannot be inferred from the repo. What the agent can already read in the code is not repeated to it. This constitution overrides any other context file.

### V. No New Dependencies Without Justification
No dependency is added without written justification in the `plan.md` of the feature that needs it. The project's stack is decided by the project, not by the agent.

### VI. Declared Architecture Is Respected
New features respect the project's declared structure (layers, folders, conventions). Structural refactors are features of their own, with their own spec — never a side effect of another feature.

### VII. Scope Changes Land as a Delta
A requirements change is described as a delta (added / modified / removed), folded into the spec, and reconciled via `/speckit-converge`. The spec is never edited silently.

### VIII. Content, Presentation, and Interaction Stay Decoupled
Content (copy, imagery, destinations, and any other editorial data) is never coupled to a component's structure or logic. UI components render whatever configuration/data they're given and carry no knowledge of which specific item — which path, which page, which product — they happen to be displaying at runtime. If a component's implementation would need to change just because a content value changes, this principle has been violated. Content lives in an isolated data-access layer (currently versioned JSON; swappable for a real database or CMS later) that components consume through a stable interface, never directly.

### IX. Accessibility Is a Release Gate, Not a Polish Pass
Keyboard operability, visible focus states, semantic markup, sufficient color contrast, and respect for the user's reduced-motion preference are required for every interactive feature before it ships — not backfilled afterward. No interaction may depend exclusively on hover; a mouse-only interaction is an incomplete feature, not a feature that's "done except for accessibility."

### X. Installed Skills Are Mandatory for the Work They Cover
This project has skills installed specifically to raise the quality of its output, and using them is not optional when the task falls in their scope:
- **`web-design-guidelines`** MUST be consulted before and during any new UI/component work, so visual decisions are grounded in the project's established design standards rather than ad hoc choices.
- **`image-to-code`** MUST be used whenever a reference image, moodboard, mockup, or screenshot is available for the work at hand, so implementation is derived from that visual reference directly rather than approximated from a text description alone.
- **`taste`** MUST be run as a final aesthetic/quality pass on any new UI output before it is presented as done.
- **`playwright`** MUST be used to add end-to-end coverage for new interactive flows before a feature is considered complete (this is how Principle II is satisfied for UI behavior specifically).

An applicable skill that goes unused is a deviation from this constitution and must be flagged and justified (per Principle V's standard for deviations), not silently skipped. If a new skill is added to the project later, it is added to this list in the same PR that introduces it — this list is never allowed to drift out of date with what's actually installed.

## Additional Constraints

- **Stack**: TypeScript 5.x (strict mode) · Next.js (App Router) · React · Tailwind CSS for styling · Framer Motion for transitions/animation · pnpm as package manager · Vitest for unit/component tests · Playwright for end-to-end tests · ESLint + Prettier for linting/formatting. *(This is the recommended default for a content-driven, animation-forward marketing site with a future backend migration in view — swap any piece by amending this section, with justification, per Principle V.)*
- **Single verification command**: `pnpm run verify` → runs `next lint && tsc --noEmit && vitest run && playwright test`. This command going green is required before any task is considered closed (Principle II).
- **Persistence & deployment**: Content (path/page configuration, long-form copy, destinations) is sourced from a versioned JSON file in this initial phase, accessed only through an isolated data layer so it can be swapped for a Firebase database later with no structural changes to components. Deployment target: **[NOT YET DECIDED — confirm before the first production deploy; Vercel is the natural default for this Next.js stack, but is not assumed here]**.
- **Languages**: Specs, documentation, code, tests, and commits are all written in English. *(This project deviates from the kit's default of Spanish-language specs/documentation — English was chosen for this project and applies uniformly across every artifact.)*

## Development Workflow

Per-feature flow: refinement (five pieces of natural-language input) → `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`, with a human gate after each step and one commit per phase. Supporting skills as needed: `/speckit-checklist`, `/speckit-analyze`, `/speckit-converge`, `/speckit-taskstoissues`.

## Governance

This constitution overrides any other project practice. It is amended only by a reviewed pull request, never by direct edit. Tooling (the Spec Kit version and the templates under `.specify/`) is updated by deliberate decision via PR, not by inertia — the CLI version in use is pinned and documented.

**Version**: 1.0 | **Ratified**: 2026-09-14 | **Last Amended**: 2026-09-14
