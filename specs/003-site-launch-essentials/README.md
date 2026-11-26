# 003 — Site launch essentials (shipped, legal pages gated)

Condensed 2026-11-17 from the original spec, plan, research, data model, contracts, checklist, quickstart and tasks (58/60 done). The full originals are in git history (`git show 7ee5391:specs/003-site-launch-essentials/spec.md`).

## Scope
404 page, per-page SEO meta + social preview, favicon set, robots/sitemap, Privacy/Terms behind an approval gate, a Privacy/Terms footer, alt-text and overflow guards, Plausible analytics. Deliberately left out: CTA above the fold, sticky mobile CTA, cookie banner (the brief says cookieless, no banner).

## Still open
- **T041** — Vaz (and counsel, if needed) approves the Privacy/Terms text and its review list, then sets `approved: true` in `src/content/legal/legal.json`. The review notes are stored on each entry. Main issue: the old Terms name "Orbolo GmbH" (Austria) as the investment counterparty, which contradicts the site's structure.
- **T045** — only after approval: add `privacy`/`terms` entries to `pageMeta.json`.

## Rules still in force → tests
| ID | Rule | Test |
|---|---|---|
| FR-404-001…004 | Unknown path → HTTP 404, branded page with nav, heading, one line, link home; noindex; not in sitemap; no photos | `not-found-page.spec.ts` |
| FR-SEO-001…005 | Unique title ("‹Page› — Orbolo") and description (40–220 chars, from approved page content only); full OG/Twitter set; canonical on `https://orbolo.com` | `seo-meta.spec.ts`, `page-meta-repository.test.ts` |
| FR-SEO-007/008 | `robots.txt` allows all and points to the sitemap; `/sitemap.xml` lists exactly the shipped indexable pages | `crawler-files.spec.ts` |
| FR-LEG-001…007 | Footer shows a legal link only when that document exists **and** is approved. Legal text is only ever fetched from orbolo.com, never written or paraphrased; meaning never rewritten; visible "last updated" | `footer-and-legal.spec.ts`, `legal-repository.test.ts` |
| FR-QA-001/002 | Every `<img>` has alt (empty only if decorative) | `image-alt-text.spec.ts` |
| FR-QA-004 | No horizontal overflow at 360/390/768/1024/1440 | `responsive-qa.spec.ts` |
| FR-AN-001…005 | Plausible page views only, no cookies, no storage, no banner; production domain only; non-blocking | `analytics.spec.ts` |
| SC-001 | Pinned titles/h1s; footer always after page content | `as-is-freeze.spec.ts` |

## Decisions (code comments cite these as R1, R5, R7, R8, R11, R12)
- **R1** — production host `https://orbolo.com` (`astro.config.mjs` `site`).
- **R5** — `getLegalDocument(kind)` returns `undefined` when the document is missing **or** unapproved; the footer and sitemap check only that.
- **R7** — one unconditional Plausible tag with `data-domain="orbolo.com"`; Plausible ignores other hosts.
- **R8** — `pageMeta` is its own collection (`{id, route, description, indexable}`), read by route via `getPageMeta()`. The 404 page has no entry.
- **R11** — `@astrojs/sitemap` was tried and removed; `/sitemap.xml` is the custom endpoint `src/pages/sitemap.xml.ts`.
- **R12** — Privacy/Terms fetched 2026-10-02 from `orbolo.com/privacy-policy` and `/terms-conditions`. Neither states its own date. Both are `approved: false`.
- Favicons and `og-default.png` were generated once with sharp and committed; they are not rebuilt.
