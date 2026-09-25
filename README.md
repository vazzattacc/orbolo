# Orbolo website — notes to self

Internal orientation notes, not a public-facing README. Written 2026-09-24 on
branch `feature/page-content-specification`. If something here looks stale,
trust the code/`.specify/` over this file and update it.

## Which branch is "the" project?

This repo has several branches representing **different, mostly incompatible
attempts** — don't assume they share a codebase:

- `spec-1`, `spec-1-2` — early Next.js/React prototype of the path-selector concept.
- `spec-2` — a **separate, much larger** full-site rebuild (`002-orbolo-website`):
  Astro + Keystatic CMS, i18n, a rich content model (Ranches, LOIs, Metrics,
  Glossary, The Code, a full page set). It was never merged and is unrelated
  to the branch you're probably on. Don't go looking for its content model
  here — it doesn't exist on this line of branches.
- `try-with-astro` → **`feature/page-content-specification`** (current, most
  likely where you are) — a from-scratch Astro rebuild of just the Home page
  path-selector (`001-orbolo-path-selection`), now being extended with real
  content for the Invest/Beef/Land pages (`002-page-content-specification`).
  This is the active line of work.

Check `git branch --show-current` and `.specify/feature.json` before assuming
which spec applies.

## The core content rule: never invent data

This is the single most important project-wide constraint, and it's not just
style — it's legal (client/counsel liability). Anywhere a real number, name,
or fact doesn't exist yet:

- **The section renders hidden entirely** — not a "coming soon" placeholder,
  not a skeleton, not a TBD label. Confirmed explicitly 2026-09-24 (see
  `specs/002-page-content-specification/spec.md`, Clarifications).
- Every number that *does* render must carry a visible date + source
  (`Metric` entity — `key/value/unit/asOfDate/sourceDocumentRef`). A metric
  missing either field silently doesn't render, rather than rendering with a
  blank date.
- If you're tempted to add a "generic example" number to make a section feel
  less empty — don't. This was explicitly asked and explicitly declined
  (OQ-013 in the spec) for exactly this reason.

If you're extending this later, keep using the `getX()` repository-function
pattern for any new content type — see below.

## Content architecture (no CMS, no DB)

Every collection follows the same shape, first established by
`001-orbolo-path-selection`'s `paths` collection and reused for
`002-page-content-specification`:

```
src/content/<name>/<name>.json      # the actual data, versioned in git
src/lib/<name>/schema.ts            # Zod schema (source of truth for shape)
src/lib/<name>/<name>-repository.ts # getX(): the ONLY way a component reads this data
src/content.config.ts               # registers the collection with Astro
```

Components never import `astro:content` or a JSON file directly — always go
through the repository function. This is a hard rule (Constitution Principle
VIII), not a suggestion, and it's what makes "swap this for a real CMS/DB
later" possible without touching every page.

## Design tokens are frozen (mostly)

- Colors: `#516b3e` (green, text/most accents) and `#f8f4e9` (cream,
  background) — see `.specify/memory/constitution.md`. Only two colors,
  deliberately.
- Fonts (HeliosExtC / Suisse Int'l / Verbena / Roslindale Cyr Deck Narrow)
  are **referential, not mandatory** — the constitution explicitly allows a
  free-license lookalike. No commercial font files are bundled yet; check
  `src/styles/global.css`'s `@theme` block for whatever's currently mapped.
- `CLAUDE.md` has a generated "Design Taste" section from running `/taste`
  against the local dev server — full analysis in `orbolo-localhost.md` /
  `.json` at the repo root. **This reflects the current, simpler 2-color/
  16px-or-pill-radius direction** — don't confuse it with
  `.specify/references/Orbolo_Editorial_Continuous.pdf`, an earlier, more
  elaborate "editorial agriculture" moodboard from the abandoned `spec-2`
  line that this branch does *not* follow.
- Any actual design change should go through `/taste` again against the
  running site so `CLAUDE.md` stays accurate — don't hand-edit its Design
  Taste section.

## Open Questions (OQ-xxx) pattern

`specs/002-page-content-specification/spec.md` tracks every piece of content
the brief left unresolved as a numbered `OQ-001`, `OQ-002`, etc., each
explicitly marked resolved / partially resolved / deliberately deferred, with
who said what and when. This turned out to be a genuinely useful pattern for
"real business facts I don't have yet" — worth reusing verbatim in future
specs rather than letting placeholders sit as vague TODOs.

## Playwright MCP

`/taste` and any live-browser design work needs the Playwright MCP server
connected (`claude mcp list`). If it shows `CONNECTION_CLOSED`: restart
Claude Code completely first (most common fix — stale connection from a
previous session); if that doesn't work, `claude mcp remove playwright` then
re-add it (`claude mcp add playwright -s user -- npx -y @playwright/mcp@latest --isolated`)
and restart again. First connection after installing can be slow (~100MB
Chromium download) — pre-warm with a bare `npx -y @playwright/mcp@latest --isolated`
run if that's suspected.

## Where to look for more

- `.specify/memory/constitution.md` — the actual governing rules (stack,
  colors, verification command, workflow). Overrides everything else,
  including this file.
- `specs/002-page-content-specification/spec.md` — current feature spec,
  Approved 2026-09-24, has the full Open Questions history.
- `specs/002-page-content-specification/plan.md` + `research.md` +
  `data-model.md` + `contracts/` — the technical plan (content architecture,
  hidden-section contract, repository function signatures) for building
  Invest/Beef/Land.
- `pnpm run verify` — the single command that must be green before any task
  is considered done (Constitution Principle II).
