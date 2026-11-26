# AGENTS.md — Orbolo website

Standing instructions for any AI agent working in this repo. Read this at the start of every session so the user doesn't have to repeat it.

## The project

Marketing site for Orbolo (grass-fed cattle and beef from Paraguay's Gran Chaco). Astro 7, TypeScript (strict), Tailwind 4, GSAP + Lenis for motion, pnpm. English is the default locale; Spanish lives under `/es`.

## Which document wins

1. `.specify/memory/constitution.md`: process, stack, architecture. It overrides everything else.
2. `CLAUDE.md` "Design Taste" (2026-10-10): the current visual design (forest / paper / lime). The constitution's _Colors_ constraint still describes the old cream design and is stale. For design, follow `CLAUDE.md`. The constitution is amended only by a reviewed PR, so flag the conflict rather than editing it.
3. `README.md`: orientation notes. Where it disagrees with the code, trust the code.

## How work arrives: two modes

**Spec-driven (features).** New pages, new sections, new content types, structural refactors, or anything the user asks to spec. Use the Spec Kit flow: `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Stop for the user's approval after each step. Specs live in `specs/NNN-name/`, and the active one is in `.specify/feature.json`. Once a feature ships and its gates close, condense its folder into one `README.md` (rules still in force, FR → test map, decisions labelled R1…, open items) and delete the rest; git history keeps the originals.

**Direct requests (minor changes).** When the user asks for a specific change in chat (copy edit, style tweak, bug fix, moving strings around), do it directly, without a spec. Every rule below still applies, including verification. Stop and suggest the spec flow first if the request turns out to need any of these:

- a new page or section;
- a new dependency;
- a structural refactor;
- a change to what an approved spec requires.

If you do proceed with a change that contradicts a spec, say which requirement it changes, so the spec can be updated as a delta (Constitution VII).

## Content rules

- **All user-facing text lives in JSON**: `src/content/<name>/<name>.json`. It is read only through `src/lib/<name>/<name>-repository.ts`, with its Zod schema in `src/lib/<name>/schema.ts` and the collection registered in `src/content.config.ts`. Components never import JSON or `astro:content` directly, and never hard-code copy. New copy goes into JSON, never into `.astro` or `.ts` files.
- **Known gap:** `src/i18n/ui.ts` still holds the nav, footer, buttons, section headings, image alt texts and the Home hero. (The Contact page text moved to `src/content/contact/contact.json` on 2026-11-14.) A few labels are also hard-coded in `src/pages/privacy.astro` and `src/pages/terms.astro`. Don't add to either. Moving them into JSON is pending.
- **Both languages:** every localized string exists in English and Spanish, as JSON entries `<id>` and `<id>-es`. Privacy, Terms and 404 are English only.
- **Never invent data.** No made-up numbers, names, prices or "example" figures. If a fact doesn't exist yet, the section is hidden: no placeholder, no "coming soon". Every number renders with its date and source through `src/components/shared/MetricValue.astro`.
- **Legal wording:**
  - Orbolo facilitates and connects. It never takes the money.
  - No investment language. The product is "Remote Rancher" (never "Verdant"). The `/invest` URL stays.
  - No commercial terms: no prices, ticket sizes or percentage returns.
  - Never promise what isn't delivered today.
  - The banned-word list is in `specs/_shared/references/orbolo-website-brief.md` and is enforced by `tests/e2e/content-compliance.spec.ts`.

## Design and UI

- Follow `CLAUDE.md` Design Taste, including its anti-patterns. Reuse the shells in `src/components/ui/*`. Motion lives in `src/scripts/motion.ts`.
- **Design skills are mandatory for the work they cover** (Constitution X). Use them; don't design from memory.
  - `design-toolkit`: the router to use when unsure which skill applies.
  - `web-design-guidelines`: before and during UI work, and to audit changed files afterwards.
  - `image-to-code`: whenever a reference image, mockup or screenshot exists. Some are in `.specify/references/`.
  - `design-taste-frontend` / `high-end-visual-design`: direction for new sections or redesigns.
  - `taste`: the final aesthetic pass on new UI. After a real design change, re-run it against localhost so `CLAUDE.md` stays accurate.
- **Playwright is mandatory for UI changes.**
  - Before calling a UI change done, look at it in a real browser with the Playwright MCP (`mcp__playwright__*`) or the `playwright-cli` skill.
  - Check desktop (about 1440px wide) and mobile (about 390px wide), in English and Spanish.
  - Check for console errors and confirm the hover, focus and reduced-motion states.
  - Save screenshots to `.playwright-mcp/` or a temp directory, never the repo root.
  - New interactive behaviour gets an e2e test in `tests/e2e/`.
  - If the MCP shows `CONNECTION_CLOSED`, see README → "Playwright MCP".
- **Accessibility is a release gate:**
  - every text pairing passes WCAG AA;
  - everything works by keyboard, with visible focus states;
  - nothing depends on hover alone;
  - semantic markup;
  - reveal animations change opacity only;
  - all motion is skipped under `prefers-reduced-motion`.

## Engineering practices

- Match the surrounding code: naming, comment density and idioms. TypeScript stays strict, with no `any`. Formatting follows `.prettierrc.json`.
- Make the smallest change that does the job: no drive-by refactors or unrequested features. Structural refactors are features of their own, with their own spec.
- Add no new dependency without asking the user first. For a feature, also justify it in that feature's `plan.md`.
- Every requirement has a test. Repositories and schemas get unit tests in `tests/unit/`, and behaviour gets e2e tests in `tests/e2e/`. When copy changes, update the tests that pin the old copy. Never weaken or skip a test to get green.
- **Done means `pnpm run verify` is green.** It runs `astro check`, `eslint`, `vitest` and `playwright`. The e2e step starts the dev server on `localhost:4321` itself. If something fails, report the actual output. Never claim done while it's red.
- Write code, comments, tests, specs and commits in English.
- Git: work on the current feature branch. Don't commit or push unless the user asks. The user commits per stage (`stage N: …`).

## Map

```
src/content/<name>/<name>.json   copy and data (EN + ES entries)
src/lib/<name>/                  schema.ts + <name>-repository.ts (the only way to read content)
src/i18n/                        locale helpers; ui.ts = strings still to move to JSON
src/pages/[...lang]/             localized pages (/, /invest, /beef, /land, /about, /contact)
src/pages/                       privacy, terms, 404, sitemap (English only)
src/components/ui/               PhotoHero, Split, Edit, Band, CtaCollage, Btn
src/components/<page>/           page sections
src/scripts/motion.ts            all motion
public/images/<section>/         site imagery, referenced by path from JSON
specs/                           Spec Kit features (shipped ones = one README.md) + _shared/references (client brief)
.specify/references/             storyline, ecosystem protocol, Remote Rancher doc, moodboard images
tests/unit, tests/e2e            Vitest, Playwright
```

## Reporting back

Say which files changed, how the change was verified (the `verify` result and what you checked in the browser) and anything left undone or skipped. Keep it short and plain.
