---

description: "Task list for 005: contact form (native form, self-hosted endpoint) and background-photo refresh"
---

# Tasks: Orbolo Website – Contact Form and Background-Photo Refresh

**Input**: Design documents from `/specs/005-contact-form/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (`contact-endpoint.md`, `contact-form-ui.md`, `photo-delivery-ui.md`), quickstart.md

**Tests**: Included. The spec requires them (FR-TEST-001…003, FR-IMG-TEST-001…004; Constitution II). Within each story, write the tests first and see them fail before implementing.

**Organization**: Tasks are grouped by user story. The feature has two independent parts: the contact form (US1–US4) and the photo refresh (US5).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: The user story the task belongs to (US1–US5)
- Paths are relative to the repository root

## Approvals (as of 2026-11-14)

Vaz approved the spec's status on 2026-11-14 and settled five of the plan's eight decisions in `/speckit-clarify` the same day (`spec.md` → Clarifications, "Session 2026-11-14 (after planning)"). The remaining three were approved on 2026-11-14 at the start of `/speckit-implement`. None is open.

| Decision | Status | Tasks that depend on it | If Vaz decides otherwise |
|---|---|---|---|
| 1. Dev dependency `@axe-core/playwright` | Approved | T005, the axe parts of T048 and T075 | SC-005 and SC-011 need a different check or a spec change |
| 2. Plausible is the only third-party host allowed on Contact pages | Approved | T072 | – |
| 3. Publishing gate conditions | Decided: the two in FR-GATE-001 only. Team email and published Privacy page are go-live checks by a person | T011, T015, T020, T023 | – |
| 4. Dev preview mode (`.env.development`) | Approved | T009 and every contact-form e2e test | The form can't be shown in e2e without a different mechanism; re-plan |
| 5. Topic labels | Decided: the spec's FR-FIELD-002 candidates | T018 | A JSON-only edit in `contact.json` |
| 6. Photo masters in `src/assets/photos/` | Approved | T051–T053, T055–T065 | – |
| 7. SC-009 measured at 390 px 3×, and 1440 px 1× and 2× | Approved | T046 | – |
| 8. Contrast checks also on Contact and 404 | Approved | T048 | – |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Record the approvals, capture evidence that can't be recreated later, and add the shared test infrastructure.

- [x] T001 (Done 2026-11-14: Vaz approved 1 and 4 and chose the spec's candidate labels for 5.) Get Vaz's answer on the three open decisions (1, 4 and 5) and record each answer with its date under "Decisions: status after the 2026-11-14 clarification session" in `specs/005-contact-form/plan.md`. Do not start a task listed against an open decision in the table above until that decision is recorded.
- [x] T002 Fold the approved deltas into `specs/005-contact-form/spec.md` (Constitution VII). Done on 2026-11-14 in `/speckit-clarify`: SC-003, FR-AN5-002, FR-GATE-001, OQ-C1, SC-009, FR-IMG-TEST-002, FR-IMG-006, FR-IMG-TEST-003, SC-011 and the stale Assumptions sentence were updated, with one Clarifications bullet per answer.
- [x] T003 Before any file under `src/` or `public/` is changed, capture the "before" screenshots of the seven slots in `specs/005-contact-form/data-model.md` §7 "Slots that change", in EN, at 1440×900 and 390×844, into `.playwright-mcp/005-photo-refresh/before/` (Playwright MCP or the `playwright-cli` skill, `pnpm dev` running). File names: `<page>-<section>-<width>.png`.
- [x] T004 [P] Before any file under `src/` or `public/` is changed, record the performance baseline per `specs/005-contact-form/quickstart.md` §5.3–5.4: `pnpm build && npx astro preview --port 4322`, then `npx lighthouse` (mobile, performance only) on `/`, `/invest` and `/beef`, saving JSON to `.playwright-mcp/005-photo-refresh/before/{home,invest,beef}.json`; write LCP, CLS and the wall time of `pnpm run test:e2e` to `.playwright-mcp/005-photo-refresh/before/baseline.md`. Lighthouse is not added to `package.json`.
- [x] T005 Add the dev dependency with `pnpm add -D @axe-core/playwright` (changes `package.json` and `pnpm-lock.yaml`). Only if decision 1 is approved in T001. *(Also added during implementation, with Vaz's approval on 2026-11-14: `pnpm add -D sharp@0.35.4`, because `astro build` fails with "Could not find Sharp" under pnpm without it.)*
- [x] T006 [P] Create `scripts/ensure-production-preview.mjs`, modelled on `scripts/ensure-dev-server.mjs`: if `http://localhost:4322/` already answers, exit 0; otherwise run `astro build` with `PUBLIC_CONTACT_ENDPOINT` and `CONTACT_FORM_PREVIEW` deleted from the child environment, then spawn `astro preview --port 4322` detached and poll every 300 ms for up to 60 s, exiting 1 on timeout (`research.md` §4).
- [x] T007 In `playwright.config.ts`, add a project `production-build` (`devices["Desktop Chrome"]`, `baseURL: "http://localhost:4322"`, `testMatch: /-production\.spec\.ts$/`) and add `/-production\.spec\.ts$/` to `testIgnore` of `chromium` and `mobile-chrome`. In `package.json`, change `pretest:e2e` to `node scripts/ensure-dev-server.mjs && node scripts/ensure-production-preview.mjs`. Depends on T006.

---

## Phase 2: Foundational (Blocking Prerequisites for the contact form)

**Purpose**: Configuration, content, the publishing gate and the validation rules that US1–US4 all use. US5 does not depend on this phase; it needs only T003, T004 and T007.

**⚠️ CRITICAL**: No contact-form story (US1–US4) can start until this phase is complete.

### Tests and dev preview setup (write the tests first, see them fail)

