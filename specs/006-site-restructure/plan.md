# Implementation Plan: Unified Site Restructure (Capital · Markets · Opportunities · About)

**Branch**: `006-site-restructure` (directory name; the working tree is on `feature/designTest`, no branch was created) | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: `specs/006-site-restructure/spec.md`. Planning started at Vaz's request ("start /speckit-plan", 2026-11-25).

## Summary

Rebuild the public site around the 2026-11-22 copy deck: Home, Capital, Markets, Opportunities, About, Contact (page and panel), Media kit and a new 404, in the existing design. All text moves to JSON under the deck's keys. The five deck forms are visible; while there is no server and no privacy approval they validate and then do nothing. The order form waits for Florian. English only for now, with a Spanish slot.

The aim of this first delivery is **a site on which Vaz can see the new design** (spec, 2026-11-25). Sending is implemented against a mock, because the spec requires it, and stays closed.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Astro 7 static output

**Primary Dependencies**: existing only: Tailwind 4, GSAP 3.13, Lenis 1.3, sharp (build). **No new dependency**

**Storage**: versioned JSON content collections; no browser storage, no cookies

**Testing**: Vitest (unit), Playwright + axe (e2e: dev server and production build), `pnpm run verify`

**Target Platform**: static site, current evergreen browsers; works without JavaScript where the spec says so

**Project Type**: static marketing site (single project)

**Performance Goals**: Lighthouse mobile ≥ 90 on five pages, CLS 0 from images (SC-008)

**Constraints**: WCAG 2.2 AA; CLAUDE.md Design Taste tokens and shells; copy verbatim; no third party except Plausible

**Scale/Scope**: 8 page types, 12 new or changed collections, 5 forms, about 35 components, 36 e2e and 16 unit test files to keep, rewrite or remove

Nothing is marked NEEDS CLARIFICATION. The points that needed Vaz are answered under "Decisions by Vaz".

## Constitution Check

| Principle | Before research | After design |
|---|---|---|
| I Spec before code | Planned while the spec was Draft, at Vaz's request | Pass: spec approved by Vaz 2026-11-25 |
| II Every requirement has its test | Pass: FR → test map below; three criteria stay manual (research R15) | Pass |
| III Human review per checkpoint | Pass: stops here; nothing committed | Pass |
| IV Minimal context | CLAUDE.md is longer than 15 lines today; not changed here | same |
| V No new dependencies | Pass | Pass |
| VI Architecture respected | Pass: the restructure is this feature's own subject; repository/schema/JSON layers kept | Pass |
| VII Deltas | One spec point could not be built as written (P1) | Pass: delta approved by Vaz 2026-11-25 and folded into the spec |
| VIII Content decoupled | Pass: photos, links and actions also come from JSON | Pass |
| IX Accessibility gate | Pass: contracts and axe on every page and panel | Pass |
| X Skills mandatory | `web-design-guidelines` before and after UI work, `playwright` for every flow, `taste` at the end, `image-to-code` only if a mockup appears (none exists for 006) | same; scheduled in stages 2–9 |

Known conflict, not touched: the constitution's *Colors* line is stale; CLAUDE.md governs design (AGENTS.md).

## Project Structure

### Documentation (this feature)

