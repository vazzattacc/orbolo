# Feature Specification: Orbolo Website — Invest, Beef & Land Page Content Structure

**Feature Branch**: `002-page-content-specification`

**Created**: 2026-09-22

**Status**: Draft — **blocked** on the Open Questions below; not ready for `/speckit-plan` until they are resolved or explicitly deferred.

**Input**: User description (2026-09-22): "We now have the Home page and its three cards. When clicking on them, we go to new pages. I want to create content on those pages, using a document I will give you (the client's builder brief, `orbolo-website-brief.md`) as the reference for content, text, and what Orbolo represents on every page — not for redoing the pages or changing the site's design, which stays as it is."

## Relationship to Phase 1

Phase 1 (`001-orbolo-path-selection`) built the Home page's audience-selector cards and their navigation targets. Those three targets exist today only as placeholder stub routes — `src/pages/invest.astro`, `src/pages/beef.astro`, `src/pages/land.astro` — each a bare `Layout` wrapper around a heading and one line of filler text ("This is a placeholder destination... out of scope for the Home page audience-path selector"), 13 lines total. No section structure, content, or copy exists on any of the three yet.

This spec defines what these three pages need to say and show — their required sections, each section's communicative purpose, and which part of the brief it is sourced from — so that a later feature can turn this structure into real, approved copy and build it. It does **not** redesign anything: the established design system (Layout component, header/nav, typography and color tokens from the constitution) is inherited unchanged, and the Home page / `PathCard` component from Phase 1 are untouched — except for the two site-wide navigation elements introduced below (global top nav bar, generic contact footer button), which are a deliberate, scoped amendment to that inheritance rule.

## Content Sources

Two sources inform this spec, and they are **not equally authoritative**:

1. **The client's builder brief** (`specs/_shared/references/orbolo-website-brief.md`) — the primary, framework-level source for everything in this spec. It is explicitly a repositioning document: it retires old branding ("Verdant" → Remote Rancher), bans a list of words (§B2.6), and moves the group from "nature-based projects NGO" framing to "a commercial group with a strong ethical code" (§2). Every Functional Requirement above is sourced from it unless stated otherwise.
2. **The live site, `https://www.orbolo.com/`** (added 2026-09-22, fetched the same day) — a **secondary, candidate-only** source, consulted per your request to use it alongside the brief. It is explicitly the *pre-repositioning* version of the site: it still uses the retired "Verdant" name, and its own copy uses words the brief bans outright for the new site ("regenerative," "sustainable," "impact"). Nothing from it is copied as wording or voice. It is useful only for two things: (a) real, currently-published operating facts (hectare counts, animal counts, page structure) that may resolve or partially resolve an Open Question once Vaz confirms they're still accurate, per FR-GEN-005's date-and-source rule; and (b) confirming what does *not* yet exist on the live site (e.g., no dedicated FAQ page today), which is context for a Non-goal or Open Question, not a requirement.

