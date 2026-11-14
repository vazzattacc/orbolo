# Feature Specification: Orbolo Website – Contact Form (Native Form, Self-Hosted Endpoint)

**Feature Branch**: `005-contact-form` *(directory name only – no git branch was created by this specify pass; branch creation is Vaz's call)*

**Created**: 2026-11-10

**Status**: Approved (Vaz, 2026-11-14)

**Input**: User description (2026-11-10): "Investigate best ways of forms in a web and how to configure it. I need it for orbolo's website." Refined in the same conversation: "I don't want Google Form." "Can the data be hosted on my server?" (home/self-run machine, operated by Vaz for Orbolo). Destination: "Email to a team inbox", stored + emailed. Routing: "One form, visitor picks." "Don't ask too much. Just tell me how to do the form." → "Make the 005 spec."

**Input – 2026-11-14 amendment**: "Modify the spec MD of the 005 update so it will include these design changes without changing the other changes. In order to make the website brighter, change the background images and make them more happier tone. Use the modern web guidance plugin and don't change those background pictures that I already happy toned." New photos supplied in `.specify/references/new-design/` (index and provenance: `_IMAGES.md`).

## Governing Rules for This Feature

1. **Contact becomes real; the only other change is the background-photo refresh.** This feature replaces the `/contact` and `/es/contact` stub ("Our contact form is on its way") with a working enquiry form, and adds the pages a form needs (thanks, failure). Every other page – Home, Invest, Beef, Land, About, Privacy, Terms, 404 – keeps its current copy, layout, components and CTAs. The existing CTAs that already point at `/contact` ("Get the Remote Rancher pack", "Book a call", "Get the spec sheet", "Request a sample", "Work with us") keep their labels and destinations unchanged. The single exception, added 2026-11-14, is the background-photo refresh (Governing Rule 5, FR-IMG-*): it swaps five photos and lightens the photo shade, and changes no copy (other than the two alt texts in FR-IMG-010), layout, component structure, motion or CTA.
2. **No third-party form provider, no Google Forms, no cookies.** The form is native HTML rendered by the site itself, posting to an endpoint on a server operated by Vaz for Orbolo. The "Plausible, no cookie banner" rule (spec 003) holds: the form MUST NOT set cookies or load third-party scripts.
3. **The site stays static.** No Astro server adapter, no on-demand rendering, no new runtime dependency on the website side. Anything needing a server lives behind the endpoint contract (FR-API-*), outside this repository.
4. **Fail closed on legal readiness.** The form is shown to visitors only when its endpoint is configured and the privacy wording covering it is approved (FR-GATE-001). Until then, Contact keeps today's stub – no half-working form, no placeholder.
5. **Brighter, not different (added 2026-11-14).** The site gets brighter and happier by (a) replacing only the five darker background photos listed in FR-IMG-001 and (b) lightening the forest shade over photos where no text sits (FR-IMG-008). The eleven photos Vaz already considers bright stay exactly as they are (FR-IMG-002). Forest stays the colour of every section, the CLAUDE.md Design Taste tokens and anti-patterns hold, and every text block keeps WCAG 2.2 AA contrast. Implementation follows Modern Web Guidance (`npx modern-web-guidance@latest`, Vaz preference) for image delivery, loading priority and contrast.

## Scope Change – 2026-11-10 (delta against the brief and earlier approved specs, per Constitution Principle VII)

- **Modified (brief §6 "Contact – three routed forms (investor, buyer, landowner) plus general")**: one form on `/contact`; the visitor picks the topic. No per-page prefilling, no separate per-audience forms. Vaz decision 2026-11-10.
- **Modified (brief §12 Tooling – "Forms: all Google Forms embedded; investor form native → Sheet via Apps Script")**: native form → self-hosted endpoint → stored in a database and emailed to a team inbox. Google Forms rejected by Vaz 2026-11-10 (design system, accessibility gate and cookie conflicts).
- **Removed for now (brief §12 "CRM: Google Sheets" and "Slack … for form … events")**: no Sheets row and no Slack alert per submission in this feature. They are not dropped from the product; they can be added later behind the same endpoint without touching the website.
- **Resolved (002 OQ-015 – what the nav bar's Contact link ultimately points at)**: it points at the Contact page carrying this form.
- **Brought in (003 Key Selection items 12, 13, 14 – "Loading states", "Form error states", "Thank-you page")**: they were Out only because Contact was off-limits. They are now in scope, for Contact only. Item 19 ("Real contact address") is brought in **partially**: a visible team email address appears on Contact as a fallback (FR-UX-012). A postal address stays out.
- **Brought in (AGENTS.md known gap – Contact page copy in `src/i18n/ui.ts`)**: all Contact copy this feature touches moves into JSON content. Nothing new is added to `ui.ts`.
- **Unchanged and explicitly out**: "Get the Remote Rancher pack" stays a link to `/contact` (the brief's Papermark data room is a separate future feature); "Book a call" stays a link to `/contact` (Google Calendar appointment scheduling is a separate future feature); "Get the spec sheet" stays a link to `/contact` (an email-gated download is a separate future feature); no newsletter signup.

## Scope Change – 2026-11-14 (background-photo refresh; delta against the brief, spec 001 and the 2026-11-10 scope above, per Constitution Principle VII)

- **Added**: a background-photo refresh across Home, Invest, Beef, Land and About to make the site brighter and happier (Governing Rule 5, US5, FR-IMG-*). Vaz request 2026-11-14.
- **Modified (Governing Rule 1 of this spec, "nothing else changes")**: the photo refresh is the one permitted change outside Contact. Every contact-form requirement above and below is unchanged.
- **Modified (spec 001 FR-020 – "Images MUST be authentic photographs of Paraguay")**: for the five replacement slots in FR-IMG-001 only, licensed stock photographs (Pexels) are allowed. Every other image on the site still follows FR-020. Vaz decision 2026-11-14.
- **Modified (brief §B Photography – "low sun … consistent warm, slightly desaturated grade")**: for the replacement slots, the target is bright daylight with natural, non-desaturated colour. A low-sun photo is allowed only as the Home hero (new-design `03`, OQ-D1). Vaz decision 2026-11-14.
- **Excluded**: new-design `07-pasture-highland-cattle-mist-landscape.jpg` (Highland cattle, a Scottish breed) is never used. Vaz decision 2026-11-14.
- **Not adopted**: the hero mockup `.specify/references/new-design/00-ref-hero-mockup.jpg`. Its headline is new copy (out of scope) and its photo is the dusk image `01`, which Vaz did not choose. `image-to-code` (Constitution Principle X) is therefore not required for FR-IMG-*; the mockup stays a reference only.
- **Unchanged and explicitly out**: all copy (except the two alt texts in FR-IMG-010), layouts, section order, components' structure, motion (hero drift, band parallax, reveals), colour tokens, the Contact hero photo (`brahman-four.jpg`), the 404 hero photo, the Home path-card images, the social preview image.

## Clarifications

### Session 2026-11-10

- Q: Embedded Google Forms (the brief's default)? → A: No. Vaz: "I don't want Google Form."
- Q: Where do submissions go? → A: To a server Vaz operates for Orbolo – a home/self-run machine. Vaz runs it as a contractor for Orbolo (Orbolo = data controller, Vaz = processor).
- Q: Stored, emailed, or both? → A: Stored and emailed to a team inbox. No Sheets, no Slack, no auto-reply to the visitor in this feature.
- Q: Routing? → A: One form; the visitor picks the topic. CTAs are not changed to prefill it.
- Q: Is the backend part of this spec? → A: Not asked to completion (Vaz: "just tell me how to do the form"). **Assumption**: this spec covers the website form plus the exact request/response contract the endpoint must honour (FR-API-*); the server's implementation is a separate spec in its own repository. Recorded in Assumptions.
- Q: Languages? → A: Not answered. **Assumption**: English and Spanish, like every other localized route (`/contact`, `/es/contact`), all copy from JSON.
- Q: Accessibility? → A: Not answered. **Assumption**: Constitution IX applies in full – no exception. A native form makes full compliance possible.

### Session 2026-11-14 (background-photo refresh)

- Q: Which current photos are "already happy" and must stay? → A: Vaz accepted the proposed split: keep the 11 bright ones (FR-IMG-002); replace the 5 darker ones – `hero-mist.jpg` (Home hero), `rider-herd.jpg` (Invest hero), `orbolo-grassfed.jpg` (Beef hero), `zebu-close.jpg` (Beef split), `rider-green.jpg` (Land split, About band, Beef collage).
- Q: The mockup puts the dusk photo `01` on the Home hero, which is moodier than "brighter, happier". What should the Home hero be? → A: Vaz: "the 007, 006, and 003 are allowed for the homepage background." Combined with the next answer (`07` excluded), the Home hero is `06` or `03` (OQ-D1; default `06`).
- Q: Should the forest shade over photos also be lightened? → A: Vaz: "follow the plugins' advices, they know better." → Modern Web Guidance (`color`, `accessibility`, `performance`, `optimize-image-priority`, `deliver-optimized-decorative-images`) is applied: lighter veil where no text sits, AA contrast where text sits, no reliance on text-shadow, readable in Forced Colors Mode (FR-IMG-006…008).
- Q: The new photos are Pexels stock, which conflicts with spec 001 FR-020 ("authentic photographs of Paraguay"); `07` shows Highland cattle and some show dairy Holsteins. How to treat them? → A: Vaz: "don't use the 007 then." → Stock is allowed in the five slots, `07` is excluded. **Assumption**: the replacements are permanent until real Orbolo photography exists (OQ-D3); the slot mapping in FR-IMG-001 avoids the dairy-breed photos (`01`, `02`, `04`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 – A visitor sends Orbolo an enquiry and knows it arrived (Priority: P1)

A prospective investor, beef buyer, landowner or anyone else opens Contact (from the nav bar or from any page CTA), says who they are and what they're interested in, writes a message, sends it, and lands on a confirmation page that tells them it arrived and what happens next. Orbolo's team receives it in their inbox and it is kept on Orbolo's server.

**Why this priority**: Every funnel in the brief (§5) ends in "talk to us", and every CTA on Invest, Beef and Land currently lands on a stub that says the form is "on its way". This story alone turns the site from a brochure into a lead source.

**Independent Test**: With the endpoint mocked to succeed, open `/contact`, fill in the required fields, choose a topic, send, and confirm: the request carries exactly the contract fields (FR-API-002), the visitor lands on `/contact/thanks`, and the thanks page is in the visitor's language. Repeat on `/es/contact` → `/es/contact/thanks`.

**Acceptance Scenarios**:

1. **Given** a visitor on `/contact`, **When** they fill Name, Email, Topic and Message with valid values and press Send, **Then** the submission is sent once to the configured endpoint and the visitor lands on `/contact/thanks`.
2. **Given** the visitor is on `/es/contact`, **When** the same happens, **Then** every label, message and the thanks page (`/es/contact/thanks`) are in Spanish.
3. **Given** a visitor arrives from any page CTA that links to `/contact`, **When** the form renders, **Then** no topic is preselected and the visitor chooses it.
4. **Given** the send is in progress, **When** the visitor presses Send again, **Then** no second submission is sent and the button shows a sending state.
5. **Given** the visitor has JavaScript disabled, **When** they submit valid data, **Then** the form still submits as a normal page request and the visitor still lands on the thanks page.

---

### User Story 2 – A visitor who makes a mistake is told exactly what to fix, without losing what they typed (Priority: P1)

A visitor presses Send with a missing or malformed field. They see a summary at the top of the form listing each problem, each linked to its field, and a message under each faulty field saying how to fix it. Everything they typed is still there.

**Why this priority**: Form errors are where enquiries are lost, and WCAG 2.2 AA (Constitution IX) is a release gate. Without this, US1 is not shippable.

**Independent Test**: Submit the empty form; submit with only an invalid email; confirm the error summary, inline messages, focus movement, document title prefix, preserved values, and that nothing reached the endpoint.

**Acceptance Scenarios**:

1. **Given** an empty form, **When** the visitor presses Send, **Then** nothing is sent, an error summary appears above the form listing every problem in field order, each entry links to its field, focus moves to the summary, and the document title is prefixed with the localized "Error:" word.
2. **Given** an error is shown for a field, **When** a screen-reader user reaches that field, **Then** its error message is announced with it and the field is exposed as invalid.
3. **Given** one or more errors, **When** they are shown, **Then** every value the visitor already entered is still in its field (WCAG 3.3.7).
4. **Given** the visitor fixes a field, **When** they press Send again, **Then** validation runs again and only the remaining problems are listed.
5. **Given** the endpoint rejects the submission with field errors (FR-API-004), **When** the response arrives, **Then** those errors are shown the same way as local ones.

---

### User Story 3 – A visitor still has a way through when the server is unreachable (Priority: P2)

The endpoint is down, slow, or rate-limiting. The visitor is told plainly that the message did not go through, their text is still in the form, and they are given Orbolo's email address to write to directly.

**Why this priority**: The endpoint runs on a self-run machine (Assumptions), so downtime is a realistic failure. A lost lead with no explanation is the worst outcome; this story caps the damage.

**Independent Test**: Mock the endpoint to fail (network error, timeout, 429, 5xx) and confirm the failure message, the fallback email address, preserved values, and that the visitor is never sent to the thanks page.

**Acceptance Scenarios**:

1. **Given** the endpoint does not respond within the timeout (FR-UX-011) or returns a server error, **When** the visitor sends, **Then** a failure message appears near the Send button, the visitor's values are kept, the thanks page is not shown, and a visible team email address is offered as an alternative.
2. **Given** the endpoint answers "too many requests", **When** the visitor sends, **Then** the failure message says to try again in a few minutes, with the same email fallback.
3. **Given** JavaScript is disabled and the endpoint fails, **When** the visitor submits, **Then** they land on a failure page (`/contact/error`, `/es/contact/error`) that explains it, gives the email fallback and links back to Contact.

---

### User Story 4 – Orbolo can see how many enquiries the site produces (Priority: P3)

The team can see, in the existing Plausible dashboard, how many visitors completed the form, per language – without cookies and without reading anyone's message.

**Why this priority**: The brief's metrics (§5) count conversions per language and funnel. Useful, but the form works without it.

**Independent Test**: Load the thanks page in each language and confirm it is a distinct, trackable page (no extra script); confirm no analytics event carries form field values.

**Acceptance Scenarios**:

1. **Given** a successful submission, **When** the visitor lands on the thanks page, **Then** that page view is countable as a goal in Plausible, separately for `/contact/thanks` and `/es/contact/thanks`.
2. **Given** any form interaction, **When** analytics fire, **Then** no personal data or message content is sent to analytics.

---

### User Story 5 – A visitor sees a brighter, happier Orbolo without losing readability or speed (Priority: P2)

A visitor opens Home, Invest, Beef, Land or About. The full-screen heroes, photo splits and bands now show sunny, green, daytime pasture instead of fog, overcast skies and deep shade. Every heading and paragraph over a photo is as readable as before, and the pages load at least as fast as before.

**Why this priority**: Vaz's request (2026-11-14). It changes how the brand feels on every main page, but the site works without it, so it ranks below the form's P1 stories.

**Independent Test**: Open the five pages in EN and ES at 390 px and 1440 px; confirm each slot in FR-IMG-001 shows its replacement, every photo in FR-IMG-002 is unchanged, every text block over a photo passes AA (FR-IMG-008), each hero image is fetched at high priority and never lazy (FR-IMG-007), and no image is downloaded larger than its displayed size needs (FR-IMG-006).

**Acceptance Scenarios**:

1. **Given** a visitor opens Home, Invest or Beef, **When** the hero renders, **Then** it shows the replacement photo from FR-IMG-001, drifting exactly as before, under a lighter shade, with the title and side text still passing AA.
2. **Given** a visitor scrolls to Beef "What we sell today", Land "Ganadería a pasto", the About Paraguay band or the Beef closing collage, **When** the section enters the viewport, **Then** it shows the replacement photo, lazily loaded, without a layout shift.
3. **Given** a visitor opens Contact, the 404 page or any section using a photo in FR-IMG-002, **When** the page renders, **Then** that photo is the same file as before.
4. **Given** a phone at 390 px, **When** a page with a replaced photo loads, **Then** the browser downloads a phone-sized modern-format version (AVIF or WebP), never the multi-megabyte original.
5. **Given** a screen-reader user reaches the Beef "What we sell today" or Land "Ganadería a pasto" photo, **When** the image is announced, **Then** its alt text describes the new photo in the page's language and does not claim it shows Orbolo's own ranch.
6. **Given** reduced motion or Windows High Contrast (Forced Colors), **When** a hero or band renders, **Then** motion is skipped as before and all text stays readable even if the photo and shade are not painted.

### Edge Cases

- **Endpoint not configured** (missing or empty setting at build time): Contact renders today's stub, the thanks and failure pages are not published, and the build does not fail (FR-GATE-001).
- **Privacy wording not yet approved**: same as above – the form is not shown (FR-GATE-001).
- **Bot fills the hidden honeypot field or submits in under the minimum fill time**: the website sends it anyway; the endpoint silently accepts and discards it (FR-API-006). The bot sees success; nothing is stored or emailed.
- **Very long message**: the field stops input at the maximum length and shows how many characters remain; the endpoint also rejects over-length values.
- **Email with unusual but valid format** (plus-addressing, subdomains, internationalised domain): accepted. Validation checks shape (something@something.tld), not deliverability.
- **Phone in any format** (`+34 600…`, `600 00 00 00`): accepted as free text up to the maximum length; no input mask, no format enforcement.
- **"Please call me" ticked without a phone number**: an error on Phone ("Add a phone number so we can call you"). Phone is otherwise optional.
- **Visitor changes language mid-form**: the language switch navigates to the other locale's Contact page; typed values are not carried over. Accepted limitation – noted, not a defect.
- **Visitor double-taps Send on mobile**: only one request is sent (US1-AS4).
- **Visitor submits, then presses Back from the thanks page**: the form shows empty or as the browser restores it; it MUST NOT resubmit on its own.
- **Reduced motion**: no form animation runs; error summary appears without transition. Smooth-scroll (Lenis) MUST NOT prevent focus moving to the error summary or to a linked field.
- **Sticky nav covering a focused field or the error summary** after focus moves: not allowed (WCAG 2.4.11) – the focused element stays fully visible.
- **Content blocked by a privacy extension**: nothing third-party is loaded, so nothing is blocked; the form works.
- **Portrait photo in a landscape slot** (`08`, `11` in a full-bleed band or wide split): the crop keeps the animal in frame at 390 px and 1440 px; the focal point is set per photo (FR-IMG-005), never by stretching.
- **Bright sky behind text** (e.g. `05`, `06`, `09` have light skies near the top-left title area): the shade stays dense enough there that the title passes AA; brightness comes from the rest of the frame (FR-IMG-008).
- **Very wide or high-density screens** (2560 px, 2× DPR): the largest delivered version is enough for the displayed size; no visible upscaling blur, and no original multi-megabyte file is sent.
- **A replacement photo fails to load**: the section shows its forest background and all text stays readable; no broken-image icon, no layout shift.
- **Forced Colors Mode**: gradients and photos may not be painted; text uses system colours and stays readable; no `forced-color-adjust: none` is added to keep the photos.
- **The same replacement twice on one page**: not allowed. With FR-IMG-001's mapping, no page shows the same photo twice.

## Requirements *(mandatory)*

### Functional Requirements – General and gating

- **FR-GEN5-001**: Contact (`/contact`, `/es/contact`) MUST render the enquiry form defined below, inside the existing `Layout`, nav bar and footer, reusing the existing `src/components/ui/*` shells. No other existing page changes (Governing Rule 1).
- **FR-GEN5-002**: All visitor-facing form copy – page heading and intro, field labels, hints, "(optional)" marker, topic options, button labels and states, error messages, error-summary heading, failure messages, privacy notice line, thanks-page and failure-page copy – MUST live in JSON content (`src/content/<name>/<name>.json`) with English and Spanish entries, read only through its repository with a Zod schema, per AGENTS.md content rules. Nothing hard-coded in `.astro`/`.ts`, nothing added to `src/i18n/ui.ts`.
- **FR-GEN5-003**: All form copy MUST pass the existing banned-word test (`tests/e2e/content-compliance.spec.ts`) and the brief's legal wording rules: no "invest with Orbolo", no returns language, no promise of a reply time Orbolo has not confirmed.
- **FR-GEN5-004**: The Contact page's existing stub text MUST be replaced (both languages) by the form's intro copy; the stub text moves out of `ui.ts` into JSON as part of this feature or is deleted once unused.
- **FR-GATE-001**: The form, `/contact/thanks`, `/es/contact/thanks`, `/contact/error` and `/es/contact/error` MUST only be published when **both** (a) the endpoint URL is configured and (b) the content flag recording Vaz/counsel approval of the privacy wording (FR-LEG5-002) is set. Otherwise Contact shows today's stub, those pages are not built, they are absent from the sitemap, and the build succeeds.
- **FR-GATE-002**: The endpoint URL MUST come from configuration (build-time setting), never hard-coded in a component, so that changing servers does not change code (Constitution VIII).

### Functional Requirements – Fields

- **FR-FIELD-001**: The form MUST contain exactly these visitor-facing fields, in this order, one per row, single column:

| # | Field | Control | Required | Constraints | Autofill hint |
|---|-------|---------|----------|-------------|---------------|
| 1 | Name | single-line text | yes | 1–120 chars after trimming | full name |
| 2 | Email | email | yes | valid shape, ≤ 254 chars | email |
| 3 | Phone | telephone | no (yes if #7 ticked) | ≤ 40 chars, free format | telephone |
| 4 | Organisation | single-line text | no | ≤ 160 chars | organisation |
| 5 | I'm interested in | single choice, 4 visible options (radio group with a group legend) | yes | one of `remote-rancher`, `beef`, `land`, `other` | – |
| 6 | Message | multi-line text | yes | 10–2,000 chars after trimming, remaining-characters hint | – |
| 7 | Please call me | checkbox | no | – | – |

- **FR-FIELD-002**: Topic option labels are content (JSON). Candidate wording, to be confirmed against the banned-word list: EN "Owning cattle with Remote Rancher" / "Buying beef" / "Working with my land" / "Something else"; ES "Ser dueño de ganado con Remote Rancher" / "Comprar carne" / "Trabajar con mi tierra" / "Otra cosa". The **stored values** are the fixed codes in FR-FIELD-001 #5, independent of language and wording.
- **FR-FIELD-003**: The form MUST also send, invisibly: the page locale (`en`/`es`), the page path, a honeypot field invisible to people and to assistive technology but present to bots, and the moment the form was rendered (for the minimum-fill-time check). These MUST NOT be exposed in the accessibility tree.
- **FR-FIELD-004**: The form MUST NOT ask for anything else: no country, no investment amount, no ticket size, no budget, no date of birth, no file upload, no marketing consent checkbox (no newsletter in this feature).

### Functional Requirements – Behaviour and accessibility

- **FR-UX-001**: Every field MUST have a visible, persistent label above it. Placeholders, if any, MUST NOT replace labels. Optional fields MUST be marked "(optional)" in the label.
- **FR-UX-002**: Validation MUST run on Send (not while typing). After a failed Send, a field MAY re-validate when the visitor leaves it.
- **FR-UX-003**: On failed validation the form MUST show, together: an error summary above the form (heading, then one linked entry per error in field order) **and** an inline message directly under each faulty field. Focus MUST move to the summary; activating an entry MUST move focus to its field.
- **FR-UX-004**: Each inline message MUST be programmatically tied to its field, and the field MUST be exposed as invalid while the error stands.
- **FR-UX-005**: Error messages MUST say what to do, not only what is wrong (WCAG 3.3.3), e.g. "Enter an email address like name@example.com", not "Invalid email".
- **FR-UX-006**: While errors are shown, the document title MUST be prefixed with the localized error word ("Error: " / "Error: ").
- **FR-UX-007**: No entered value is ever cleared by a validation failure, an endpoint error or a timeout (WCAG 3.3.7).
- **FR-UX-008**: Errors MUST NOT be signalled by color alone (icon or text prefix in addition), and every error color pairing on the forest background MUST pass WCAG AA.
- **FR-UX-009**: The Send button MUST never be disabled before a send. During a send it MUST show a localized sending state and ignore further presses.
- **FR-UX-010**: Without JavaScript, the form MUST submit as an ordinary page request to the endpoint and rely on the browser's built-in required/type/length checks; the endpoint then redirects to the thanks or failure page (FR-API-005). With JavaScript, the site's own validation (FR-UX-002…008) replaces the browser's built-in messages.
- **FR-UX-011**: A send that gets no response within 15 seconds MUST be treated as a failure (US3).
- **FR-UX-012**: Every failure state (US3) MUST show the team email address as a clickable `mailto:` link. The address is content (JSON), shared by both languages.
- **FR-UX-013**: Status changes that are not focus moves (sending, failure) MUST be announced to assistive technology.
- **FR-UX-014**: The form MUST be fully operable by keyboard alone, in a logical tab order, with a visible focus indicator on every control; no focused control may be hidden behind the sticky nav (WCAG 2.4.11); every control's target is at least 24×24 CSS px (WCAG 2.5.8).
- **FR-UX-015**: The form MUST follow CLAUDE.md Design Taste: forest background, paper text, square edges, hairline borders, `Btn` styling for Send, no rounded corners, no light/cream form panel, lime never used for body text. Any form motion is opacity-only and skipped under `prefers-reduced-motion`.
- **FR-UX-016**: The form MUST work at 390 px and 1440 px wide (and everything between) with no horizontal scrolling, and input text MUST be at least 16 px on mobile so iOS does not zoom on focus.

### Functional Requirements – Thanks and failure pages

- **FR-PAGE-001**: `/contact/thanks` and `/es/contact/thanks` MUST confirm the message arrived and say what happens next, using only wording Orbolo confirms (no promised reply time unless supplied), and link back to Home. They MUST be marked not-to-be-indexed and excluded from the sitemap.
- **FR-PAGE-002**: `/contact/error` and `/es/contact/error` (reached only without JavaScript) MUST explain the message did not go through, show the email fallback (FR-UX-012) and link back to Contact. Not indexed, not in the sitemap.
- **FR-PAGE-003**: Both pages MUST carry their own title and meta description per spec 003's metadata rules.

### Functional Requirements – Privacy and analytics

- **FR-LEG5-001**: Directly above or below the Send button, the form MUST show one short localized line stating that the details are used only to reply to the enquiry, with a link to the Privacy page. No consent checkbox is required to reply to an enquiry (Assumption, subject to counsel).
- **FR-LEG5-002**: Before the form is published (FR-GATE-001), the Privacy page MUST describe this processing: what is collected (FR-FIELD-001/003), why, where it is stored, by whom it is processed, how long it is kept, and how to ask for deletion. The wording is **supplied or approved by Vaz/counsel** – the implementing agent MUST NOT write legal text from scratch (consistent with spec 003 US3). Approval is recorded as a content flag read by FR-GATE-001.
- **FR-AN5-001**: Form completion MUST be measurable through the existing Plausible setup via the thanks pages (US4). No form field value, message text or email address may be sent to analytics.
- **FR-AN5-002**: The form MUST NOT set cookies, use local/session storage, or load any third-party script, font, iframe or captcha widget.

### Functional Requirements – Endpoint contract (the server MUST honour this; its implementation is out of scope)

- **FR-API-001**: One endpoint, `POST {FORM_ENDPOINT}` over HTTPS, on an Orbolo-controlled hostname (candidate: `https://api.orbolo.com/contact` – see OQ-C5).
- **FR-API-002**: Request fields (same names for both encodings): `name`, `email`, `phone`, `organisation`, `topic`, `message`, `callMe` (`true`/absent), `locale`, `page`, `renderedAt`, and the honeypot field. Accepted encodings: `application/x-www-form-urlencoded` (no-JS) and `application/json` (JS).
- **FR-API-003**: Success – JSON request: `201` with a small JSON body; form request: `303` redirect to the locale's thanks page.
- **FR-API-004**: Validation failure – JSON request: `422` with a body mapping each failing field name to an error code (e.g. `{"errors":{"email":"invalid"}}`); the website maps codes to its own localized messages (no server-written visitor-facing text). Form request: `303` to the locale's failure page.
- **FR-API-005**: Rate limited – `429` (JSON) / `303` to failure page (form). Any server error – `5xx` (JSON) / `303` to failure page (form).
- **FR-API-006**: Spam – if the honeypot is filled or the form was submitted less than 3 seconds after `renderedAt`, the endpoint MUST answer exactly as for success and store nothing.
- **FR-API-007**: The endpoint MUST validate every field with the same rules as FR-FIELD-001 (server rules are authoritative; the website's are a convenience).
- **FR-API-008**: Cross-origin calls MUST be allowed only from `https://orbolo.com` (and the preview origin while one exists), only for `POST` with `Content-Type: application/json`.
- **FR-API-009**: Obligations recorded here for the separate backend spec (not tested in this repository): store each accepted submission before emailing it; email the team inbox with the visitor's address only as Reply-To after validation, never inserting visitor input into other email headers; retry email delivery if it fails; delete submissions after the retention period (OQ-C2); rate-limit per client; HTTPS only; send email through an authenticated relay with SPF/DKIM for orbolo.com rather than directly from the home connection; keep encrypted backups off the machine.

### Functional Requirements – Testing (Constitution II, X)

- **FR-TEST-001**: Unit tests (Vitest) MUST cover the form content schema and repository (EN + ES entries present, required keys) and the client-side validation rules for every field in FR-FIELD-001, including boundary lengths and the "call me requires phone" rule.
- **FR-TEST-002**: End-to-end tests (Playwright) MUST run against a **mocked** endpoint (no real network) and cover: US1 AS1–AS5, US2 AS1–AS5, US3 AS1–AS3, keyboard-only completion, reduced-motion behaviour, both locales, 390 px and 1440 px widths, FR-GATE-001 (stub shown when endpoint/approval missing), and absence of cookies and third-party requests (FR-AN5-002).
- **FR-TEST-003**: `pnpm run verify` MUST be green; existing tests that pin the Contact stub copy are updated, never weakened or skipped.

### Functional Requirements – Background-photo refresh (added 2026-11-14; Governing Rule 5)

- **FR-IMG-001**: Exactly these five photos MUST be replaced, everywhere they are used, by the listed photo from `.specify/references/new-design/`:

| # | Current photo (`public/images/site/`) | Where it is used today | Replacement (`.specify/references/new-design/`) |
|---|---|---|---|
| 1 | `hero-mist.jpg` | Home hero (PhotoHero, LCP) | `06-pasture-green-black-cattle-landscape.jpg` (default) or `03-herd-sunset-sunburst-landscape.jpg` – OQ-D1 |
| 2 | `rider-herd.jpg` | Invest hero (PhotoHero, LCP) | `05-pasture-small-group-blue-sky-landscape.jpg` |
| 3 | `orbolo-grassfed.jpg` | Beef hero (PhotoHero, LCP) | `09-ranch-white-cow-closeup-landscape.jpg` |
| 4 | `zebu-close.jpg` | Beef "What we sell today" (Split) | `11-ranch-cows-bells-tree-portrait.jpg` |
| 5 | `rider-green.jpg` | Land "Ganadería a pasto" (Split), About Paraguay band (Band), Beef closing collage (CtaCollage, 2nd image) | `08-pasture-cow-grazing-leaves-portrait.jpg` |

- **FR-IMG-002**: These files MUST stay byte-identical and keep every current placement: `brahman-four.jpg`, `florian.jpg`, `gaucho-nelore.jpg`, `grazing-bright.jpg`, `nelore-herd.jpg`, `orbolo-cattle-shade.jpg`, `orbolo-gauchos.jpg`, `orbolo-palms.jpg`, `orbolo-walk.jpg`, `pasture-top.jpg`, `shade-tree.jpg`, `cow-lines-lime.png`, plus everything in `public/images/paths/`, `public/images/brand/`, `public/images/branding/` and `public/images/social/`.
- **FR-IMG-003**: New-design photos not listed in FR-IMG-001 MUST NOT be used: `07` is excluded (Vaz 2026-11-14); `01` and `02` (dusk / orange golden hour) do not meet "happier"; `04` and `10` are unassigned spares; `03` may only be the Home hero; `00` is a mockup, never a site asset.
- **FR-IMG-004**: Replacements MUST be used as photographed: crop, resize and compression only. No colour grading, filters, exposure edits, retouching, AI generation or added text/watermarks.
- **FR-IMG-005**: Each replacement MUST have a chosen focal point (crop position) so its main animals stay in frame at 390 px and 1440 px in every slot it fills, and so the brightest area (sky, sun) does not sit under a text block where avoidable.
- **FR-IMG-006 (Modern Web Guidance – `performance`, `deliver-optimized-decorative-images`)**: Each replacement MUST be delivered in AVIF and WebP with a JPEG fallback, in several widths, with responsive selection (`srcset` + `sizes`) so a 390 px phone never downloads a desktop-sized file; every image MUST reserve its space (intrinsic `width`/`height` or aspect ratio) so loading causes no layout shift. The original 1–4 MB / up to 9,504 px files MUST NOT be served. Image processing MUST use the existing stack (Astro's built-in image tooling) – no new runtime dependency (Constitution V).
- **FR-IMG-007 (Modern Web Guidance – `optimize-image-priority`)**: On every page whose first screen is a PhotoHero, the hero photo MUST be an `<img>`/`<picture>` in the HTML (not a CSS background), with `fetchpriority="high"` and without `loading="lazy"`; at most one image per page gets `fetchpriority="high"`. Split, Band and collage photos MUST keep `loading="lazy"` and MUST NOT get `fetchpriority="low"`; `fetchpriority="auto"` is not used. Because PhotoHero and Band are shared shells, this also applies to the kept photos they display (FR-IMG-002) – only markup and delivery change, never those files.
- **FR-IMG-008 (Modern Web Guidance – `color`, `accessibility`)**: The forest shade over photos (PhotoHero and Band shells, all pages using them) MUST be lightened where no text sits, so the photos read brighter, while every text block over a photo keeps at least 4.5:1 (normal text, including the 0.12em caps labels) or 3:1 (large text: ≥ 24 px, or ≥ 18.66 px bold) against the composited photo + shade at the lightest point behind that text, at 390 px and 1440 px. Contrast MUST come from the shade itself – not from `text-shadow` or `background-image` alone, which Forced Colors Mode removes. Section backgrounds stay forest (no cream/light section, CLAUDE.md). No `prefers-contrast: more` variant is required because the default already meets AA (Modern Web Guidance: use it only to reinforce, never to fix a failing default). In Forced Colors Mode, text MUST stay readable with system colours, and `forced-color-adjust: none` MUST NOT be used to preserve the photos.
- **FR-IMG-009**: Motion MUST be unchanged: the hero drift, band parallax, staggered reveals and their `prefers-reduced-motion` behaviour apply to the new photos exactly as to the old ones.
- **FR-IMG-010**: The two informative split photos MUST get updated alt text in EN and ES describing the new photo; candidates – Beef "What we sell today": EN "Brown cattle with bells, standing under a tree." / ES "Ganado marrón con cencerros bajo un árbol."; Land "Ganadería a pasto": EN "A brown cow grazing on green pasture." / ES "Una vaca marrón pastando en un potrero verde." The values are edited where they live today (`whatWeSellAlt`, `gappAlt` in `src/i18n/ui.ts`) – no new keys are added there (AGENTS.md known gap); hero, band and collage photos stay decorative (`alt=""`).
- **FR-IMG-011**: Because the replacements are stock photos, no alt text, caption, title or copy MAY state or imply that they show Orbolo's own ranches, animals, El Tapir or a specific place in Paraguay. Existing copy is not changed by this feature; OQ-D2 records the legal check.
- **FR-IMG-012**: Provenance (original Pexels filename, photographer, dimensions) MUST stay recorded in `.specify/references/new-design/_IMAGES.md`. No on-page credit is required (Pexels licence). Files replaced in FR-IMG-001 MAY be deleted from `public/images/site/` once nothing references them.
- **FR-IMG-TEST-001**: End-to-end tests (Playwright) MUST confirm, in EN and ES at 390 px and 1440 px, that every slot in FR-IMG-001 renders its replacement and that Contact, 404 and every placement in FR-IMG-002 still render their current photo.
- **FR-IMG-TEST-002**: End-to-end tests MUST confirm, per page: exactly one `fetchpriority="high"` image and it is the hero; no hero image is lazy; every replaced image offers AVIF and WebP sources with `srcset`/`sizes` and reserved dimensions; at 390 px no replaced image transfer exceeds the SC-009 budget.
- **FR-IMG-TEST-003**: Text contrast over photos (FR-IMG-008) MUST be checked on Home, Invest, Beef, Land and About in EN and ES at 390 px and 1440 px – automated by sampling the rendered screenshot behind each text block where feasible, otherwise a recorded manual check – and the results attached to the change. Automated accessibility checks (axe) MUST still report 0 violations.
- **FR-IMG-TEST-004**: `pnpm run verify` MUST be green; existing tests that pin the old image paths are updated, never weakened or skipped.

### Key Entities

- **Enquiry**: one submission. Attributes: name, email, phone (optional), organisation (optional), topic (`remote-rancher` | `beef` | `land` | `other`), message, callMe (boolean), locale (`en` | `es`), page, receivedAt (set by the server). Stored by the endpoint, never by the website.
- **ContactFormContent**: the localized copy listed in FR-GEN5-002, plus the team email address (FR-UX-012) and the privacy-approval flag (FR-LEG5-002). One entry per locale (`<id>`, `<id>-es`) following the existing content convention.
- **FormEndpointSetting**: the build-time endpoint URL (FR-GATE-002). Absent = form not published.
- **BackgroundPhotoSlot** (2026-11-14): one place a background or split photo is shown. Attributes: page, section, shell (`PhotoHero` | `Split` | `Band` | `CtaCollage`), photo file, role (hero/LCP or below-the-fold), focal point, alt text (informative splits only). FR-IMG-001 lists the slots that change; FR-IMG-002 the photos that do not.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can complete and send the form in under 2 minutes using keyboard only, in both languages (measured in the e2e keyboard test and a manual run at 390 px and 1440 px).
- **SC-002**: 100% of validation failures show both the error summary and inline messages, with all previously entered values preserved (e2e, US2).
- **SC-003**: 0 cookies set and 0 requests to third-party hosts from `/contact`, `/es/contact` and the thanks/failure pages (e2e network and cookie assertions).
- **SC-004**: When the endpoint fails or times out, 100% of attempts show the failure message with the email fallback and never show the thanks page (e2e, US3).
- **SC-005**: Automated accessibility checks report 0 violations at WCAG 2.2 AA on Contact and its thanks/failure pages, in both languages.
- **SC-006**: Completions per language are visible in Plausible within one day of launch, with no personal data in any analytics event.
- **SC-007**: With the endpoint unset or privacy approval missing, the production build succeeds and Contact shows exactly today's stub (e2e, FR-GATE-001).
- **SC-008**: Vaz approves on the preview that Home, Invest, Beef, Land and About look brighter and happier than before (side-by-side screenshots of each replaced slot, before vs after).
- **SC-009**: Each replaced photo transfers ≤ 200 KB at 390 px and ≤ 450 KB at 1440 px (AVIF where supported), against 1–4 MB originals (e2e network assertions).
- **SC-010**: Largest Contentful Paint on Home, Invest and Beef stays in Lighthouse's "good" range (≤ 2.5 s, mobile profile) and is not worse than before the change; Cumulative Layout Shift from images is 0.
- **SC-011**: 100% of text blocks over photos meet AA (FR-IMG-008) on all five pages, both languages, both widths; axe reports 0 violations.
- **SC-012**: 0 byte changes to the photos in FR-IMG-002 and 0 copy changes other than the two alt texts in FR-IMG-010 (diff review).

## Open Questions

- **OQ-C1**: Team inbox address that receives enquiries and is shown as the email fallback (FR-UX-012). Blocks FR-GATE-001.
- **OQ-C2**: Retention period for stored enquiries (common choice: 24 months). Needed for the Privacy wording (FR-LEG5-002) and the backend spec.
- **OQ-C3**: Counsel sign-off on (a) the privacy notice line (FR-LEG5-001), (b) the Privacy page section (FR-LEG5-002), (c) whether no consent checkbox is needed for enquiries, and (d) the data processing agreement between Orbolo (controller) and Vaz (processor, operating the server). Blocks FR-GATE-001.
- **OQ-C4**: Email relay used by the server (Orbolo's mailbox via SMTP or an EU transactional email service). Backend spec only; listed here because it affects the Privacy wording (processors named).
- **OQ-C5**: Endpoint hostname (candidate `api.orbolo.com`) and how it is exposed from the home machine (port-forward + reverse proxy with automatic TLS + dynamic DNS, or a tunnel provider – note a Cloudflare Tunnel routes traffic through a US company). Backend spec only.
- **OQ-C6**: What the thanks page may promise about next steps (e.g. "we reply within two working days") – only if Orbolo confirms it; otherwise neutral wording.
- **OQ-C7**: Confirm the home machine is physically in the EU (Assumption: Spain), to keep the brief's EU-residency non-negotiable (§17).
- **OQ-D1**: Home hero – `06-pasture-green-black-cattle-landscape.jpg` (bright green pasture, blue sky; **default**) or `03-herd-sunset-sunburst-landscape.jpg` (sunset sunburst). Vaz allowed both on 2026-11-14. Pick on the preview against SC-008 and FR-IMG-008.
- **OQ-D2**: Counsel/Vaz confirm that illustrative stock photos next to Invest and Beef copy create no misleading impression (the brief planned real El Tapir photography and anonymised ranches). Not a blocker for preview; confirm before launch.
- **OQ-D3**: When real Orbolo photography exists (brief: half-day shoots at El Tapir and the processor), it replaces the stock in FR-IMG-001 as a later content-only delta.

## Non-goals

- Server/endpoint implementation, database schema, email sending, backups, monitoring – separate backend spec and repository (FR-API-009 records obligations only).
- Google Forms, Tally or any third-party form tool; Google Sheets CRM; Slack alerts; auto-reply email to the visitor.
- Per-audience forms, topic prefilling from CTAs, topic-specific extra fields.
- Changing any CTA label or destination on Invest, Beef, Land, Home or About.
- Papermark data room / investor pack, Google Calendar call booking, email-gated spec sheet download, sample-request workflow, newsletter signup.
- Any captcha widget. Spam control in this feature is honeypot + minimum fill time + endpoint rate limiting; a privacy-first proof-of-work captcha (e.g. self-hosted ALTCHA) is a later delta only if spam gets through.
- Carrying typed values across a language switch.
- A postal address on Contact.
- *(2026-11-14 photo refresh)* Adopting the hero mockup's headline or layout; any copy change other than FR-IMG-010's alt texts; replacing any photo in FR-IMG-002; colour grading or editing photos; changing motion, colour tokens or section backgrounds; using new-design `07` (or `01`, `02`); changing path-card or social-preview images; adding photo captions; moving image paths or alt texts out of components/`ui.ts` into JSON (stays the AGENTS.md known gap).

## Assumptions

- **Backend scope**: this repository holds the website form and its tests; the endpoint is built and specified separately and honours FR-API-*. The website is tested only against a mocked endpoint.
- **Server**: a home/self-run machine operated by Vaz as a contractor for Orbolo; Orbolo is the data controller. Located in Spain (EU) – to be confirmed (OQ-C7).
- **Languages**: English and Spanish, as for every other localized route.
- **Accessibility**: Constitution IX applies in full, WCAG 2.2 AA; no exception requested or granted.
- **Legal**: replying to an enquiry the visitor sent rests on steps the visitor requested, so no consent checkbox – subject to counsel (OQ-C3). Marketing email would need separate, unticked consent and double opt-in under Austria's § 174 TKG 2021; out of scope here.
- **Hosting**: the website deploys to Firebase Hosting (EU) per the constitution; the form does not depend on the host because the endpoint is on its own hostname.
- **No new website dependency**: validation, sending and states use the platform and the existing stack (Astro, TypeScript, Zod via content collections). Any proposed dependency must be justified in `plan.md` (Constitution V).
- **Design skills**: `web-design-guidelines`, `taste` and `playwright` apply to this UI work (Constitution X); `image-to-code` applies only if a reference mockup of the form is supplied.
- **Photo refresh (2026-11-14)**: "brighter" is achieved through photos and the photo shade only – never through a light section background (CLAUDE.md anti-pattern). The Pexels licence allows commercial use without attribution. The 11 kept photos are the ones Vaz confirmed as already bright on 2026-11-14. Modern Web Guidance guides consulted: `performance`, `optimize-image-priority`, `deliver-optimized-decorative-images`, `color`, `accessibility`, `parallax-scroll-effects` (motion is unchanged, so its scroll-driven-animation advice is not applied here). `plan.md` (and any later `tasks.md`) predates this amendment and must be regenerated by Vaz with `/speckit-plan` to cover FR-IMG-*.