```text
specs/006-site-restructure/
├── spec.md
├── plan.md                        this file
├── research.md                    decisions, photo proposal (R13), open points (R16)
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── pages-ui.md
│   ├── forms-ui.md
│   ├── forms-endpoint.md
│   └── candidate-copy.md          wording for Vaz's review
├── references/                    copy deck
└── tasks.md                       later, /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── assets/photos/                 + byte-identical copies of kept photos used by 006; index.ts → named library
├── content/                       new: home capital markets opportunities media site forms choices faq partners team projects
│                                  rewritten: about contact notFound pageMeta settings
│                                  removed: invest beef land ranches paths
├── content.config.ts
├── lib/
│   ├── shared/                    photo, action and text schemas
│   ├── <each collection>/         schema.ts + <name>-repository.ts
│   ├── faq/faq-jsonld.ts
│   ├── forms/                     rules.ts, gate.ts, forms-repository.ts (from lib/contact)
│   └── site/                      redirects.ts, published-locales.ts, site-repository.ts
├── i18n/index.ts                  locale helpers only (ui.ts removed)
├── components/
│   ├── ui/                        existing shells; Photo gains two kinds; + ActionBtn, StackBox, StepList, Disclosure, Figure
│   ├── forms/                     Field, ChoiceGroup, TimeZone, FormShell, ContactForm, InterestForm,
│   │                              GatheringForm, IdeaForm, NewsletterForm, Panel
│   ├── home/ capital/ markets/ opportunities/ about/ media/ notfound/
│   └── Nav, Footer, Layout
├── pages/[...lang]/               index capital markets opportunities about contact(+thanks,error) media
├── pages/                         404 privacy terms sitemap (imprint page added only with its approved text)
└── scripts/                       motion.ts (+ panel hook, band), forms.ts, panels.ts, path-card-flip.ts → choice-card.ts
tests/unit/  tests/e2e/            see "Tests"
scripts/ensure-dev-server.mjs      opens the form gate for test runs only (R6)
```

**Structure Decision**: the single Astro project keeps its layers (JSON → schema → repository → component). `components/invest`, `beef`, `land`, `lib/contact`, `lib/paths`, `lib/ranches` are replaced.

## Design by area

| Area | Requirements | How |
|---|---|---|
| Content layer | GEN6-003/004/006/007/008 | `data-model.md`; R1–R3 |
| Assets | GEN6-005, IMG6-* | optional fields; R13 |
| Routes | GEN6-001/002, SEO6-003 | R4; sitemap from `pageMeta` + R3 |
| Menu, footer | NAV6-*, FOOT-*, NEWS-* | `contracts/pages-ui.md` |
| Home | HOME-* | flip cards keep 001's script and rules; R11, R12 |
| Capital, Markets | CAP-*, MKT-* | shells + `StackBox`, `StepList`; problem on `--forest-deep` |
| Order | ORD-* | `isOrderPublished()` returns false until OQ-006-M3; no page, no schema invented |
| Opportunities | OPP-*, IDEA-* | R8; counter script, closed gate makes no call |
| About | ABOUT-* | cycle as ordered list + CSS ring |
| Forms, panels | CON-*, FORM-*, GATE6-*, A11Y6-002…007 | R5–R10; `contracts/forms-ui.md` |
| Endpoint | API6-* | `contracts/forms-endpoint.md`, mock only |
| Media, 404, legal, SEO | MEDIA-001, 404-6-001, LEG6-*, SEO6-* | imprint: gate extended, no page until its text exists |

## Stages (input for /speckit-tasks)

Each stage ends with `pnpm run verify` green and a stop for review.

1. **Foundation**: schemas, repositories, JSON from the deck, deck parser and fidelity test, photo library, locales, redirects list.
2. **Frame**: Layout, Nav, Footer, pageMeta titles, sitemap, 404. Old pages come down here so tests stay green.
3. **Home** · 4. **Capital** · 5. **Markets** · 6. **Opportunities** (without forms) · 7. **About**, Media kit.
8. **Forms**: engine, gate, panels, five forms, counter.
9. **Closing pass**: axe, forced colours, contrast, reduced motion, no-JS, image weight, `taste`, `web-design-guidelines`; README and AGENTS.md updates proposed for review (routes, retired rules).

Pages can be reviewed visually after each of stages 3–7, so the design is visible before forms are finished.

## Tests

### FR → test