**Method note**: You asked specifically for Playwright. I first attempted a direct Playwright/Chromium browser session against `www.orbolo.com` from this session's sandboxed environment; its outbound network policy rejected the connection (`403` at the proxy layer) before the page ever loaded — a sandbox-level restriction, not a site-side block. I fell back to this session's web-fetch tool, which retrieves and reads the same live pages (HTML converted to text) and reached the site successfully. The pages fetched (all 2026-09-22): `/` (Home), `/el-tapir`, `/copy-of-el-tapir-2` (Ganadería a Pasto), `/verdant`, `/how-we-work`, `/contact`. This gets you the same *text content* Playwright would have extracted; what it does **not** give you is a real rendered-page/interactive session (screenshots, JS-only content, clicking through forms). If that level of access is needed later, it would go through a connected browser (this session's device bridge or Claude in Chrome), which wasn't available in this pass.

Every live-site-derived fact used below is marked **"Candidate data"** and tagged with its fetch date and page — never merged into a Functional Requirement as if it were confirmed, and never used to resolve an Open Question outright. See the new **ContentSourceRef** entity under Key Entities.

## Clarifications

### Session 2026-09-22 (captured in conversation, ahead of a formal `/speckit-clarify` pass)

- Q: Which pages does this spec cover? → A: Invest, Beef, and Land only. Sub-destinations named in the brief's site map — El Tapir, Partner ranches, Ganadería a Pasto (under Land), and the Deployment Pipeline (under Invest) — are **not** separate routes in this pass; at most they appear as sections within Land or Invest.
- Q: How much should `spec.md` contain — finished copy or structure? → A: Structure and source-mapping only. Each section states what it must communicate and which part of the brief it draws from; final headline/body wording is a later copywriting task.
- Q: How should the brief's unresolved placeholders ([X] head, [entity name], target dates, fees, etc.) be treated? → A: As **blocking** open questions — not invented, not softened into optional notes. This spec cannot move to planning until each is answered or a page's affected section is explicitly marked hidden-until-resolved.
- Q: Language scope? → A: English only. Spanish and German are later phases per the brief (§13, §15) and Phase 1's own Scope Change already flagged localization as unaddressed.
- Q: Should every page carry a persistent top navigation bar and a footer contact button? → A: Yes, added 2026-09-22. Every page (Home, Invest, Beef, Land) gets (1) a top navigation bar linking to the four pages that exist today, and (2) a single small, generic "contact" button below the page's own content, distinct from each page's existing page-specific CTAs (investor pack / book a call on Invest; spec sheet / sample on Beef; work-with-us on Land). This amends FR-GEN-001's design-freeze and the Non-goals entry that froze the header/nav — see FR-GEN-009/FR-GEN-010 below.
- Q: Should the spec add a general FAQ page? → A: Yes, added 2026-09-22 — linked from the shared trust layer (FR-GEN-006) alongside The Code, Glossary, and Contact, distinct from Invest's own FAQ section (FR-INV-011). Building the FAQ page itself stays out of scope, the same as those three destinations; its content is blocked on **OQ-017**.
- Q: Should the live site (`https://www.orbolo.com/`) also be consulted as a content reference, alongside the brief, and should that be done via Playwright? → A: Yes, added 2026-09-22 — as a secondary, candidate-only source, never for voice or terminology. See Content Sources above for the sourcing rules and the Playwright-access note; see OQ-012, OQ-014, OQ-015, OQ-016, and OQ-017 for where its findings touch specific Open Questions.

## Open Questions — Blocking

Every item below is a placeholder the brief itself leaves unresolved ("[X]", "[entity]", "[date]", or a described-but-unnamed data set) and that the brief's own Non-negotiables (§17) and Honest Staging principle (§3) forbid inventing. **This spec's status cannot move from Draft to Approved until each item is answered by Orbolo/Vaz, or the affected section is explicitly marked as hidden-until-resolved rather than filled with a placeholder value.**

**General / cross-page**
- **OQ-001**: Legal name(s) of the Paraguayan contracting entity/entities — required for the footer line on every investor-facing page (§1, §16, §17).
- **OQ-002**: Partner names, roles, logos, usage permission, and (where possible) a quote, for every partner referenced on Invest and Beef (§8, §16). No bare logo walls are allowed without written permission.
- **OQ-003**: The Code's final numbered rules and, per rule, who verifies it (§6, §16) — Invest and Beef both reference "raised/sold under the Code, verified by [partners]" and need at least the verifier names even though the full Code page is out of scope here.
- **OQ-015**: Destination and required fields for the new generic footer contact button (added 2026-09-22) — does it point to the same form/target as the Land "Work with us" CTA, a new shared contact form, or something else? Not answered yet; treat the button as a structural placeholder (present, styled, non-functional or pointing at a stub) until resolved, per the same placeholder rule applied to OQ-001–OQ-014. *Candidate data (added 2026-09-22, pending Vaz confirmation)*: the live site's current `/contact` page (fetched 2026-09-22) has exactly one universal contact form — name, email, a free-text "tell us about your project or interest" field, a "please call me" checkbox, and an "I am interested in…" dropdown currently listing the old project set (El Tapir, Orbolo Bridge, Verdant, Ganadería a Pasto, General Partnership). This is a plausible existing pattern to evolve (updating the dropdown to Invest/Remote Rancher, Beef, Land, General) once OQ-015 is actually answered — it is context, not a resolution.
- **OQ-017** *(added 2026-09-22)*: The new site-wide FAQ page (FR-GEN-006) has no defined question set from either source. The brief only specifies Invest's own FAQ (FR-INV-011), not a general one. *Candidate data*: the live homepage (fetched 2026-09-22) has FAQ-style content inline — on monitoring/verification methodology, the types of partners the group works with, and why Paraguay was chosen — but phrased in the pre-repositioning voice this project is explicitly moving away from (§2, §B2.6: e.g. it uses "regenerative" and "impact investors" framing). It may suggest topic areas but its wording is not usable as-is. The actual question set and answers are blocked on Vaz/Orbolo input.

**Invest (Remote Rancher)**
- **OQ-004**: Offer terms — minimum ticket, cycle length, target return range, fee, payout timing (§16, §B5 offer box).
- **OQ-005**: Head count for the offer box example ("[X] head, tagged in your name") and days-to-tagging after capital call ("[X] days") (§B5).
- **OQ-006**: Risk-section specifics — animal-loss provision, drought reserve arrangement, currency/contract-currency terms, export/policy diversification detail (§B5 "What if it goes wrong?").
- **OQ-007**: Eligibility rules and the counsel-approved regulatory/sign-off line gating the offer box, risks, LOI, and data-room access (§16, §17 — "No returns language, investor flow or LOI live without counsel sign-off").
- **OQ-008**: Deployment Pipeline ranch data — actual ranch codenames, regions, hectares, thresholds, opens dates, and current committed-under-LOI counts (§7). The brief is explicit: "No bar is shown unless the number is real and current." Until this exists, the pipeline section has no real cards to render.
- **OQ-016** *(added 2026-09-22)*: The live site's current Verdant page (`/verdant`, fetched 2026-09-22) describes a four-stage mechanic — land access & system design → capital integration → regenerative operational management → cycle closure & distribution — and states "460+ animals" currently in the system. Neither the brief's 60%-under-signed-LOI release rule nor its LOI mechanism (§7) appears anywhere on that live page. It is **not established** whether Remote Rancher is Verdant simply renamed with the same underlying mechanics (in which case "460+ animals" could become a real, datable proof-point figure for Invest), or a materially redesigned product per the brief's LOI/60% pipeline (in which case the live page describes a discontinued mechanic that must not be carried over into Remote Rancher content). This must be confirmed by Vaz/Orbolo before any live-site Verdant figures or mechanics are used on the new Invest page.

**Beef**
- **OQ-009**: What is actually sold today — current cuts, volumes, certifications, and markets (§16, §B6 "What we sell today").
- **OQ-010**: Roadmap milestones with real target/done dates for the now → building → target stages (§16, §B6).
- **OQ-011**: Named customers, if any are permitted to be shown (§8).

**Land**
- **OQ-012**: El Tapir's current size, expansion target (hectares), and target date (§16, referenced on both Land and Invest's "Is this real?" block). *Candidate data (added 2026-09-22, pending Vaz confirmation)*: the live site (`/el-tapir`, fetched 2026-09-22) states El Tapir is 1,000 hectares in the Gran Chaco, "currently in development phase." This only resolves the current-size figure if Vaz confirms it is still accurate and it is given a proper as-of date/source per FR-GEN-005 — the expansion target and target date remain fully open; neither the brief nor the live site states them.
- **OQ-013**: Which partner ranches are live to profile as anonymized cards, and their public fields (codename, region, hectares, grazing system, years in transition, MPCS status) — likely the same underlying data as OQ-008.
- **OQ-014**: Ganadería a Pasto — the brief frames it only as "how we grow supply" / "the technical arm" (§6) with no further detail. *Candidate data (added 2026-09-22, pending Vaz confirmation)*: the live site (`/copy-of-el-tapir-2`, fetched 2026-09-22) describes GAPP as a field-based technical advisory service on 35,000 hectares in the Gran Chaco, run as a four-step methodology (diagnostics → technical planning → on-the-ground guidance → ongoing follow-up), with its own site at `ganaderiapasto.com` (also named in the brief's own domain-redirect list, §11). This gives real substance to draft from — but the live site's own wording uses banned terms ("regenerative") and NGO-style framing the brief explicitly retires — it needs Vaz's confirmation that the 35,000-hectare figure and methodology description are still current, and a full rewrite pass before use, not a copy-paste.

Until these are answered, every affected section below is written as a structural placeholder (what must go there and where it comes from), not as copy with invented numbers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A prospective investor understands and can start the Remote Rancher path (Priority: P1)

A visitor who followed the "Investors" card from Home reaches Invest and can, top to bottom, understand what they'd own, how the process works, what it costs and returns (once OQ-004 is answered), why it's real (El Tapir), what happens if a ranch doesn't fill, and what could go wrong — ending with a clear way to get the investor pack or book a call.

**Why this priority**: Invest is the primary commercial page for the group's core financial product (Remote Rancher) and carries the heaviest trust burden — money is involved. Without this page telling the whole story the investor funnel (brief §5) has no second step after "Interest."

**Independent test**: Load `/invest` and confirm every required section (below) is present and in order, even where content is a marked placeholder pending OQ-004–OQ-008/OQ-016; confirm the page never claims a guaranteed return, never describes Orbolo itself as collecting investor money, and always attributes the contracting relationship to the Paraguayan entity (once OQ-001 is answered) or shows no entity claim at all (never a fabricated one) until then.

**Acceptance scenarios**:

1. **Given** a visitor reaches `/invest`, **When** the page loads, **Then** a hero states the core Remote Rancher proposition and the 60%-release / no-capital-before-release rule, per §B5.
2. **Given** the visitor reads the offer box, **When** OQ-004/OQ-005 remain unanswered, **Then** the section is rendered as an explicit "terms pending" structural placeholder rather than showing invented numbers.
3. **Given** the visitor reaches the "Is this real?" section, **When** it renders, **Then** it points to El Tapir as the one fully named, visitable proof point (pending OQ-012 for the exact, confirmed hectare figure).
4. **Given** the visitor reaches the Deployment Pipeline section, **When** no real ranch data exists yet (OQ-008), **Then** the section structure is present but shows no fabricated progress bar or ranch card.
5. **Given** the visitor reads any section describing Orbolo's role, **When** the copy is drafted later from this structure, **Then** it must never say Orbolo collects, manages, or invests the visitor's money — only that the Paraguayan entity contracts with them and Orbolo facilitates/markets.
6. **Given** a visitor is anywhere on `/invest`, **When** they look at the top of the page or scroll to the bottom, **Then** they can reach Home, Invest, Beef, and Land from a persistent top navigation bar, and reach the generic contact form from a footer button distinct from the page's own "Get the investor pack" / "Book a call" CTAs.
7. **Given** the copy is drafted later from this structure, **When** OQ-016 is unresolved, **Then** no figure or mechanic from the live site's Verdant page (e.g. "460+ animals," the four-stage model) is used on `/invest` without Vaz having confirmed Remote Rancher's actual relationship to that legacy product.

---

### User Story 2 - A prospective beef buyer understands what's available today and what's coming (Priority: P1)

A visitor who followed the "Buyers" card from Home reaches Beef and can understand, honestly and specifically, what Orbolo sells today (grass-fed, MPCS-standard, conventional price, no full traceable history yet), what's being built (the 300,000-head producer alliance and traceability), and why trading now earns first pick later — ending with a way to request a spec sheet or sample.

**Why this priority**: Beef is the other half of the "two engines under one brand" (brief §1) and is the only page representing Orbolo's own direct commercial activity (the trading desk) rather than the investor product. It is also where the brief's single hardest content rule lives: never call today's product "regenerative."

**Independent test**: Load `/beef` and confirm every required section is present; confirm "regenerative" never appears anywhere describing current beef; confirm the conventional-price promise and first-pick promise both appear, matching the exact framing in §B2.7 and §17.

**Acceptance scenarios**:

1. **Given** a visitor reaches `/beef`, **When** the page loads, **Then** the hero states the grass-fed/MPCS/conventional-price proposition and names the 300,000-head alliance being built, per §B6.
2. **Given** the visitor reaches "What we sell today," **When** OQ-009 is unanswered, **Then** cuts/volumes/certifications/markets render as a pending placeholder rather than invented specifics, and the copy explicitly states that full animal history is not yet available.
3. **Given** the visitor reaches the roadmap, **When** OQ-010 is unanswered, **Then** the now/building/target structure is present with each stage's date marked pending.
4. **Given** the visitor reaches the closing content, **When** it renders, **Then** it includes the first-pick promise for early buyers (per §17, §B6) and a cross-link "Own the herd behind this beef" back to Invest (per §5 "Two roles, one contact").
5. **Given** the copy is drafted later from this structure, **When** it describes today's beef, **Then** the word "regenerative" (and every other §B2.6 banned word, outside the Glossary) must not appear — including words the live site itself still uses (§ Content Sources).
6. **Given** a visitor is anywhere on `/beef`, **When** they look at the top of the page or scroll to the bottom, **Then** they can reach Home, Invest, Beef, and Land from a persistent top navigation bar, and reach the generic contact form from a footer button distinct from "Get the spec sheet" / "Request a sample."

---

### User Story 3 - A visitor exploring Land understands the physical operation and how to get involved (Priority: P2)

A visitor who followed the "Landowners" card from Home — or anyone curious about where the cattle actually live — reaches Land and understands El Tapir as the group's own, visitable, named farm; sees the (currently anonymized, pending OQ-013) partner ranches; understands Ganadería a Pasto's role in growing supply; and, if they're a landowner themselves, finds a clear "Work with us" path.

**Why this priority**: Land is the brief's own "richest page" for trust (§6: El Tapir "vouches for the anonymised pipeline") but is one of three funnels (§5) rather than the primary commercial page, and its own copy framework (§B4–B6) is the thinnest of the three in the brief — most of its content must be built from Part A's architecture section (and now, candidate live-site material) rather than ready prose, which is itself a content-drafting decision for later, not this spec.

**Independent test**: Load `/land` and confirm El Tapir, Partner ranches, and Ganadería a Pasto each render as their own section (not a separate route) within the single Land page, each showing pending-data markers where OQ-012/013/014 are unanswered, plus a landowner "Work with us" call to action per §5.

**Acceptance scenarios**:

1. **Given** a visitor reaches `/land`, **When** the page loads, **Then** El Tapir appears as the most prominent section, describing it as the group's own farm, open to visitors by appointment, with size/expansion figures marked pending until OQ-012 is answered (candidate figure: 1,000 ha, per Content Sources).
2. **Given** the visitor scrolls to partner ranches, **When** OQ-013 is unanswered, **Then** the section shows its intended anonymized-card structure (codename, region, hectares, system) with no fabricated ranch entries.
3. **Given** the visitor reaches Ganadería a Pasto, **When** OQ-014 is unanswered, **Then** the section is marked as needing Vaz's confirmation of the candidate live-site material (35,000 ha, four-step methodology) rather than either inventing content or copying the live site's wording verbatim.
4. **Given** a landowner visits the page, **When** they reach the closing section, **Then** a "Work with us" call to action routes them toward contact, per the landowner funnel in §5.
5. **Given** a visitor is anywhere on `/land`, **When** they look at the top of the page or scroll to the bottom, **Then** they can reach Home, Invest, Beef, and Land from a persistent top navigation bar, and reach the generic contact form from a footer button distinct from "Work with us."

---

### Edge Cases

- A visitor reaches Invest, Beef, or Land directly (e.g. a bookmarked or shared link) without passing through the Home page's card selector first — every required section must still make sense read cold, without assuming the visitor already saw the card's framing text. The top navigation bar is what makes the rest of the site reachable from that cold entry.
- A section is blocked on an Open Question at build time — does the page hide that section entirely, or show a visibly-marked "coming soon" state? (Not decided here; the brief's own B4 rule — "placeholders... filled by Orbolo or the section is hidden" — suggests hiding is the safer default, but this spec leaves the choice to planning, flagged as an assumption below.)
- The same underlying ranch data feeds both the Deployment Pipeline (Invest) and Partner ranches (Land) — if that data changes on one page, does the other page need to reflect the update in the same content pass, and are the two views (investor progress-bar view vs. public anonymized-card view) drawing from the same private/public field split described in §7?
- A visitor is both an investor and a buyer (§5 "Two roles, one contact") — each page must carry exactly one cross-link to the other ("Own the herd behind this beef" on Beef; "See where your beef is sold" on Invest), not zero and not more than one, per the brief's own instruction. This is separate from the new generic footer contact button, which is the same on every page and is not a cross-link between Invest and Beef.
- The new footer contact button and each page's own bottom CTA(s) (investor pack/book a call; spec sheet/sample; work-with-us) sit close together at the bottom of the page — the page must keep them visually distinct so a visitor cannot mistake the generic contact button for the page's primary conversion action, without this spec dictating exact layout (a design/planning decision, not a content one).
- On mobile widths, the top navigation bar must not crowd out or overlap the page's own hero content — it inherits whatever responsive nav pattern (e.g. a collapsed/hamburger form) the existing `Layout`/header component already uses, since this spec does not introduce a new nav visual design, only the requirement that it lists and links all four current pages.
- A candidate live-site figure (El Tapir's 1,000 ha, GAPP's 35,000 ha, Verdant's 460+ animals) turns out, on Vaz's review, to be stale or inaccurate — the page must be able to render its pending-placeholder state indefinitely rather than assuming a candidate figure will eventually just be "confirmed as-is."

## Requirements *(mandatory)*

### Functional Requirements — Cross-page (apply to Invest, Beef, and Land alike)

- **FR-GEN-001**: Each page MUST inherit the existing `Layout` component, header/nav, and the constitution's typography and color tokens unchanged — no new design tokens, components, or page chrome are introduced by this feature, **except** the top navigation bar and footer contact button defined in FR-GEN-009 and FR-GEN-010, which are a deliberate, scoped amendment agreed 2026-09-22.
- **FR-GEN-002**: Each page's content MUST be organized into the named sections listed under its own Functional Requirements group below, in the order listed, even where a section's content is a marked pending-data placeholder rather than final copy.
- **FR-GEN-003**: No section MUST use any of the banned words from §B2.6 of the brief (sustainable, holistic, impact, journey, solution, ecosystem, unlock, seamless, leverage, empower, passionate, "premium" as a price claim) outside a linked Glossary term. This applies even to words the live site itself still uses (§ Content Sources) — the live site is not a style reference.
- **FR-GEN-004**: No section MUST describe Orbolo itself as collecting, holding, or managing investor capital, or use phrasing equivalent to "invest with Orbolo" — the contracting party for herd ownership is always the Paraguayan entity (§1, §17).
- **FR-GEN-005**: Every displayed number MUST carry a visible date and source, or MUST NOT be displayed (§3 "One source of truth"); a number blocked by an Open Question MUST render as a pending placeholder, never an invented value. A "candidate" figure sourced from the live site (§ Content Sources) is treated as blocked/pending exactly like any other Open Question until Vaz confirms it and it is given a proper as-of date and source.
- **FR-GEN-006**: Each page MUST link out to the shared trust layer — The Code, Glossary, Contact, and **FAQ** *(added 2026-09-22)* — even though those destination pages are themselves out of scope for this feature.
- **FR-GEN-007**: Voice and tone MUST follow §B2 of the brief: second person, present tense, short declarative sentences, one claim per sentence, concrete specifics (head counts, hectares, ranch codes, dates, names) over abstractions.
- **FR-GEN-008**: Each page MUST remain mobile-first per the constitution and brief §3 — section order and content must work at phone width first, not as a shrunk desktop layout.
- **FR-GEN-009** *(added 2026-09-22)*: Every page (Home, Invest, Beef, Land) MUST carry a persistent top navigation bar linking to all four of those pages, so a visitor can reach any page from any other page without returning to Home first. Scope for this pass is the four pages that exist today; the not-yet-built pages (The Code, Glossary, Contact, FAQ, About, Orbolo Bridge) are added to the nav bar only when they themselves ship, not as dead links now. Visual design of the bar (styling, mobile collapse pattern) is inherited from/added to the existing `Layout`/header component and is a design-phase decision, not specified here.
- **FR-GEN-010** *(added 2026-09-22)*: Every page (Home, Invest, Beef, Land) MUST carry one small, generic contact button below the page's own content (i.e. in or near the footer), distinct from any page-specific CTA already defined for that page (Invest's investor pack/book a call; Beef's spec sheet/sample; Land's work-with-us). This button's destination/form is blocked on **OQ-015** and renders as a structural placeholder (present and styled, pointing at a stub target) until resolved.

### Functional Requirements — Invest (Remote Rancher)

- **FR-INV-001**: Hero — states the core proposition ("own cattle on a working ranch in Paraguay, raised under the Orbolo Code"), the 60%-release / no-capital-before-release rule, and a "See the next ranch" call to action. Source: §B5 hero.
- **FR-INV-002**: Offer box — states what's included (tagged animals, named/visitable ranch, Code-raised, quarterly reporting, capital called only post-release) and the commercial terms (ticket, cycle, return range, fee, payout timing). Terms are blocked on **OQ-004/OQ-005**. Source: §16, §B5 offer box.
- **FR-INV-003**: "Is this real?" — points to El Tapir as the one fully named, visitable reference operation and offers a visit booking. Blocked on **OQ-012** for the exact, confirmed figures (candidate: 1,000 ha, per Content Sources). Source: §B5.
- **FR-INV-004**: "Who buys the animal at the end?" — explains Orbolo's own trading desk as the off-taker at market prices, i.e. every herd has a buyer before it's bought. Source: §B5.
- **FR-INV-005**: "What if not enough people join?" — explains the 60%-under-signed-LOI release rule and the 90-day LOI expiry/fallback. Source: §7, §B5.
- **FR-INV-006**: "What if it goes wrong?" — covers animal loss, drought, currency, policy/export, and liquidity risk categories in plain language. Specifics blocked on **OQ-006**. Source: §B5.
- **FR-INV-007**: How it works — the seven-step process from choosing a ranch through to payout and first pick on the next ranch. Source: §B5. Blocked on **OQ-016** for whether this replaces or coexists with the live site's own, differently-structured four-stage Verdant description.
- **FR-INV-008**: Deployment Pipeline — the ranch-card section per §7 (codename, region, hectares, grazing system, years in holistic management, MPCS membership, checklist ticks, threshold, progress bar, status, last-updated date, CTA by status). No card renders with fabricated data; blocked on **OQ-008** until real ranch data exists.
- **FR-INV-009**: "What you own, precisely" — specific animals by ear tag under a management agreement with the Paraguayan entity; explicitly not land, not a fund unit; carbon/biodiversity credits stay with the land and the group; the investor's return is beef only. Source: §6, §B5.
- **FR-INV-010**: "Who verifies what" — names the tagging provider, vet/audit partner, bank, satellite/deforestation monitor, and Orbolo's trading desk as off-taker. Blocked on **OQ-002/OQ-003**. Source: §B5, §8.
- **FR-INV-011**: FAQ (page-specific, distinct from the new general FAQ page in FR-GEN-006) — covers at minimum: owning cattle in an unvisited country, proof animals exist, early-exit possibility, visiting, eligibility, and what happens at cycle end. Eligibility text blocked on **OQ-007**. Source: §B5.
- **FR-INV-012**: Closing — "Released at 60%. No capital before then." plus "Get the investor pack" / "Book a call" calls to action and a footer line naming the contracting entity, blocked on **OQ-001**. Source: §B5.
- **FR-INV-013**: A single cross-link to Beef ("See where your beef is sold") per the two-roles-one-contact rule (§5). Source: §5.

### Functional Requirements — Beef

- **FR-BEEF-001**: Hero — states the grass-fed/MPCS/conventional-price proposition today and the 300,000-head producer alliance being built, with a first-pick promise for buyers who trade now. Source: §B6.
- **FR-BEEF-002**: "What we sell today" — current cuts, volumes, certifications, and markets, explicitly noting full animal history is not yet available because traceability is being built first. Blocked on **OQ-009**. Source: §6, §B6.
- **FR-BEEF-003**: "The promise" — conventional prices, no dependency on a premium; the better product is about resilience and scale, not a price play. This restates the same promise given once on Home (§4) — the wording should be consistent with it, not a new claim. Source: §4, §B6.
- **FR-BEEF-004**: The roadmap — dated now / building / target stages. Blocked on **OQ-010**. Source: §6, §B6.
- **FR-BEEF-005**: "First pick" — explains how early buyers who trade now get priority access to the traceable, aligned supply once it exists. Source: §5, §17, §B6.
- **FR-BEEF-006**: "Why supply from the group is different" — the trading desk plus owned herds combination (the "loop," §4) as the differentiator. Source: §B6.
- **FR-BEEF-007**: "Who verifies what" — MPCS, certifiers, processor, logistics partner, and named customers where permitted. Blocked on **OQ-002/OQ-011**. Source: §8, §B6.
- **FR-BEEF-008**: Calls to action — "Get the spec sheet" and "Request a sample." Source: §5, §B6.
- **FR-BEEF-009**: A single cross-link to Invest ("Own the herd behind this beef") per the two-roles-one-contact rule (§5). Source: §5, §B6.
- **FR-BEEF-010**: The word "regenerative" MUST NOT appear describing today's beef anywhere on this page (§6, §17 non-negotiable) — including in any material adapted from the live site (§ Content Sources).

### Functional Requirements — Land

- **FR-LAND-001**: El Tapir — the most prominent section on the page: the group's own farm, currently expanding, open to visitors by appointment, framed as the one fully named reference that vouches for the anonymized pipeline. Size/date figures blocked on **OQ-012** (candidate: 1,000 ha, per Content Sources). Source: §6.
- **FR-LAND-002**: Partner ranches — anonymized cards (codename, region, hectares, grazing system) drawing on the same underlying data referenced by the Invest page's Deployment Pipeline (§7), but showing only the public-layer fields. Blocked on **OQ-013**. Source: §6, §7.
- **FR-LAND-003**: Ganadería a Pasto — framed as "how we grow supply" / the group's technical arm. Content beyond this one-line frame is blocked on **OQ-014** (candidate: 35,000 ha, technical advisory service, four-step methodology, per Content Sources — needs confirmation and a rewrite pass, not a copy-paste). Source: §6.
- **FR-LAND-004**: Landowner "Work with us" — a closing call to action routing a landowner visitor toward contact, per the landowner funnel (§5: Land page → "Work with us" form → call).

### Non-goals *(mandatory)*

- Writing final, polished marketing copy (headlines, body paragraphs) for any of the three pages — this spec defines structure and sourcing only; copywriting is a later task, gated on the Open Questions above being answered.
- Building El Tapir, Partner ranches, Ganadería a Pasto, or the Deployment Pipeline as their own routes — they render as sections within Land or Invest in this pass, not as separate pages.
- Building the general FAQ page itself *(added 2026-09-22)* — like The Code, Glossary, and Contact, it is a link target for this pass (FR-GEN-006), not a page this feature builds; its content is blocked on OQ-017.
- The Deployment Pipeline's live/dynamic mechanics — LOI counting, expiry automation, Papermark/Sheets/Slack webhooks (§7, §10) — this spec only defines the pipeline's presentational section structure on Invest, not its automation.
- Spanish or German content — English only, per Clarifications.
- Any change to the Home page's own content, the `PathCard`/`PathGrid` components, or the design tokens set in the constitution. The header/nav is unchanged **except** for the addition of the top navigation bar and footer contact button (FR-GEN-009/010), which is the one deliberate, scoped exception to this freeze, agreed 2026-09-22.
- The Opportunity, The Code, Glossary, About, Contact, FAQ, or Orbolo Bridge pages — separate, out-of-scope destinations referenced only as link targets (and, per FR-GEN-009, not yet added to the top nav bar until they ship).
- The investor portal or the Papermark data room build-out (§10, §15 build phases 4 and 8).
- Performing legal/counsel review itself — this spec only marks where sign-off is required as a content gate (§17); it does not conduct that review.
- Resolving the Open Questions above — that is a decision for Orbolo/Vaz, not something this spec invents on their behalf, including **OQ-015** through **OQ-017**.
- Migrating or preserving anything from the live site's current structure, product names ("Verdant"), or wording — it is consulted only as a candidate factual source per Content Sources, never as a design, copy, or terminology reference.

### Key Entities *(include if feature involves data)*

- **PageSection**: A named content block on one of the three pages. Attributes: `id`, `page` (invest | beef | land), `heading`, `purpose` (what it must communicate), `briefSource` (§ citation), `status` (structure-only | blocked-on-open-question | ready-for-copy). This is the spec's own bookkeeping construct, not a proposal for a new code entity.
- **ContractingEntity**: The Paraguayan legal entity investors actually contract with. Attributes: `name`, `jurisdiction`. Currently fully unresolved — see OQ-001.
- **RanchCard**: The public-facing representation of one ranch in the pipeline, shared conceptually between Invest's Deployment Pipeline and Land's Partner ranches sections (§7). Public attributes: `codename`, `region`, `hectares`, `grazingSystem`, `yearsInTransition`, `mpcsStatus`, `checklistFlags`, `threshold`, `committedUnderLOI`, `status`, `updatedDate`. A private layer (ranch name, exact location, owner, contracts) exists per §7 but is explicitly out of scope for these public pages. Blocked on OQ-008/OQ-013 for real data; this spec does not define its storage/schema — that is a planning-phase decision.
- **Metric**: Any displayed number. Attributes: `value`, `unit`, `asOfDate`, `sourceDocumentRef` — per the brief's CMS content model (§14) and "One source of truth" principle (§3). Every number on these three pages is an instance of this pattern.
- **SiteNav**: The top navigation bar's link set. Attributes: `label`, `href`, `isActive`. Scoped to the four pages that exist today (Home, Invest, Beef, Land); grows as new pages ship. This is the spec's bookkeeping construct for FR-GEN-009, not a proposal for a new code entity.
- **ContentSourceRef** *(added 2026-09-22)*: Tracks where a fact or figure in this spec came from. Attributes: `sourceType` (theBrief | liveSite), `locator` (a § citation for the brief, or a live-site URL plus fetch date), `reliability` (authoritative | candidate-pending-confirmation). Every brief citation in this spec is `authoritative`; every live-site citation is `candidate-pending-confirmation` and must be upgraded by Vaz before it can back a live Metric. This is the spec's own bookkeeping construct, not a proposal for a new code entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each of the three pages (Invest, Beef, Land) contains every section listed in its Functional Requirements group above, in the order listed — verifiable as a structural checklist against the live page, independent of whether individual sections still show pending-data placeholders.
- **SC-002**: A banned-word search (§B2.6 list) across all three pages' rendered text returns zero hits outside Glossary-linked terms.
- **SC-003**: Zero instances of "regenerative" describing current-state beef; zero instances of "guaranteed" describing returns; zero instances of Orbolo described as collecting, holding, or managing investor capital, across all three pages.
- **SC-004**: Every number rendered on any of the three pages carries a visible date and source; no number renders without one, including any number originally sourced from the live site.
- **SC-005**: All 17 Open Questions (OQ-001–OQ-017) are either answered or their affected section is explicitly marked hidden-until-resolved, before this spec's Status changes from Draft to Approved.
- **SC-006**: Each of the three pages carries exactly one cross-link to its paired audience page per the "two roles, one contact" rule (Invest ↔ Beef), and a link to each of The Code, Glossary, Contact, and FAQ.
- **SC-007** *(added 2026-09-22)*: From any of the four pages (Home, Invest, Beef, Land), a visitor can reach every other one of the four via the top navigation bar in one click, and can reach the generic contact target via the footer button in one click, without needing to return to Home first.
- **SC-008** *(added 2026-09-22)*: A "FAQ" link is present in the shared trust layer on all three pages (and Home, per the nav-bar assumption below), reachable in one click, pointing at a single site-wide FAQ page — never duplicated per-page, and never conflated with Invest's own FAQ section (FR-INV-011).

## Assumptions

- The existing `Layout.astro`, header/nav, and the constitution's typography (HeliosExtC/Suisse Int'l/Verbena/Roslindale Cyr Deck Narrow) and color tokens (`#516b3e`/`#f8f4e9`) apply to these three pages unchanged — this spec introduces no new design tokens or chrome, other than the top nav bar and footer contact button carved out in FR-GEN-009/010.
- Where a section is blocked on an Open Question, the default assumption — pending a planning-phase decision — is that it renders **hidden** rather than showing a visible "TBD" placeholder on the live site, per the brief's own B4 rule ("placeholders... filled by Orbolo or the section is hidden"). This spec flags the choice rather than deciding it silently, per the Edge Cases above. The same default applies to the new footer contact button while OQ-015 is unresolved: present but pointing at a stub, not hidden, since a persistent contact path is meant to always be reachable.
- The Deployment Pipeline (Invest) and Partner ranches (Land) sections are assumed to draw on one shared underlying ranch data source (per §7's public/private field split), not two independently maintained data sets — the exact schema and storage mechanism is left to planning, consistent with Phase 1's own scoped-JSON-now precedent (constitution, Principle VIII).
- This spec assumes English-only content is a complete, shippable increment on its own — it does not assume Spanish/German will reuse this same section structure unchanged, since translation requirements (glossary-first translation, per §13) are a separate future concern.
- Resolving the Open Questions is assumed to happen through direct input from Vaz/Orbolo (not inferred from the brief, since the brief itself leaves them open) — this spec's Status field is the mechanism for tracking that this feature is blocked until then.
- The top navigation bar (FR-GEN-009) is assumed to also apply to the Home page itself, even though Home is technically outside this feature's original three-page scope, since a nav bar that appears on Invest/Beef/Land but not Home would leave no way back to those pages from Home other than the existing `PathCard`s — this is flagged as an assumption, not confirmed with Vaz, and should be checked at planning time.
- *(Added 2026-09-22)* The live site at `https://www.orbolo.com/` (fetched via automated page-text extraction on 2026-09-22, after a direct Playwright browser session from this environment was blocked by its own outbound network policy — see Content Sources) is treated as a secondary, candidate data source for real operating facts (hectare counts, animal counts, existing page/contact-form structure) only. It predates the brief's repositioning and still uses retired branding ("Verdant"), banned words ("regenerative," "sustainable," "impact"), and NGO-style framing the brief explicitly moves away from (§2) — none of its wording is assumed usable as-is, and none of its numbers are treated as resolved without Vaz's explicit confirmation they are still current, per FR-GEN-005.