- [x] T008 [P] Write `tests/unit/contact-validation.test.ts` for `validateEnquiry()` (FR-TEST-001). Cover every rule in `specs/005-contact-form/data-model.md` §1, applied after trimming: `name` "1–120 chars" (`required`, `too_long`); `email` "≤ 254 chars; shape `local@domain.tld` (no whitespace, exactly one `@`, a dot in the domain, non-empty parts); Unicode allowed" (`required`, `invalid`, `too_long`); `phone` "≤ 40 chars, free format", "yes if `callMe`" (`required_for_call`, `too_long`); `organisation` "≤ 160 chars" (`too_long`); `topic` "`remote-rancher` | `beef` | `land` | `other`" (`required`, `invalid`); `message` "10–2,000 chars" (`required`, `too_short`, `too_long`). Test each boundary (120/121, 254/255, 40/41, 160/161, 9/10, 2000/2001), plus-addressing and internationalised-domain emails accepted, precedence `required` → `invalid` → `too_short`/`too_long`, one code per field, and errors returned in field order.
- [x] T009 Create `.env.development` with exactly `PUBLIC_CONTACT_ENDPOINT=https://contact-endpoint.orbolo.test/contact` and `CONTACT_FORM_PREVIEW=true` (`research.md` §3). It holds no secrets and is committed; confirm `.gitignore` does not exclude it. Only if decision 4 is approved in T001.
- [x] T010 [P] Write `tests/unit/contact-repository.test.ts`: `getContactPage("en")` and `getContactPage("es")` resolve; every key in `data-model.md` §2 is a non-empty string; each `errors.<field>` object has exactly the codes listed in §1 for that field; `form.topic.options` has exactly the keys `remote-rancher`, `beef`, `land`, `other`; `stubBody` equals today's text from `src/i18n/ui.ts` (`contact.body`) verbatim in both languages.
- [x] T011 [P] Write `tests/unit/contact-gate.test.ts` for `resolveContactGate()`: the full truth table in `data-model.md` §4. Production (`isDev: false`): live only when `endpoint` is set and `privacyApproved` is true (the two conditions of FR-GATE-001, clarified 2026-11-14); either one missing gives `{ live: false }`; `contactEmail` is not a condition and is passed through as given, including `undefined`; `preview: true` is ignored. Dev with `preview: true`: live when `endpoint` is set, with `contactEmail` falling back to `contact@example.com` and `preview: true` in the result; without `endpoint`, closed.
- [x] T012 [P] Write `tests/unit/settings-repository.test.ts` (or extend it if it exists) for `getContactSettings()`: returns `{ contactEmail: undefined, contactFormPrivacyApproved: false }` for today's `settings.json`.

### Implementation

- [x] T013 In `astro.config.mjs`, add `env.schema` with `PUBLIC_CONTACT_ENDPOINT: envField.string({ context: "client", access: "public", optional: true, url: true })` and `CONTACT_FORM_PREVIEW: envField.boolean({ context: "server", access: "public", default: false })` (`research.md` §1, §3; FR-GATE-002).
- [x] T014 [P] Create `src/lib/contact/validation.ts`: pure TypeScript, no Zod. Export the field limits and error codes as constants, and `validateEnquiry(values)` returning `Partial<Record<Field, ErrorCode>>` with the rules, units (UTF-16 code units, same as HTML `maxlength`), order and precedence in `data-model.md` §1. Makes T008 pass.
- [x] T015 [P] Create `src/lib/contact/gate.ts`: pure `resolveContactGate(input: GateInput): ContactFormGate` with the types and table in `data-model.md` §4. Makes T011 pass.
- [x] T016 [P] Add the two settings fields: in `src/lib/settings/schema.ts`, `contactEmail: z.email().optional()` and `contactFormPrivacyApproved: z.boolean()`; in `src/content/settings/settings.json`, `"contactFormPrivacyApproved": false` (no `contactEmail` until OQ-C1); in `src/lib/settings/settings-repository.ts`, `getContactSettings()` beside `getSocialPreviewDefaults()` with the same "entry must exist" behaviour. Makes T012 pass.
- [x] T017 Create `src/lib/contact/schema.ts`: a Zod schema for `ContactPageContent` with exactly the tree in `data-model.md` §2. All strings `z.string().min(1)`; `id` is `"contact" | "contact-es"`; each `errors.<field>` is a `z.object` with exactly that field's codes; `form.topic.options` is a `z.object` with the four contract codes as keys.
- [x] T018 Create `src/content/contact/contact.json` with entries `contact` and `contact-es` matching T017. Move `title`, `h1` and `stubBody` verbatim from `src/i18n/ui.ts` (`contact.title`, `contact.h1`, `contact.body`, EN and ES). Topic labels: the FR-FIELD-002 candidates. Error messages say what to do (FR-UX-005), e.g. "Enter an email address like name@example.com"; `phone.required_for_call`: "Add a phone number so we can call you". `errors.titlePrefix` is "Error: " in both languages. No reply time is promised in `thanks.body` (OQ-C6). No banned word from `specs/_shared/references/orbolo-website-brief.md`, no investment or returns language (FR-GEN5-003). The privacy line states that the details are used only to reply to the enquiry; do not write further legal text (FR-LEG5-002).
- [x] T019 Register the `contact` collection in `src/content.config.ts` (`file("src/content/contact/contact.json")`, schema from T017), following the existing collections. Depends on T017, T018.
- [x] T020 Create `src/lib/contact/contact-repository.ts`: `getContactPage(locale)` (uses `localizedId("contact", locale)`; throws if the entry is missing, like `getInvestPage`) and `getContactFormGate()`, which builds the `GateInput` from `astro:env` (`PUBLIC_CONTACT_ENDPOINT`, `CONTACT_FORM_PREVIEW`), `import.meta.env.DEV` and `getContactSettings()`, and returns `resolveContactGate(input)`. Makes T010 pass. Depends on T015, T016, T019.
- [x] T021 Switch the stub to JSON content: in `src/pages/[...lang]/contact.astro`, read `title`, `h1` and `stubBody` from `getContactPage(locale)` instead of `t.contact.*`; then delete the `contact` block (EN and ES) and its type from `src/i18n/ui.ts`, keeping the nav label `contact`. The rendered page must be identical to today's (FR-GEN5-004). Depends on T020.
- [x] T022 [P] Create `tests/e2e/support/contact-endpoint.ts` exporting `mockContactEndpoint(page, behaviour)` per `research.md` §15: routes `https://contact-endpoint.orbolo.test/**`; behaviours `success` (`201`, `{"ok":true}`), `fieldErrors` (`422` with a codes body), `rateLimited` (`429`), `serverError` (`500`), `networkError` (`route.abort()`), `hang` (never fulfils); answers the `OPTIONS` preflight with `204` and the CORS headers in `contracts/contact-endpoint.md`; adds `Access-Control-Allow-Origin` to every response; records every POST body; for a form-encoded POST, answers `303` to the local thanks or failure page for the request's `locale`.
- [x] T023 [P] Write `tests/e2e/contact-gate-production.spec.ts` (project `production-build`; FR-GATE-001, SC-007): `/contact` and `/es/contact` show the stub text and contain no `<form>` and no `[data-contact-form]`; `/contact/thanks`, `/contact/error`, `/es/contact/thanks` and `/es/contact/error` return 404; `/sitemap.xml` lists none of them. Depends on T007.

**Checkpoint**: `pnpm run test:unit` is green for the four new unit tests; `/contact` looks and reads exactly as before; the production gate test is green.

---

