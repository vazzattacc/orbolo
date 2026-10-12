# Tasks — 004 Rewriting content (text only)

Source copy: `plan.md` → "Copy deck". Scope: text only — no markup, class, section, route, id or motion changes. No commit.

## Phase 1 — Setup
- [x] T001 Confirm sources: `.specify/references/orbolo_storyline.md`, `orbolo_ecosystem_protocol.md`, `remote_rancher.md` §1–4 only (stop at "5. This is business, not charity")
- [x] T002 Confirm guardrails: brief §1 language rules, §B2 banned words, §17 non-negotiables; schema limits (7 steps, meta 40–220 chars)

## Phase 2 — Home
- [x] T003 `src/pages/index.astro`: new h1 + side line; strip fallback words without "Capital"
- [x] T004 `src/content/paths/paths.json`: card titles, audiences, descriptions (keep ids, images, alts, destinations, order)

## Phase 3 — Remote Rancher page (`/invest`)
- [x] T005 `src/pages/invest.astro`: title "Remote Rancher — Orbolo"
- [x] T006 `src/content/invest/invest.json` hero + offer box + terms note (must contain "request", no `$` figures)
- [x] T007 `invest.json` isThisReal, whoBuysAtEnd, whatIfNotEnough
- [x] T008 `invest.json` whatIfWrong (5 categories; note keeps "data room" + "NDA")
- [x] T009 `invest.json` howItWorks (exactly 7 steps), whatYouOwn, whoVerifies
- [x] T010 `invest.json` FAQ (6 items) + closing (release line, CTA labels); cross-link unchanged

## Phase 4 — Beef
- [x] T011 `src/content/beef/beef.json`: hero, whatWeSellToday, promise, firstPick, whySupplyDifferent (whoVerifies, CTAs, cross-link unchanged)

## Phase 5 — Land, Contact, Nav, Meta
- [x] T012 `src/content/land/land.json`: El Tapir intro (no "expansion"), Ganadería a Pasto body
- [x] T013 `src/components/land/WorkWithUs.astro`: body line
- [x] T014 `src/pages/contact.astro`: replace internal placeholder note with visitor-facing line
- [x] T015 `src/components/Nav.astro`: label "Invest" → "Remote Rancher" (href stays `/invest`)
- [x] T016 `src/content/pageMeta/pageMeta.json`: five descriptions without invest wording

## Phase 6 — Tests that freeze copy
- [x] T017 `tests/e2e/as-is-freeze.spec.ts`: h1s (/, /invest, /beef) + /invest title
- [x] T018 `tests/e2e/seo-meta.spec.ts`: /invest title + og:title
- [x] T019 `tests/e2e/nav-bar.spec.ts`: nav label
- [x] T020 `tests/e2e/invest-page.spec.ts`: last h2 + FAQ question

## Phase 7 — Verify
- [x] T021 Wording scan: `grep -rniE "invest|verdant|capital|return" src/content src/pages src/components` → only code identifiers/routes
- [x] T022 Banned-word scan of all new copy (brief §B2.6/7)
- [x] T023 `pnpm astro check` · `pnpm lint` · `pnpm test:unit` · `pnpm exec playwright test`
- [x] T024 Screenshots at 1440 and 390 for Home, Remote Rancher, Beef, Land, Contact — no layout breakage
- [x] T025 Stop the dev server; leave everything uncommitted

## Review notes
- Review 1 (plan → tasks): every copy-deck block maps to exactly one task; T006–T010 split invest.json by section so each edit is checkable against the plan.
- Review 2 (risks): `/invest` URL, path id `investors` and `investors.jpg` stay. They're structure, and tests route on them. Nothing from remote_rancher.md §5+ (prices, %, exit, Q&A) is used.
- Review 3 (after implementation): at 360px the longer "Remote Rancher" nav label pushed Contact onto a second row; mobile nav link gap tightened 1.3em → 0.9em in `src/styles/global.css` (spacing only) so the bar stays one row. Remaining wording-scan hits are only in `src/content/legal/legal.json` (unapproved, not rendered; legal text not rewritten here) and a code comment.
