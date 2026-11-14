# Implementation Plan: Orbolo Website – Contact Form (Native Form, Self-Hosted Endpoint) and Background-Photo Refresh

**Branch**: `005-contact-form` *(directory name only; the work currently sits on `feature/designTest`, and branch creation is Vaz's call)* | **Date**: 2026-11-11, revised 2026-11-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-contact-form/spec.md`, including its 2026-11-14 amendment (background-photo refresh, FR-IMG-*).

**What changed in this revision**: the contact-form plan of 2026-11-11 is kept as it was. This revision adds the plan for the photo refresh (Part B below, `research.md` §17–§27, `data-model.md` §6–§8, `contracts/photo-delivery-ui.md`, `quickstart.md` §5–§8). The only edit to the contact-form design is a rename: the `production-gate` Playwright project becomes `production-build`, because it now also hosts the photo byte-budget test.

## Summary

The feature has two independent parts. Nothing has been implemented yet for either.

### Part A: Contact form (US1–US4)

This part replaces the `/contact` and `/es/contact` stub with a native, accessible enquiry form. The form posts to a self-hosted endpoint, defined only by a contract (`contracts/contact-endpoint.md`); the server itself is a separate spec. The site stays static.

- **Endpoint:** the endpoint URL is a build-time `astro:env` variable.
- **Copy:** all copy moves into a new `contact` JSON collection, including the stub text, which leaves `src/i18n/ui.ts`.
- **Publishing gate:** one pure function decides whether the form and its thanks/error pages are published. In production this requires four things: the endpoint, Vaz/counsel's privacy approval, a published Privacy page and the team email. Otherwise today's stub ships unchanged.
- **Dev preview:** a dev-only preview mode shows the live form locally and in e2e, so the suite can test it against a mocked endpoint without faking any approval.
- **Closed-gate test:** a second Playwright project tests the closed gate against a real production build.
- **Behaviour:** progressive enhancement. The native post works without JS. With JS, the script adds the GOV.UK-style error summary and inline errors, a 15 s timeout, a failure state with a `mailto:` fallback, and a full navigation to the thanks page so Plausible counts it.

### Part B: Background-photo refresh (US5)

This part replaces five dark background photos with five bright ones in seven slots across Home, Invest, Beef, Land and About, and lightens the forest shade over photos wherever no text sits. No copy changes except two alt texts. Layout, motion and colour tokens stay as they are.

- **Photos:** nine masters (wide and tall frames of the five Pexels photos) go into `src/assets/photos/`. Astro's built-in image pipeline turns them into AVIF, WebP and JPEG at several widths. The eleven kept photos stay in `public/images/site/`, untouched.
- **Markup:** one internal component, `Photo.astro`, renders every shell photo: a `<picture>` for a replacement, the same `<img>` as today for a kept photo. Phones get a portrait crop, so they download only the part of the photo they show.
- **Priority:** the hero photo is the only `fetchpriority="high"` image on a page and is never lazy; every other photo is lazy.
- **Shade:** three tokens. The shade follows each text block instead of the viewport, at an opacity that passes AA even over a white photo; everywhere else it drops to 0.06.
- **Proof:** tests read the pixels behind every line of text, the bytes each device downloads from the production build, and a hash of every kept photo.

Measured on 2026-11-14: a phone downloads at most 160 KB for a hero (today 461–930 KB on every device), and a laptop at most 429 KB.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode (existing).

**Primary Dependencies**:
- Existing, unchanged: Astro 7 (built-in `astro:env`, `astro:assets` with sharp, content collections with Zod, `ClientRouter`), Tailwind 4, GSAP and Lenis.
- **New dev dependency (pending approval): `@axe-core/playwright`**, for SC-005 and SC-011 (`research.md` §12).
- No new runtime dependency (Governing Rule 3, Constitution V). The photo refresh adds no dependency at all: Lighthouse runs through `npx` for a recorded check only.

**Storage**:
- Website: versioned JSON only. A new `contact` collection, plus two fields in `settings` and four `pageMeta` entries.
- Enquiries are stored only by the external endpoint (out of scope).
- Photos: nine master JPEGs in `src/assets/photos/`; generated variants are build output, not committed.

**Testing**:
- Vitest: validation rules, the gate truth table, the content repository, and the hashes of the kept photos.
- Playwright:
  - existing `chromium`, `mobile-chrome` and `reduced-motion` projects against `astro dev` (contact form in preview mode with a mocked endpoint; photo slots, delivery markup, contrast and forced colours);
  - new `production-build` project against `astro build` + `astro preview :4322` (closed contact gate; photo byte budgets);
  - axe checks.

**Target Platform**: Static site on Firebase Hosting EU (constitution). Evergreen browsers, with and without JavaScript. AVIF where supported, WebP and JPEG otherwise.

**Project Type**: Web. Single existing Astro project; no new package.

**Performance Goals**:
- The form script stays small: plain TS, no Zod in the client bundle (`research.md` §8). Endpoint answers are awaited for at most 15 s.
- Each replaced photo: ≤ 200 KB on a 390 px phone and ≤ 450 KB at 1440 px (SC-009; conditions in `research.md` §21).
- LCP on Home, Invest and Beef ≤ 2.5 s (mobile profile) and not worse than before; layout shift from images 0 (SC-010).

**Constraints**:
- No cookies, no storage and no third-party request from the form (FR-AN5-002).
- WCAG 2.2 AA (Constitution IX), including every text block over a photo (FR-IMG-008).
- CLAUDE.md Design Taste: square corners, forest/paper/lime, lime never used for body text, every section on forest.
- Copy only in JSON. The two alt texts are edited where they already live, in `ui.ts` (FR-IMG-010).
- Every other page unchanged, apart from the photo refresh (Governing Rules 1 and 5).
- Fail closed (Governing Rule 4).
- Photos are cropped, resized and compressed only (FR-IMG-004). The eleven kept photos stay byte-identical (FR-IMG-002).
- Motion is unchanged: `motion.ts` is not edited by Part B (FR-IMG-009).

**Scale/Scope**:
- Part A: 1 rewritten page (Contact, ×2 locales) and 2 new gated pages (thanks and error, ×2 locales); 1 new component, 1 client script, 2 pure modules, 1 new collection; about 8 new test files; 1 shared-shell extension (`Btn` button mode).
- Part B: 7 slots on 5 pages (×2 locales); 9 master files and a registry; 1 new internal component; 4 shells and 7 call sites touched; 1 CSS file; 5 old photos deleted; 7 new test files (one a shared helper) and 1 modified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec Before Code | `spec.md` exists with Scope Change deltas and Clarifications from 2026-11-10 and 2026-11-14. Vaz approved it on 2026-11-14 (header: **Approved**). | PASS |
| II. Every Requirement Has Its Test | Part A: FR-TEST-001/002/003 map every US and FR to the tests in `quickstart.md` §1. Part B: FR-IMG-TEST-001…004 map to `quickstart.md` §6; every FR-IMG and SC-008…012 has a named test or a recorded check (SC-008 and the Lighthouse half of SC-010 are human or recorded by nature). `pnpm run verify` closes both. | PASS |
| III. Human Review at Every Checkpoint | This plan stops here for Vaz's review before `/speckit-tasks`. Publishing the form has its own human gate (FR-GATE-001). The photo refresh has SC-008: Vaz approves the before/after screenshots. | PASS (pending review) |
| IV. Minimal, Curated Context | AGENTS.md's "Known gap" line is updated in implementation, because the Contact text leaves `ui.ts`. CLAUDE.md's Design Taste is touched only if `taste`, re-run after the shade change, finds its one sentence on the photo shade no longer true. | PASS |
| V. No New Dependencies Without Justification | `@axe-core/playwright` (dev only) is justified in `research.md` §12. Nothing else is added: `astro:env`, `astro:assets`, sharp (shipped with Astro), `AbortController` and native forms are built in. | PASS (pending Vaz's approval of the dependency) |
| VI. Declared Architecture Is Respected | Part A follows the collection + `schema.ts` + repository pattern and reuses the shells. Part B keeps the four shells and adds one helper inside `src/components/ui/`. **One deviation**: the replacement masters live in `src/assets/photos/`, not `public/images/<section>/` as the constitution's Assets line says. See Complexity Tracking. | PASS with one justified deviation (awaiting Vaz) |
| VII. Scope Changes Land as a Delta | The spec carries its own deltas. This plan proposes three more instead of silently reinterpreting: SC-003 / FR-AN5-002 versus Plausible (`research.md` §13), how SC-009 is measured (§21), and contrast checks on Contact and 404 (§25). | PASS (deltas awaiting Vaz) |
| VIII. Content/Presentation/Interaction Decoupled | Part A: endpoint from config; all copy from JSON. Part B: the shells render whatever photo and focal point they are given and know nothing about which photo it is. Which photo a section shows stays in that section's component, as today; moving it to JSON is a spec Non-goal. | PASS |
| IX. Accessibility Is a Release Gate | Part A: native controls, labels, error summary, focus management, live regions. Part B: AA behind every line of text over a photo, proved against the real photo and against white; a system-colour background in Forced Colors Mode; reduced motion unchanged; alt texts updated. | PASS |
| X. Installed Skills Are Mandatory | See "Mandatory skill usage" below. | PASS (commitment recorded) |

**Constitution drift (flag only, not this feature's job):** the constitution's _Colors_ constraint still describes the cream palette. This plan follows CLAUDE.md Design Taste, as AGENTS.md directs. Amending the constitution needs its own reviewed PR.

### Mandatory skill usage (Constitution Principle X)

- `web-design-guidelines`: consulted while building the form, the error summary and the result pages, and while designing the shade pools; run as an audit on the changed files before done.
- Modern Web Guidance (`npx modern-web-guidance@latest`, Vaz's preference, spec Governing Rule 5): consulted for this plan on 2026-11-14 (`optimize-image-priority`, `deliver-optimized-decorative-images`, `performance`, `color`, `accessibility`); retrieved again during implementation so the code follows the current text.
- `taste`: the final aesthetic pass on Contact and on the five photo pages; re-run against localhost afterwards so CLAUDE.md stays accurate.
- `playwright` (`playwright-cli` / Playwright MCP): all e2e coverage in `quickstart.md` §1 and §6, plus the browser checks in §2 and §7 at 1440 and 390 px, in EN and ES, including hover, focus, reduced motion and forced colours.
- `image-to-code`: not used. For the form, no mockup exists. For the photos, the spec records that the hero mockup is not adopted (Scope Change 2026-11-14), so there is no reference to derive from.

### Decisions awaiting approval (before `/speckit-tasks`)

Part A (unchanged since 2026-11-11):

1. **New dev dependency `@axe-core/playwright`** for SC-005, now also used for SC-011 (`research.md` §12).
2. **Spec delta on SC-003 / FR-AN5-002**: the site-wide Plausible script is allowed on the Contact pages, because US4 depends on it (`research.md` §13).
3. **Gate conditions 3 and 4** (Privacy page published, team email set) are added to FR-GATE-001's literal two (`research.md` §2). This is a clarification rather than a change; confirm it.
4. **Dev preview mode** via a committed `.env.development` and the reserved `contact@example.com` fallback, dev only (`research.md` §3).
5. Non-blocking copy question: topic labels versus the 2026-10-28 renames (`research.md` §16).

Part B (new):

6. **Replacement masters in `src/assets/photos/`**, which departs from the constitution's Assets line (`research.md` §17). Recommended. The alternative keeps the folder rule but commits about 100 generated files and adds `sharp` as a direct dependency.
7. **SC-009 measured at real pixel densities**: 390 px at 3×, and 1440 px at 1× and 2× (`research.md` §21). Recommended; all three pass on measured sizes.
8. **Contrast checks also cover Contact and 404**, because the shade lives in shells they share (`research.md` §25). Recommended.
9. Not a decision for now, for awareness: on the Beef hero, the white cow in `09` stands in the centre and partly under the title (`research.md` §20). The mapping is fixed by FR-IMG-001, so it is left for the SC-008 preview. OQ-D1 (Home hero `06` or `03`) is decided at the same preview; the plan builds `06`.

## Project Structure

### Documentation (this feature)

```text
specs/005-contact-form/
├── spec.md                   # Feature spec (Approved 2026-11-14, including that day's amendment)
├── plan.md                   # This file
├── research.md               # Phase 0: Part A §1–§16 (form), Part B §17–§27 (photos)
├── data-model.md             # Phase 1: §1–§5 form entities, §6–§8 Photo, BackgroundPhotoSlot, shade tokens
├── quickstart.md             # Phase 1: §1–§4 form validation and go-live, §5–§8 photo validation and evidence
├── contracts/
│   ├── contact-endpoint.md   # HTTP contract the server must honour (FR-API-*)
│   ├── contact-form-ui.md    # DOM/ARIA/behaviour hooks used by the script and tests
│   └── photo-delivery-ui.md  # Photo markup, priority, motion hooks, shade, budgets (FR-IMG-*)
└── tasks.md                  # Phase 2 (/speckit-tasks; not created here)
```

### Source Code (repository root): Part A, contact form

```text
astro.config.mjs                         MODIFY  env.schema: PUBLIC_CONTACT_ENDPOINT, CONTACT_FORM_PREVIEW
.env.development                         NEW     dev-only reserved endpoint + preview flag (committed, no secrets)
package.json                             MODIFY  devDependency @axe-core/playwright (if approved); pretest:e2e also runs ensure-production-preview
playwright.config.ts                     MODIFY  + project "production-build" (baseURL :4322); exclude its specs from other projects
scripts/ensure-production-preview.mjs    NEW     astro build (endpoint/preview unset) + astro preview --port 4322, poll until up

src/content.config.ts                    MODIFY  register `contact` collection
src/content/contact/contact.json         NEW     EN + ES copy (data-model §2)
src/content/settings/settings.json       MODIFY  + contactFormPrivacyApproved: false (contactEmail absent until OQ-C1)
src/content/pageMeta/pageMeta.json       MODIFY  + 4 non-indexable result-page entries
src/lib/contact/schema.ts                NEW     Zod schema for ContactPageContent
src/lib/contact/contact-repository.ts    NEW     getContactPage(locale), getContactFormGate()
src/lib/contact/gate.ts                  NEW     pure resolveContactGate()
src/lib/contact/validation.ts            NEW     pure validateEnquiry() + field limits/codes (shared with tests)
src/lib/settings/schema.ts               MODIFY  + contactEmail?, contactFormPrivacyApproved
src/lib/settings/settings-repository.ts  MODIFY  + getContactSettings()
src/i18n/ui.ts                           MODIFY  remove the `contact` block (EN + ES); nav label stays
src/i18n/index.ts                        MODIFY  LOCALIZED_ROUTES + /contact/thanks, /contact/error

src/components/ui/Btn.astro              MODIFY  optional `type` → renders <button>; <a> output unchanged
src/components/contact/ContactForm.astro NEW     form, summary, failure, status, messages island
src/scripts/contact-form.ts              NEW     enhancement script (page-load / before-swap lifecycle)
src/styles/global.css                    MODIFY  form controls, error marker, honeypot, scroll-margin
src/pages/[...lang]/contact.astro        MODIFY  stub (gate closed) or intro + ContactForm (gate live)
src/pages/[...lang]/contact/thanks.astro NEW     gated getStaticPaths
src/pages/[...lang]/contact/error.astro  NEW     gated getStaticPaths

AGENTS.md                                MODIFY  "Known gap": Contact text no longer in ui.ts

tests/unit/contact-validation.test.ts    NEW
tests/unit/contact-gate.test.ts          NEW
tests/unit/contact-repository.test.ts    NEW
tests/unit/settings-repository.test.ts   NEW or MODIFY (contact settings)
tests/e2e/support/contact-endpoint.ts    NEW     endpoint mock (research §15)
tests/e2e/contact-form.spec.ts           NEW     US1
tests/e2e/contact-form-errors.spec.ts    NEW     US2
tests/e2e/contact-form-failure.spec.ts   NEW     US3
tests/e2e/contact-form-no-js.spec.ts     NEW     US1-AS5, US3-AS3
tests/e2e/contact-form-a11y.spec.ts      NEW     keyboard, focus vs nav, axe, widths
tests/e2e/contact-form-privacy.spec.ts   NEW     cookies, storage, request allowlist
tests/e2e/contact-gate-production.spec.ts NEW    FR-GATE-001 / SC-007 against the build
tests/e2e/content-compliance.spec.ts     MODIFY  + /contact in PAGES
tests/e2e/reduced-motion.spec.ts         MODIFY  + Contact error-summary focus under reduced motion
tests/e2e/nav-bar.spec.ts                CHECK   "/contact renders as the stub page" still holds (h1 unchanged); rename the test if it now sees the form
```

### Source Code (repository root): Part B, photo refresh

```text
src/assets/photos/*.jpg                  NEW     9 masters, cropped and resized from the Pexels originals (research §18)
src/assets/photos/index.ts               NEW     Photo type + registry: pastureHerd, calvesSky, corralCow, cowsBells, cowGrazing (data-model §6)
.specify/references/new-design/_IMAGES.md MODIFY + "Site masters" table: master, source, crop rectangle, size (FR-IMG-012)

src/components/ui/Photo.astro            NEW     <picture> for a Photo, plain <img> for a path string; data-photo; priority attributes
src/components/ui/PhotoHero.astro        MODIFY  image: string | Photo; focus, focusNarrow; renders Photo (priority)
src/components/ui/Band.astro             MODIFY  same props; renders Photo (lazy)
src/components/ui/Split.astro            MODIFY  same props; renders Photo (lazy)
src/components/ui/CtaCollage.astro       MODIFY  images: (string | Photo)[3]; focus per image; renders Photo (lazy)
src/styles/global.css                    MODIFY  shade tokens; text-block pools; lighter .phero__shade / .band__shade (desktop and ≤ 991 px);
                                                 object-position from --photo-focus; <picture> fill rule; forced-colors block

src/pages/[...lang]/index.astro          MODIFY  Home hero → pastureHerd + focus
src/components/invest/Hero.astro         MODIFY  → calvesSky + focus
src/components/beef/Hero.astro           MODIFY  → corralCow + focus
src/components/beef/WhatWeSellToday.astro MODIFY → cowsBells + focus
src/components/land/GanaderiaAPasto.astro MODIFY → cowGrazing + focus
src/pages/[...lang]/about.astro          MODIFY  Why-Paraguay band → cowGrazing + focus (hero, split and CTA untouched)
src/components/beef/Ctas.astro           MODIFY  collage 2nd image → cowGrazing + focus
src/i18n/ui.ts                           MODIFY  values of whatWeSellAlt and gappAlt, EN + ES (FR-IMG-010); no new key

public/images/site/hero-mist.jpg, rider-herd.jpg, orbolo-grassfed.jpg, zebu-close.jpg, rider-green.jpg
                                         DELETE  once nothing references them (FR-IMG-012)
public/images/** (everything else)       UNTOUCHED  byte-identical (FR-IMG-002); orbolo-herd.jpg is unreferenced today and is left alone
src/scripts/motion.ts                    UNTOUCHED  selectors keep matching (contracts/photo-delivery-ui.md §4)
CLAUDE.md                                CHECK   Design Taste sentence on the photo shade, after re-running `taste`

tests/unit/kept-photos.test.ts           NEW     SHA-256 of every FR-IMG-002 file
tests/e2e/support/photo-contrast.ts      NEW     pixel sampler: lightest pixel behind each line of text
tests/e2e/photo-slots.spec.ts            NEW     FR-IMG-TEST-001
tests/e2e/photo-delivery.spec.ts         NEW     FR-IMG-TEST-002 (markup, priority, layout shift, LCP element)
tests/e2e/photo-budget-production.spec.ts NEW    SC-009 against the build (project production-build)
tests/e2e/photo-contrast.spec.ts         NEW     FR-IMG-TEST-003 + axe on the five photo pages
tests/e2e/photo-forced-colors.spec.ts    NEW     Forced Colors Mode
tests/e2e/reduced-motion.spec.ts         MODIFY  + hero photo has no animation on the <picture> path
```

**Structure Decision**: Single Astro project, extended along its declared layers:
- content: `src/content` + `src/lib/<name>`;
- presentation: `src/components`, reusing the `ui/*` shells;
- interaction: `src/scripts`.

Pure logic (validation, the gate) sits in `src/lib/contact/`, so it is unit-testable without Astro. No backend code enters this repository. The photo masters are the one addition outside those layers: `src/assets/` is where Astro's image pipeline reads from.

**Order that matters for Part B** (for `/speckit-tasks`): capture the "before" evidence first (`quickstart.md` §5: screenshots, kept-photo hashes, Lighthouse baseline, suite time). It cannot be recreated once the photos are swapped. Parts A and B touch different files except `global.css`, `ui.ts`, `playwright.config.ts` and `reduced-motion.spec.ts`, so they can be built and committed as separate stages in either order.

## Phase 0 and Phase 1 Outputs

- `research.md`: all decisions, with rationale and alternatives. There were no `NEEDS CLARIFICATION` markers to resolve in either part. Part A has four items needing approval and Part B three (listed above).
- `data-model.md`: form entities, validation rules, the client state machine, the gate truth table; the Photo registry, every photo slot (changing and kept), and the shade tokens.
- `contracts/contact-endpoint.md`, `contracts/contact-form-ui.md` and `contracts/photo-delivery-ui.md`.
- `quickstart.md`: the automated scenario maps, the manual browser checks, the closed-gate check, go-live steps, and the before/after evidence for the photo refresh.

## Constitution Re-check (post-design)

No change from the table above:
- The design adds no runtime dependency, and Part B adds no dependency of any kind.
- It keeps every string in JSON and the endpoint in config. The two alt texts stay where they already are.
- It reuses the existing shells and metadata/sitemap mechanisms.
- It covers every FR with a named test or a recorded check.
- It leaves `motion.ts`, the colour tokens and every kept photo untouched.

The only open items are the approvals listed above and the one deviation in Complexity Tracking, all explicit and none silently assumed.

## Risks

Part A:

- **Lenis versus focus-induced scrolling:** if Lenis ever fights a native `focus()` scroll, the "focused element below the nav" assertion catches it. The fallback is to scroll with `lenis.scrollTo(el, { immediate: true })` through a small export from `motion.ts`.
- **Flakiness from the dev content watcher:** the suite avoids fixture mutation entirely (preview mode, plus a separate production-build project). The existing `path-card-config-driven` flake is unrelated and still open.
- **`astro preview` in this CLI build may daemonise like `astro dev`:** `ensure-production-preview.mjs` polls the port, the same way `ensure-dev-server.mjs` does, so it works either way.

Part B:

- **Shade pools reading as dark boxes:** the pools need a wide, soft feather. Designed with `web-design-guidelines`, judged in the `taste` pass and by Vaz on the preview. The contrast test guards the opposite failure (too light).
- **Beef hero composition:** the subject of `09` is centred and the text sits in the corners (`research.md` §20). If Vaz dislikes it on the preview, the remedy is a spec delta choosing another photo for that slot, not a layout change.
- **Dev-server encoding time:** `astro dev` encodes images on every request, which slows every e2e navigation to a hero page. Measured before and after; remedies in `research.md` §26.
- **Thin margin on one budget:** `05` at 2560 px is 429 KB against 450 KB. If the eye check wants higher AVIF quality, that photo's top rung drops to 2240 px (`research.md` §21).
- **`max()` in the `sizes` attribute:** a browser that can't parse it assumes `100vw`, which under-requests on phones for the wide frame only; phones use the tall frame. `photo-budget-production.spec.ts` asserts which file Chromium picks.
- **Stock photos next to Invest and Beef copy (OQ-D2):** a legal check before launch, not before preview. No alt text or copy claims the photos show Orbolo's animals (FR-IMG-011).

## Complexity Tracking

| Deviation | Why needed | Simpler alternative rejected because |
|---|---|---|
| New dev dependency `@axe-core/playwright` | SC-005 and SC-011 require automated WCAG 2.2 AA checks with 0 violations (`research.md` §12). | Hand-written ARIA assertions can't claim "0 violations"; Lighthouse CI is heavier and embeds the same rules. |
| Replacement masters in `src/assets/photos/` instead of `public/images/site/` (constitution, Additional Constraints → Assets) | FR-IMG-006 requires AVIF/WebP/JPEG at several widths from Astro's built-in tooling, which only processes images imported from `src/` (`research.md` §17). | Keeping them in `public/` means either serving unoptimized files (fails FR-IMG-006 and SC-009) or committing about 100 generated variants and adding `sharp` as a direct dependency. The eleven kept photos stay in `public/`, so the constitution's rule still describes them. |

The constitution itself is not edited by this feature. If Vaz wants the Assets line to mention `src/assets/` for optimized photos, that is a separate reviewed PR.