## Phase 3: User Story 1 – A visitor sends an enquiry and knows it arrived (Priority: P1) 🎯 MVP

**Goal**: A visitor fills the form on `/contact` or `/es/contact`, sends it once to the endpoint, and lands on the thanks page in their language. It also works without JavaScript.

**Independent Test**: With the endpoint mocked to succeed, fill the required fields, send, and confirm exactly one POST with the contract's fields and a landing on `/contact/thanks`; repeat on `/es/contact` → `/es/contact/thanks`.

### Tests for User Story 1 (write first, see them fail)

- [x] T024 [P] [US1] Write `tests/e2e/contact-form.spec.ts` using `mockContactEndpoint(page, "success")`, in EN and ES: (AS1/AS2) a valid send makes exactly one POST whose JSON body has exactly the keys in `contracts/contact-endpoint.md` (`name`, `email`, `phone`, `organisation`, `topic`, `message`, `locale`, `page`, `renderedAt`, `website`, and `callMe: true` only when ticked), then the URL is `/contact/thanks` or `/es/contact/thanks`; (AS3) arriving via a CTA link to `/contact`, no radio is checked; (AS4) a second press while sending still gives one POST, and the button has `aria-busy="true"` with the label `send.sending`; script init sets `novalidate`, fills `renderedAt` and sets `data-contact-ready`; the Send button is never `disabled` (FR-UX-009); the remaining-characters hint updates while typing in Message.
- [x] T025 [P] [US1] Write `tests/e2e/contact-form-no-js.spec.ts` with `test.use({ javaScriptEnabled: false })` (US1-AS5): the form has `method="post"`, `action` equal to the endpoint and native `required`/`type`/`maxlength`/`minlength` attributes; submitting valid data posts form-encoded and, via the mock's `303`, lands on the thanks page, in EN and ES.

### Implementation for User Story 1

- [x] T026 [P] [US1] Extend `src/components/ui/Btn.astro` with an optional `type?: "submit" | "button"`: when `type` is given and `href` is not, render `<button type={type}>` with the same inner markup and classes; make `href` optional in `Props`. Existing `<Btn href>` calls must render byte-identically (`research.md` §10).
- [x] T027 [P] [US1] Add the thanks pages to routing metadata: in `src/content/pageMeta/pageMeta.json`, entries `contactThanks` (`/contact/thanks`) and `contactThanksEs` (`/es/contact/thanks`) with `indexable: false` and a 40–220 character description in the voice of the other entries; in `src/i18n/index.ts`, add `"/contact/thanks"` to `LOCALIZED_ROUTES`. Update `tests/unit/i18n.test.ts` and `tests/unit/page-meta-repository.test.ts` only where they pin the old lists.
- [x] T028 [US1] Create `src/components/contact/ContactForm.astro` with exactly the DOM in `contracts/contact-form-ui.md` → "Gate-live rendering": props are the content from `getContactPage`, the endpoint, the contact email and the preview flag; seven fields in the FR-FIELD-001 order, one per row, each with a `<label for>` above it and `optionalMarker` inside the label of optional fields; `autocomplete` tokens `name`, `email`, `tel`, `organization`; topic as `<fieldset id="contact-topic">` with `<legend>` and four radios, none checked; honeypot `website` inside `div[aria-hidden="true"].contact-hp` with `tabindex="-1"` and `autocomplete="off"`; hidden `locale`, `page`, `renderedAt`; privacy line with a link to `/privacy`; Send as `<Btn type="submit" variant="light" data-contact-send>`; empty `[data-contact-summary]` (`tabindex="-1"`, `hidden`), `[data-contact-status]` (`role="status"`, `aria-live="polite"`) and `[data-contact-failure]` (`hidden`); the localized errors and states in `<script type="application/json" data-contact-messages>`; `[data-contact-preview]` flag only when `preview` is true. No field beyond FR-FIELD-001/003 (FR-FIELD-004). No copy hard-coded.
- [x] T029 [US1] Add form control styles to `src/styles/global.css` per `research.md` §11 and CLAUDE.md Design Taste: transparent controls on forest, paper text, 1.5px hairline border, lime border and the existing 2px lime outline on focus, square corners, `.caps` labels, control font size `max(16px, 1em)` (FR-UX-016), radio and checkbox targets at least 24×24 CSS px (FR-UX-014), single column, `.contact-hp` moved off-screen (not `display: none`), no horizontal scroll at 390 px. Consult `web-design-guidelines` while designing (Constitution X).
- [x] T030 [US1] In `src/pages/[...lang]/contact.astro`, branch on `getContactFormGate()`: closed → the stub from T021, unchanged; live → `PhotoHero` with `h1` and `intro` as side text, followed by an `Edit` section whose head is `<h2 id="contact-form-heading">` (`form.heading`) and whose body is `ContactForm`. Depends on T028.
- [x] T031 [US1] Create `src/scripts/contact-form.ts` and load it from `ContactForm.astro`: initialise on `astro:page-load` and tear down on `astro:before-swap` (same lifecycle as `src/scripts/motion.ts`); read messages from `[data-contact-messages]`; at init add `novalidate`, set `renderedAt` to epoch ms and set `data-contact-ready`; update `#contact-message-remaining` on input, with a separate polite live region debounced by 1 s; on submit, run `validateEnquiry` from `src/lib/contact/validation.ts` and, when valid, POST the JSON body of `contracts/contact-endpoint.md` with `credentials: "omit"`, ignoring further presses while in flight, setting `aria-busy="true"` and the `send.sending` label, and announcing through `[data-contact-status]`; on `201`, `location.assign` the locale's thanks path with no query string. Leave the invalid and failure branches as calls to functions implemented in US2 and US3. Never clear a field value (FR-UX-007).
- [x] T032 [US1] Create `src/pages/[...lang]/contact/thanks.astro`: `getStaticPaths` returns `localeStaticPaths()` when `getContactFormGate()` is live and `[]` when closed; renders `thanks.h1`, `thanks.body` and a link to Home (`thanks.homeLabel`, via `path("/")`) inside `Layout` with `title` = `thanks.title` (FR-PAGE-001, FR-PAGE-003). Reuse the `PhotoHero` (`center`) or `Edit` shell; no new section style.

**Checkpoint**: T024 and T025 pass. A valid enquiry reaches the mocked endpoint once and the visitor lands on the thanks page, in both languages, with and without JavaScript.

---

## Phase 4: User Story 2 – A visitor who makes a mistake is told exactly what to fix (Priority: P1)

**Goal**: A failed Send shows an error summary and inline messages, moves focus to the summary, prefixes the title, and keeps every typed value.

**Independent Test**: Submit the empty form, then the form with only an invalid email; confirm the summary, inline messages, focus, title prefix, preserved values and zero requests to the endpoint.

