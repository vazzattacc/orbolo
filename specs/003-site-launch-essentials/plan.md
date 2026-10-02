# Implementation Plan: Orbolo Website — Site Launch Essentials

**Branch**: `003-site-launch-essentials` *(directory name only — no git branch required, per spec.md header)* | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-site-launch-essentials/spec.md`

## Summary

Add the launch-hygiene layer the live site is missing — a branded 404, per-page SEO metadata and social previews, a favicon set, `robots.txt`/`sitemap.xml`, carried-over Privacy/Terms pages behind a minimal new footer, an alt-text/responsive QA guard, and cookieless Plausible analytics — without changing anything a visitor already sees on Home, Invest, Beef, or Land (the As-Is Freeze), except the two Vaz-approved exceptions: the new footer, and applying the 2026-09-30 `#bfd55d` accent token to existing fills. All new editorial content (404 copy, meta descriptions, social-preview text, footer labels, legal text) lives in the content layer via the same `getX()` repository pattern `001`/`002` already established — nothing new is hardcoded into a component.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode (existing, unchanged)

**Primary Dependencies**: Astro 7.x (existing) + **`@astrojs/sitemap`** (new — justified below). Favicon/OG-image raster generation uses **`sharp`**, already present transitively (Astro's default `astro:assets` image service dependency) — not a new top-level dependency. No new dependency for `robots.txt` (static file) or Plausible (a `<script>` tag, not an npm package).

**Storage**: Versioned JSON files under `src/content/<collection>/`, same `file()`-loader mechanism as every existing collection — no database, no CMS.

**Testing**: Vitest (unit — repository functions, footer-link gating logic) + Playwright (e2e — 404 status/content, per-page meta tags, `robots.txt`/`sitemap.xml` contents, alt-text sweep, responsive sweep at 5 widths, analytics script presence, visual as-is diff for existing pages).

**Target Platform**: Web (desktop/tablet/mobile), production host `https://orbolo.com` (brief §11: "Domains: orbolo.com primary" — resolves spec.md FR-SEO-008's open `NEEDS CLARIFICATION`; the live site currently also answering at `www.orbolo.com` is a DNS/redirect concern outside this feature).

**Project Type**: Web — single existing Astro project; no new project/package.

**Performance Goals**: No new target introduced (spec.md Assumptions explicitly excludes Lighthouse ≥ 90 from this feature's scope); analytics must not block rendering (FR-AN-004).

**Constraints**: As-Is Freeze (FR-GEN3-001) — zero visible/behavioral change to existing pages beyond the footer (FR-LEG-001) and the `#bfd55d` accent-fill exception (constitution, 2026-09-30); every new color use restricted to the constitution's now-three tokens, `#bfd55d` never as text color; no legal text invented, paraphrased, or rewritten for voice (FR-LEG-004/005) — only fetched, carried over, and reported on; analytics is cookieless with zero consent UI (FR-AN-002).

**Scale/Scope**: 3 new pages (404, Privacy, Terms — the latter two conditionally shipped), 1 new shared component (Footer), per-page metadata for 7 eventual public routes (5 existing + Privacy + Terms), 1 shared social-preview image, 1 favicon/manifest set, 2 static crawler files, 1 analytics script.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec Before Code | `spec.md` exists, Draft status, extensively clarified 2026-09-25 with Vaz directly; one open `NEEDS CLARIFICATION` (FR-SEO-008) resolved below from the brief, not invented | PASS |
| II. Every Requirement Has Its Test | Every FR maps to a task + test in `tasks.md`; `pnpm run verify` is the closing gate | PASS (mapping finalized in `tasks.md`) |
| III. Human Review at Every Checkpoint | This plan awaits review before `/speckit-tasks`; FR-LEG-007 additionally gates Privacy/Terms behind Vaz's own content approval, independent of this plan's approval | PASS (pending review) |
| IV. Minimal, Curated Context | No `CLAUDE.md` changes needed by this plan directly (the constitution's 2026-09-30 accent-color amendment already happened outside this plan) | PASS |
| V. No New Dependencies Without Justification | `@astrojs/sitemap` justified below (§ Research 1); everything else reuses already-present tooling | PASS |
| VI. Declared Architecture Is Respected | Extends the `001`/`002` content-isolation pattern (repository function + colocated Zod schema + JSON `file()` collection) with 3 new collections; reuses the existing `settings` singleton rather than duplicating it | PASS |
| VII. Scope Changes Land as a Delta | The footer and the accent-color exceptions are both recorded as labeled Scope Change entries in `spec.md`/constitution, not silent edits; FR-SEO-008's resolution is recorded in this plan, not silently assumed | PASS |
| VIII. Content/Presentation/Interaction Decoupled | 404 copy, meta descriptions, social-preview text, footer labels, and legal text all live in content collections, read through repository functions — FR-GEN3-003 verbatim | PASS |
| IX. Accessibility Is a Release Gate | 404/Privacy/Terms/Footer keyboard-operable with visible focus, semantic landmarks, alt-text guard (US4), responsive guard (US4) — carried into `tasks.md` as explicit tasks. The `#bfd55d` accent is a **documented, Vaz-approved exception** to this principle for non-text fills only (constitution, 2026-09-30) — not a silent violation | PASS (with one recorded, approved exception — see constitution) |
| X. Installed Skills Are Mandatory | See "Mandatory skill usage" below | PASS (commitment recorded) |

**No unjustified violations — Complexity Tracking table below has exactly one entry (the accent-color accessibility exception), already approved by Vaz and traceable to the constitution, not invented here.**

### Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `#bfd55d` accent fails WCAG AA (1.48:1) yet ships as an accent/fill color | Vaz's explicit, informed 2026-09-30 decision (constitution) — the brief's own moodboard reference uses this exact value | Darkening the value (options offered, computed to 3:1/4.5:1) was rejected by Vaz in favor of the literal brief value; not this plan's decision to override |

### Mandatory skill usage (Constitution Principle X)

- `web-design-guidelines` — MUST be consulted while building the 404 page, Footer, Privacy/Terms pages (new UI), and wherever the `#bfd55d` accent is applied to existing fills.
- `image-to-code` — the brief's moodboard (`.specify/references/Orbolo_Editorial_Continuous.pdf`) is the source of the `#bfd55d` accent decision already made; Vaz's new reference images (in progress as of this plan, not yet delivered) apply to a later visual-application pass, not this feature's launch-hygiene scope directly — revisit if/when they inform the 404/Footer/legal-page visuals specifically.
- `taste` — MUST run as a final aesthetic pass on the 404 page and the Footer (the two most visible new surfaces) before this feature is presented as done.
- `playwright` (skill) — MUST be used for the e2e coverage listed under Testing above.

## Project Structure

### Documentation (this feature)

```text
specs/003-site-launch-essentials/
├── spec.md                  # Feature spec (Draft, extensively clarified 2026-09-25/30)
├── plan.md                  # This file
├── research.md              # Phase 0 output
├── data-model.md            # Phase 1 output
├── quickstart.md            # Phase 1 output
├── contracts/
│   ├── page-meta-schema.md
│   └── footer-and-legal-gating.md
├── checklists/
│   └── requirements.md      # Pre-existing (from /speckit-specify)
└── tasks.md                 # Phase 2 output (/speckit-tasks — not created by this plan)
```

### Source Code (repository root — extends the existing single Astro project)

```text
src/
├── components/
│   ├── Layout.astro                    # MODIFIED: adds per-page <head> meta, social preview,
│   │                                    #   canonical link, Plausible script, <Footer>
│   ├── Footer.astro                    # NEW: minimal site-wide footer (Privacy · Terms)
│   └── notfound/Hero.astro             # NEW: the 404 page's single content block
├── content.config.ts                   # MODIFIED: registers 3 new collections + settings' extended schema
├── content/
│   ├── settings/settings.json          # MODIFIED: adds siteName/socialImagePath/socialImageAlt
│   ├── pageMeta/pageMeta.json          # NEW: one entry per public route (route, description, indexable)
│   ├── notFound/notFound.json          # NEW: 404 page copy
│   └── legal/legal.json                # NEW: Privacy + Terms — 0, 1, or 2 entries depending on FR-LEG-004/007
├── lib/
│   ├── settings/{schema.ts,settings-repository.ts}   # MODIFIED: schema extended (3 new fields);
│   │                                                  #   existing getContractingEntityName() untouched,
│   │                                                  #   new getSocialPreviewDefaults() added alongside it
│   ├── pageMeta/{schema.ts,page-meta-repository.ts}  # NEW: getPageMeta(route)
│   ├── notFound/{schema.ts,not-found-repository.ts}  # NEW: getNotFoundContent()
│   └── legal/{schema.ts,legal-repository.ts}         # NEW: getLegalDocument(kind) — undefined if absent/unapproved
├── pages/
│   ├── 404.astro                       # NEW — Astro's file-based not-found convention
│   ├── privacy.astro                   # NEW — renders only if getLegalDocument("privacy") is approved
│   └── terms.astro                     # NEW — renders only if getLegalDocument("terms") is approved
└── styles/global.css                   # UNCHANGED by this feature (accent token already added 2026-09-30)

public/
├── robots.txt                          # NEW — static, references the sitemap
├── favicon.ico                         # NEW — generated from the existing favicon.svg (unchanged mark)
├── apple-touch-icon.png                # NEW — 180×180, generated from favicon.svg
├── icon-192.png / icon-512.png         # NEW — generated from favicon.svg
├── site.webmanifest                    # NEW — references the icon set
└── images/social/og-default.png        # NEW — 1200×630, logo + color tokens only, generated once

astro.config.mjs                        # MODIFIED: site: "https://orbolo.com", @astrojs/sitemap integration
                                         #   (filtered to exclude /404)

tests/
├── unit/
│   ├── page-meta-repository.test.ts    # NEW
│   ├── legal-repository.test.ts        # NEW — gating logic (approved vs not, missing vs present)
│   └── settings-repository.test.ts     # MODIFIED — covers the new fields
└── e2e/
    ├── not-found-page.spec.ts          # NEW — 404 status, content, noindex, nav present
    ├── seo-meta.spec.ts                # NEW — per-page title/description/canonical/OG uniqueness
    ├── crawler-files.spec.ts           # NEW — robots.txt + sitemap.xml contents
    ├── footer-and-legal.spec.ts        # NEW — footer presence, link gating, legal page rendering
    ├── image-alt-text.spec.ts          # NEW — US4 automated alt-text sweep, all pages
    ├── responsive-qa.spec.ts           # NEW — US4 no-horizontal-scroll sweep, 5 widths, all pages
    ├── analytics.spec.ts               # NEW — script present, no cookies, no console break
    └── as-is-freeze.spec.ts            # NEW — SC-001: existing pages' visible DOM unchanged above the footer
```

**Structure Decision**: Same single-Astro-project structure as `001`/`002`. Four new content collections/extensions (`pageMeta`, `notFound`, `legal`, extended `settings`) follow the identical repository-function pattern already proven twice. `Footer.astro` is a new shared component parallel to `Nav.astro` — added to `Layout.astro` once, inherited by every page automatically, which is how the As-Is Freeze's one approved visual exception reaches every existing page without editing each page file individually.

## Complexity Tracking

*(See the Complexity Tracking table under Constitution Check above — the single approved, non-negotiable exception. No other violations to justify.)*