| Requirements | Tests |
|---|---|
| GEN6-003/004/007/008, SC-001 | unit `deck-fidelity`; e2e `copy-fidelity` (textContent, every page) |
| GEN6-001/002, SC-002, SEO6-* | unit `redirects`, `page-meta`; e2e `routes`, `seo-meta`, `crawler-files` |
| GEN6-005, SC-009 | unit: optional assets per schema; e2e `absent-assets`, `forms-closed-production` |
| GEN6-006, NAV6-002 | unit `published-locales`; e2e `language-switch` |
| NAV6, FOOT | e2e `nav-bar`, `footer-and-legal` |
| HOME-003/004 | existing `path-card-*` rewritten as `choice-card-*` |
| HOME-001/002/005–009 | e2e `home-page`, `faq`, `partner-band`; unit `faq-jsonld` |
| CAP, MKT, ORD, OPP, ABOUT, MEDIA | one e2e file per page: order, links, ids, absent buttons |
| CON, FORM, IDEA, NEWS, GATE6, API6-001/002 | unit `form-rules`, `form-gate`, `preselection`; e2e `forms-*` (errors, failure, no-JS, privacy, a11y), `panels` |
| OPP-004, API6-003, SC-005 | unit `counter`; e2e `counter` (9, 10, error, timeout, closed) |
| IMG6 | unit `kept-photos` (+ copies' hashes); e2e `photo-*` rewritten to R13 |
| A11Y6, SC-006 | e2e `axe-pages` (every page, panel open and closed, two widths), `reduced-motion`, `photo-contrast`, `photo-forced-colors`, `responsive-qa` |
| SC-003, SC-008, SC-011 | manual, `quickstart.md` |

API6-004/005 and NEWS-003 are server duties: recorded, not testable here.

### Existing tests

| Action | Files |
|---|---|
| Keep, minor edits | `analytics`, `image-alt-text`, `reduced-motion`, `photo-contrast`, `photo-forced-colors`, `photo-delivery`, `photo-budget-production`, `crawler-files`; unit `legal`, `metrics`, `settings`, `kept-photos`, `i18n` |
| Rewrite to new rules | `nav-bar`, `footer-and-legal`, `language-switch`, `not-found-page`, `seo-meta`, `responsive-qa`, `home-hero-cards`, all `path-card-*`, `path-grid-responsive`, `photo-slots`, all `contact-form*`, `contact-gate-production`, both `support/` files; unit `about`, `contact-*`, `not-found`, `page-meta`, `path` |
| Remove (rule or page retired by the spec) | `as-is-freeze` (frozen titles), `content-compliance` + `approved-exceptions` (banned words), `beef-page`, `invest-page`, `land-page`, `hidden-sections-config-driven` (its "asset appears when supplied" half moves to `absent-assets`); unit `beef`, `invest`, `land`, `ranches` |

Every removal is listed in the change description (FR-TEST6-004).

## Decisions by Vaz (2026-11-25)

| # | Point | Decision |
|---|---|---|
| 1 | Spec | approved |
| 2 | Photos (research R13) | approved, Home's two photos beside the El Tapir text included |
| 3 | P1, preselection without JavaScript | with JavaScript only; spec delta applied |
| 4 | P4, strings not in the deck | "© ‹year› Orbolo" kept, "Scroll" dropped |
| 5 | Candidate wording | `contracts/candidate-copy.md` approved as written |
| 6 | OQ-006-M2, fifth Markets tile | no link |

Later, before sending opens: research R16 P2–P3 and `contracts/forms-endpoint.md`.

## Risks

- **Size**: one feature replaces nearly every page. The stages keep each review small.
- **Few honest photos**: project cards and tiles start without pictures; the design must hold as text cards.
- **Two kinds of redirect** until a host exists (R4).
- **Only Chromium is installed** for e2e; Safari and Firefox behaviour of panels is from guidance, not tested.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Kept photos copied into `src/assets/photos/` (constitution: images live in `public/images/`) | FR-IMG6-002 wants modern formats and sizes on every slot; Astro only processes `src/` | Leaving them as plain files breaks FR-IMG6-002. 005 made the same exception for its five photos |
