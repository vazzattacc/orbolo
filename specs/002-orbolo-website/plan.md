# Implementation Plan: Orbolo Website — Full Site

**Branch**: `002-orbolo-website` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-orbolo-website/spec.md`

## Summary

Build the real, full Orbolo company website per `.specify/references/orbolo-website-brief.md`: a static, multilingual (EN first), EU-hosted site covering Home, Invest (Remote Rancher), Beef, Land, The Code, The Opportunity, About, Orbolo Bridge, and Contact, with a Papermark-backed data room integration and a git-based CMS (Keystatic) driving every page's content, partners, glossary terms, Code rules, metrics, and the investor deployment pipeline's ranch cards. The investor and buyer funnels are the primary conversion paths (P1); the landowner funnel, the site-wide trust layer (Code/Glossary/Opportunity), and CMS-friendliness are P2; supporting pages and multilingual rollout are P3. This is an independent feature from `001-orbolo-path-selection` — different stack (Astro/Firebase vs. Next.js/implied-Vercel), different premise (the real multi-page site vs. a gamified path-selector), no code dependency between them.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode (per constitution)

**Primary Dependencies**: Astro (static output, built-in i18n routing) · Keystatic (git-backed CMS, Astro-native) · Tailwind CSS · `@astrojs/sitemap` — no component-framework island runtime (React/Vue/Svelte) is added; interactivity is native HTML + vanilla TypeScript islands (`research.md` §3)

**Storage**: Content lives as structured files in the same GitLab repo, authored via Keystatic, read at build time through Astro Content Collections (Zod-validated) behind the `lib/content/*` isolation layer (`contracts/content-layer.md`) — no database for this feature; Firebase Firestore/Storage remain reserved for the future investor-portal phase (constitution)

**Testing**: Vitest (unit — `computeRanchStatus`, `getMetricValue`'s omit-if-unsourced rule, content-compliance lint), Playwright (e2e — the 10 quickstart scenarios)

**Target Platform**: Web (desktop/tablet/mobile, EN/ES/DE locales)

**Project Type**: Web — single Astro project; the "backend" behaviors this feature needs (webhook-driven CRM/Slack sync, e-signature, NDA gating) are external systems (Papermark, Make/Apps Script, Sheets, Dropbox Sign) this feature links to, not services this feature builds (`research.md` §5)

**Performance Goals**: Lighthouse ≥ 90 on mobile for core pages (brief §11 / `spec.md` SC-008) — achievable by default with a static Astro build and minimal client JS (no framework runtime), not a stretch target requiring special optimization work

**Constraints**: EU data residency (Firebase Hosting EU region; Keystatic content lives in the GitLab repo, not a third-party SaaS) · every displayed number must carry a date+source or not render (FR-031) · zero banned-word/"regenerative"/"guaranteed" violations (FR-032, enforced by CI) · ranch release logic never callable below 60% signed-unexpired LOI (FR-010) · no investor-facing content ships without recorded counsel sign-off (FR-033, a process gate, not a technical one)

**Scale/Scope**: 9 top-level pages + Orbolo Bridge sub-pages (open-ended) + Blog, 3 locales (EN live at launch; ES/DES as later content work per `spec.md` non-goals), an open-ended number of Ranch/Partner/Term/Rule/Metric content records — architecture must not assume any of these counts are fixed (mirrors `001-orbolo-path-selection`'s zero-to-many pattern, extended here to every content collection, not just one)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec Before Code | `spec.md` exists, passed `/speckit-clarify` (0 critical ambiguities — the source brief already resolved nearly everything), no code written before this plan | PASS |
| II. Every Requirement Has Its Test | Every FR/user story maps to a `quickstart.md` scenario and will map to a `tasks.md` test task; `pnpm run verify` (including the content-compliance lint) is the closing gate | PASS (exact test mapping finalized in `tasks.md`) |
| III. Human Review at Every Checkpoint | This plan is a checkpoint artifact awaiting your review before `/speckit-tasks` | PASS (pending review) |
| IV. Minimal, Curated Context | No `CLAUDE.md` changes made by this plan | PASS |
| V. No New Dependencies Without Justification | Every new dependency (Astro, Keystatic, `@astrojs/sitemap`) is justified in `research.md`; explicitly rejected a component-framework runtime (React/etc.) and a hosted CMS SaaS (Sanity) and a self-hosted CMS server (Payload) with reasons | PASS |
| VI. Declared Architecture Is Respected | This feature establishes new architecture (first Astro feature in the repo) — Project Structure below is that declaration; it does not touch or depend on `001-orbolo-path-selection`'s structure | PASS (baseline-setting for this stack, not a violation) |
| VII. Scope Changes Land as a Delta | The visual-identity change (FR-042–FR-046, 2026-09-17) is folded into `spec.md` as a labeled Delta subsection, not a silent edit; this plan's "Design System" section below is its corresponding plan-level delta | PASS |
| VIII. Content/Presentation/Interaction Decoupled | `lib/content/*` isolation layer (`contracts/content-layer.md`) + Keystatic collections + zero per-partner/per-ranch/per-term branching in templates directly implement this, at a larger scale than `001` | PASS |
| IX. Accessibility Is a Release Gate | Native HTML interactive elements (details/popover for tooltips, real form controls), semantic landmark/heading structure per page, focus-visible states, reduced-motion respected for the loop diagram's one-time animation — carried into `tasks.md` as first-class tasks | PASS |
| X. Installed Skills Are Mandatory | See "Mandatory skill usage" below | PASS, one flagged deviation (`taste`, see below) |

**One flagged deviation (Principle X / Principle V's justification standard)**: the `taste` skill's pipeline requires the Playwright MCP server against a live URL; that server is disconnected in this environment (`claude mcp list` → `CONNECTION_CLOSED`), a pre-existing infrastructure issue outside this delta's control. Substituted a manual aesthetic review of Home/Invest screenshots (captured via the project's own local `@playwright/test`) against the same criteria the skill would apply. Recorded in `tasks.md` T075; re-run `/taste` formally once the MCP reconnects. No other violations to justify — Complexity Tracking table is otherwise empty/omitted.

### Mandatory skill usage (Constitution Principle X)

- `web-design-guidelines` — MUST be consulted while building every page template, especially the forms (Contact, "Get the investor pack", "Work with us") and the data-heavy Invest/pipeline views.
- `image-to-code` — a moodboard was supplied 2026-09-17 (`.specify/references/Orbolo_Editorial_Continuous.pdf`); the design system below was derived by direct visual inspection of that reference (rendered to image segments, colors pixel-sampled) rather than approximated from text, satisfying the "whenever a reference image is available" trigger. No further mockups are expected for this feature.
- `taste` — MUST run as a final aesthetic pass on Home and Invest (the two highest-traffic, highest-stakes pages) before this feature is presented as done, and ideally on every page. (2026-09-17 delta: substituted a manual pass — see Constitution Check's flagged deviation above.)
- `playwright` (skill) — MUST be used to add the e2e coverage for the 10 quickstart scenarios.

## Design System (Visual Identity Delta, 2026-09-17)

Implements `spec.md` FR-042–FR-046. Derived from direct inspection of `.specify/references/Orbolo_Editorial_Continuous.pdf` (rendered at 150dpi, split into 8 segments, colors pixel-sampled from the darkest/most-saturated pixels in each labeled text region — not eyeballed). Existing token names in `tailwind.config.mjs` (`paper`, `ink`, `accent`, `verified`, `font-display`, `font-body`) are kept; only their values change, plus one new font role is added. This is a token-level reskin: a repo-wide grep confirms every component reads color/font through these 6 Tailwind tokens with zero hardcoded hex values, so no component file needs structural changes — only `tailwind.config.mjs` and `BaseLayout.astro`'s font `<link>` tags, plus targeted tagline markup in hero/mission-style sections for the new cursive role (FR-045).

**Color tokens** (sampled hex, replacing current values):

| Token | Old value | New value | Role |
|---|---|---|---|
| `paper` | `#F6F3EC` | `#F8F4E9` | Background surface (near-identical shift — same warm-cream family) |
| `ink` | `#1C1B18` (near-black) | `#47592F` (forest green) | Primary text — sampled from the "ORBOLO" wordmark and body headlines across 3 independent regions, converging on `#495D37` ± small JPEG-compression variance |
| `verified` | `#2E4A34` | `#2E3B20` | Code marks / "verified by" — kept as a visibly darker green than `ink` for semantic distinction (unverified body text vs. a verification claim) |
| `accent` | `#B77B4A` (dry-grass ochre) | `#B77B4A` (unchanged) | Single primary CTA per screen — moodboard shows no distinct flat CTA-button color (its links are understated text + arrow glyphs), so the existing earth-tone accent is kept; it already reads as compatible with the new green/cream palette and no motivated replacement exists |
| *(new)* `sage` | — | `#6D7063` | Secondary/eyebrow labels ("RESPONSIBILITY. LOCAL KNOWLEDGE.") and the cursive tagline color — sampled at `#A9AC9A` from 2 independent caption regions, then darkened (same hue) to `#6D7063` because the raw sampled value fails WCAG AA (2.09:1 on `paper`); the moodboard's original tone is a real-world example of brand mood boards prioritizing vibe over accessibility, which Constitution Principle IX does not permit here |

**Contrast verification (SC-011)**, computed via the WCAG relative-luminance formula, not eyeballed:

| Pairing | Ratio | Threshold | Result |
|---|---|---|---|
| `ink` (#47592F) on `paper` (#F8F4E9) | 6.98:1 | 4.5:1 (body) | PASS |
| `verified` (#2E3B20) on `paper` | 10.84:1 | 4.5:1 | PASS |
| `paper` on `ink` (primary button) | 6.98:1 | 4.5:1 | PASS |
| `sage` (#6D7063) on `paper` | 4.61:1 | 4.5:1 (used for small eyebrow labels, so held to the body threshold, not just the large-text 3:1 one) | PASS |
| `accent` (#B77B4A) — only live usage is `bg-accent/10` (10% tint) under `text-ink`, not a solid accent surface | n/a (effectively ink-on-paper) | — | No solid-accent-background text exists in the codebase today; if a future task puts text directly on a full-strength `accent` fill, it must be re-checked then (not this delta's scope) |

**Typography** (FR-044/FR-045): the moodboard's named faces (a Roslindale-style serif, "Helios Ext") are commercial/paid families (per the spec's Assumptions). Per Principle V, free equivalents are chosen instead of licensing new commercial fonts, reusing what's already installed where the character match is close enough:

| Role | Moodboard face | Chosen face | Justification |
|---|---|---|---|
| `font-display` (headline serif) | Roslindale | **Fraunces** (already installed — no change) | Fraunces is already a warm, high-contrast editorial serif; the moodboard's serif plays the same role (big statement headlines) Fraunces already fills in this codebase. No new dependency. |
| *(new)* `font-display-bold` (full-bleed statement headlines, FR-044) | Helios Ext | **Archivo** at variable `wdth=125` (Google Fonts) | Closest free match to a bold extended/wide grotesk. "Archivo Expanded" is not a real Google Fonts family (a direct API request for it 400s); Archivo's registered `wdth` axis at 125 produces a verified `font-stretch: expanded` face instead (confirmed in the raw `@font-face` response, not assumed) — `font-display-bold` in Tailwind supplies the family, a small `.font-display-bold` rule in `global.css` supplies the `font-stretch` (Tailwind's `fontFamily` key only emits `font-family`). Used only for the "declaration over photography" pattern the moodboard shows (e.g. "ON THE GROUND"), never for body or nav. New dependency, justified by FR-044. |
| `font-body` (body/UI text) | Suisse Intl | **Inter** (already installed — no change) | Inter is the standard free substitute for Suisse Intl; already fills this role. No new dependency. |
| *(new)* `font-accent` (cursive taglines, FR-045) | (unnamed script) | **Caveat** (Google Fonts) | Legible, warm cursive matching the moodboard's handwritten accent lines; used at most once per section per FR-045. New dependency, justified by FR-045. |

Two new font families (`Archivo Expanded`, `Caveat`) are added to the Google Fonts `<link>` tags in `BaseLayout.astro`, both with `display=swap` (accent/emphasis text, not layout-critical LCP content, so the CLS argument that justifies Fraunces's `display=optional` does not apply here).

## Project Structure

### Documentation (this feature)

```text
specs/002-orbolo-website/
├── spec.md                 # Feature spec (approved, 0 critical ambiguities)
├── plan.md                  # This file
├── research.md               # Phase 0 output
├── data-model.md              # Phase 1 output
├── quickstart.md               # Phase 1 output
├── contracts/
│   ├── content-layer.md
│   └── page-routes.md
├── checklists/
│   └── requirements.md
└── tasks.md                  # Phase 2 output (/speckit-tasks — not created by this plan)
```

### Source Code (repository root)

`001-orbolo-path-selection` (the earlier Next.js path-selector prototype) has been fully removed from the repository — this Astro project is now the sole project at the repository root:

```text
├── src/
│   ├── pages/
│   │   ├── [locale]/
│   │   │   ├── index.astro           # Home
│   │   │   ├── invest.astro          # Invest / Remote Rancher
│   │   │   ├── beef.astro            # Beef
│   │   │   ├── land.astro            # Land
│   │   │   ├── the-code.astro
│   │   │   ├── glossary.astro
│   │   │   ├── the-opportunity.astro
│   │   │   ├── about.astro
│   │   │   ├── orbolo-bridge/
│   │   │   │   └── index.astro       # + future sub-pages, no nav changes needed (FR-004)
│   │   │   ├── contact.astro
│   │   │   └── blog/
│   │   │       ├── index.astro
│   │   │       └── [slug].astro
│   ├── components/
│   │   ├── sections/                 # One component per Section type (data-model.md)
│   │   │   ├── Hero.astro
│   │   │   ├── Loop.astro
│   │   │   ├── NumbersRow.astro
│   │   │   ├── PartnerStrip.astro
│   │   │   ├── CodeStrip.astro
│   │   │   ├── Pipeline.astro
│   │   │   ├── Roadmap.astro
│   │   │   ├── WhereWeAre.astro
│   │   │   ├── TextBlock.astro
│   │   │   ├── Faq.astro
│   │   │   └── FormEmbed.astro
│   │   ├── RanchCard.astro
│   │   ├── GlossaryTooltip.astro
│   │   └── Nav.astro / Footer.astro
│   ├── content/
│   │   ├── config.ts                 # Astro Content Collections + Zod schemas per data-model.md
│   │   └── [collections populated by Keystatic]
│   ├── lib/
│   │   └── content/                  # contracts/content-layer.md — getPage, getMetricValue,
│   │       │                         # getPublishedRanches, computeRanchStatus, getGlossaryTerm,
│   │       │                         # assertContentCompliance
│   │       ├── pages.ts
│   │       ├── metrics.ts
│   │       ├── ranches.ts
│   │       ├── glossary.ts
│   │       └── compliance.ts
│   └── i18n/
│       └── routing.ts                # locale config, hreflang, redirect-by-Accept-Language
├── keystatic.config.ts               # Collections/singleton schemas, mirrors data-model.md
├── tests/
│   ├── unit/                         # Vitest: ranch status logic, metric-omission rule, compliance lint
│   └── e2e/                          # Playwright: the 10 quickstart.md scenarios
├── public/
├── astro.config.mjs
├── tailwind.config.mjs
├── firebase.json                     # Hosting targets: production, preview
├── .gitlab-ci.yml                    # MR → preview channel; main → production
├── tsconfig.json
└── package.json
```

**Structure Decision**: This Astro project lives directly at the repository root. It originally shipped inside a `site/` subdirectory to avoid colliding with `001-orbolo-path-selection`'s Next.js files, which lived at the repo root; `001` has since been removed entirely (its Next.js code and `specs/001-orbolo-path-selection/` deleted) and this project was flattened up to the repo root to eliminate the redundant nesting. The `lib/content/*` isolation layer is what makes the Keystatic-backed CMS swappable later (e.g. to Sanity, if that decision is ever revisited) with no template changes — the same isolation discipline `001` proved with `PathRepository`, now applied across nine content types instead of one.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