### Tests for User Story 2 (write first, see them fail)

- [x] T033 [P] [US2] Write `tests/e2e/contact-form-errors.spec.ts`, in EN and ES: (AS1) an empty Send makes 0 requests, shows `[data-contact-summary]` focused, with one link per error in field order, each `href="#contact-<field>"`, and `document.title` starting with `errors.titlePrefix`; (AS2) each errored control has `aria-invalid="true"` and an `aria-describedby` that includes `contact-<field>-error`, whose text carries the visually hidden `errors.inlinePrefix`; (AS3) typed values are still present after the failure; (AS4) fixing one field and sending again lists only the remaining errors, and the title prefix goes away once validation is clean; (AS5) with `mockContactEndpoint(page, "fieldErrors")`, the `422` codes render the same way; clicking a summary link focuses its field (the topic entry focuses `#contact-topic-first`) without a smooth-scroll, and the focused element's box is below the nav's bottom edge; ticking "Please call me" without a phone gives the `phone.required_for_call` message; after a failed Send, leaving a corrected field removes its error (FR-UX-002).

### Implementation for User Story 2

- [x] T034 [US2] In `src/scripts/contact-form.ts`, implement the invalid state: fill and unhide `[data-contact-summary]` (heading `errors.summaryHeading`, one `<li><a href="#contact-<field>">` per error in field order), focus it, add `p#contact-<field>-error` under each faulty field with the hidden prefix and the localized message, set `aria-invalid="true"` and append the error id to `aria-describedby` after any hint id, and prefix `document.title` with `errors.titlePrefix`. Clear all of it on the next clean validation. No `role="alert"` on the summary (`research.md` §9).
- [x] T035 [US2] In `src/scripts/contact-form.ts`, handle clicks on summary links: `preventDefault()` and `stopPropagation()` so `initAnchors()` in `src/scripts/motion.ts` does not hijack them, then focus the field (first radio for the topic). After the first failed Send, re-validate a field when it loses focus.
- [x] T036 [US2] In `src/scripts/contact-form.ts`, map a `422` response's `{"errors":{field: code}}` onto the same rendering as local errors; an unknown field or code is treated as the generic failure of US3 (`contracts/contact-endpoint.md` → "Unknown codes").
- [x] T037 [US2] In `src/styles/global.css`, style the error summary and inline errors: text in paper, the square lime marker used by `.flag` beside each message so errors are not colour-only (FR-UX-008), a lime hairline on invalid controls, and `scroll-margin-top` at least the nav's height on the summary, every control and the legend (WCAG 2.4.11). No animation.

**Checkpoint**: T033 passes; US1's tests still pass.

---

## Phase 5: User Story 3 – A visitor still has a way through when the server is unreachable (Priority: P2)

**Goal**: On a timeout, a server error or rate limiting, the visitor sees a plain failure message with the team email, keeps what they typed, and never sees the thanks page.

**Independent Test**: Mock the endpoint to fail (network error, 15 s hang, `429`, `500`) and confirm the failure message, the `mailto:` link, preserved values and an unchanged URL.

### Tests for User Story 3 (write first, see them fail)

- [x] T038 [P] [US3] Write `tests/e2e/contact-form-failure.spec.ts`, in EN and ES: (AS1) `serverError` and `networkError` show `[data-contact-failure]` with `failure.generic` and a `mailto:` link to the contact email, values intact, URL unchanged, status region announcing; a `hang`, fast-forwarded 15 s with `page.clock`, gives the same result (FR-UX-011); (AS2) `rateLimited` shows `failure.rateLimited` with the same link; after a failure, Send works again.
- [x] T039 [US3] Extend `tests/e2e/contact-form-no-js.spec.ts` (US3-AS3): with JavaScript disabled and the mock answering `303` to the failure page, the visitor lands on `/contact/error` or `/es/contact/error`, which shows the `mailto:` link and a link back to that locale's Contact page.

### Implementation for User Story 3

