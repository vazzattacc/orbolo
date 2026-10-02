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

- **Stack**: TypeScript 5.x (strict mode) · **Astro**, with i18n routing, mostly plain HTML/CSS output and framework islands used only where a component genuinely needs client-side interactivity · Tailwind CSS for styling · pnpm as package manager · Vitest for unit/component tests · Playwright for end-to-end tests · ESLint + Prettier for linting/formatting. *(Superseded 2026-09-19: this project originally targeted Next.js/React/Framer Motion; the client's builder brief mandates Astro, so the stack changed accordingly. Any animation previously assumed to use Framer Motion — which requires a React runtime — is done instead with Astro's native View Transitions API or plain CSS transitions, unless a specific feature's `plan.md` justifies mounting an island framework for that one piece of UI.)*
- **Single verification command**: `pnpm run verify` → runs `astro check && eslint . && vitest run && playwright test`. This command going green is required before any task is considered closed (Principle II).
- **Persistence & deployment**: Hosting is **Firebase Hosting, EU region** (europe-west1 or europe-west3); the repository is a single **GitLab** repo (`/site` Astro, `/functions`, `/cms`); CI/CD via GitLab CI with merge-request preview channels and a production deploy from `main`. The project-wide content model (general pages, sections, partners, glossary, etc.) is expected to live in a headless CMS — **Sanity or Payload**, per the client's brief — but that choice is **not yet ratified here**: no feature should assume it until a feature's own `plan.md` confirms it. Firebase itself (Firestore/Auth/Storage) is reserved specifically for the future investor-portal phase, not for general site content. Individual features may still justify a narrower, self-contained data source (e.g. a small versioned JSON file) for their own scope — see that feature's `spec.md` for the justification — without that becoming the project's general content strategy.
- **Languages**: Specs, documentation, code, tests, and commits are all written in English. *(This project deviates from the kit's default of Spanish-language specs/documentation — English was chosen for this project and applies uniformly across every artifact.)*
- **Typography**: Titles — **HeliosExtC**. Body text — **Suisse Int'l**. Quotes — **Verbena**. Subtitles — **Roslindale Cyr Deck Narrow**. All four are commercial foundry fonts (not on Google Fonts/Fontsource); font files live in `public/fonts/<family>/` and are declared via `@font-face`, not npm-installed. *(Set 2026-09-19. This supersedes the client brief's own §B1 suggestion of Fraunces/Tiempos + Söhne/Inter — a deliberate override, not an oversight.)* **These four names are referential, not mandatory**: if a similar-looking, free-license font is found for any of them, it MAY be substituted at the implementer's discretion — the exact commercial family is not a hard requirement, unlike the colors below.
- **Colors**: Primary green (text/headings/functional elements) — `#516b3e`. Background — `#f8f4e9` (whitish, used mostly for backgrounds). **Accent** — `#bfd55d` (lime-green). *(Set 2026-09-19, accent added 2026-09-30. This supersedes the brief's own §B1 palette (`#F6F3EC`/`#1C1B18`/ochre/`#2E4A34`) — a deliberate override, not an oversight.)* **`#bfd55d` is an accent/fill color only — background blocks, button fills, borders, decorative elements — never running text (body copy or headings).** Vaz measured and confirmed this 2026-09-30: `#bfd55d` against `#f8f4e9` is 1.48:1 contrast either direction (text-on-cream or cream-text-on-an-accent-block), far below WCAG AA (4.5:1 text / 3:1 large text) — a knowing, explicit exception to Principle IX, scoped strictly to non-text accent usage, where the low-contrast pairing doesn't impede reading (a title, per the brief's moodboard reference, sitting over the fill needs its own separately-legible color, not `#f8f4e9`-on-`#bfd55d` or `#bfd55d`-on-`#f8f4e9`). Applies to **both existing and new UI** — this is a site-wide palette change, not scoped to one feature; `003-site-launch-essentials`'s own As-Is Freeze is amended accordingly (see that spec's Scope Change log). Three color tokens now, not two — expand this section further only as additional accents/text colors are deliberately decided, never inferred.
- **Assets**: Site images live in `public/images/<section>/` (e.g. `public/images/paths/` for the audience cards), referenced by plain path string from JSON config, per FR-013/FR-021. These images serve a **dual purpose**: they are used directly on the live site AND function as design/style references for the agent (mood, composition, tone) — there is no separate references-only image folder for site imagery specifically. (This is distinct from non-image reference material like the brief itself or a written moodboard doc, which still goes under `specs/_shared/references/` or a feature's own `references/` folder, per earlier convention.)

## Development Workflow

Per-feature flow: refinement (five pieces of natural-language input) → `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`, with a human gate after each step and one commit per phase. Supporting skills as needed: `/speckit-checklist`, `/speckit-analyze`, `/speckit-converge`, `/speckit-taskstoissues`.

## Governance

This constitution overrides any other project practice. It is amended only by a reviewed pull request, never by direct edit. Tooling (the Spec Kit version and the templates under `.specify/`) is updated by deliberate decision via PR, not by inertia — the CLI version in use is pinned and documented.

**Version**: 1.4 | **Ratified**: 2026-09-14 | **Last Amended**: 2026-09-30
