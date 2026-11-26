# Feature Specification: Orbolo Website – Unified Site Restructure (Capital · Markets · Opportunities · About)

**Feature Branch**: `006-site-restructure` *(directory name only – no git branch was created by this specify pass; branch creation is Vaz's call)*

**Created**: 2026-11-22

**Status**: Approved by Vaz, 2026-11-25 ("i approve this draft"). Open Questions stay open; changes from here land as deltas (Constitution VII)

**Input**: User description (2026-11-22): "See these changes, or these requirements, compare it with the current ones, including the briefing, and tell me what changes are there." → "Create a unified specs combining the original and recent specs with this new one. Ask me if you need to clarify anything." Source: the English copy deck `Orbolo / Website / English` by Florian Senger-Weiss, dated 2026-11-22, stored in `specs/006-site-restructure/references/` (PDF + verbatim text extraction).

**What "unified" means here**: this spec is the single current description of the whole public site. It is built from four layers, highest authority first:

1. **The 2026-11-22 copy deck** (`references/orbolo-website-copy-2026-11-22.md`, "the copy deck") – wins every conflict (Vaz, 2026-11-22).
2. **Vaz's decisions recorded in this spec** (Clarifications) – fill gaps the copy deck leaves.
3. **Specs 001–005** – every rule they hold that the copy deck does not contradict stays in force and is restated or referenced here (see "Carried-over requirements").
4. **The September brief** (`specs/_shared/references/orbolo-website-brief.md`) – applies only where the three layers above are silent.

Specs 001–005 are not edited. Their README/spec files remain the history; where this spec retires or modifies one of their rules, the delta is listed in the Scope Change section below (Constitution VII).

---

## Governing Rules for This Feature

1. **The copy deck is the content.** Every visitor-facing string listed in the copy deck is used verbatim, in British spelling, under the content key the deck gives it (e.g. `hero.headline`, `faq.invest[3]`). The agent never rewrites, shortens, "improves" or paraphrases deck copy. Strings the deck does not provide (aria labels, validation messages, alt text, link labels for assets) follow the existing voice and are listed for Vaz's review.
2. **Earlier wording bans are retired.** The banned-word list (brief §B2.6, spec 002 FR-GEN-003, spec 004 wording table) and the "never regenerative" rule (FR-BEEF-010) no longer apply. The copy deck's words – including "invest", "capital", "returns", "regenerative", "impact" – are used as written (Vaz, 2026-11-22: "use the new copy verbatim").
3. **Show text, hide only assets.** Where the deck marks something `[TO COME]`, the section still renders with all of its available text; only the missing asset (logo, photo, icon, map, download file, external link, legal text) is left out of the DOM. No placeholder image, no "coming soon" label, no dummy link, no `href="#"`. This replaces spec 002's "hidden, never placeholder" rule, which hid whole sections.
4. **The site stays static; all forms use the self-hosted endpoint.** No Astro server adapter, no on-demand rendering, no third-party form tool, no Google Forms. Every form posts to the server Vaz operates for Orbolo, extending spec 005's endpoint contract (FR-API-*). Dynamic values (the "I'm in" counter) are fetched from that endpoint by the browser at page load.
5. **Design system unchanged.** CLAUDE.md Design Taste (forest/paper/lime tokens, square edges, HeliosExt/Roslindale/Suisse/Verbena, shells in `src/components/ui/*`, motion rules, anti-patterns) governs every new section. The copy deck's layout notes (in brackets after section headings) say *what* a section contains; CLAUDE.md says *how* it looks.
6. **English first, Spanish slot kept.** English ships complete. The content model and routing keep a Spanish (`-es`) slot for every page; a Spanish page is published only when its translated content entry exists. The current Spanish copy is not migrated (it describes the old structure).
7. **Accessibility is a release gate** (Constitution IX, WCAG 2.2 AA) for every new interaction: the contact panel, flip cards, accordions, moving partner band, "I'm in" panels and all forms.
8. **Modern Web Guidance applies** (Vaz's standing preference for new specs). The CLI (`npx modern-web-guidance@latest`) could not be run when this spec was first written; it was run during the clarification sessions (2026-11-23 to 2026-11-25) and its accepted advice is in FR-CON-004, FR-CON-007, FR-HOME-006, FR-FORM-007, FR-A11Y6-004 and FR-A11Y6-007. It has no guide on structured data. Guides were read as prose; `plan.md` MUST consult them again, code examples included, before design decisions are fixed.

---

## Scope Change – 2026-11-22 (delta against the brief and specs 001–005, per Constitution VII)

### Added

- **Pages**: `/capital`, `/markets`, `/opportunities`, `/media` (media kit), `/imprint` (legal-gated).
- **Request a call panel**: a modal panel opened by every "Request a call" button on the site, with origin-based preselection; `/contact` remains as the full-page version.
- **Forms**: "I'm in" interest registration per project with a public counter (shown from 10), gathering application, idea box, newsletter signup (footer, every page), order form on its own page (added 2026-11-24, OQ-006-M1; built once its fields exist, OQ-006-M3).
- **Home**: story section, "Capital and nature" section with a seven-item strip (text labels only for now, OQ-006-H2), "Come and see it" section (photos, El Tapir logo; no Chaco map for now, OQ-006-H3), moving partner band, closing CTA, four-group FAQ accordion with FAQ structured data.
- **About**: chaptered long scroll, founder chapter with quote, four-part cycle picture with links, principles paragraph, team grid, partners paragraph, folded glossary.
- **Footer**: tagline, company line, link list (Capital · Markets · Opportunities · About us · Media kit · Imprint · Privacy · Terms), newsletter signup.
- **Named partners**: Roundtable for Sustainable Beef Paraguay (member), CREA, Ganadería a Pasto (GAPP), Estancia El Tapir. (Answers spec 002 OQ-002/OQ-003 in part.)
- **Explicit SEO titles and descriptions** per page from the copy deck.

### Modified

- **Navigation** (spec 002 FR-GEN-009, R3): from `Home · Remote Rancher · Beef & Co · Education · About Us · Contact · EN/ES` to `Capital · Markets · Opportunities · About us · [Request a call] · ES`. The logo links Home; there is no "Home" text link. "Request a call" is a button that opens the panel.
- **Home audience cards** (spec 001): still three flip cards, config-driven, same flip interaction and accessibility rules; now they are the "you want X → here we have it" calls to action: Capital, Markets, Opportunities. Front: photo + question as title; back: one sentence + a link labelled with the destination page name. Position: after the "Capital and nature" section (copy deck order), not directly under the hero.
- **Routes**: `/invest` and `/land` → `/capital`; `/beef` → `/markets` (permanent redirects).
- **Form gate** (spec 005 FR-GATE-001): from "form not published until the endpoint is configured and privacy approved" to "form always shown; it sends nothing until then" (Vaz 2026-11-25, FR-GATE6-001). The Contact stub is dropped.
- **Contact form** (spec 005): endpoint, validation behaviour, error handling, accessibility and no-JS fallback are kept; the fields, topic options and copy are replaced (FR-CON-*). Phone becomes a conditional field.
- **Legal footer links** (spec 003 FR-LEG-*): the gate stays (a link only when the document exists and is approved); Imprint is added under the same gate; the footer now also carries non-legal links, so the "Legal" label moves from the whole footer to the legal links only (FR-FOOT-003).
- **SEO titles** (spec 003 FR-SEO-001): the pattern "‹Page› — Orbolo" is replaced by the exact titles in the copy deck. Unique-title, description-length (40–220 chars), Open Graph, canonical, robots and sitemap rules stay.
- **404** (spec 003 FR-404-*): new copy and a button instead of a text link; all other 404 rules stay.
- **Spanish** (all specs): from "full ES for every page" to "ES slot kept, ES pages published per page once translated" (Governing Rule 6).
- **Photography** (spec 005 FR-IMG-*): delivery, priority, contrast and shade rules stay; slot assignments are redefined for the new sections (FR-IMG6-*).
- **Placeholder handling** (spec 002 "hidden, never placeholder"): replaced by Governing Rule 3.
- **Cross-links** (spec 002 FR-INV-013 / FR-BEEF-009): only the copy deck's link remains – Markets `closing.next` → Capital. There is no Capital → Markets link (the deck has none).
- **Newsletter** (spec 005 FR-FIELD-004 and Non-goals "no newsletter"): now in scope.

### Removed (pages, sections and content no longer on the site)

- Pages `/invest`, `/beef`, `/land` as content pages (they become redirects).
- Home: the moving audience word strip and the "Find your path" heading (not in the copy deck; removal confirmed by Vaz 2026-11-25, OQ-006-H1).
- Invest: deployment pipeline (ranch cards, LOI progress bar), "How it works" 7 steps, "What you own, precisely", "Who buys the animal at the end?", "What if not enough people join?", "Who verifies what", contracting-entity line, investor FAQ (moved to Home in new form), "Get the Remote Rancher pack".
- Beef: roadmap, first-pick promise, conventional-price promise, MPCS references, 300,000-head alliance, "Who verifies what", spec sheet and sample-request CTAs, the `regenerative standard*` review note.
- Land: El Tapir section, partner ranches, Ganadería a Pasto section with its hectares metric, "Work with us".
- About: hero lede, "An old idea, rebuilt" (*capitalización de ganado*), "How the group works", four principles cards, "Why Paraguay", "Where we are", About FAQ, current closing.
- Metrics on the page: `animalCount`, `gappHectares` (no numbers in the copy deck). The `metrics` collection and `MetricValue` may stay in the codebase unused; nothing renders them.
- Current Spanish copy for all pages (kept in git history).

### Retired rules (no longer requirements)

| Rule | Source | Why |
|---|---|---|
| Banned-word list; never "regenerative"; no "invest/return" vocabulary | brief §B2.6–7, 002 FR-GEN-003, FR-BEEF-010, 004 wording table | Copy deck wins; Vaz 2026-11-22 |
| Orbolo never collects/holds/manages money; Orbolo only "facilitates"; contracting-entity line on investor pages | brief §1, §17; 002 FR-GEN-004, R6 | Copy deck positions Orbolo as "the operator on the ground" and describes management fees |
| 60% release rule, signed-LOI-only progress, 90-day LOI expiry, "no money before release" | brief §5, §7, §17; Invest copy | Copy deck: rolling rounds sized to interest |
| Orbolo trading desk as off-taker of every herd | brief §1, §4 | Copy deck: sold into Paraguay's cattle market |
| Every number dated and sourced via Metric records | brief §3, §17; 002 FR-GEN-005 | No numbers in the copy deck; rule returns automatically if a number is added later (OQ-006-G3) |
| "Say what we don't do yet" blocks; "no closed cycle" statements | brief §B2.5, 004 | Copy deck states round one completed a full cycle |
| Credits "stay with the land and the group; return is beef" | brief §9.4, Invest copy | Copy deck presents carbon/biodiversity credits as added value |
| First-pick and conventional-price promises on Beef | brief §17 | Not in copy deck |
| No icon grids; no bare logo walls | brief §B1, §8 | Copy deck asks for an icon strip and a moving logo band |
| Pinned page titles/h1s (as-is freeze) | 003 SC-001 | All titles change |
| `howItWorks.steps` exactly 7 | 004 schema limit | Section removed |
| "No per-page prefilling of the contact topic" | 005 Scope Change | Copy deck requires origin-based preselection |

---

## Clarifications

### Session 2026-11-22

- Q: Do the three Home cards stay? → A: Yes. "The 3 cards are now the call to actions – you want x → here we have it." They link to Capital, Markets and Opportunities.
- Q: Should the new cards still flip? → A: Keep the flip.
- Q: How is each card's text split? → A: Question as title, sentence as body, page name as link label.
- Q: Moving word strip and "Find your path" heading? → A: No preference. **Decision under Rule "copy deck wins"**: both removed; confirmed 2026-11-25 (OQ-006-H1).
- Q: Where do the cards sit? → A: Where the copy deck puts them: Hero → Story → Capital and nature → cards → Come and see it → partners → closing → FAQ.
- Q: Where the copy deck and the brief disagree, which wins? → A: The new document wins everywhere; brief rules survive only where the new document is silent.
- Q: Banned words and investment vocabulary? → A: Use the new copy verbatim; retire the wording bans.
- Q: Spanish until the translation exists? → A: Keep the ES slot; ES pages stay unpublished until each has its translated content.
- Q: Where is the spec written? → A: `specs/006-site-restructure/spec.md` in the repo, plus a copy in the Orbolo SDD project. Specs 001–005 untouched.
- Q: `[TO COME]` items? → A: Show text, hide only assets.
- Q: What happens to spec 005? → A: Replace 005's form fields; keep its endpoint, gate, validation approach and thanks/error pages. (Gate modified 2026-11-25: FR-GATE6-001.)
- Q: Phone/WhatsApp chosen but no phone field? → A: Add a phone field that appears and becomes required only when phone or WhatsApp is chosen.
- Q: Storage for the new forms and the live "I'm in" count? → A: Same self-hosted endpoint; the count is fetched from it at page load.

### Session 2026-11-23

- Q: What control should the contact form use for "Best times for you (shown in your time zone)"? (OQ-006-C1) → A: B – checkboxes for days (Mon–Sun) and parts of the day (morning / afternoon / evening, with hour ranges) in the visitor's time zone; at least one day and one part of the day required; the detected zone is shown and can be changed; only the IANA zone name is sent, no time conversion on the site.

### Session 2026-11-24

- Q: Should "Request a quote" go to an external order-form link or to a form Orbolo hosts? (OQ-006-M1) → A: B – a page Orbolo hosts, posting to the same self-hosted endpoint as a sixth form type (`order`). Its fields and copy are not in the deck and come from Florian (OQ-006-M3); until they exist the page is not built and both "Request a quote" buttons are absent.

### Session 2026-11-25

- Q: Where should "Production" and "Education" link in the About cycle picture? (OQ-006-A1) → A: C – Production → the "Prefer land?" block on Capital; Education → the Education project card on Opportunities.
- Q: Who supplies the seven "Capital and nature" icons and the Chaco map? (OQ-006-H2, OQ-006-H3) → A: D – drop both for now: the icon labels show as text only and there is no map; the content model keeps both slots.
- Q: From 10 registrations up, what exactly should a project card show? (OQ-006-O1) → A: A – "{n} people are in." and nothing else; "Be one of the first." shows only below 10 (the deck's "below that" means below 10). The counter wording is not in the deck; chosen by Vaz.
- Q: Confirm removing the moving word strip and the "Find your path" heading from Home? (OQ-006-H1) → A: A – both removed; the cards section gets a visually hidden heading, "Your part in it" (the deck's section name).
- Q: Should the deck's section names that have no content key appear as visible headings? → A: A – 25 of them are shown exactly as written, chapter numbers included; the working labels (Hero, Story, Partner band, Closing, The problem, "The offer: Remote Rancher, round two") are never shown; "Your part in it" stays hidden (FR-GEN6-008).
- Q: What should the project cards and forms show while there is no backend and no approved privacy text? → A: The forms are shown now, even if they do nothing: for now the aim is a website where Vaz can see the new design, contact form included; the backend and privacy come later. (Vaz first answered "A, and publish form", then clarified; the forms-hidden state is dropped.) Applied to the five deck forms; the order form is unchanged (FR-GATE6-001, OQ-006-P1).
- Q: Should the deck's bracketed notes in the form fields appear on the page? → A: A – all three are shown exactly as written, as part of the field's label or legend: "(shown in your time zone)", "(optional)", "(one or two lines)" (FR-CON-002, FR-OPP-007).
- Q: What title should sit above the Video / Phone / WhatsApp choice? → A: B – "How you’d like to talk" instead of the deck's field text "Video, phone or WhatsApp" (chosen by Vaz; FR-CON-002).
- Q: Which photo should fill the Home hero? (OQ-006-G2) → A: A – `06` (cattle on green pasture, blue sky), the current Home hero; this also settles 005 OQ-D1 (FR-HOME-001).
- Q: Apply the nine proposed fixes? → A: yes, all (Vaz, 2026-11-25): (1) contact panel focus, closing and scroll (FR-CON-007); (2) FAQ questions open independently (FR-HOME-006); (3) one Pause/Play button on the partner band (FR-A11Y6-004); (4) preselection rule (FR-CON-006); (5) menu, footer and Home hero texts move to content JSON (FR-GEN6-003); (6) only the legal links are labelled "Legal" (FR-FOOT-003); (7) distinct names for repeated buttons (FR-A11Y6-007); (8) 005 photo rules kept (FR-IMG6-005); (9) form and time-zone details (FR-FORM-007, FR-CON-004) and the Modern Web Guidance note (Governing Rule 8).
- Q: Which photos should the new pages use until Orbolo sends its own? → A: A – the whole list in `research.md` R13; project cards, Markets tiles, team and Villa Weiss have no photos until real ones arrive. The two photos beside the El Tapir text on Home are asked separately (FR-IMG6-001).
- Q: May `orbolo-walk` and `orbolo-cattle-shade` stand beside the El Tapir text on Home? → A: A – yes, both (FR-IMG6-001).
- Q: Without JavaScript, may the contact form open with no interest selected? → A: A – yes; the interest is preselected only with JavaScript, because a static page cannot read the link. Delta to US1 AS6, FR-CON-006 and FR-CON-007 (found while planning, research P1).
- Q: Keep the footer's "© 2026 Orbolo" and the hero's "Scroll" cue, which the deck doesn't have? → A: B – keep the copyright line, drop the scroll cue (FR-FOOT-001, FR-HOME-001).
- Q: Is the candidate wording for strings the deck lacks fine to use? → A: A – the whole of `contracts/candidate-copy.md` as written on 2026-11-25. Where a requirement calls one of these strings a candidate, that file's wording is the approved one; any new string still needs review.
- Q: Does the Markets tile "Something else from Paraguay? Ask us." link anywhere? (OQ-006-M2) → A: A – no link, text only (FR-MKT-004).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 – A prospective investor reaches Capital and requests a call (Priority: P1)

A visitor interested in owning cattle lands on Home or Capital, understands the Remote Rancher offer, and requests a 15-minute call with "Remote Rancher" already selected.

**Why this priority**: The call request is the site's primary conversion and the only path into the data room.

**Independent Test**: Open `/capital`, read top to bottom, press "Request my 15-minute call", complete the panel, receive the success message; repeat without JavaScript via `/contact`.

**Acceptance Scenarios**:

1. **Given** a visitor on `/capital`, **When** the page loads, **Then** sections render in deck order: hero, problem, offer, proof, promise, prefer land, risks, why now, closing – all text verbatim from the copy deck §2.
2. **Given** a visitor on `/capital`, **When** they activate "Request my 15-minute call" (hero or closing), **Then** the Request a call panel opens with "Remote Rancher" preselected, focus moves into the panel, and the page behind is inert.
3. **Given** the panel is open, **When** the visitor presses Escape or the close control, **Then** the panel closes and focus returns to the button that opened it.
4. **Given** the visitor chooses "Phone" or "WhatsApp", **When** the choice is made, **Then** a phone number field appears directly after the choice, labelled and required; choosing "Video" hides it again and it is no longer required.
5. **Given** valid input, **When** the visitor sends, **Then** the panel shows the deck's `contact.success` text and the endpoint receives the submission with `interest=remote-rancher` and the visitor's time zone.
6. **Given** JavaScript is unavailable, **When** the visitor activates the button, **Then** they reach `/contact?interest=remote-rancher` with no interest selected (modified 2026-11-25), and sending leads to the thanks page.
7. **Given** a visitor requests `/invest` or `/land`, **When** the request is served, **Then** they are permanently redirected to `/capital`.

---

### User Story 2 – Every visitor can find their way: navigation, Home and redirects (Priority: P1)

A visitor understands what Orbolo is from Home and picks Capital, Markets or Opportunities through the menu or the three cards.

**Why this priority**: The new structure only works if the menu, Home and old URLs all lead to the new pages.

**Independent Test**: Load Home at 390 px and 1440 px; use the menu, the three cards (mouse, keyboard, touch) and the FAQ; request every old URL.

**Acceptance Scenarios**:

1. **Given** any page, **When** it renders, **Then** the menu shows exactly: Capital, Markets, Opportunities, About us, a "Request a call" button and – only when the current page has a published Spanish version – "ES"; the logo links to Home; no link is hidden behind a hamburger.
2. **Given** Home, **When** it renders, **Then** sections appear in deck order: hero, story, capital and nature, three cards, come and see it, partner band, closing, FAQ.
3. **Given** a Home card, **When** the visitor clicks, taps or presses Enter/Space on its flip trigger, **Then** it flips to show the sentence and a link labelled "Capital", "Markets" or "Opportunities"; the flip never navigates; activating the link navigates; Escape or the trigger flips back.
4. **Given** the FAQ, **When** the visitor opens a question, **Then** its answer is shown; questions are grouped under "About Orbolo", "Investing", "Market access", "Visiting"; the page carries FAQ structured data matching the visible text.
5. **Given** the partner band, **When** it moves, **Then** it pauses on hover and keyboard focus, offers a visible pause control, and does not move at all under reduced motion.
6. **Given** `/beef`, **When** requested, **Then** a permanent redirect goes to `/markets`.

---

### User Story 3 – A business buyer requests a quote on Markets (Priority: P2)

A B2B buyer sees what Orbolo can supply and requests a quote through the order form.

**Why this priority**: Second revenue engine; the order form depends on a field list still to come (OQ-006-M3).

**Independent Test**: Open `/markets`, read it, follow "Request a quote" (when the order form is published) and the Capital cross-link.

**Acceptance Scenarios**:

1. **Given** `/markets`, **When** it renders, **Then** sections appear in deck order: hero, five product tiles, already possible, why buy through us, four-step ordering timeline, closing with the Capital link – verbatim from deck §3.
2. **Given** the order form is not published (FR-ORD-003), **When** the page renders, **Then** both "Request a quote" buttons are absent and all surrounding text still renders (Governing Rule 3).
3. **Given** the order form is published, **When** the visitor activates "Request a quote", **Then** they reach the Orbolo-hosted order page and can send the form, with and without JavaScript.

---

### User Story 4 – A supporter says "I'm in" on a project (Priority: P2)

A visitor on Opportunities registers interest in one or more projects with name and email, and sees how many others are in once there are at least ten.

**Why this priority**: Builds the early-supporter list the deck promises; first dynamic data on the site.

**Independent Test**: Open `/opportunities`, open "I'm in" on a card, submit, see the success text; check the counter display at 9 and 10 registrations with a mocked endpoint.

**Acceptance Scenarios**:

1. **Given** a project card, **When** it renders, **Then** it shows photo, name, one line, an "I'm in" button and the line "No money, no commitment."
2. **Given** the endpoint reports fewer than 10 registrations for a project, or does not answer, **When** the card renders, **Then** it shows "Be one of the first." and no number.
3. **Given** the endpoint reports 10 or more, **When** the card renders, **Then** it shows "{n} people are in." and does not show "Be one of the first." (deck `roadmap.button`; OQ-006-O1).
4. **Given** the visitor activates "I'm in", **When** the small panel opens, **Then** it asks only for name and email, shows the consent line, and on success shows `interest.success`.
5. **Given** the same email registers twice for the same project, **When** the second registration arrives, **Then** the visitor sees the same success message and the count does not increase.
6. **Given** "More ideas", **When** the visitor opens the fold, **Then** the four ideas are shown as text, without "I'm in" buttons.

---

### User Story 5 – A visitor applies for a gathering seat, sends an idea, or offers to partner (Priority: P3)

**Independent Test**: On `/opportunities`, apply for a seat, send a one-line idea, and use the three "Let's talk / Offer your skills" lines; verify preselection.

**Acceptance Scenarios**:

1. **Given** the gatherings section, **When** "Apply for a seat" is activated, **Then** a panel asks for name, email, which gathering (two options) and what they would bring (one or two lines), and on success shows `gatherings.form.success`.
2. **Given** the idea line, **When** the visitor types one line and sends, **Then** `idea.success` is shown in place.
3. **Given** "Partner with us → Let's talk", "Offer your skills", or the introducer "Let's talk", **When** activated, **Then** the Request a call panel opens with "Partnering", "Something else" or "Introducing someone" preselected respectively.

---

### User Story 6 – A visitor reads About and the supporting pages (Priority: P3)

**Independent Test**: Read `/about`, open the glossary fold, follow the cycle links; open `/media`, an unknown URL, the footer links; subscribe to the newsletter.

**Acceptance Scenarios**:

1. **Given** `/about`, **When** it renders, **Then** it shows, in deck order: hero, chapters 1–4 (chapter 3 with its Amazon paragraph), the four-part cycle picture with each part a link, how we work, team, who we work with, words we use (folded), closing.
2. **Given** team roles and photos are not supplied, **When** the team grid renders, **Then** the five names render as text and nothing else.
3. **Given** the footer, **When** a visitor submits an email to the newsletter, **Then** `newsletter.success` is shown; with double opt-in (FR-NEWS-003) the confirmation email is the next step.
4. **Given** `/media`, **When** it renders, **Then** headline, body and the 50-word introduction render; each download link appears only when its file exists.
5. **Given** an unknown URL, **When** requested, **Then** the 404 page shows the deck's 404 copy and a "Back to home" button, with HTTP 404.

---

### Edge Cases

- **Panel opened on a page that is itself `/contact`**: "Request a call" buttons on `/contact` move focus to the form on the page instead of opening a panel over it.
- **Two different preselections**: until the visitor picks an interest themselves, each opening sets the interest to that button's preselection, or to nothing if it has none (Capital, then the nav button → nothing selected). Once the visitor has picked one, no later button changes it on that page load (FR-CON-006).
- **Panel open, visitor uses Back**: on Android, where the browser treats Back as a close request, the panel closes and the page stays. Elsewhere (e.g. desktop) the browser's Back leaves the page as usual; the site does not intercept it.
- **Endpoint down when Opportunities loads**: counters fall back to "Be one of the first."; the "I'm in" buttons still render; a send fails with `forms.error` and the values are kept.
- **Endpoint returns a count while the visitor has just registered**: the visitor's own registration is not added to the displayed count client-side; the count refreshes only on the next page load.
- **Counter abuse**: repeated registrations from one email per project count once; the endpoint rate-limits per client (FR-API6-004).
- **Visitor's time zone cannot be detected**: the time-zone line shows "UTC" and the visitor can change it (FR-CON-004).
- **Very long names or ideas**: limits per FR-FORM-002; the idea box is single-line and caps at 280 characters.
- **ES link on an English-only page**: not shown. Old Spanish URLs (`/es`, `/es/invest`, `/es/beef`, `/es/land`, `/es/about`, `/es/contact`) redirect to their English counterparts until the Spanish page exists (Assumption A-ES).
- **Reduced motion**: flip near-instant, partner band static, photo drift and reveals skipped, panel opens without animation.
- **A partner logo arrives for only some partners**: each partner shows its logo if supplied, otherwise its name as text, in the same band.
- **Legal pages still unapproved at launch**: Imprint, Privacy and Terms links are absent from the footer, and the consent line's "Privacy policy" link is absent while its sentence stays (Governing Rule 3) – the forms are shown but send nothing until privacy approval (FR-GATE6-001).

---

## Requirements *(mandatory)*

### Functional Requirements – General structure (FR-GEN6)

- **FR-GEN6-001**: The site MUST publish exactly these English pages: `/` (Home), `/capital`, `/markets`, `/opportunities`, `/about`, `/contact`, `/media`, the order page only once published (FR-ORD-003), plus `/privacy`, `/terms`, `/imprint` only when each is approved (FR-LEG6-*), the contact thanks/error pages (FR-CON-010), and the 404 page.
- **FR-GEN6-002**: `/invest` and `/land` MUST answer with a permanent redirect (HTTP 301) to `/capital`; `/beef` to `/markets`. Redirects from the old production site's URLs (brief §11) stay in force wherever they currently exist; their targets are updated to the new routes.
- **FR-GEN6-003**: Every visitor-facing string MUST come from the content layer (JSON content collections), keyed by the copy deck's content keys (Constitution VIII). Components carry no copy. Strings the deck does not provide (labels, aria text, validation messages, alt text) also live in content JSON – no new strings are added to `src/i18n/ui.ts`. The menu, footer and Home hero texts, today in `ui.ts`, MUST move to content JSON in this feature.
- **FR-GEN6-004**: Every string the copy deck provides MUST appear exactly as written in the deck (characters, punctuation, en-dashes, curly apostrophes, British spelling). Line breaks inside deck paragraphs are PDF layout, not content.
- **FR-GEN6-005 (assets)**: For any asset marked `[TO COME]` or not yet supplied (logos, photos, icons, the Chaco map, download files, external links, legal text), the asset's element MUST be absent from the DOM while every text of its section renders. No placeholder, skeleton, "coming soon", dummy link or `href="#"`. Adding the asset later MUST be a content-only change.
- **FR-GEN6-006**: Each page's content MUST have an `-es` slot in its collection schema. A Spanish route is built only when the page's `-es` entry exists and is complete; otherwise it is not built, not in the sitemap and not offered in the language switch.
- **FR-GEN6-007**: The project name "Remote Rancher" and the place names "Estancia El Tapir", "Ganadería a Pasto (GAPP)", "Gran Chaco", "Villa Weiss" are written exactly as in the deck.
- **FR-GEN6-008 (section headings without a content key)** *(clarified 2026-11-25)*: These 25 deck section names MUST be visible headings of their sections, exactly as written. They count as deck strings for FR-GEN6-004, FR-TEST6-003 and SC-001; the deck gives them no content key, so `plan.md` names the keys.
  - **Home**: FAQ
  - **Capital**: Why you can trust it · Our no-pressure promise · Prefer land? · What could go wrong · Why now
  - **Markets**: What we supply · Already possible · Why buy through us · How ordering works
  - **Opportunities**: How it works · The projects · What early supporters get · Why it’s more than an idea · Gatherings · Bring something
  - **About**: Chapter 1 – How it began · Chapter 2 – The founder · Chapter 3 – The Chaco, split in two · Chapter 4 – What we’re building now · How it fits together · How we work · Team · Who we work with · Words we use

  The layout note in brackets after a name is never shown. "Words we use" is shown once, as the visible label of its fold (FR-ABOUT-004). The working labels Hero, Story, Partner band, Closing, The problem and "The offer: Remote Rancher, round two" MUST NOT be shown. "Your part in it" stays visually hidden (FR-HOME-005). Sections whose heading has a key (e.g. `story.heading`) show only that heading.

### Functional Requirements – Navigation and footer (FR-NAV6, FR-FOOT)

- **FR-NAV6-001**: The primary navigation MUST show, in this order: Capital (`/capital`), Markets (`/markets`), Opportunities (`/opportunities`), About us (`/about`), a "Request a call" button, and the language switch. The logo links to `/`. The nav link list is code-level (002 R3 kept); labels are content.
- **FR-NAV6-002**: The language switch MUST show "ES" only on pages with a published Spanish counterpart (and "EN" on Spanish pages). Its accessible name keeps the visible text (WCAG 2.5.3, as today).
- **FR-NAV6-003**: Every nav link MUST stay visible and keyboard-reachable at every width; no hamburger hides them (CLAUDE.md anti-pattern kept). The current page link carries `aria-current="page"`.
- **FR-NAV6-004**: The "Request a call" button MUST be a real link to `/contact` that JavaScript upgrades to open the panel (FR-CON-007).
- **FR-FOOT-001**: The footer MUST show `footer.line`, `footer.company` (without its `[TO COME]` note), the links in `footer.links` order (Capital · Markets · Opportunities · About us · Media kit · Imprint · Privacy · Terms) and the newsletter form (FR-NEWS-*). It also keeps today's copyright line, "© ‹current year› Orbolo" (not in the deck; Vaz, 2026-11-25).
- **FR-FOOT-002**: Imprint, Privacy and Terms links MUST render only when their document exists and is approved (003 FR-LEG-001 and R5 kept, extended to Imprint).
- **FR-FOOT-003**: Only the group holding Imprint, Privacy and Terms is labelled "Legal"; today the whole footer carries that label. The other links form their own labelled group (label candidate "Footer", for Vaz's review), and deck order is kept. When no legal document is approved, the "Legal" group is absent.

### Functional Requirements – Home (FR-HOME)

- **FR-HOME-001**: Home MUST render, in this order, the sections of deck §1: hero (full-width photo: `06-pasture-green-black-cattle`, the current Home hero, OQ-006-G2, without today's "Scroll" cue; `hero.headline`, `hero.subline`, `hero.ctas`), story (`story.heading`, `story.paragraphs[0–3]`, photos between paragraphs), capital and nature (`capitalNature.heading`, `capitalNature.body`, `capitalNature.icons`), the three cards (FR-HOME-003), come and see it (`visit.heading`, `visit.body`, photos, El Tapir logo; the Chaco map is dropped for now, its content slot stays – OQ-006-H3 → D), partner band (`partners.logos`), closing (`closing.line`, `closing.cta`), FAQ (FR-HOME-006).
- **FR-HOME-002**: Hero CTAs: "See the opportunities" is the primary button to `/opportunities`; "Request a call" is a secondary link opening the panel with no preselection.
- **FR-HOME-003 (cards)**: Three cards, from `choose.cards[0–2]`, MUST link to `/capital`, `/markets`, `/opportunities` respectively. Each card's content: **title** = the question ("Looking to invest?", "Looking for a supplier?", "Want to be part of it?"); **body** = the remaining sentence(s); **link label** = the page name after the arrow ("Capital", "Markets", "Opportunities"); **image** + **alt**. Cards are read from a content collection through a repository (001 R4 kept); the card component knows nothing about which card it renders.
- **FR-HOME-004 (flip, carried from 001)**: Front shows image + title; activating the flip trigger (`<button aria-expanded>`) shows body + link; the flip never navigates; the link is a real `<a href>` present in the DOM in every state and works without JavaScript; opening moves focus to the link; Escape or the trigger flips back and returns focus; mouse, keyboard and touch all work, nothing is hover-only; reduced motion makes the flip near-instant; a broken image shows the branded fallback; layout adapts (not scales) at all widths. 001 FR-004/005/006/009/011/012/013/016/017/019/022/023/024 and decisions R2, R3, R5, R6 stay in force, with "Discover more" replaced by the per-card link label from content.
- **FR-HOME-005**: The moving word strip and the "Find your path" heading MUST NOT render (confirmed 2026-11-25, OQ-006-H1). The cards section is named by a visually hidden heading, "Your part in it" (the deck's section name, held in content).
- **FR-HOME-006 (FAQ)**: The FAQ MUST render under its "FAQ" heading (FR-GEN6-008) as four groups in deck order with deck headings ("About Orbolo", "Investing", "Market access", "Visiting") and all 15 questions with their answers verbatim. Each question is an expandable disclosure, operable by keyboard, all closed by default, answers present in the DOM (findable by in-page search) when closed. Questions open and close independently: opening one MUST NOT close another.
- **FR-HOME-007 (FAQ structured data)**: Home MUST include FAQPage structured data whose questions and answers are character-identical to the visible text, generated from the same content entries.
- **FR-HOME-008 (icon strip)**: The seven `capitalNature.icons` labels render as text; an icon is shown beside a label only once its icon asset is supplied (FR-GEN6-005). No icons ship in this feature and none are drawn by the agent (OQ-006-H2 → D, 2026-11-25); the optional icon slot stays in the content model. If added later, icons are decorative (`alt=""`/`aria-hidden`).
- **FR-HOME-009 (partner band)**: Each partner in `partners.logos` renders as its logo once supplied, otherwise as its name in text. "Roundtable for Sustainable Beef Paraguay" carries its "(member)" qualifier in text or in the logo's accessible name. The band moves only when the motion conditions in FR-A11Y6-004 are met.

### Functional Requirements – Capital (FR-CAP)

- **FR-CAP-001**: `/capital` MUST render, in this order, deck §2 sections: hero (`hero.headline`, `hero.subline`, `hero.cta`), problem (`problem.body`, dark background), offer (`offer.heading`, `offer.stack` – seven items as a list, `offer.effort`), proof (`proof.body` with photos), promise (`promise.body`), prefer land (`land.body`, small block), risks (`risks.cards`, three cards: Nature, Markets, Liquidity, each with its label and body), why now (`urgency.body`), closing (`closing.line`, `closing.cta`).
- **FR-CAP-002**: Both CTAs ("Request my 15-minute call") MUST open the panel with "Remote Rancher" preselected; their no-JS href is `/contact?interest=remote-rancher`.
- **FR-CAP-003**: The offer stack MUST be one visually grouped block ("stacked offer box") with the seven items in deck order and `offer.effort` directly beneath.
- **FR-CAP-004**: The "dark background" note for the problem section MUST be met within CLAUDE.md tokens (e.g. the darkest forest token `#263518` or a shaded photo band) – no new colour token without Vaz's approval.

### Functional Requirements – Markets (FR-MKT)

- **FR-MKT-001**: `/markets` MUST render deck §3 in order: hero (`hero.headline`, `hero.subline`, `hero.cta`; photo of cattle on grass, then boxed product), five product tiles (`products.tiles`, each with a photo), already possible (`possible.body`), why buy through us (`why.body`, team photo), how ordering works (`order.steps`, four steps as an ordered list rendered as a timeline), closing (`closing.line`, `closing.cta`, `closing.next`).
- **FR-MKT-002**: "Request a quote" (hero and closing) MUST link to the order page (FR-ORD-001); while that page is not published both buttons are absent (FR-GEN6-005). The destination is content, never hard-coded in a component.
- **FR-MKT-003**: `closing.next` MUST link "Capital" to `/capital`. It is the only cross-link between Markets and Capital.
- **FR-MKT-004**: The fifth tile ("Something else from Paraguay? Ask us.") has no photo requirement of its own beyond the tile pattern; it MUST NOT link anywhere (OQ-006-M2 → A, 2026-11-25).

### Functional Requirements – Order form (FR-ORD; added 2026-11-24, OQ-006-M1 → B)

- **FR-ORD-001**: The order form MUST be a page of this site (route candidate `/markets/order`, for Vaz's review), reached from both "Request a quote" buttons. It is a page, not a panel. It is never a third-party form or Google Forms.
- **FR-ORD-002**: It MUST post to the self-hosted endpoint as form type `order` and follow FR-FORM-*, including the no-JS path. Its fields, limits, labels, success text, title and description are not in the deck: they are supplied by Florian/Vaz (OQ-006-M3) and never invented by the agent.
- **FR-ORD-003**: The page MUST be published only when the form gate is open (FR-GATE6-001) **and** its content entry exists and is complete. Until then it is not built, not linked and not in the sitemap, and the build succeeds.

### Functional Requirements – Opportunities (FR-OPP)

- **FR-OPP-001**: `/opportunities` MUST render deck §4 in order: hero (`hero.headline`, `hero.subline`, `hero.cta`), how it works (`steps`, three steps in one line on wide screens, stacked on narrow), the projects (`roadmap.cards`, five cards), "More ideas" fold (`roadmap.more`), what early supporters get (`early.stack`, `early.price`), why it's more than an idea (`proof.body` with photo), gatherings (`gatherings.body`, photo of Villa Weiss, `gatherings.cta`), bring something (`join.partner`, `join.skills`, `join.idea`, `join.introduce`), closing (`closing.line`, `closing.cta`).
- **FR-OPP-002**: "See the projects ↓" (hero) and "See the projects ↑" (closing) MUST be in-page links to the projects section, which has a stable id. Arrows are part of the visible label and hidden from assistive technology.
- **FR-OPP-003**: Each project card MUST show its photo, name, one line, the "I'm in" button and "No money, no commitment." Projects are content entries with a stable `projectId` (`remote-beekeeper`, `buffalo`, `native-forest`, `education`, `amazon-to-chaco`) used by the endpoint.
- **FR-OPP-004 (counter)**: On page load, the page MUST request the registration counts for all projects in one call (FR-API6-003). For a project with count ≥ 10 the card shows "{n} people are in." (content string, chosen by Vaz 2026-11-25, OQ-006-O1) and not "Be one of the first.". Below 10, while the gate is closed (FR-GATE6-001), on error, on timeout (5 s) or without JavaScript, the card shows only "Be one of the first." The threshold 10 is content/configuration.
- **FR-OPP-005 (I'm in panel)**: Activating "I'm in" MUST open a small panel tied to that project with fields Name and Email (`interest.fields`), the consent line, the button "I'm in" (`interest.button`), and on success `interest.success`. Without JavaScript, "I'm in" is a link to a no-JS form page or an anchor to an inline form per project (decided in plan; MUST work without JS).
- **FR-OPP-006**: "More ideas" MUST be a disclosure, closed by default, showing the four items as text; the non-profit item keeps its "(donations welcome)" text with no donation link (no donation mechanism exists – OQ-006-O3).
- **FR-OPP-007 (gatherings)**: `gatherings.body` renders without its `[TO COME]` note. "Apply for a seat" opens the gatherings panel (FR-FORM-*): Name, Email, Which gathering (radio: "Villa Weiss, April 2027" / "Paraguay, October 2027"), "What would you bring to the table? (one or two lines)" (label exactly so, clarified 2026-11-25; required), button "Apply", success `gatherings.form.success`.
- **FR-OPP-008 (bring something)**: `join.partner` "Let's talk" → panel, "Partnering" preselected. `join.skills` "Offer your skills" → panel, "Something else" preselected. `join.introduce` "Let's talk" → panel, "Introducing someone" preselected. `join.idea` "Send" → the inline idea box (FR-IDEA-*).

### Functional Requirements – About (FR-ABOUT)

- **FR-ABOUT-001**: `/about` MUST render deck §5 in order as a long photo-led scroll, one idea per screen: hero (`hero.headline`, `hero.subline`, photo: sunrise over the Chaco), chapter 1 (`ch1.body`), chapter 2 (`ch2.body`, portrait photo, `ch2.quote` as a quotation with attribution), chapter 3 (`ch3.body`, photo of forest edge meeting pasture, `ch3.amazon`), chapter 4 (`ch4.body`, photo of team and cattle), how it fits together (`pillars.intro` + cycle picture), how we work (`principles.body`), team (`team.intro`, `team.members`), who we work with (`partners.body`, logo row), words we use (`glossary.items`, folded), closing (`closing.line`, `closing.cta`).
- **FR-ABOUT-002 (cycle picture)**: The cycle shows Capital → Production → Markets → back to Capital, with Education at the heart, each part a link. Capital → `/capital`, Markets → `/markets`; Production → the "Prefer land?" block on `/capital`; Education → the Education project card on `/opportunities` (OQ-006-A1 → C, 2026-11-25). Both targets MUST have a stable id, so the links land on the block and the card, not on the top of the page. The picture MUST have a text equivalent (the four parts as a list of links in reading order), so it works without CSS/SVG and for screen readers.
- **FR-ABOUT-003 (team)**: Each member renders name; role line and photo appear only when supplied (FR-GEN6-005).
- **FR-ABOUT-004 (glossary)**: "Words we use" MUST be a disclosure, closed by default; inside, a description list of the six terms with their definitions verbatim.
- **FR-ABOUT-005**: The founder quote uses the Verbena quote style (constitution typography) and a real `<blockquote>`/`<figure>` with `<figcaption>` attribution.

### Functional Requirements – Request a call (FR-CON; replaces 005 FR-FIELD-001/002, keeps 005's other rules)

- **FR-CON-001**: The form MUST contain exactly these fields, in this order, one per row, single column:

| # | Field | Control | Required | Constraints / values |
|---|---|---|---|---|
| 1 | Name | single-line text | yes | 1–120 chars after trimming; autofill `name` |
| 2 | Email | email | yes | valid shape, ≤ 254 chars; autofill `email` |
| 3 | I'm interested in | radio group with legend, 7 options | yes | codes `remote-rancher`, `estancia-management`, `buying`, `partnering`, `introducing`, `press`, `other`; labels: Remote Rancher / Estancia management / Buying / Partnering / Introducing someone / Press / Something else |
| 4 | Best times for you (shown in your time zone) | two checkbox groups with legends: days, parts of the day (FR-CON-004) | yes | at least one day **and** at least one part of the day; day codes `mon`…`sun`; part codes `morning`, `afternoon`, `evening` |
| 5 | How you’d like to talk | radio group with legend, 3 options | yes | codes `video`, `phone`, `whatsapp`; labels: Video / Phone / WhatsApp |
| 6 | Phone number | telephone | only when #5 is `phone` or `whatsapp` | ≤ 40 chars, free format, at least 6 digits; autofill `tel`; hidden and not submitted when #5 is `video` |
| 7 | Anything we should know? (optional) | multi-line text | no | ≤ 2,000 chars after trimming, remaining-characters hint |

- **FR-CON-002**: Field labels, legends and option labels MUST be the deck's wording (`contact.fields`), including the bracketed notes "(shown in your time zone)" and "(optional)" (clarified 2026-11-25). One exception: field 5's legend is "How you’d like to talk" (Vaz, 2026-11-25), so the deck's "Video, phone or WhatsApp" is not shown as a title and is exempt from FR-GEN6-004, FR-TEST6-003 and SC-001; the phone field label and its hint are not in the deck and are proposed for Vaz's review (EN candidate: "Phone or WhatsApp number" / hint "With country code, so we can reach you."). Stored values are the fixed codes above, independent of language.
- **FR-CON-003**: Dropped from 005: Organisation, the required Message (now optional #7), "Please call me". The 005 rule "Phone required if call me ticked" is replaced by FR-CON-001 #6.
- **FR-CON-004 (best times and time zone)** *(clarified 2026-11-23, OQ-006-C1 → B)*: "Best times for you (shown in your time zone)" MUST be a group (legend from `contact.fields`) holding two checkbox sets: days Monday–Sunday and parts of the day morning / afternoon / evening, each part labelled with its hour range in the visitor's own clock (e.g. "Morning (8–12)"). The visitor MUST tick at least one day and at least one part of the day; the stored values are the fixed codes in FR-CON-001 #4 (`bestDays`, `bestParts`), independent of language. The parts of the day are read as the visitor's local time: the site does **no** time conversion. The visitor's time zone is detected in the browser, shown as text with the field (candidate: "Times shown in Europe/Madrid"), and can be changed with a zone list; only the IANA zone name is submitted (`timeZone`), never a UTC offset. Detection uses the browser's `Intl` API; the zone list is generated at build time, always includes UTC, and always offers the detected zone even if the list lacks it. Without JavaScript, the zone is chosen from the same list (default UTC). Day names, part-of-day names, hour ranges, the zone line and the change-zone label are not in the deck and are candidates for Vaz's review.
- **FR-CON-005**: Headline `contact.headline`, subline `contact.subline`, button `contact.button`, success `contact.success`, consent `forms.consent`, generic error `forms.error`.
- **FR-CON-006 (preselection)**: The interest can be preselected by the opening button. Mapping (deck "routing"): Capital buttons → `remote-rancher`; Opportunities `join.partner` → `partnering`; `join.introduce` → `introducing`; `join.skills` → `other`. All other "Request a call" buttons open with nothing preselected. Preselection needs JavaScript; without it nothing is preselected and the visitor picks (delta 2026-11-25). A preselection is a default only: until the visitor picks an interest themselves, every opening sets it to the opening button's value (or to nothing); once they have picked one, no button changes it until the next page load.
- **FR-CON-007 (panel)**: With JavaScript, every "Request a call" button (nav, Home, Capital, Opportunities, About) and every button in FR-CON-006 MUST open the form in a modal panel built on the native modal dialog: background inert, focus moved to the Name field, closed by Escape, by a visible close control and, where the browser treats it as a close request, by the Android Back gesture; focus returns to the opener; typed values are kept while the page stays loaded; full-screen on narrow viewports. While it is open, smooth scrolling (Lenis) is stopped and scrolling is contained in the panel; browsers with only partial support for containing it (Safari) may still let the page behind move, which is accepted. Without JavaScript, these buttons are links to `/contact` with `?interest=<code>` where a preselection applies; `/contact` reads that parameter with JavaScript only (delta 2026-11-25).
- **FR-CON-008**: `/contact` MUST show the same form as a page (headline, subline, form). On `/contact`, "Request a call" buttons move focus to the form instead of opening a panel.
- **FR-CON-009**: After a successful send with JavaScript, the panel/page replaces the form with `contact.success` and moves focus to it; a close control remains in the panel.
- **FR-CON-010 (no-JS pages, kept from 005 FR-PAGE-*)**: `/contact/thanks` shows `contact.success` and a link home; `/contact/error` shows `forms.error`, the team email fallback and a link back to `/contact`. Neither is indexed or in the sitemap. Their headings are proposed for review (not in the deck).
- **FR-CON-011**: 005 FR-UX-001…016 (visible labels, validate on send, error summary + inline errors with focus management, programmatic error association, helpful messages, title prefix, never clearing values, not colour alone, send button states, no-JS submission, 15 s timeout, email fallback on failure, announcements, keyboard/focus/target size, Design Taste, 390–1440 px, 16 px inputs) MUST hold for this form, in the panel and on the page. Validation messages for the new fields are proposed for Vaz's review in the content file.

### Functional Requirements – Shared form rules (FR-FORM; applies to Request a call, I'm in, gatherings, idea box, newsletter, order form)

- **FR-FORM-001**: Every form MUST be native HTML posting to the self-hosted endpoint (FR-API6-*), with a working no-JS path, and MUST NOT set cookies, use local/session storage, or load any third-party script, font, iframe or captcha (005 FR-AN5-002 extended). Plausible stays the only third-party request; no field value is ever sent to it.
- **FR-FORM-002**: Limits: names 1–120 chars; email ≤ 254 and valid shape; gatherings "what would you bring" 1–300 chars; idea 1–280 chars single-line; notes ≤ 2,000.
- **FR-FORM-003**: Under every form, `forms.consent` MUST appear with its "Privacy policy" link to `/privacy`; the link renders only when Privacy is approved (FR-GEN6-005).
- **FR-FORM-004**: Every form MUST carry the honeypot and render-time fields (005 FR-FIELD-003), plus `form` (form type), `locale` and `page`.
- **FR-FORM-005**: Every endpoint failure, timeout (15 s) or rate limit MUST show `forms.error`, keep all typed values, and (for Request a call) offer the team email as a `mailto:` link (005 FR-UX-012).
- **FR-FORM-006**: 005 FR-UX-001…016 apply to every form, scaled to its size (e.g. a one-field form still has a visible label, an error message tied to the field, and focus management on error).
- **FR-FORM-007** *(Modern Web Guidance)*: Every form MUST have an accessible name; email fields MUST have autocorrection and autocapitalisation off; a phone number is always one single `tel` field.

### Functional Requirements – Idea box and newsletter (FR-IDEA, FR-NEWS)

- **FR-IDEA-001**: The idea box is one single-line field with the placeholder `idea.placeholder` **and** a visible label (placeholders never replace labels, 005 FR-UX-001; label text proposed for review, e.g. "Your idea"), a "Send" button, success `idea.success` in place. No name or email is asked.
- **FR-NEWS-001**: The footer newsletter MUST be an email field (visible label) and a "Subscribe" button, with `footer.newsletter` text and `newsletter.success` on success.
- **FR-NEWS-002**: The newsletter appears on every page that has the footer, once per page.
- **FR-NEWS-003**: Subscription MUST use double opt-in: the endpoint sends a confirmation email and the address is only added once confirmed (assumption carried from 005 about Austria's § 174 TKG 2021; OQ-006-L3 asks counsel). The success text is the deck's; if counsel requires the visitor be told to confirm, that sentence is added as reviewed copy.

### Functional Requirements – Endpoint contract extension (FR-API6; extends 005 FR-API-001…009, which stay in force)

- **FR-API6-001**: Submissions MUST carry a `form` value: `contact`, `interest`, `gathering`, `idea`, `newsletter`, `order`. Field names for `order` wait for OQ-006-M3. Field names per form follow FR-CON-001 / FR-OPP-005 / FR-OPP-007 / FR-IDEA-001 / FR-NEWS-001 (`name`, `email`, `interest`, `bestDays`, `bestParts`, `timeZone`, `channel`, `phone`, `notes`, `projectId`, `gathering`, `bring`, `idea`). The plan fixes whether this is one endpoint with a `form` discriminator or one path per form; responses keep 005's codes (201/303 success, 422 with field error codes, 429, 5xx → failure).
- **FR-API6-002**: `interest` submissions are unique per (`projectId`, normalized email): a repeat answers as success and stores nothing new.
- **FR-API6-003**: A read-only public call MUST return the count per `projectId` for all projects, with no personal data, cacheable for at most 5 minutes, allowed cross-origin only from the site's origins (005 FR-API-008 applies).
- **FR-API6-004**: Rate limiting, honeypot, minimum fill time, server-side validation and storage-before-email (005 FR-API-006/007/009) apply to every form type.
- **FR-API6-005**: Every submission type except `newsletter` is emailed to the team inbox, with the visitor's address as Reply-To where one exists (`idea` has none). Newsletter confirmations are emailed to the subscriber only (FR-NEWS-003).

### Functional Requirements – Form gate (FR-GATE6; modifies 005 FR-GATE-001, keeps FR-GATE-002)

- **FR-GATE6-001** *(rewritten 2026-11-25)*: The five deck forms (Request a call in the panel and on `/contact`, I'm in, Apply for a seat, idea box, newsletter) MUST always be shown, with all their buttons and lines. The gate decides only whether they **send**. It is open when (a) the endpoint URL is configured and (b) the privacy-approval content flag is set; the agent never sets that flag. While it is closed: fields, panels, validation and focus behaviour work; pressing a form's send button with valid input does nothing more – no request, no success text, no error text, typed values stay; with or without JavaScript no typed value leaves the page or enters a URL; the count is not requested and cards show "Be one of the first." (FR-OPP-004); the no-JS thanks/error pages are not built. The order page keeps FR-ORD-003. The build succeeds either way. FR-CON-009/010, FR-FORM-001's sending path, FR-FORM-005 and every acceptance scenario about a completed send apply while the gate is open; tests open it against a mocked endpoint.
- **FR-GATE6-002**: The endpoint URL is build-time configuration (005 FR-GATE-002 kept).

### Functional Requirements – Media kit, 404, legal (FR-MEDIA, FR-404-6, FR-LEG6)

- **FR-MEDIA-001**: `/media` MUST show `media.headline`, `media.body`, `media.intro` (labelled as the 50-word introduction), and one download link per asset (logos, El Tapir logo, photos, founder's bio, fact sheet) only when that file exists. "use our contact form and choose 'Press'" MUST link to the panel/`/contact` with `press` preselected (mapping added to FR-CON-006; with JavaScript only).
- **FR-404-6-001**: The 404 page shows `notfound.headline`, `notfound.body`, and `notfound.cta` as a button to `/`; HTTP 404, `noindex`, not in sitemap, nav present (003 FR-404-001…004 kept).
- **FR-LEG6-001**: `/imprint` MUST follow the same gate as Privacy/Terms (003 FR-LEG-*, R5): built and linked only when its approved text exists. Its content will include postal address and general email, no phone (deck "Still to come" #5). Legal text is supplied/approved by Vaz/counsel, never written by the agent.
- **FR-LEG6-002**: No cookie banner is shown while the only analytics is Plausible without cookies (003 FR-AN-* kept). If analytics changes, a banner becomes a separate delta (deck `legal.pages` "[TO COME: depends on the analytics used]").

### Functional Requirements – SEO (FR-SEO6)

- **FR-SEO6-001**: Each page's `<title>` and meta description MUST be exactly the deck's `pageMeta/<page>.title` / `.description` (deck §1–§5, §7). The 404 has the deck's title and no description. Thanks/error pages and Imprint get titles proposed for review.
- **FR-SEO6-002**: 003 FR-SEO-002…005 and 007/008 stay: unique titles, descriptions 40–220 chars, full Open Graph/Twitter set, canonical on `https://orbolo.com`, robots.txt, `/sitemap.xml` listing exactly the published indexable pages (and their `hreflang` alternates only when both languages exist).
- **FR-SEO6-003**: Redirected routes (FR-GEN6-002) MUST NOT appear in the sitemap.

### Functional Requirements – Photography (FR-IMG6; extends 005 FR-IMG-*)

- **FR-IMG6-001**: Every new photo slot (deck layout notes: story photos, visit photos, cards, Capital hero/proof, Markets hero/tiles/team, Opportunities project cards/proof/Villa Weiss, About hero/chapters) MUST use the existing photo library until Orbolo supplies section photos (deck "Still to come" #6). The slot-by-slot mapping is `research.md` R13, approved by Vaz 2026-11-25, Home's two photos beside the El Tapir text included; slots whose subject cannot honestly be shown with an existing photo (Villa Weiss, the team, boxed product, Florian's portrait other than `florian.jpg`, tallow/leather) leave their image out (FR-GEN6-005).
- **FR-IMG6-002**: Delivery, priority and contrast rules 005 FR-IMG-004…009 and 011 apply to every slot: AVIF/WebP/JPEG, `srcset`/`sizes`, reserved dimensions, one `fetchpriority="high"` hero per page, lazy below the fold, AA contrast from the shade (not text-shadow), forced-colours readable, motion unchanged.
- **FR-IMG6-003**: Stock photos (005 FR-IMG-001 set) MUST NOT be captioned or described as Orbolo's own ranches, animals or El Tapir (005 FR-IMG-011 kept).
- **FR-IMG6-004**: Home cards reuse the three current card images until new ones are supplied: `investors.jpg` → Capital, `buyers.jpg` → Markets, `landowners.jpg` → Opportunities, with alt text reviewed for the new meaning.
- **FR-IMG6-005**: 005 FR-IMG-002 stays in force for the files: the listed photos MUST stay byte-identical; only its "keep every current placement" clause is superseded, because the old sections are gone. 005 FR-IMG-003 stays in force: its excluded and unassigned photos MUST NOT be used; `03` is therefore unused now that the Home hero is `06`.

### Functional Requirements – Accessibility and design (FR-A11Y6)

- **FR-A11Y6-001**: Constitution IX and WCAG 2.2 AA apply to every page and interaction; automated checks (axe) report 0 violations on every page at 390 px and 1440 px.
- **FR-A11Y6-002**: Every disclosure (FAQ, More ideas, glossary) MUST use native disclosure semantics, be keyboard operable, and expose open/closed state.
- **FR-A11Y6-003**: Every panel (Request a call, I'm in, Apply for a seat) MUST follow FR-CON-007's modal behaviour, with focus on its own first field (Name).
- **FR-A11Y6-004 (moving content)**: The partner band MUST move only under `prefers-reduced-motion: no-preference`; it MUST pause while hovered or while any element inside has focus; and because it moves for more than five seconds, it MUST offer one visible, keyboard-reachable button whose label changes between "Pause" and "Play" (labels are candidates for Vaz's review), without `aria-pressed` (WCAG 2.2.2). The button is absent while the band cannot move (reduced motion, no JavaScript). Duplicate copies used for seamless looping are hidden from assistive technology; each partner is announced once.
- **FR-A11Y6-005**: Headings form one logical outline per page (one `h1` = the hero headline); the headings in FR-GEN6-008 are part of it.
- **FR-A11Y6-006**: CLAUDE.md Design Taste tokens, anti-patterns and shells (PhotoHero, Split, Edit, Band, CtaCollage, Btn) apply; new section types (offer stack, risk cards, product tiles, timeline, project cards, cycle picture, team grid, partner band, FAQ groups) reuse existing shells where they fit and otherwise follow the same tokens, square edges and hairlines. The skills `web-design-guidelines`, `taste`, `playwright`, and `image-to-code` (when a mockup exists) are mandatory (Constitution X).
- **FR-A11Y6-007 (repeated buttons)**: The five "I’m in" buttons and the two "Let’s talk" buttons MUST have distinct accessible names that start with the visible text (WCAG 2.5.3). Candidates for Vaz's review: "I’m in – ‹project name›", "Let’s talk – Partnering", "Let’s talk – Introducing someone".

### Functional Requirements – Testing (FR-TEST6)

- **FR-TEST6-001**: Unit tests (Vitest) MUST cover every new or changed content schema and repository, the preselection mapping, the counter threshold logic, form validation rules for every field (including the conditional phone rule and limits), and the "asset absent → element absent, text present" behaviour.
- **FR-TEST6-002**: End-to-end tests (Playwright) MUST cover US1–US6 acceptance scenarios against a mocked endpoint (no real network), at 390 px and 1440 px, keyboard-only, with and without JavaScript where a no-JS path is specified, under reduced motion, and assert no cookies/storage and no third-party requests besides Plausible.
- **FR-TEST6-003**: A content-fidelity test MUST compare every rendered deck string against the content JSON (which is checked against the deck reference file when it is created), so copy cannot drift.
- **FR-TEST6-004**: Tests pinned to retired rules (banned words, as-is freeze titles, old routes, old sections, hidden-section contract for removed sections, 005 field set) are removed or rewritten to the new rules in the same change, each removal listed in the change description – never silently skipped. `pnpm run verify` MUST be green.

### Key Entities

- **PageContent** (per page, `<id>` and `<id>-es`): the deck's content keys for that page, as typed sections; asset references (image src + alt, logo, map, download file) are optional fields.
- **PathCard → ChoiceCard** (Home): id, title (question), body, linkLabel, destination, image {src, alt}, order, locale. Replaces `description` + fixed "Discover more" of 001's `PathCard`.
- **FaqItem**: group (`about` | `invest` | `buy` | `visit`), order, question, answer, locale.
- **Partner**: name, qualifier (e.g. "member"), logo (optional), order.
- **TeamMember**: name, role (optional), photo (optional), order.
- **Project** (Opportunities): projectId, name, line, image (optional), order; `isMoreIdea` for the folded list.
- **Gathering**: id, label ("Villa Weiss, April 2027"), order.
- **CallRequest** (endpoint): name, email, interest code, bestDays (one or more of `mon`…`sun`), bestParts (one or more of `morning`/`afternoon`/`evening`), timeZone (IANA name), channel, phone (conditional), notes, locale, page, receivedAt.
- **InterestRegistration** (endpoint): projectId, name, email, receivedAt; unique per (projectId, email).
- **GatheringApplication**, **Idea**, **NewsletterSubscription** (endpoint): per FR-OPP-007, FR-IDEA-001, FR-NEWS-*; subscription has a confirmed flag/date.
- **OrderRequest** (endpoint): fields per OQ-006-M3, plus locale, page, receivedAt.
- **SiteSettings**: endpoint URL, team email, privacy-approval flag, counter threshold (10).

---

## Carried-over requirements (index)

| From | Rule | Status in 006 |
|---|---|---|
| 001 | Flip-card behaviour, a11y, config-driven cards, fallback image, reduced motion (FR-004…024, R2–R6) | **Kept** for Home cards (FR-HOME-004) |
| 001 | Cards link to `/invest`, `/beef`, `/land`; "Discover more" label | **Modified** (FR-HOME-003) |
| 002 | One typed JSON per page, schemas per page (R1), hidden = conditional rendering (R4) | **Kept** (R4 now applies per asset, not per section) |
| 002 | Nav = code-level list (R3) | **Kept**, new links |
| 002 | Banned words, Orbolo-never-takes-money, dated metrics, pipeline, roadmap, partner ranches, El Tapir expansion, cross-links | **Retired / removed** (see Scope Change) |
| 003 | 404 behaviour, SEO meta/OG/canonical, robots/sitemap, legal gate, alt text, overflow at 360–1440, Plausible no-cookie | **Kept** (FR-404-6, FR-SEO6, FR-LEG6, FR-A11Y6) |
| 003 | Title pattern, as-is freeze | **Retired** |
| 003 | Open: T041 legal approval, T045 legal pageMeta | **Still open**, now also Imprint |
| 004 | Wording table, story spine, 7 steps | **Retired**; "don't use `remote_rancher.md` §5+ figures" stays as a caution (no figures in the deck anyway) |
| 005 | Endpoint contract, UX/a11y rules, no-JS pages, no third parties, photo delivery rules | **Kept and extended** (FR-API6, FR-FORM, FR-IMG6) |
| 005 | Gate hides the form until endpoint and privacy approval | **Modified**: form shown, sending gated (FR-GATE6-001) |
| 005 | Field set, 4 topics, no newsletter, no prefill | **Replaced** (FR-CON-001…006, FR-NEWS) |
| 005 | Open: T071 photo approval, OQ-D1 hero choice | T071 **still open**; OQ-D1 **resolved** 2026-11-25 (photo `06`, OQ-006-G2) |
| Brief | Firebase EU hosting, Astro, GitLab CI, EU residency, Plausible, mobile first, hreflang, Lighthouse ≥ 90 mobile | **Kept** (deck is silent) |
| Brief | Papermark data room | **Out of scope**; deck mentions the data room only in text ("Still to come" #2) |

---

## Success Criteria *(mandatory)*

- **SC-001**: 100% of the copy deck's English strings for the pages in scope appear verbatim on the site (content-fidelity test), and 0 strings from removed sections remain.
- **SC-002**: Every old route (`/invest`, `/land`, `/beef`) answers 301 to its new route; 0 broken internal links across all pages (link check).
- **SC-003**: A visitor can open the Request a call panel from Capital, complete it and send it in under 2 minutes using keyboard only, at 390 px and 1440 px.
- **SC-004**: Preselection is correct for 100% of the buttons in FR-CON-006 and FR-MEDIA-001 (e2e).
- **SC-005**: With the endpoint mocked at 9 and at 10 registrations, project cards show the fallback and the count respectively; with the endpoint unreachable, 100% of cards show the fallback within 5 s and the page remains usable.
- **SC-006**: axe reports 0 WCAG 2.2 AA violations on every page, panel open and closed, both widths; the partner band does not move under reduced motion and can be paused.
- **SC-007**: 0 cookies, 0 storage writes, 0 third-party requests besides Plausible on every page, including during form use.
- **SC-008**: Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices and SEO on Home, Capital, Markets, Opportunities and About; CLS 0 from images.
- **SC-009**: With the endpoint unset or privacy approval missing, the production build succeeds, the five deck forms are shown, pressing their send buttons causes 0 requests and no success or error text, no typed value enters a URL, and every section's text renders.
- **SC-010**: FAQ structured data on Home validates and matches the visible FAQ text character for character.
- **SC-011**: Vaz approves the new pages on a preview against the copy deck (section order, copy, CTAs) before release.

---

## Open Questions

- ~~**OQ-006-H1**~~: resolved 2026-11-25 → both removed; hidden heading "Your part in it" (FR-HOME-005).
- ~~**OQ-006-H2**~~: resolved 2026-11-25 → labels as text only for now; icon slot kept (FR-HOME-008).
- ~~**OQ-006-H3**~~: resolved 2026-11-25 → no map for now; map slot kept (FR-HOME-001).
- ~~**OQ-006-C1**~~: resolved 2026-11-23 → days + parts of the day (FR-CON-004).
- **OQ-006-C2**: Team inbox address (005 OQ-C1 still open) – shown on failure.
- ~~**OQ-006-M1**~~: resolved 2026-11-24 → Orbolo-hosted order page on the self-hosted endpoint (FR-ORD-*).
- **OQ-006-M3**: Order form content, from Florian: field list (the deck says only "about ten minutes"), required/optional, labels, success text, page title and description; route name (candidate `/markets/order`). Blocks FR-ORD-002/003, not the rest of Markets.
- ~~**OQ-006-M2**~~: resolved 2026-11-25 → no link (FR-MKT-004).
- ~~**OQ-006-O1**~~: resolved 2026-11-25 → "{n} people are in." from 10; "Be one of the first." only below 10 (FR-OPP-004).
- **OQ-006-O2**: Do supporters get anything when a project opens (email)? The deck promises "We'll write the moment this project opens" – the endpoint must keep registrations until then; retention period needed for the Privacy text.
- **OQ-006-O3**: "(donations welcome)": is a donation route planned? Default: text only.
- ~~**OQ-006-A1**~~: resolved 2026-11-25 → Production: "Prefer land?" on Capital; Education: its card on Opportunities (FR-ABOUT-002).
- **OQ-006-P1**: Before the site is opened to the public: may forms that send nothing be public, or must the gate be open first? Not decided; for now the site is for seeing the design (Vaz, 2026-11-25).
- **OQ-006-L1**: Privacy wording covering all six form types, the counter and double opt-in (blocks sending, FR-GATE6-001; not the design).
- **OQ-006-L2**: Legal check of the investment wording now used verbatim ("invest", "returns", "round", "minimum", "share the upside", "quick sale at a cost") – Vaz chose verbatim; this is recorded only as a pre-launch check, not a blocker in this spec.
- **OQ-006-L3**: Newsletter double opt-in and the "rewarded" introducer line (`join.introduce`) – counsel confirmation.
- **OQ-006-G1**: Spanish: when ES translation arrives, is it the same deck structure with ES keys (assumed)?
- ~~**OQ-006-G2**~~: resolved 2026-11-25 → photo `06` (FR-HOME-001).
- **OQ-006-G3**: If numbers (head counts, hectares, round size) are added to copy later, does the dated-and-sourced Metric rule come back? Default: yes.

---

## Non-goals

- Writing or rewriting any copy the deck provides; translating to Spanish or German.
- The data room, investor portal, Papermark, e-signature, LOI register, CRM, Slack notifications.
- The server implementation, database schema, email sending and newsletter tooling (separate backend spec; FR-API6 records the contract only).
- Inventing the order form's fields or copy (they come from Florian, OQ-006-M3).
- Donation or ticket payment; gathering ticket sales.
- A blog, The Code page, Orbolo Bridge, The Opportunity page, a standalone glossary page.
- Changing colour tokens, fonts, motion system or shells beyond what new sections need.
- Cookie banner (only if analytics changes).

## Assumptions

- **A-ES**: Until a Spanish page exists, its old `/es/...` URL redirects to the English counterpart (`/es` → `/`, `/es/invest` and `/es/land` → `/capital`, `/es/beef` → `/markets`, `/es/about` → `/about`, `/es/contact` → `/contact`) with a temporary redirect (302), so the ES URL can return later.
- **Backend**: same home/self-run server as 005, in the EU (005 OQ-C7 still to confirm), operated by Vaz as processor for Orbolo.
- **Hosting**: static output, deployed as today; redirects configured at the host. The brief's Firebase EU target is unchanged.
- **FAQ rich results**: search engines may not show FAQ rich results for commercial sites; the structured data is still valid and requested by the deck.
- **Modern Web Guidance**: `plan.md` MUST run `npx modern-web-guidance@latest` again and consult at least the guides on dialogs/modals, disclosure/accordion, forms and validation, `Intl`/time zones, carousels and auto-moving content, scroll/motion and reduced motion, image delivery and priority, and performance (there is no structured-data guide); the plan records which advice changes a requirement here (as a delta) and which is implementation detail.
- **Content keys**: the deck's keys are used as JSON paths; arrays keep the deck's order.
- **British spelling** throughout English content; en-dashes as in the deck.
- **Photos**: until Orbolo supplies section photos, the existing library is reused per FR-IMG6-001, subject to Vaz's approval of the mapping in the plan.
- **Specs 001–005 remain the record** of shipped work; this spec does not edit them. `plan.md` and `tasks.md` for 006 are generated in later steps, by Vaz's decision.
