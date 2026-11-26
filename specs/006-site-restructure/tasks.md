# Tasks: Unified Site Restructure (Capital · Markets · Opportunities · About)

**Input**: `specs/006-site-restructure/` – plan.md, spec.md (approved 2026-11-25), research.md, data-model.md, contracts/, quickstart.md

**Tests**: required (Constitution II, FR-TEST6-001…004). In each phase, write the tests first and see them fail.

**Organization**: by user story. US2 comes before US1 (both P1) because Home, menu and redirects are the frame every other page is reviewed in. Plan stages: 1–2 = Phases 1–2 · 3 = Phase 3 · 4 and the form engine of 8 = Phase 4 · 5 = Phase 5 · 6 and the rest of 8 = Phases 6–7 · 7 = Phase 8 · 9 = Phase 9.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: different files, no dependency on an unfinished task in the same group (two tasks that extend the same shared test file take turns on it)
- **[US#]**: user story in spec.md
- Paths are relative to the repository root

## Rules for every task

- Deck copy is pasted verbatim from `references/orbolo-website-copy-2026-11-22.md`; strings the deck lacks come only from `contracts/candidate-copy.md`. A string in neither: stop and ask.
- No visitor-facing string in `.astro` or `.ts` files. No new dependency. No legal text. `contactFormPrivacyApproved` stays `false`.
- Do not edit `specs/001`–`005`, the constitution, or this feature's `plan.md`. Tick boxes in this file only during `/speckit-implement`.
- Each page task also adds its photos to `tests/e2e/photo-slots.spec.ts` (research R13).
- Do not commit or push. At each **Checkpoint**: `pnpm run verify` green, look at the pages in a browser at 390 px and 1440 px (screenshots in `.playwright-mcp/`), report, and **stop for Vaz's review**.
- Unit tests read `.astro/data-store.json`, and `scripts/warm-content-store.mjs` keeps an old one if it exists: after changing a collection, let a dev server rebuild it before running them.

---

## Phase 1: Setup

- [X] T001 Run `pnpm run verify` on the untouched tree and write its real result (pass/fail per step) to the implementation report; if it is red, stop and ask before changing anything in `src/`
- [X] T002 Load the `web-design-guidelines` skill and `CLAUDE.md` Design Taste, and list which shells in `src/components/ui/` each section in `contracts/pages-ui.md` uses (Constitution X); no mockup exists, so `image-to-code` is recorded as not applicable
- [X] T003 Run `npx modern-web-guidance@latest` again for dialog, accordion, forms, motion, image priority and performance, code examples included, and record in the report any advice that contradicts `research.md` (Governing Rule 8); a requirement change is proposed as a delta, never applied silently

---

## Phase 2: Foundational (blocks every story)

**Purpose**: content layer, copy check, photos, languages, menu, footer, page frames. At the end every new route shows its hero; old pages are gone.

### Tests first

- [ ] T004 [P] Write `tests/unit/support/deck.ts` (parse the deck `.md` into key → text, join PDF line breaks, drop `[TO COME…]`, `Button:`/`Link:` and `→ /route`; research R14) and `tests/unit/deck-parser.test.ts`
- [ ] T005 [P] Write `tests/unit/deck-fidelity.test.ts`: every deck key and the 25 headings of FR-GEN6-008 equal the JSON; explicit list for keys split into fields; one exemption, `contact.fields` "Video, phone or WhatsApp" (FR-CON-002). The `contact.*` keys join in Phase 4
- [ ] T006 [P] Write schema and repository tests for the new collections in `tests/unit/` (`home`, `capital`, `markets`, `opportunities`, `about`, `media`, `site`, `forms`, `choices`, `faq`, `partners`, `team`, `projects`): required text present, counts from `data-model.md`, each optional asset may be absent, malformed entry rejected
- [ ] T007 [P] Write `tests/unit/published-locales.test.ts` (a locale exists only with both the `-es` entry and its `pageMeta`) and `tests/unit/redirects.test.ts` (`/invest`, `/land` → `/capital` 301; `/beef` → `/markets` 301; `/es`, `/es/invest`, `/es/land`, `/es/beef`, `/es/about`, `/es/contact` → English twins 302)
- [ ] T008 [P] Update `tests/unit/page-meta-repository.test.ts` (exact deck `title`, description 40–220 characters, unique titles, 404 without description), `tests/unit/settings-repository.test.ts` (`interestThreshold` 10, no `contractingEntityName`), `tests/unit/not-found-repository.test.ts` and `tests/unit/about-repository.test.ts`
- [ ] T009 [P] Extend `tests/unit/kept-photos.test.ts`: each copied photo in `src/assets/photos/` has the same SHA-256 as its `public/images/` original
- [ ] T010 [P] Rewrite `tests/e2e/nav-bar.spec.ts` (four links + "Request a call" linking `/contact`, no Home link, no ES, `aria-current`, all visible at 360–1440 px) and `tests/e2e/footer-and-legal.spec.ts` (line, company, five "Footer" links, "Legal" group absent, copyright line)
- [ ] T011 [P] Rename and rewrite `tests/e2e/path-card-*.spec.ts`, `path-grid-responsive.spec.ts` and `home-hero-cards.spec.ts` to `choice-card-*.spec.ts`, `choice-grid-responsive.spec.ts` and `home-page.spec.ts` (section order, hidden heading, per-card link label, 001 rules, no word strip, no "Find your path"); update `playwright.config.ts`

### Content layer

- [ ] T012 Create `src/lib/shared/schemas.ts`: `text` (non-empty), `Photo` (`name` in the photo library, `alt`, `focus?`, `focusNarrow?`), `Action` (`link` with `href` starting `/` or `#` and never `#` alone; `call` with optional interest code; `order`), `Closing`, `Labelled` (data-model §1)
- [ ] T013 Copy the kept photos used in research R13 byte-identically into `src/assets/photos/` and turn `src/assets/photos/index.ts` into a named library with one lookup function; `public/images/` stays untouched
- [ ] T014 [P] `home`: `src/lib/home/schema.ts`, `src/lib/home/home-repository.ts`, `src/content/home/home.json` (deck §1; headings per FR-GEN6-008; "Your part in it" as `choose.heading`; no icons, no map, no El Tapir logo)
- [ ] T015 [P] `capital`: `src/lib/capital/schema.ts`, `src/lib/capital/capital-repository.ts`, `src/content/capital/capital.json` (deck §2; `offer.stack` exactly 7, `risks.cards` exactly 3)
- [ ] T016 [P] `markets`: `src/lib/markets/schema.ts`, `src/lib/markets/markets-repository.ts`, `src/content/markets/markets.json` (deck §3; `products.tiles` exactly 5, `order.steps` exactly 4; no tile link, FR-MKT-004)
- [ ] T017 [P] `opportunities`: `src/lib/opportunities/schema.ts`, `src/lib/opportunities/opportunities-repository.ts`, `src/content/opportunities/opportunities.json` (deck §4; `steps` 3, `early.stack` 4, `roadmap.more` 4; `roadmap.button.count` = "{n} people are in.")
- [ ] T018 [P] `about`: rewrite `src/lib/about/schema.ts`, `src/lib/about/about-repository.ts`, `src/content/about/about.json` (deck §5; `pillars.parts` 4 with hrefs `/capital`, `/capital#prefer-land`, `/markets`, `/opportunities#project-education`; `glossary.items` 6)
- [ ] T019 [P] `media` and `notFound`: `src/lib/media/`, `src/content/media/media.json` (body split `before`/`link`/`after`, `downloads` empty), rewrite `src/lib/notFound/schema.ts` and `src/content/notFound/notFound.json` (deck §6)
- [ ] T020 [P] `site`: `src/lib/site/schema.ts`, `src/lib/site/site-repository.ts`, `src/content/site/site.json` (menu, call button, footer incl. "© {year} Orbolo", interface labels from `contracts/candidate-copy.md`, the two `MetricValue` labels)
- [ ] T021 [P] `forms`: `src/lib/forms/schema.ts`, `src/lib/forms/forms-repository.ts`, `src/content/forms/forms.json` (deck §7 + approved labels and messages; gatherings `villa-weiss-2027-04`, `paraguay-2027-10`)
- [ ] T022 [P] `choices`: `src/lib/choices/schema.ts`, `src/lib/choices/choice-repository.ts`, `src/content/choices/choices.json` (3 cards: question / sentence / page name; images `investors`, `buyers`, `landowners` in `/images/paths/`)
- [ ] T023 [P] `faq`: `src/lib/faq/schema.ts` (groups `about`, `invest`, `buy`, `visit`), `src/lib/faq/faq-repository.ts`, `src/content/faq/faq.json` (4 / 7 / 3 / 1 = 15)
- [ ] T024 [P] `partners`, `team`, `projects`: `src/lib/partners/`, `src/lib/team/`, `src/lib/projects/` (schema + repository) and `src/content/partners/partners.json` (4, qualifier "member"), `src/content/team/team.json` (5 names, no roles, no photos), `src/content/projects/projects.json` (`remote-beekeeper`, `buffalo`, `native-forest`, `education`, `amazon-to-chaco`; no photos)
- [ ] T025 Extend `src/lib/pageMeta/schema.ts` and `src/content/pageMeta/pageMeta.json` (`title`; new routes; old and `/es` routes removed; thanks/error not indexable), `src/lib/settings/*` and `src/content/settings/settings.json` (`interestThreshold`, remove `contractingEntityName`), `src/lib/legal/schema.ts` and `legal-repository.ts` (accept `imprint`; add no entry)
- [ ] T026 Register the new collections and remove `invest`, `beef`, `land`, `ranches`, `paths` in `src/content.config.ts` (depends on T014–T025 except contact; done together with T035)

### Languages, routes, frames

- [ ] T027 Create `src/lib/site/published-locales.ts` and use it for `getStaticPaths`; reduce `src/i18n/index.ts` to locale helpers (remove `LOCALIZED_ROUTES`)
- [ ] T028 Create `src/lib/site/redirects.ts` and wire it into `redirects` in `astro.config.mjs`; check the status codes in `astro dev` and record them (research R4 did not test this)
- [ ] T029 Rework `src/components/ui/Photo.astro` (library names, kinds `card` and `figure`, one high-priority hero, reserved dimensions), `PhotoHero.astro`, `Band.astro`, `Split.astro` and `CtaCollage.astro` to take a `Photo`; remove the scroll cue from `PhotoHero.astro` and `global.css`
- [ ] T030 [P] Create `src/components/ui/ActionBtn.astro` (renders an `Action`: link; call opener `<a href="/contact" data-panel-open="call">`, with `data-interest` and `?interest=` when set; `order` renders nothing while `isOrderPublished()` in `src/lib/site/order.ts` is false)
- [ ] T031 Take the title and description from `pageMeta` in `src/components/Layout.astro`; `hreflang` from T027; remove its `ui.ts` use
- [ ] T032 [P] Rework `src/components/Nav.astro` from `site` (the call button without panel behaviour yet)
- [ ] T033 [P] Rework `src/components/Footer.astro` (two labelled groups; newsletter text only, the form arrives in T085)
- [ ] T034 Rename `PathCard`/`PathGrid` to `src/components/home/ChoiceCard.astro` and `ChoiceGrid.astro`, and `src/scripts/path-card-flip.ts` to `choice-card.ts` (front = photo + title; label from content)
- [ ] T035 Delete `src/pages/[...lang]/{invest,beef,land}.astro`, `src/components/{invest,beef,land}/`, `src/components/shared/CrossLink.astro`, `src/lib/{invest,beef,land,ranches,paths}/`, `src/content/{invest,beef,land,ranches,paths}/`, the Home strip, and the empty folders `src/pages/[locale]/` and `src/content/blogPosts/`; create `src/pages/[...lang]/{capital,markets,opportunities,media}.astro` with hero only; reduce `index.astro` to hero and cards, `about.astro` to its hero; finish `src/pages/404.astro` with `src/components/notfound/Hero.astro`; keep `MetricValue` with its labels from `site`. Contact keeps the 005 form, English only, until Phase 4
- [ ] T036 Delete `src/i18n/ui.ts` after its last import is gone (menu, footer, cards, shells, `MetricValue`); `Privacy` and `Terms` labels stay as they are
- [ ] T037 Remove the retired tests: `tests/e2e/{as-is-freeze,content-compliance,beef-page,invest-page,land-page,hidden-sections-config-driven}.spec.ts`, `tests/e2e/approved-exceptions.ts`, `tests/unit/{beef,invest,land,ranches}-repository.test.ts`; list each with its retired rule in the report (FR-TEST6-004) and remove its project from `playwright.config.ts`
- [ ] T038 Rewrite the tests that name old routes or `/es` pages: `tests/e2e/{seo-meta,crawler-files,analytics,image-alt-text,language-switch,responsive-qa,reduced-motion,not-found-page}.spec.ts`, `tests/unit/i18n.test.ts`; in the contact tests (`tests/e2e/contact-*.spec.ts`, `tests/unit/contact-*.test.ts`) remove only the Spanish cases (FR-GEN6-006); in `tests/e2e/photo-*.spec.ts` replace the old slots with the heroes that exist now. Report every removed case

**Checkpoint**: menu and footer are new, every new route shows its hero, Home shows the cards, the 005 contact form still works, `pnpm run verify` is green. Stop.

---

## Phase 3: User Story 2 – Navigation, Home and redirects (P1)

**Goal**: Home as in the deck (menu, footer and cards come from Phase 2).

**Independent test**: Home at 390 and 1440 px; menu, three cards by mouse, keyboard and touch; FAQ; every old URL.

### Tests

- [ ] T039 [P] [US2] Write `tests/e2e/routes.spec.ts` (old URLs end at the new pages; no broken internal link)
- [ ] T040 [P] [US2] Write `tests/e2e/faq.spec.ts` (4 groups, 15 questions, closed at load, independent, answers in the DOM) and `tests/unit/faq-jsonld.test.ts`
- [ ] T041 [P] [US2] Write `tests/e2e/partner-band.spec.ts` (moves only when allowed; pauses on hover, focus and button; Pause/Play label, no `aria-pressed`; no button under reduced motion or without JavaScript; each name exposed once)

### Implementation

- [ ] T042 [P] [US2] Create `src/components/ui/Figure.astro` and `src/components/ui/Disclosure.astro` (native `<details>`, no heading inside `<summary>`)
- [ ] T043 [P] [US2] Create `src/components/home/Story.astro`, `CapitalNature.astro` (text labels, optional icon slot), `Visit.astro` (two photos; optional logo and map slots)
- [ ] T044 [P] [US2] Create `src/components/shared/PartnerBand.astro` and its script in `src/scripts/motion.ts` (research R12)
- [ ] T045 [P] [US2] Create `src/components/home/Faq.astro` and `src/lib/faq/faq-jsonld.ts`, emitted through a head slot in `src/components/Layout.astro`
- [ ] T046 [US2] Assemble `src/pages/[...lang]/index.astro` in the order of `contracts/pages-ui.md` with `data-section`; styles in `src/styles/global.css` within existing tokens
- [ ] T047 [US2] Write `tests/e2e/copy-fidelity.spec.ts` for Home, menu and footer (`textContent`, reduced motion); later stories add their page

**Checkpoint**: Home reviewable. Stop.

---

## Phase 4: User Story 1 – Capital and Request a call (P1)

**Goal**: the Capital page and the visible contact form, as page and panel; nothing is sent.

**Independent test**: read `/capital`; open the panel from it; fill and send (nothing happens); repeat on `/contact` without JavaScript.

### Tests

- [ ] T048 [P] [US1] Write `tests/e2e/capital-page.spec.ts` (order, 7 stack items, 3 risks, `#prefer-land`, both CTAs) and add Capital and Contact to `copy-fidelity.spec.ts`
- [ ] T049 [P] [US1] Write `tests/unit/form-rules.test.ts`, replacing `contact-validation.test.ts`: `name` 1–120; `email` shape, ≤ 254; `interest` one of 7 codes; `bestDays` ≥ 1 of `mon…sun`; `bestParts` ≥ 1 of `morning, afternoon, evening`; `timeZone` IANA name; `channel` `video|phone|whatsapp`; `phone` ≤ 40, ≥ 6 digits, only when channel ≠ video; `notes` ≤ 2,000; lengths after trimming, UTF-16 units
- [ ] T050 [P] [US1] Write `tests/unit/form-gate.test.ts` (replaces `contact-gate.test.ts`), `tests/unit/preselection.test.ts` (data-model §5) and `tests/unit/time-zones.test.ts` (UTC present, detected zone added); update `contact-repository.test.ts`
- [ ] T051 [P] [US1] Write `tests/e2e/panels.spec.ts` (focus on Name, inert page, Esc and close button, focus back, values kept, preselection, `/contact` focuses the form instead, no repeated ids, axe 0 violations open and closed)
- [ ] T052 [P] [US1] Rewrite `tests/e2e/contact-form*.spec.ts` (6 files) and `tests/e2e/support/contact-endpoint.ts` as `forms-*.spec.ts` and `support/forms-endpoint.ts` for the open gate: new fields, errors, 422/429/5xx/network/15 s, no-JS post and thanks/error pages, privacy
- [ ] T053 [P] [US1] Replace `contact-gate-production.spec.ts` with `tests/e2e/forms-closed-production.spec.ts`: form visible, valid send = 0 requests, no success, error or "Sending…" text, values and URL unchanged, panel stays open; same with JavaScript off; thanks/error pages answer 404; nothing in cookies or storage (FR-GATE6-001, SC-009)

### Implementation

- [ ] T054 [P] [US1] Create `src/components/ui/StackBox.astro` and `src/components/capital/{Problem,Offer,Proof,Promise,PreferLand,Risks,Urgency}.astro` (problem on `--forest-deep`); assemble `src/pages/[...lang]/capital.astro`
- [ ] T055 [US1] Rewrite `src/content/contact/contact.json` and `src/lib/contact/schema.ts` for FR-CON-001/005 (English entry only; deck `contact.*`, approved labels, `thanks`, `errorPage`)
- [ ] T056 [US1] Create `src/lib/forms/rules.ts` (fields, limits and codes per form type, data-model §4), `src/lib/forms/gate.ts` (`{ sends: false } | { sends: true, endpoint, contactEmail }`), `src/lib/forms/preselection.ts`, `src/lib/forms/time-zones.ts`; remove `src/lib/contact/{gate,validation}.ts`
- [ ] T057 [US1] Move the two preview variables from `.env.development` into `scripts/ensure-dev-server.mjs`; if port 4321 already serves a dev server without them, stop it, say so, and start its own (research R6)
- [ ] T058 [US1] Create `src/components/forms/{FormShell,Field,ChoiceGroup,TimeZone}.astro` (closed: `method="dialog"` without action; open: `method="post"`; unique prefixes; honeypot and hidden fields; consent line, its link only when Privacy is approved; accessible name; email without autocorrect or autocapitalise)
- [ ] T059 [US1] Create `src/components/forms/ContactForm.astro` (FR-CON-001 order; legend "How you’d like to talk"; phone block shown by CSS `:has`) and remove `src/components/contact/`
- [ ] T060 [US1] Create `src/scripts/forms.ts` from `contact-form.ts` (several forms per page, checkbox groups, conditional phone, time-zone detection, in-place success; closed gate: validate, then nothing) and remove `contact-form.ts`
- [ ] T061 [US1] Create `src/components/forms/Panel.astro` and `src/scripts/panels.ts` (research R7; title `h2`; opener focused before `showModal()`), plus the Lenis stop/start hook in `src/scripts/motion.ts` and the dialog styles and `lenis-stopped` override in `global.css`
- [ ] T062 [US1] Put `dialog#panel-call` in `src/components/Layout.astro` on every page except `/contact`; assemble `src/pages/[...lang]/contact.astro` (reads `?interest=` with JavaScript only) and update `contact/thanks.astro` and `contact/error.astro`
- [ ] T063 [US1] Check in a browser that the call panel opens from the menu, Home hero, Home closing and both Capital buttons with the right preselection, and that the page does not shift sideways when it opens; cover each in `tests/e2e/panels.spec.ts`

**Checkpoint**: Capital and the contact form reviewable. Stop.

---

## Phase 5: User Story 3 – Markets (P2)

**Goal**: Markets without the order form (OQ-006-M3).

**Independent test**: read `/markets`; no "Request a quote"; the Capital link works.

- [ ] T064 [P] [US3] Write `tests/e2e/markets-page.spec.ts` (order, 5 unlinked tiles, 4 steps, no "Request a quote", one link to Capital, `/markets/order` answers 404 and is not in the sitemap) and add Markets to `copy-fidelity.spec.ts`
- [ ] T065 [P] [US3] Write `tests/unit/order.test.ts` (`isOrderPublished()` is false; an `order` action renders nothing)
- [ ] T066 [P] [US3] Create `src/components/ui/StepList.astro` (variants `line` and `timeline`)
- [ ] T067 [US3] Create `src/components/markets/{Products,Possible,WhyUs,Ordering,Closing}.astro` and assemble `src/pages/[...lang]/markets.astro`

**Checkpoint**: Markets reviewable. Stop.

---

## Phase 6: User Story 4 – "I'm in" (P2)

**Goal**: Opportunities with the five cards, the "I'm in" panel and the counter.

**Independent test**: open "I'm in" on two cards; counter at 9 and 10 with a mocked endpoint.

- [ ] T068 [P] [US4] Write `tests/e2e/opportunities-page.spec.ts` (order, ids `projects` and `project-<id>`, cards without photos, "More ideas" closed and without buttons, both arrow links) and add Opportunities to `copy-fidelity.spec.ts`
- [ ] T069 [P] [US4] Write `tests/unit/counter.test.ts` and `tests/e2e/counter.spec.ts` (9, 10, error, 5 s timeout, no JavaScript, closed gate = no request; threshold 10 from settings)
- [ ] T070 [P] [US4] Write `tests/e2e/interest-panel.spec.ts` (title = project, `projectId`, distinct accessible names, consent line, closed and open sending, repeat registration = same success, no-JS inline form) and extend `form-rules.test.ts` (`interest`: name, email, projectId)
- [ ] T071 [P] [US4] Create `src/components/opportunities/{Steps,Projects,ProjectCard,EarlyStack,Proof}.astro` and "More ideas" with `Disclosure.astro`
- [ ] T072 [US4] Create `src/components/forms/InterestForm.astro`, `dialog#panel-interest` and the `<noscript>` form per card (research R8; button shown only with JavaScript)
- [ ] T073 [US4] Create `src/scripts/counter.ts` and `src/lib/projects/counter.ts` (`contracts/forms-endpoint.md`, Counts)
- [ ] T074 [US4] Assemble `src/pages/[...lang]/opportunities.astro`, leaving the gatherings and "Bring something" sections for Phase 7

**Checkpoint**: cards, panel and counter reviewable. Stop.

---

## Phase 7: User Story 5 – Gatherings, ideas, partnering (P3)

**Goal**: the rest of Opportunities.

**Independent test**: apply for a seat, send an idea, use the three panel lines; check preselection.

- [ ] T075 [P] [US5] Write `tests/e2e/gathering-and-idea.spec.ts` (fields, two gatherings, closed and open sending, no-JS inline form; idea: visible label, `idea.success` in place) and extend `form-rules.test.ts` (`gathering`, `bring` 1–300; `idea` 1–280)
- [ ] T076 [P] [US5] Extend `tests/e2e/panels.spec.ts` with Partnering, Something else and Introducing someone, and the two "Let’s talk" names
- [ ] T077 [P] [US5] Create `src/components/forms/GatheringForm.astro` with `dialog#panel-gathering` and its `<noscript>` form
- [ ] T078 [P] [US5] Create `src/components/forms/IdeaForm.astro`
- [ ] T079 [US5] Create `src/components/opportunities/{Gatherings,BringSomething,Closing}.astro` and add them to `src/pages/[...lang]/opportunities.astro`

**Checkpoint**: Opportunities complete. Stop.

---

## Phase 8: User Story 6 – About, media kit, newsletter (P3; the 404 page is finished in Phase 2)

**Goal**: the remaining pages and the footer form.

**Independent test**: read `/about`, open the glossary, follow the four cycle links; `/media`; an unknown URL; subscribe.

- [ ] T080 [P] [US6] Write `tests/e2e/about-page.spec.ts` (order, quote markup, five names only, glossary closed with 6 terms, cycle links land on their targets below the nav) and add About, Media and 404 to `tests/e2e/copy-fidelity.spec.ts`
- [ ] T081 [P] [US6] Write `tests/e2e/media-page.spec.ts` (no download links; "contact form" opens the panel with Press)
- [ ] T082 [P] [US6] Write `tests/e2e/newsletter.spec.ts` (once per page, visible label, closed and open sending, works on `/contact` beside the contact form) and extend `form-rules.test.ts` (`newsletter`: email)
- [ ] T083 [P] [US6] Create `src/components/about/{Chapter,Quote,Cycle,Principles,Team,Partners,Glossary}.astro` and assemble `src/pages/[...lang]/about.astro`
- [ ] T084 [P] [US6] Assemble `src/pages/[...lang]/media.astro`
- [ ] T085 [US6] Create `src/components/forms/NewsletterForm.astro` and add it to `src/components/Footer.astro`

**Checkpoint**: every page and form reviewable. Stop.

---

## Phase 9: Polish and cross-cutting

- [ ] T086 [P] Complete `tests/e2e/photo-{slots,delivery,contrast,forced-colors,budget-production}.spec.ts` against the whole table in research R13 and FR-IMG6
- [ ] T087 [P] Write `tests/e2e/absent-assets.spec.ts` (no empty figure, image, logo, icon, map or download left behind) and `tests/e2e/axe-pages.spec.ts` (every page, panels open and closed, 390 and 1440 px, 0 violations)
- [ ] T088 [P] Extend `tests/e2e/{reduced-motion,responsive-qa,seo-meta,crawler-files,analytics,image-alt-text}.spec.ts` to every new page (CLS 0 from images, no cookies or storage, no third party except Plausible)
- [ ] T089 Remove what nothing imports any more in `src/` (styles of removed sections, `strip` keyframes if unused); leave `public/images/` alone
- [ ] T090 Run the `web-design-guidelines` audit on all changed UI files in `src/components/` and fix findings that need no new copy or decision; list the rest
- [ ] T091 Run the `taste` pass against localhost; apply only fixes within CLAUDE.md tokens; propose, do not apply, changes to `CLAUDE.md` and `orbolo-localhost.md`
- [ ] T092 Walk through `specs/006-site-restructure/quickstart.md` 1–14 (Lighthouse and the 2-minute check by hand) and record the results
- [ ] T093 Propose, as a diff for review, the updates to `README.md` and `AGENTS.md` (routes, retired rules, strings in JSON)
- [ ] T094 Run `pnpm run verify` (`package.json`); report its output, the list of removed or rewritten tests (FR-TEST6-004) and everything left undone

**Checkpoint**: Vaz reviews the site against the deck (SC-011).

---

## Not in these tasks (waiting)

Order form (OQ-006-M3) · host 301 rules · Spanish pages · imprint, privacy and terms text · opening the gate · no-JS result pages for the small forms · unsubscribe · server

## Dependencies

- Phase 1 → Phase 2 → all stories. Inside Phase 2: T012–T013 → T014–T024 → T025; T027–T034 need T020, T022 and T025; T026 and T035 together; then T036, T037, T038.
- **US2** needs Phase 2 only.
- **US1** needs Phase 2; its panel is also checked from Home (T063), so it follows US2. Inside it: T055–T057 → T058 → T059–T062 → T063.
- **US3** needs Phase 2; its page is independent of the forms.
- **US4** needs US1 (form engine, panels). **US5** needs US4 (page) and US1.
- **US6** About needs Phase 2; the newsletter and the media kit's Press link need US1; the Education cycle link needs US4.
- Phase 9 needs all stories.

## Parallel examples

- Phase 2: T004–T011 together; then T014–T024 together; then T030, T032, T033.
- US2: T039–T041 together; then T042–T045.
- US1: T048–T053 together; T054 beside T055.
- US3: T064–T066 together. US4: T068–T071. US5: T075–T078. US6: T080–T084.

## Implementation strategy

1. Phases 1–2, then **US2 + US1 = first version to look at** (Home, Capital, contact form and panel).
2. Add US3, US4, US5, US6 one at a time, each reviewed.
3. Phase 9, then the final review.
