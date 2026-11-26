# Orbolo website

Marketing site for Orbolo. Working rules for agents and people: `AGENTS.md`. Visual design: `CLAUDE.md`. Governance: `.specify/memory/constitution.md` (its Colors section is stale; see AGENTS.md "Which document wins").

## Commands
- `pnpm dev`: dev server on `localhost:4321`
- `pnpm run verify`: `astro check`, eslint, vitest, playwright. It must be green before anything counts as done.

## Specs
- `specs/001`–`004`: shipped, each condensed into one `README.md` (rules still in force, test map, decisions R1…). The full originals are in git history.
- `specs/005-contact-form`: active (see `.specify/feature.json`).
- `specs/_shared/references/orbolo-website-brief.md`: the client brief, including the banned-word list.

## Branches
Current work: `development` and `feature/*` branches. `spec-1`, `spec-1-2`, `spec-2` and `try-with-astro` are abandoned earlier attempts (Next.js prototype; a separate Keystatic rebuild). Don't reuse their code or content model.

## Playwright MCP
If `claude mcp list` shows `CONNECTION_CLOSED`:
1. Restart Claude Code. Most often it's a stale connection from a previous session.
2. If it still fails, run `claude mcp remove playwright`, then `claude mcp add playwright -s user -- npx -y @playwright/mcp@latest --isolated`, then restart again.

The first connection downloads Chromium (about 100 MB). To get that out of the way first, run `npx -y @playwright/mcp@latest --isolated` once on its own.