- [x] T040 [US3] In `src/scripts/contact-form.ts`, implement the failed states: abort the request after 15 s with `AbortController`; on `429` show `failure.rateLimited`; on `5xx`, a network error, the timeout or an unknown `422` code show `failure.generic`; both followed by `failure.emailLead` with `{email}` rendered as a `mailto:` link (omit that sentence only when the gate's `contactEmail` is unset); unhide `[data-contact-failure]`, clear `aria-busy`, restore the Send label, and announce through `[data-contact-status]` (FR-UX-012, FR-UX-013). Style the block in `src/styles/global.css` with the same marker as inline errors.
- [x] T041 [P] [US3] Add the failure pages to routing metadata: in `src/content/pageMeta/pageMeta.json`, entries `contactError` (`/contact/error`) and `contactErrorEs` (`/es/contact/error`) with `indexable: false`; in `src/i18n/index.ts`, add `"/contact/error"` to `LOCALIZED_ROUTES`.
- [x] T042 [US3] Create `src/pages/[...lang]/contact/error.astro`: gated `getStaticPaths` exactly like `thanks.astro`; renders `errorPage.h1`, `errorPage.body`, the `mailto:` link to the gate's `contactEmail` (omitted only when it is unset), and a link back to Contact (`errorPage.backLabel`, via `path("/contact")`), with `title` = `errorPage.title` (FR-PAGE-002, FR-PAGE-003).

**Checkpoint**: T038 and T039 pass; US1 and US2 tests still pass.

---

## Phase 6: User Story 5 – A brighter, happier Orbolo without losing readability or speed (Priority: P2)

**Goal**: Seven slots on Home, Invest, Beef, Land and About show the five bright replacement photos, delivered as AVIF/WebP/JPEG at the right size, under a shade that is clear where no text sits and passes AA where text sits. Motion, copy and the eleven kept photos are unchanged.

**Independent Test**: In EN and ES at 390 px and 1440 px, every slot in FR-IMG-001 shows its replacement and every kept placement its current file; every text block over a photo passes AA; each page has one high-priority image, the hero; a phone never downloads a desktop-sized file.

**Prerequisites**: T003, T004 and T007 done. Decision 6 was approved on 2026-11-14. Independent of Phases 2–5.

### Tests for User Story 5 (write first, see them fail)

- [x] T043 [P] [US5] Write `tests/unit/kept-photos.test.ts` (FR-IMG-002, SC-012): for each of `brahman-four.jpg`, `florian.jpg`, `gaucho-nelore.jpg`, `grazing-bright.jpg`, `nelore-herd.jpg`, `orbolo-cattle-shade.jpg`, `orbolo-gauchos.jpg`, `orbolo-palms.jpg`, `orbolo-walk.jpg`, `pasture-top.jpg`, `shade-tree.jpg`, `cow-lines-lime.png` in `public/images/site/`, and every file in `public/images/paths/`, `public/images/brand/`, `public/images/branding/` and `public/images/social/`, assert that its SHA-256 equals a value pinned in the test. Take the pinned values from `HEAD` (`git show HEAD:<path> | shasum -a 256`), not from the working tree. Uses only `node:fs` and `node:crypto`.
- [x] T044 [P] [US5] Write `tests/e2e/photo-slots.spec.ts` (FR-IMG-TEST-001), in EN and ES at 390×844 and 1440×900: each slot in `data-model.md` §7 "Slots that change" contains an `<img>` whose `data-photo` is the expected name (`pasture-herd`, `calves-sky`, `corral-cow`, `cows-bells`, `cow-grazing`) and which, once scrolled into view, has `complete === true` and `naturalWidth > 0`; each placement in §7 "Slots that must not change" has `src` equal to its current `/images/site/<file>` path; no page has two shell photos with the same `data-photo`; the two Split alts equal the FR-IMG-010 text for the page's language.
- [x] T045 [P] [US5] Write `tests/e2e/photo-delivery.spec.ts` (FR-IMG-TEST-002, `contracts/photo-delivery-ui.md` §2–§4), for `/`, `/invest`, `/beef`, `/land`, `/about`, `/contact` and their `/es` twins: exactly one element has `fetchpriority="high"` and it is the `<img>` inside `.phero`; that `<img>` has no `loading` attribute; nothing has `fetchpriority="low"` or `"auto"`; every `<img>` inside `.band`, `.split__media` and `.cta__collage` has `loading="lazy"`; every replaced photo is inside a `<picture>` with an `image/avif` source before an `image/webp` source, each with a `w`-descriptor `srcset` and `sizes`, and its `<img>` has `width`, `height`, `srcset` and `sizes`; the page's layout (every section and photo box, and the document height) is identical with all photos blocked and with all photos loaded; on `/`, `/invest` and `/beef` the browser requests the hero photo, and no other image, at high network priority (read through the Chrome DevTools Protocol). *(Changed during implementation: Chrome's LCP metric ignores full-viewport images, and the page's total layout-shift score includes a 0.0002 font-swap shift that predates this feature; `research.md` §22 and §25.)*
- [x] T046 [P] [US5] Write `tests/e2e/photo-budget-production.spec.ts` (project `production-build`; SC-009, `contracts/photo-delivery-ui.md` §7): for each page with a replaced photo, in three contexts (390×844 at `deviceScaleFactor: 3`; 1440×900 at 1; 1440×900 at 2), load the page, scroll through it, and collect the image responses for replaced photos (match them through each `img[data-photo]`'s `currentSrc`). Assert `content-type` is `image/avif`, body size ≤ 200 KB in the phone context and ≤ 450 KB in both desktop contexts, no response over 1 MB, and no decoded image wider than 2560 px.
- [x] T047 [P] [US5] Create `tests/e2e/support/photo-contrast.ts` per `research.md` §25: `measureTextContrast(page, { whitePhotos })` emulates reduced motion, collects every visible text node inside `.phero`, `.band` and the nav (page at the top), takes its line boxes (`Range.getClientRects()`) grown by 8 px, skips text inside an element with its own opaque background (`.flag`, `.card--glass`, `.btn`), screenshots with the text colour set to transparent (`scale: "css"`), decodes the PNG in the page with a canvas, and returns per line: selector, text, computed colour, font size and weight, the lightest pixel, the ratio and the required ratio (4.5, or 3 when the size is ≥ 24 px, or ≥ 18.66 px with weight ≥ 700). With `whitePhotos: true`, first inject a test-only style turning `.phero__media img` and `.band__bg` white (`filter: brightness(0) invert(1)`). No dependency is added.
- [x] T048 [US5] Write `tests/e2e/photo-contrast.spec.ts` (FR-IMG-TEST-003, SC-011) using T047: on `/`, `/invest`, `/beef`, `/land`, `/about`, `/contact` and `/404`, in EN and ES where the page is localized, at 390×844 and 1440×900, assert every line meets its required ratio with the real photo and again with `whitePhotos: true`; attach the per-line results as JSON with `testInfo.attach`. Add an axe run (`AxeBuilder`, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) on the five photo pages in both languages asserting 0 violations; this part needs T005.
- [x] T049 [US5] Write `tests/e2e/photo-forced-colors.spec.ts` (Chromium only; `contracts/photo-delivery-ui.md` §6): with `page.emulateMedia({ forcedColors: "active" })` on `/`, `/beef` and `/about`, each of `.phero__title`, `.phero__side`, the Band's default-slot wrapper and `.band__foot` has a computed `background-color` that is not transparent; no element on the page has computed `forced-color-adjust: none`; `measureTextContrast` passes.
- [x] T050 [P] [US5] Extend `tests/e2e/reduced-motion.spec.ts` (FR-IMG-009): on `/` under the `reduced-motion` project, the `<img>` matched by `.phero__media img` has computed `animation-name: none`.

### Implementation for User Story 5

- [x] T051 [US5] Prepare the nine masters in `src/assets/photos/` from `.specify/references/new-design/` by crop and resize only (FR-IMG-004; done with sharp 0.35.4 from an uncommitted one-off script, not `sips`), as sRGB JPEG at quality 90 with metadata stripped: `pasture-herd-wide.jpg` (from `06`, full frame, 2560 × 1713), `pasture-herd-tall.jpg` (`06`, 2:3 crop centred near x = 54 %, 1080 × 1620), `calves-sky-wide.jpg` (`05`, full frame, 2560 × 1707), `calves-sky-tall.jpg` (`05`, 2:3 crop centred near x = 50 %, 1080 × 1620), `corral-cow-wide.jpg` (`09`, full frame, 2560 × 1707), `corral-cow-tall.jpg` (`09`, 2:3 crop centred near x = 48 %, 1080 × 1620), `cows-bells-tall.jpg` (`11`, full frame, 1440 × 1918), `cow-grazing-tall.jpg` (`08`, full frame, 1440 × 2160), `cow-grazing-wide.jpg` (`08`, 16:10 crop centred near y = 48 %, 2560 × 1600). Do not use `07`, `01`, `02`, `04`, `10` or `00` (FR-IMG-003). Add a "Site masters" table (master, source, crop rectangle in source pixels, size) to `.specify/references/new-design/_IMAGES.md` (FR-IMG-012).
- [x] T052 [US5] Create `src/assets/photos/index.ts`: the `Photo` type (`name`, `wide?`, `tall?` as `ImageMetadata`) and the registry `photos` with entries `pastureHerd` (`pasture-herd`), `calvesSky` (`calves-sky`), `corralCow` (`corral-cow`), `cowsBells` (`cows-bells`, tall only) and `cowGrazing` (`cow-grazing`), per `data-model.md` §6. Depends on T051.
- [x] T053 [US5] Create `src/components/ui/Photo.astro` per `contracts/photo-delivery-ui.md` §2–§3 and `research.md` §19. Props: `image: string | Photo`, `alt`, `kind` (`hero` | `band` | `split` | `collage`), `focus?`, `focusNarrow?`, `class?`. For a string: one `<img src>` with `data-photo` = file name without extension. For a `Photo`: a `<picture>` built with `getImage()` from `astro:assets`: tall-frame sources with `media="(max-width: 991px) and (orientation: portrait)"` first (only when both frames exist), AVIF before WebP, then the `<img>` with the JPEG `src`/`srcset`; widths and `sizes` from the table in `research.md` §19, with the `vh` term derived from the master's dimensions; quality AVIF 45, WebP 70, JPEG 80; `width`/`height` on the `<img>` and on tall-frame sources. Both paths: `decoding="async"`, `data-photo`, `--photo-focus` / `--photo-focus-narrow` as inline custom properties when given; `fetchpriority="high"` and no `loading` for `hero`; `loading="lazy"` and no `fetchpriority` otherwise. The positioning `class` goes on the outermost element rendered.
- [x] T054 [US5] In `src/styles/global.css`, without changing any rendered pixel for kept photos: set `object-position: var(--photo-focus, center 70%)` on `.phero__media img` and `var(--photo-focus, 50% 50%)` on `.split__media img`, `.band__bg` and `.cta__collage img`; inside the existing `@media (max-width: 991px)` block use `var(--photo-focus-narrow, var(--photo-focus, <same default>))`; add the rules that make a `<picture>` carrying `band__bg` or `c1`–`c3` take the box those classes give an `<img>` today, with its inner `<img>` filling it (`width: 100%; height: 100%; object-fit: cover`). Every selector in `contracts/photo-delivery-ui.md` §4 must still match exactly one element per photo. Do not edit `src/scripts/motion.ts`.
- [x] T055 [P] [US5] Update `src/components/ui/PhotoHero.astro`: `image: string | Photo`, new optional `focus` and `focusNarrow`; render `<Photo kind="hero">` inside `.phero__media` in place of the `<img>`. Depends on T053.
- [x] T056 [P] [US5] Update `src/components/ui/Band.astro`: same props; render `<Photo kind="band" class="band__bg">` in place of the `<img>`. Depends on T053.
- [x] T057 [P] [US5] Update `src/components/ui/Split.astro`: same props; render `<Photo kind="split">` with the existing `alt` in place of the photo `<img>`; leave the sketch `<img>` as it is. Depends on T053.
- [x] T058 [P] [US5] Update `src/components/ui/CtaCollage.astro`: `images?: [string | Photo, string | Photo, string | Photo]`, new optional `focus?: [string?, string?, string?]`; render three `<Photo kind="collage">` with classes `c1`, `c2`, `c3`, each a direct child of `.cta__collage`; the default images are unchanged. Depends on T053.
- [x] T059 [P] [US5] In `src/pages/[...lang]/index.astro`, change the Home hero to `image={photos.pastureHerd}` with `focus="50% 62%"` and `focusNarrow="50% 55%"` (`research.md` §20). Depends on T052, T055.
- [x] T060 [P] [US5] In `src/components/invest/Hero.astro`, change the hero to `image={photos.calvesSky}` with `focus="50% 60%"` and `focusNarrow="50% 55%"`. Depends on T052, T055.
- [x] T061 [P] [US5] In `src/components/beef/Hero.astro`, change the hero to `image={photos.corralCow}` with `focus="50% 35%"` and `focusNarrow="50% 40%"`. Depends on T052, T055.
- [x] T062 [P] [US5] In `src/components/beef/WhatWeSellToday.astro`, change the Split to `image={photos.cowsBells}` with `focus="50% 40%"`. Depends on T052, T057.
- [x] T063 [P] [US5] In `src/components/land/GanaderiaAPasto.astro`, change the Split to `image={photos.cowGrazing}` with `focus="40% 50%"`. Depends on T052, T057.
- [x] T064 [P] [US5] In `src/pages/[...lang]/about.astro`, change only the "Why Paraguay" Band to `image={photos.cowGrazing}` with `focus="50% 50%"` and `focusNarrow="40% 50%"`; the hero, the founder Split and the closing collage stay as they are. Depends on T052, T056.
- [x] T065 [P] [US5] In `src/components/beef/Ctas.astro`, change only the second collage image to `photos.cowGrazing` with focus `42% 47%`; the first and third stay `/images/site/orbolo-cattle-shade.jpg` and `/images/site/brahman-four.jpg`. Depends on T052, T058.
- [x] T066 [US5] In `src/i18n/ui.ts`, replace the values of `whatWeSellAlt` and `gappAlt` (no new key; FR-IMG-010): EN "Brown cattle with bells, standing under a tree." and "A brown cow grazing on green pasture."; ES "Ganado marrón con cencerros bajo un árbol." and "Una vaca marrón pastando en un potrero verde." Neither names Orbolo, El Tapir or a place (FR-IMG-011).
- [x] T067 [US5] In `src/styles/global.css`, implement the shade model of `research.md` §23 and `contracts/photo-delivery-ui.md` §5, on desktop and inside the `@media (max-width: 991px)` block: replace the unused `--shade` with `--shade-text: 0.76`, `--shade-text-lime: 0.9` and `--shade-clear: 0.06`; give `.phero__title`, `.phero__side`, `.phero__scroll`, the Band's default-slot wrapper and `.band__foot` a soft-edged forest pool that is at least `--shade-text` everywhere inside the block's box and feathers to `--shade-clear` outside it; reduce `.phero__shade` and `.band__shade` to the strip under the nav at the top of a hero (at least `--shade-text-lime` together with `.nav::before`), a short blend into the forest section below, and `--shade-clear` elsewhere. No `text-shadow`, no light section background, no `prefers-contrast` block; do not change `.split__media` gradients or `.nav`. Consult `web-design-guidelines` for the feather so the pools never read as dark boxes. Makes T048 pass.
- [x] T068 [US5] In `src/styles/global.css`, add an `@media (forced-colors: active)` block giving each text block listed in T067 `background-color: Canvas`; do not set `forced-color-adjust` anywhere (`research.md` §24). Makes T049 pass.
- [x] T069 [US5] Delete `public/images/site/hero-mist.jpg`, `rider-herd.jpg`, `orbolo-grassfed.jpg`, `zebu-close.jpg` and `rider-green.jpg` after a repo-wide search (`grep -rn` over `src`, `tests`, `public`, `scripts`) finds no reference to any of them (FR-IMG-012). Leave `public/images/site/orbolo-herd.jpg` alone.
- [x] T070 [US5] Check the result in a real browser per `specs/005-contact-form/quickstart.md` §7 (Playwright MCP or `playwright-cli`): the five pages in EN and ES at 1440×900 and 390×844; adjust `focus`/`focusNarrow` at the call sites so the main animals stay in frame; inspect the pool edges; view the three heroes at 100 % for compression artefacts (if AVIF quality must rise and `calves-sky` at 2560 px would exceed 450 KB, lower that photo's top wide rung to 2240 px, `research.md` §21); Contact and 404 unchanged and readable; reduced motion; forced colours; one blocked hero request; console clean. Save the same shots as T003 into `.playwright-mcp/005-photo-refresh/after/`.
- [ ] T071 [US5] **(Evidence written 2026-11-15 to `.playwright-mcp/005-photo-refresh/evidence.md`, OQ-D1 comparison shot included. Still open: Vaz's SC-008 approval, the OQ-D1 choice, and how SC-010 is read, see below.)** Collect the evidence in `specs/005-contact-form/quickstart.md` §8 into `.playwright-mcp/005-photo-refresh/evidence.md`: before/after pairs per slot; the Home hero with `03` from a local, uncommitted swap for OQ-D1; the contrast JSON from T048; Lighthouse LCP and CLS for `/`, `/invest` and `/beef` on the production build, against T004's baseline (SC-010: LCP ≤ 2.5 s and not worse; CLS 0); e2e wall time against T004 (if more than about 25 % slower, apply `research.md` §26); `git diff --stat -- public/images` showing only the five deletions. Present it to Vaz for approval (SC-008) and for the OQ-D1 choice.

**Checkpoint**: T043–T050 pass. The five pages show the new photos, text over photos passes AA, and budgets hold on the production build.

---

## Phase 7: User Story 4 – Orbolo can see how many enquiries the site produces (Priority: P3)

**Goal**: Each thanks page is a distinct page view in Plausible, per language, and no form value ever reaches analytics. No cookies, no storage.

**Independent Test**: Load each thanks page and confirm it is a separate, trackable page with no extra script; confirm no analytics request carries a form value.

**Prerequisites**: US1 complete. Decision 2 was approved on 2026-11-14.

### Tests for User Story 4 (write first, see them fail)

- [x] T072 [P] [US4] Write `tests/e2e/contact-form-privacy.spec.ts` (FR-AN5-002, SC-003 as amended; `contracts/contact-form-ui.md` → "Network and privacy invariants"), on `/contact`, `/es/contact`, both thanks pages and both error pages, including after a successful and a failed send with recognisable field values: `context.cookies()` is empty; `localStorage` and `sessionStorage` have no entries; every request host is the site origin, the endpoint origin or `plausible.io`; no request to `plausible.io` contains any typed value in its URL or body; the page loads no iframe and no captcha script.
- [x] T073 [P] [US4] Extend `tests/e2e/analytics.spec.ts`: add `/contact/thanks` and `/es/contact/thanks` to the routes it already checks, so the site-wide Plausible script is asserted on them exactly as on every other page (US4-AS1), and assert the URL reached after a successful send has no query string or fragment.

### Implementation for User Story 4

- [x] T074 [US4] Confirm in `src/scripts/contact-form.ts` that success uses a full navigation (`location.assign`) to the bare thanks path and that the script makes no analytics call and no storage access; fix it if T072 or T073 shows otherwise. The two Plausible pageview goals are created by Vaz in the dashboard at go-live (`specs/005-contact-form/quickstart.md` §4, step 6); no code is needed for them.

**Checkpoint**: T072 and T073 pass.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility gate, compliance, the mandatory design skills, and the final verification.

- [x] T075 [P] Write `tests/e2e/contact-form-a11y.spec.ts` (FR-UX-014, FR-UX-016, SC-001, SC-005): complete and send the form with the keyboard only, in EN and ES; tab order follows the field order and every control shows a focus indicator; no focused control or the error summary is covered by the nav; at 390 px and 1440 px there is no horizontal scroll and every input's computed font size is ≥ 16 px; every radio, checkbox and the Send button is at least 24×24 CSS px; axe (same tags as T048) reports 0 violations on `/contact` and `/es/contact` in the idle, error and failure states and on both thanks and both error pages. The axe part needs T005.
- [x] T076 [P] In `tests/e2e/content-compliance.spec.ts`, add `/contact` to `PAGES` so the banned-word check covers the form copy (FR-GEN5-003); fix any copy it flags in `src/content/contact/contact.json`, never the test.
- [x] T077 Extend `tests/e2e/reduced-motion.spec.ts`: on `/contact` under reduced motion, an empty Send moves focus to `[data-contact-summary]` and a summary link moves focus to its field (spec Edge Cases: Lenis must not prevent it).
- [x] T078 In `tests/e2e/nav-bar.spec.ts`, rename "/contact renders as the stub page, not a 404" to describe what it now sees in dev preview (the Contact page with the form) while keeping its assertions; confirm `tests/e2e/as-is-freeze.spec.ts`, `tests/e2e/seo-meta.spec.ts`, `tests/e2e/language-switch.spec.ts` and `tests/e2e/responsive-qa.spec.ts` still pass unchanged. Never weaken or skip a test (FR-TEST-003, FR-IMG-TEST-004).
- [x] T079 [P] Update the "Known gap" bullet in `AGENTS.md`: the Contact page text is no longer in `src/i18n/ui.ts`.
- [x] T080 Run the `web-design-guidelines` skill as an audit on the changed UI files (`src/components/contact/ContactForm.astro`, `src/components/ui/Photo.astro`, the four shells, `src/styles/global.css`, `src/pages/[...lang]/contact.astro`, `contact/thanks.astro`, `contact/error.astro`) and fix what it finds (Constitution X).
- [x] T081 *(Done 2026-11-15: `orbolo-localhost.md` / `.json` regenerated; CLAUDE.md's shade sentence and its pointer to the analysis updated.)* Run the `taste` skill as the final aesthetic pass on Contact (idle, error and failure states), the thanks page and the five photo pages; then re-run it against localhost and update the photo-shade sentence in `CLAUDE.md` Design Taste only if it no longer describes the site (AGENTS.md; Constitution IV).
- [x] T082 Check the contact form in a real browser per `specs/005-contact-form/quickstart.md` §2 (Playwright MCP or `playwright-cli`): `/contact` and `/es/contact` at 1440×900 and 390×844 in the idle, error and failure states; hover and focus on every control and on Send; reduced motion; console clean. Screenshots go to `.playwright-mcp/`.
- [x] T083 Check the closed gate by hand per `specs/005-contact-form/quickstart.md` §3: `env -u PUBLIC_CONTACT_ENDPOINT -u CONTACT_FORM_PREVIEW pnpm build`; `dist/contact/` contains only `index.html`, and it has no `<form>`.
- [x] T084 Run `pnpm run verify` and make it green without weakening or skipping any test; then report per `AGENTS.md` → "Reporting back": files changed, the `verify` result, what was checked in the browser, and anything left undone (the open questions OQ-C1…C7 and OQ-D2 that block going live, per `specs/005-contact-form/quickstart.md` §4).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 first (three open decisions; T002 is already done). T003 and T004 must finish before any change under `src/` or `public/`.
- **Foundational (Phase 2)**: after Setup. Blocks US1–US4. Does not block US5.
- **US1 (Phase 3)**: after Foundational. The MVP.
- **US2 (Phase 4)**: after US1 (it extends `ContactForm.astro` and `contact-form.ts`).
- **US3 (Phase 5)**: after US1; independent of US2 except the shared file `contact-form.ts` and T036's hand-off to the generic failure.
- **US5 (Phase 6)**: after T003, T004 and T007 only. Can be built before, after or alongside Phases 2–5.
- **US4 (Phase 7)**: after US1.
- **Polish (Phase 8)**: after every story that is being shipped.

### User Story Dependencies

```text
Setup ──▶ Foundational ──▶ US1 ──▶ US2
   │                        ├────▶ US3
   │                        └────▶ US4
   └──────────────────────▶ US5            (independent of the form)
                                   all ──▶ Polish
```

### Files touched by more than one phase (do these tasks one after another)

- `src/styles/global.css`: T029 (US1), T037 (US2), T040 (US3), T054, T067, T068 (US5)
- `src/scripts/contact-form.ts`: T031 (US1), T034–T036 (US2), T040 (US3), T074 (US4)
- `src/i18n/ui.ts`: T021 (Foundational), T066 (US5)
- `src/i18n/index.ts` and `src/content/pageMeta/pageMeta.json`: T027 (US1), T041 (US3)
- `tests/e2e/reduced-motion.spec.ts`: T050 (US5), T077 (Polish)
- `tests/e2e/contact-form-no-js.spec.ts`: T025 (US1), T039 (US3)

### Within Each User Story

- Tests are written first and must fail before the implementation starts.
- Content and pure modules before components; components before pages; pages before the client script that enhances them.
- A story is complete when its checkpoint holds; commit per stage (`stage N: …`) only when Vaz asks.

### Parallel Opportunities

- Setup: T004 and T006 alongside T003.
- Foundational: the four unit tests (T008, T010, T011, T012) together; then T014, T015 and T016 together; T022 and T023 alongside the content tasks.
- US1: T024, T025, T026 and T027 together.
- US5: the tests T043–T047 and T050 together; the four shells T055–T058 together; the seven call sites T059–T065 together.
- US5 as a whole can run in parallel with the contact-form phases, apart from the shared files listed above.

---

## Parallel Example: User Story 5

```bash
# Tests first, all in different files:
Task: "Write tests/unit/kept-photos.test.ts"
Task: "Write tests/e2e/photo-slots.spec.ts"
Task: "Write tests/e2e/photo-delivery.spec.ts"
Task: "Write tests/e2e/photo-budget-production.spec.ts"
Task: "Create tests/e2e/support/photo-contrast.ts"

# After Photo.astro (T053) exists, the four shells:
Task: "Update src/components/ui/PhotoHero.astro"
Task: "Update src/components/ui/Band.astro"
Task: "Update src/components/ui/Split.astro"
Task: "Update src/components/ui/CtaCollage.astro"

# After the shells, the seven call sites (T059–T065), one file each.
```

## Parallel Example: User Story 1

```bash
Task: "Write tests/e2e/contact-form.spec.ts"
Task: "Write tests/e2e/contact-form-no-js.spec.ts"
Task: "Extend src/components/ui/Btn.astro with a button mode"
Task: "Add the thanks pages to pageMeta.json and LOCALIZED_ROUTES"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (approvals recorded, baseline captured).
2. Phase 2: Foundational.
3. Phase 3: US1.
4. **STOP and VALIDATE**: a valid enquiry reaches the mocked endpoint once and lands on the thanks page, in EN and ES, with and without JavaScript.

US1 alone is not shippable to production: WCAG 2.2 AA is a release gate (Constitution IX), so US2 must follow before the form goes live. Production keeps the stub until FR-GATE-001 is met in any case.

### Incremental Delivery

1. Setup + Foundational → `/contact` unchanged for visitors, content in JSON, gate in place.
2. US1 → the form sends (dev preview).
3. US2 → errors are handled accessibly. The form is now complete enough to review.
4. US3 → failures are handled; the error page exists.
5. US5 → the photo refresh, reviewable on its own by Vaz (SC-008).
6. US4 → analytics and privacy invariants proven.
7. Polish → skills, browser checks, `pnpm run verify` green.

### Two-track option

The photo refresh (US5) shares no design with the form. One agent can take Phases 2–5 and 7 while another takes Phase 6, coordinating only on the shared files listed above.

---

## Notes

- [P] tasks are in different files and have no dependency on an unfinished task.
- Never weaken or skip a test to get green; when copy changes, update the tests that pin the old copy.
- No new dependency beyond `@axe-core/playwright`, and that one only if decision 1 is approved.
- All new copy goes into `src/content/contact/contact.json`; nothing is added to `src/i18n/ui.ts`.
- Going live is outside these tasks: it needs OQ-C1 (team email), OQ-C3 (privacy approval), the deployed endpoint and the steps in `quickstart.md` §4.

## Status at stop (2026-11-15)

`pnpm run verify` was green on the final source state: 109 unit tests, 707 e2e passed, 1 skipped (pre-existing), 152 s.

Open: T071 only, and only for decisions that are Vaz's: SC-008 approval of the before/after screenshots, OQ-D1 (`06` or `03` as the Home hero), and how SC-010 is read. With real slow-4G throttling, LCP is unchanged on all three pages (Home 3.7 s before and after, Invest 1.6–1.7 s, Beef 3.6 s), so "not worse than before" holds; Home and Beef were already above the 2.5 s target before this feature. With Lighthouse's default simulated throttling, Home reads 1.4 s before and 7.0 s after, a modelling artefact explained in `.playwright-mcp/005-photo-refresh/evidence.md` §3.
