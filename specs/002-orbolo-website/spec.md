# Feature Specification: Orbolo Website — Full Site (Home, Invest, Beef, Land, Trust, Data Room)

**Feature Branch**: `002-orbolo-website`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Build the full Orbolo company website per the complete builder brief at `.specify/references/orbolo-website-brief.md` — a coded, multilingual (EN first), EU-hosted static site covering: Home (hero, the loop diagram, trust strip, two audience cards, Code summary, 'where we are', closing CTA), Invest/Remote Rancher (offer box, deployment pipeline with ranch cards, FAQ, risks), Beef (staged roadmap, spec sheet, sample request), Land (El Tapir, partner ranches, Ganadería a Pasto), The Code, The Opportunity, About, Orbolo Bridge, and Contact — plus a Papermark-backed investor/buyer data room, a CMS-driven content model, and the investor/buyer/landowner funnels described in the brief. This is a new feature, independent of the existing `001-orbolo-path-selection` feature (which stays as-is on its own stack)."

**Primary source document**: `.specify/references/orbolo-website-brief.md` ("Orbolo website — builder brief", September 2026). This spec translates that brief into testable requirements; where this spec and the brief could be read to disagree, the brief's Non-negotiables (§17) and Part B voice rules govern, and that disagreement should be raised via `/speckit-clarify` rather than resolved silently.

**Visual identity reference (Delta, 2026-09-17)**: `.specify/references/Orbolo_Editorial_Continuous.pdf` ("Orbolo Editorial Continuous" moodboard). Adds FR-042–FR-046 below as a presentation-layer delta per Constitution Principle VII — visual identity (color, typography, photography direction) only. Scope confirmed with the user: the moodboard's simplified nav (Beef/Live Cattle/Our Approach/Projects/Contact) and its "Verdant model" naming are template artifacts of the moodboard mockup, not content decisions — the information architecture, page set, user stories, and "Remote Rancher" naming already established in this spec are unchanged.

**Relationship to `001-orbolo-path-selection`**: Independent feature, own stack (per the project constitution's 2026-09-16 stack amendment: Astro, Firebase Hosting EU, Sanity/Payload CMS, GitLab CI). Feature 001's gamified path-selector and its Next.js implementation are kept as-is and are not part of this feature's scope, delivery, or dependency graph.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Home: understand the two engines and find a path (Priority: P1)

A first-time visitor — investor, beef buyer, or otherwise curious — lands on the Orbolo homepage. In one scroll, they understand that Orbolo has two engines under one brand (Remote Rancher for cattle ownership, beef trading for buyers), see the loop that connects them, see who Orbolo works with, and can move confidently toward the page that matches them.

**Why this priority**: This is the entry point for every other funnel; without it, no other story is reachable in a way that reflects the brand's actual positioning. It replaces a five-second understanding problem with a five-second understanding solution (brief §4, "the loop... understandable in five seconds").

**Independent Test**: Load the homepage and confirm, without scrolling past the first two screens, a visitor can state in their own words what Orbolo does and which of "Invest" or "Beef" applies to them; confirm both audience cards link to their respective pages and the loop diagram is present and correctly ordered (fund → raise → sell → pay → fund).

**Acceptance Scenarios**:

1. **Given** a first-time visitor loads the homepage, **When** the page finishes loading, **Then** they see, in order: a hero with the one-liner headline and two buttons ("Invest in a herd", "Buy beef"), the loop diagram (four stages, each linking to its page), a trust strip of partner logos with roles, two audience cards (Investors/Remote Rancher, Buyers/Orbolo beef) each with three dated numbers, and a closing CTA split by audience (Investors/Buyers/Landowners/Organisations).
2. **Given** the visitor reads the "why this, why now" section, **When** they scan it, **Then** each of the seven arguments (brief §9) is shown with its proof directly beside it (a chart, a named partner, a dated measurement, or a sourced figure) — no bare claim without adjacent evidence.
3. **Given** the visitor reaches "Where we are" and "What we don't do yet", **When** they read both, **Then** every operating/building/next item carries a "last updated" date, and the not-yet-done list explicitly states that Orbolo does not collect investor capital directly.
4. **Given** the visitor clicks a partner logo in the trust strip, **When** they view it, **Then** they see that partner's role and (where permitted) a one-line quote — never a bare logo with no context.
5. **Given** the visitor is a landowner (not an investor or buyer), **When** they look for a path in the closing CTA, **Then** they find a link into the Land funnel alongside the Investor/Buyer links.

---

### User Story 2 - Investor funnel: evaluate Remote Rancher through to a Letter of Intent (Priority: P1)

An investor lands on the Invest page, understands exactly what they'd own and how the money flow works, gets the investor pack via the light data room, and — once ready — requests full access, reviews a specific ranch's pipeline card, and signs a non-binding Letter of Intent for it.

**Why this priority**: This is the group's primary capital-formation mechanism (Remote Rancher) and the funnel the brief treats as most consequential to get right, honest, and legally safe (brief §5 Investor funnel, §17 Non-negotiables).

**Independent Test**: Starting from the Invest page alone (no dependency on Home), confirm a visitor can read the offer box, the deployment pipeline, the risks section, and the FAQ; request the investor pack (email verification only); and reach a specific ranch card showing a real, current LOI count against its threshold.

**Acceptance Scenarios**:

1. **Given** a visitor on the Invest page, **When** they read "what you own, precisely", **Then** it states they own specific tagged animals under a management agreement with the Paraguayan operating entity — never land, never a fund unit, and never phrased as investing "with Orbolo" (brief's Non-negotiables, §17).
2. **Given** the visitor views the deployment pipeline, **When** they look at any ranch card, **Then** it shows: codename, region (department level), hectares, grazing system, years in holistic management, MPCS membership, the selection checklist, animals needed (threshold), cycle length, opens date, a progress bar, status, last-updated date, and a status-appropriate call to action.
3. **Given** a ranch's progress bar, **When** the visitor reads it, **Then** it counts only signed, unexpired Letters of Intent, and the line beneath it states the ranch is released for deployment at 60% under signed LOI and keeps filling to 100%, with no capital called before release.
4. **Given** a ranch's LOIs have not reached 60% before their 90-day expiry, **When** that happens, **Then** the ranch either stays open or is withdrawn, and every affected LOI signer is informed — this rule is stated on the page, not just enforced silently.
5. **Given** the visitor wants to move forward, **When** they click "Get the investor pack", **Then** they reach the light data room via email verification only, with no NDA required at that stage.
6. **Given** the visitor has accepted the NDA in the full data room, **When** they choose a ranch, **Then** they can sign a non-binding Letter of Intent (head count, ticket, expiry) from a link inside the data room, and this is the only action that advances the pipeline bar.
7. **Given** the visitor reads the risks section, **When** they scan it, **Then** every risk category listed in the brief (animal loss, drought, currency, policy/export, liquidity, returns) appears in plain language, each beside its mitigation or its honestly-stated absence of one (e.g. "no secondary market today").
8. **Given** the offer box or any returns language, **When** it is displayed, **Then** it never uses the word "guaranteed" for returns and never states or implies Orbolo itself collects or manages investor capital.

---

### User Story 3 - Buyer funnel: evaluate and sample Orbolo's beef (Priority: P1)

A beef buyer lands on the Beef page, understands exactly what is available today versus what's being built, requests the spec sheet, and requests a sample.

**Why this priority**: The beef trading desk is Orbolo's own live commercial activity today (not a future promise), and honest staging here is explicitly a brand-trust requirement (brief §17, "never regenerative for today's beef").

**Independent Test**: Starting from the Beef page alone, confirm the "now / building / target" staging is visible with each stage clearly separated, the conventional-price and first-pick promises are both present, and the spec-sheet/sample-request actions work independently of the investor funnel.

**Acceptance Scenarios**:

1. **Given** a visitor on the Beef page, **When** they read "what we sell today", **Then** it describes grass-fed Paraguayan beef sourced from the market under the MPCS standard, sold at conventional market prices, with full animal history explicitly noted as not yet available.
2. **Given** the same visitor, **When** they look for the word "regenerative" anywhere describing today's product, **Then** it does not appear — that term is reserved for the Glossary's own defined-term context only, never as a claim about current beef.
3. **Given** the visitor reads the roadmap, **When** they scan it, **Then** each milestone (now/building/target) carries a date, and the roadmap visually distinguishes "live today" from "in progress" from "future target."
4. **Given** the visitor wants a sample, **When** they submit the sample request, **Then** they receive a sample with whatever origin record is available today (not a promise of full traceability), and see the first-pick promise for early buyers stated on the page.
5. **Given** the visitor is also curious about the investor side, **When** they look for it, **Then** a single "Own the herd behind this beef" link takes them to Invest — exactly one cross-link, not a duplicated funnel.

---

### User Story 4 - Landowner funnel: explore Land and get in touch (Priority: P2)

A landowner or visitor interested in Orbolo's land stewardship reaches the Land page, sees El Tapir as the fully-named reference farm, sees anonymised partner ranches, understands Ganadería a Pasto's role, and can submit a "Work with us" inquiry.

**Why this priority**: Land is the credibility anchor for the whole site (El Tapir "vouches for the anonymised pipeline," brief §6) but is a smaller, single-page funnel compared to Invest/Beef.

**Independent Test**: Load the Land page directly and confirm El Tapir is presented with real, named details (not anonymised), partner ranches are shown as anonymised cards, and the "Work with us" form successfully routes an inquiry.

**Acceptance Scenarios**:

1. **Given** a visitor on the Land page, **When** they read the El Tapir section, **Then** it is named (not anonymised), states its current size and expansion target with a date, and states it is open to visitors by appointment.
2. **Given** the same visitor, **When** they look at partner ranch cards, **Then** each is anonymised (codename, no owner name, no exact location) unless that specific ranch's owner has given written consent to be named.
3. **Given** the visitor reads about Ganadería a Pasto, **When** they finish, **Then** they understand it as "how the group grows its supply" — a technical/operational description, not a separate product pitch.
4. **Given** a landowner wants to work with Orbolo, **When** they submit the "Work with us" form, **Then** they receive confirmation their inquiry was received and a call is scheduled or offered.

---

### User Story 5 - Trust layer: The Code, Glossary, and verification are reachable from anywhere (Priority: P2)

Any visitor, on any page, can check the specific rule and verifier behind a claim, or the precise, non-marketing definition of a term, without leaving their current task.

**Why this priority**: The brief's core review lens (Voss, Buffett, Sutherland — §B7) is "resolve the fear before the upside" and "let them see the objection answered before they ask it." This is what makes every other page's honesty claims checkable rather than just asserted.

**Independent Test**: From any page in the site, confirm The Code and a working Glossary link/tooltip are reachable within one interaction, and that every rule in The Code names its verifier.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they look for the trust layer, **Then** The Code, the Glossary, and Contact are linked from that page (brief §6, "Trust layer, linked from every page").
2. **Given** the visitor opens The Code, **When** they read it, **Then** it presents 6-8 numbered rules, each stating how it is verified and by whom.
3. **Given** the visitor encounters a defined term (e.g. "grass-fed", "grass-finished", "MPCS standard", "in transition", "regenerative") anywhere on the site, **When** they hover/tap it on first occurrence, **Then** a tooltip shows the term, Orbolo's definition, how it's measured, and explicitly what it is not.
4. **Given** the visitor wants the full evidence behind "why this, why now", **When** they navigate to The Opportunity page, **Then** they see the full version of the seven arguments with charts and cited sources (not just the summary shown on Home).

---

### User Story 6 - Content editor manages site copy, partners, and ranch pipeline without code changes (Priority: P2)

A non-technical content editor adds or updates a page section, a partner, a glossary term, a Code rule, a dated metric, a ranch pipeline card, or a roadmap milestone, and the site reflects the change without any code or template modification.

**Why this priority**: Every other story depends on content being editable independently of code — this is the mechanism that makes "every number dated and sourced" (§3) and weekly ranch-card updates (§7) operationally sustainable rather than a one-time launch state.

**Independent Test**: Edit a Partner's role/logo/quote, a Metric's value/date/source, and a Ranch card's LOI-derived progress in the content system, and confirm each change appears on the live site with zero changes to page templates/components.

**Acceptance Scenarios**:

1. **Given** a content editor updates a Metric's value, unit, as-of date, or source reference, **When** the site rebuilds/republishes, **Then** the new value and its date/source appear everywhere that Metric is referenced, with no template change.
2. **Given** a content editor adds a new Partner with a role and logo, **When** published, **Then** it appears in the correct location(s) per the brief's partner placement table (§8) with no bare logo (a role is mandatory).
3. **Given** a content editor updates a Ranch's committed-under-LOI count, **When** the site refreshes, **Then** the progress bar, status, and any status-driven call-to-action update consistently — no ranch card shows a bar unless its underlying number is real and current, and cards are updated at least weekly.
4. **Given** a page exists only in English so far, **When** an editor views it in the content system, **Then** it shows as "published in EN, draft in ES/DE" rather than disappearing or erroring, and the public site does not show an incomplete translation as if it were finished.
5. **Given** a Ranch reaches 60% committed under signed LOI, **When** the threshold is crossed, **Then** the system flags it (for the team to send contracts manually — this step is deliberately not automated) rather than silently auto-progressing the ranch's public status.

---

### User Story 7 - About, Orbolo Bridge, and Contact (Priority: P3)

A visitor wants to know who is behind Orbolo, learn about its education/non-profit arm, or simply get in touch with the right team.

**Why this priority**: Supporting pages that round out the site's credibility and reachability but aren't on the primary conversion path for either funnel.

**Independent Test**: Load About, Orbolo Bridge, and Contact independently and confirm each renders its brief-specified content and Contact's routed forms reach the correct destination per audience.

**Acceptance Scenarios**:

1. **Given** a visitor on About, **When** they read it, **Then** they see the team, a three-sentence story, the group structure explained in plain words (Orbolo facilitates and trades; Paraguayan companies operate), "where we are", and careers.
2. **Given** a visitor on Orbolo Bridge, **When** they explore it, **Then** they see education and site-visit content for organisations and the group's non-profit activities, structured so that new sub-pages can be added later without touching the main site navigation.
3. **Given** a visitor submits the Contact page, **When** they choose investor, buyer, landowner, or general, **Then** their inquiry is routed to the correct destination for that audience, and call scheduling is available where relevant.

---

### User Story 8 - Multilingual rollout: Spanish and German after English launch (Priority: P3)

Once the English site is live, the same site becomes available in Spanish, then German, with The Code and Glossary translated first and fully.

**Why this priority**: Explicitly sequenced after English launch in the brief's own build phases (§15: "6. Spanish. 7. German."); not required for initial launch value.

**Independent Test**: With Spanish content loaded for a subset of pages, confirm `/es/` routes render correctly, hreflang tags are present, root-level language redirect works by `Accept-Language`, and any page without Spanish content does not silently appear "done" in that language.

**Acceptance Scenarios**:

1. **Given** a visitor with a Spanish-language browser, **When** they land on the root domain, **Then** they are redirected toward `/es/` content where it exists, with a manual switcher always available regardless of the auto-redirect.
2. **Given** The Code and Glossary, **When** Spanish content is added, **Then** these two are translated first and completely, ahead of every other page.
3. **Given** a page that has English content but no Spanish content yet, **When** a Spanish-preferring visitor reaches it, **Then** the system does not present an untranslated or partially-translated page as if it were the finished Spanish version (per the CMS's own "published in EN, draft in ES" state).

---

### Edge Cases

- What happens when a ranch's LOI count and its cached/rendered value briefly disagree (e.g. a signature webhook is delayed)? The page must not display a number known to be stale beyond the "at least weekly" freshness bar (§7), and should show its last-updated date so the discrepancy is visible rather than hidden.
- What happens if a deployed (fully-funded) ranch's owner has not consented to being named or photographed? It must remain visible as a completed row without a name or photo, never silently removed from history.
- What happens if a visitor reaches the full data room without having accepted the NDA (e.g. a stale/shared link)? The NDA gate must block content access regardless of how the link was reached.
- What happens if a visitor's Letter of Intent expires (90 days) before the ranch reaches 60%? They must be automatically informed, and the ranch's progress bar must no longer count that LOI.
- What happens when a Metric is referenced on a page but has no `as-of` date or source in the CMS? The page must not render that Metric's value at all — an unsourced number is worse than a missing one (§3, "One source of truth").
- What happens if a visitor is both a buyer and an investor? The CRM/contact model must allow one person to hold both roles without creating duplicate, conflicting records.
- What happens when a page exists in the CMS but its translation for the visitor's language is still in "draft"? The visitor must see the published (e.g. English) version or a clear language notice, never a half-translated draft.
- What happens if someone lands on one of the old domains (`verdant-by-orbolo.manus.space`, `ganaderiapasto.com`) or an old `orbolo.com` URL? They must 301-redirect into the corresponding page on the new site.

## Requirements *(mandatory)*

### Functional Requirements — Site structure & content system

- **FR-001**: The system MUST present the site architecture defined in the brief (§6): Home; Invest (Remote Rancher) with a Deployment pipeline section and a gated Investor portal placeholder for later; Beef with a Roadmap section; Land with El Tapir, Partner ranches, and Ganadería a Pasto; The Code; The Opportunity; About; Orbolo Bridge; Contact — with primary navigation `Invest · Beef · Land · The Code · About` plus a highlighted "Invest in a herd" button, and a footer containing `Glossary · The Opportunity · Data room · Contact · Orbolo Bridge · Blog · Imprint · Terms · Privacy · newsletter · LinkedIn · Instagram`.
- **FR-002**: Every page's content (copy, numbers, partners, images, sections) MUST be sourced from a content system, never hardcoded in a page template — adding, editing, or removing a Partner, Term, Rule, Metric, Ranch, Roadmap milestone, or Team member MUST require no template/component code change (mirrors Constitution Principle VIII).
- **FR-003**: The content model MUST support per-page, per-section translatability with an explicit "published in EN, draft in ES/DE" state per page (brief §13/§14) — a page in draft for a language MUST NOT be presented to a visitor of that language as a finished translation.
- **FR-004**: The system MUST support adding new Orbolo Bridge sub-pages without modifying the main site navigation (brief §6).

### Functional Requirements — Home

- **FR-005**: The Home page MUST present, in order: a hero (headline, deck, two buttons: "Invest in a herd" / "Buy beef", a captioned photo); the loop diagram (four linked stages, plus the two "why together" lines); the promise statement; a trust strip of 5-7 partner logos each with a stated role; two audience cards (Investors/Remote Rancher, Buyers/Orbolo beef), each with three dated numbers and a CTA; the seven "why this, why now" arguments each with adjacent proof; The Code in five lines with a link to the full page; a dated "where we are" block (Operating / Building / Next, each dated); a "what we don't do yet" block; and a closing CTA split by audience (Investors/Buyers/Landowners/Organisations).
- **FR-006**: The "what we don't do yet" block MUST explicitly state that Orbolo does not collect investor capital directly and that investments go to the Paraguayan operating company, only once a ranch is released.

### Functional Requirements — Invest / Remote Rancher

- **FR-007**: The Invest page MUST present: what an investor owns (tagged animals under a management agreement with the Paraguayan entity, never land or a fund unit); how it works (the 7-step flow in brief §B5); the offer box; the deployment pipeline; where the herd lives; who verifies what; a statement that returns are beef only (any carbon/biodiversity credits stay with the land and the group); risks in plain language; an FAQ; "Get the investor pack" and "Request full access" actions; and a footer line naming the contracting entity.
- **FR-008**: Each deployment-pipeline ranch card MUST display: codename, region (department level), hectares, grazing system, years in holistic management, MPCS membership, the selection checklist (MPCS member · minimum years in transition · water security · deforestation-free by satellite · contract in place), animals needed (threshold), cycle length, opens date, a progress bar, status, last-updated date, and a status-appropriate call to action.
- **FR-009**: A ranch's progress bar MUST count only signed, unexpired Letters of Intent. Letters of Intent MUST expire automatically 90 days after signing and drop off the count on expiry.
- **FR-010**: A ranch MUST be marked "released for deployment" only at 60% or more of its threshold under signed, unexpired LOIs, and MUST continue accepting commitments toward 100% after release. The system MUST NOT call capital from any signer before a ranch's release.
- **FR-011**: If a ranch does not reach 60% before its earliest-signed LOIs expire, the system MUST either keep it open or mark it withdrawn, and MUST notify every affected signer of that outcome.
- **FR-012**: A ranch that reaches "Deployed" status MUST remain visible on the pipeline as a completed row indefinitely; it MUST be named and photographed only with the owner's written consent on file.
- **FR-013**: Ranch card statuses MUST follow the sequence: Planned → Due diligence → Open for LOI → Released (60%+) → Filling → Full → Deployed. Each card MUST show a last-updated date and MUST be refreshed at least weekly.
- **FR-014**: The private layer of ranch data (exact name, exact location, owner, contracts, pasture assessment, water/infrastructure, vet history, visit booking) MUST be reachable only through the full (NDA-gated) data room, never the public pipeline view.
- **FR-015**: The system MUST NOT display any returns figure as "guaranteed"; target return ranges MUST be labeled as targets, not commitments, until a cycle has closed.

### Functional Requirements — Beef

- **FR-016**: The Beef page MUST present, staged and dated: what is sold today (grass-fed Paraguayan beef under MPCS, at conventional prices, full history not yet available); what is being built (the producer alliance and traceability layer); the target (ear-tag-to-box traceable supply including investor herds); a dated roadmap; the conventional-price promise; the first-pick promise for early buyers; who verifies what; a spec-sheet request; and a sample request.
- **FR-017**: The system MUST NOT describe today's beef product as "regenerative" anywhere outside the Glossary's own defined-term explanation of why it doesn't yet qualify.
- **FR-018**: The first-pick promise to early buyers MUST appear consistently across the Beef page, buyer follow-up emails, and the spec sheet (brief §17) — this is a single, reusable content fact, not three independently-maintained copies.

### Functional Requirements — Land

- **FR-019**: The Land page MUST present El Tapir as a fully named reference (current size, expansion target with a date, open to visitors by appointment), anonymised Partner ranch cards, and Ganadería a Pasto framed as "how we grow supply."
- **FR-020**: A Partner ranch card MUST NOT reveal owner name or exact location unless that ranch's record has explicit written consent on file to do so.
- **FR-021**: The Land page MUST provide a "Work with us" inquiry form for landowners that results in a scheduled or offered call.

### Functional Requirements — Trust layer (The Code, Glossary, Opportunity)

- **FR-022**: The Code, the Glossary, and Contact MUST be linked from every page on the site.
- **FR-023**: The Code MUST present 6-8 numbered rules, each stating how it is verified and by whom (a named Partner acting as verifier).
- **FR-024**: The Glossary MUST define, at minimum, "grass-fed", "grass-finished", "MPCS standard", "in transition", and "regenerative" — each with the term, Orbolo's definition, how it's measured, and what it is explicitly not — and the site MUST show a tooltip for each on its first occurrence per page.
- **FR-025**: The Opportunity page MUST present the full version of the seven "why this, why now" arguments (brief §9) with charts and cited sources, each traceable to a data-room document.

### Functional Requirements — Data room & investor/buyer flow infrastructure

- **FR-026**: The system MUST provide a light data room reachable via email verification only (no NDA), containing at minimum: the deck, one-pager, The Code, the Glossary, the pipeline, and a sample report.
- **FR-027**: The system MUST provide a full data room gated by NDA click-to-accept (with timestamp and audit log), containing financials, Remote Rancher terms, ranch identities and documents, herd registers, LOI and contract templates, group structure/entity documents, insurance, and regulatory opinions, organized into groups per audience.
- **FR-028**: Signing a Letter of Intent or a definitive contract MUST use a dedicated e-signature flow linked from inside the full data room; the NDA's own click-to-accept mechanism MUST NOT be reused to represent LOI or contract signatures.
- **FR-029**: The system MUST record, for every full-room visitor: email verification event, NDA acceptance event (with timestamp), and document view events — each of these MUST be able to trigger a team notification.
- **FR-030**: Approval of full-room access and the sending of contracts to LOI signers MUST remain explicit manual steps, never automatic.

### Functional Requirements — Metrics, sourcing, and content compliance

- **FR-031**: Every number displayed publicly on the site MUST carry a visible as-of date and a traceable source; the system MUST NOT render a Metric value that lacks both.
- **FR-032**: All site copy MUST comply with the brief's voice rules (§B2, §17): no banned terms outside Glossary context (*sustainable, holistic, impact, journey, solution, ecosystem, unlock, seamless, leverage, empower, passionate, premium*); second person, present tense preferred; concrete over abstract; and Orbolo is never described as collecting or managing investor capital ("Orbolo facilitates"/"the Paraguayan operating company" — never "invest with Orbolo").
- **FR-033**: No investor-facing flow (the offer box, risk language, LOI flow, or data-room access rules) MUST go live without a recorded counsel sign-off on that specific content.
- **FR-034**: Every investor-facing page MUST carry a footer line naming the contracting entity for that flow.
- **FR-035**: Every partner logo displayed anywhere on the site MUST be accompanied by a stated role; bare, role-less logo walls are prohibited.

### Functional Requirements — Analytics & funnels

- **FR-036**: The system MUST be able to report, per language and per funnel (Investor, Buyer, Landowner): visits → downloads → calls-or-samples → LOIs-or-trial-orders → contracts, plus the elapsed time between stages.
- **FR-037**: The system MUST allow one contact to hold more than one role (e.g. both investor and buyer) without creating duplicate or conflicting records, and each relevant page MUST offer exactly one cross-link to the other funnel ("Own the herd behind this beef" on Beef; "See where your beef is sold" on Invest).

### Functional Requirements — Internationalization

- **FR-038**: The system MUST support per-page language routing (`/en/`, `/es/`, `/de/`) with hreflang tags, a root-level redirect by `Accept-Language`, and a manual language switcher that is always available regardless of the automatic redirect.
- **FR-039**: The Code and the Glossary MUST be fully translated before any other page's translation is considered a priority, for each added language.

### Functional Requirements — Performance & redirects

- **FR-040**: Each page MUST expose per-page Open Graph metadata and be included in a per-language sitemap.
- **FR-041**: The system MUST 301-redirect every current `orbolo.com` URL, plus the two legacy domains (`verdant-by-orbolo.manus.space`, `ganaderiapasto.com`), into the corresponding page on the new site.

### Functional Requirements — Visual Identity & Design System (Delta, 2026-09-17)

- **FR-042**: The site's visual identity MUST express an "editorial agriculture" direction per the moodboard reference: full-bleed real photography of land, livestock, and people driving hero and section backgrounds, generous whitespace, and a confident typographic voice — never generic stock-photo grids or illustrated iconography as the primary visual device.
- **FR-043**: The color system MUST use a warm cream/paper background as the dominant surface, a forest-green as the primary text/ink color (replacing the previous near-black), and a lighter sage-green for secondary/eyebrow labels and accent taglines — with the existing earth-toned accent reserved for the single primary call-to-action per screen, and all combinations meeting Constitution Principle IX contrast requirements.
- **FR-044**: Page headlines MUST use an editorial serif display face; major full-bleed statement headlines (section-opening declarations set over photography) MAY use a bold, extended/wide grotesk treatment for emphasis, distinct from body copy.
- **FR-045**: Short emotional taglines that accompany a headline (e.g. "rooted in the land," "from the ground up") MUST be set in a cursive/script accent face, used sparingly — at most one such line per section — and never for body copy or functional UI text (buttons, form labels, navigation).
- **FR-046**: This visual refresh MUST apply to the existing information architecture, page set, section content, and product naming ("Remote Rancher") established elsewhere in this spec without modification — it is a presentation-layer delta only; no functional requirement outside this subsection is added, removed, or reinterpreted by it.

### Non-goals *(mandatory)*

- The Investor portal (authenticated, ongoing investor account area) — explicitly phased last (brief §15, phase 8); this spec covers only the public-facing pre-investment funnel through LOI.
- Building the actual CRM/Sheets automation, Slack/Make/Apps Script integrations, or e-signature vendor integration code — this spec defines the *behavior* those integrations must produce (FR-029, FR-036); the specific vendor wiring is a `plan.md`/implementation concern.
- Spanish and German content itself (the translated copy) — the *mechanism* for multilingual support is in scope (User Story 8, FR-038/039); translating all pages' content is separate, later work per the brief's own build phases.
- Any specific investor minimum ticket, cycle length, target return range, fee, or payout timing number — these are pending business/counsel input (brief §16) and are represented as pending Metrics in the content system, not hardcoded, and hidden until supplied (same "pending, hidden until complete" pattern already proven in `001-orbolo-path-selection`).
- Any specific Paraguayan contracting entity name — pending legal input (brief §16); represented as a pending content field, not hardcoded, and not shown in production copy until supplied.
- Determining which specific document-signing vendor (Dropbox Sign vs DocuSign vs Google Docs eSignature) — brief leaves this open; a `plan.md`-level decision.
- Determining which specific CMS product (Sanity vs Payload vs Keystatic/Decap/FireCMS) — brief explicitly leaves this open ("acceptable if preferred"); a `plan.md`-level decision.
- Ever describing today's beef as "regenerative", ever using "guaranteed" for returns, or ever phrasing Orbolo as collecting/managing investor capital — hard non-negotiables (FR-032), not features to build toward.

### Key Entities *(include if feature involves data)*

- **Page**: `slug`, `title`, `sections[]`, `SEO` fields; translatable per language with a per-language publish/draft state.
- **Section**: A typed content block (hero, loop, numbers, partner strip, Code strip, pipeline, roadmap, where-we-are, text, FAQ, form embed) attached to a Page; translatable.
- **Partner**: `name`, `logo`, `role`, `quote` (optional), `pages[]` (where it's displayed); quote is translatable.
- **Term** (Glossary): `term`, `definition`, `measured by`, `what it is not`, `group`; translatable.
- **Rule** (The Code): `number`, `rule text`, `verified how`, `verifier` (→ Partner), `terms` (→ Term[]); translatable.
- **Metric**: `key`, `value`, `unit`, `as-of date`, `source document reference`; label translatable, value/date/source are not.
- **Ranch**: `codename`, `region`, `hectares`, `system`, `MPCS status`, `years in transition`, `checklist flags`, `threshold`, `committed under LOI`, `release threshold (60%)`, `cycle length`, `status`, `opens date`, `updated date`, `photos`; plus private-only fields (exact name, exact location, owner, contracts, pasture assessment, water/infrastructure, vet history, visit booking) never rendered publicly.
- **Roadmap milestone**: `stage`, `title`, `target date`, `done date`, `status`; translatable.
- **Team member**: `name`, `role`, `background`, `photo`; bio translatable.
- **Blog post**: standard content type; translatable.
- **Contact/CRM record**: one row per person, with role(s) as a multi-value field (investor/buyer/landowner may co-occur on one record).
- **LOI**: ranch reference, signer reference, head count, ticket size, signed date, expiry date (signed date + 90 days), status (active/expired/converted).
- **Settings**: `product name` ("Remote Rancher"), `contracting entity line`, `contact emails`, `socials line` — global, non-page-specific content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Partners, Terms, Rules, Metrics, Ranches, and Roadmap milestones can be added, edited, or removed through the content system with zero page-template code changes.
- **SC-002**: A first-time visitor can state which of "Invest" or "Beef" applies to them, and reach that page, within one navigation action from Home.
- **SC-003**: An investor can complete "Get the investor pack" (light data room access) unassisted, on a phone, without any human intervention.
- **SC-004**: A buyer can request a spec sheet and a sample unassisted, without any human intervention until physical sample shipping.
- **SC-005**: Zero instances of the banned-word list (brief §B2) or the terms "regenerative" (for current beef) or "guaranteed" (for returns) appear anywhere on the published site outside their permitted Glossary/foil context.
- **SC-006**: Every number rendered on a published page carries a visible date and a traceable source; zero exceptions.
- **SC-007**: A ranch's publicly displayed progress bar never shows a count that includes an expired or unsigned LOI, and a ranch is never shown as "released" below 60% signed-and-unexpired commitment.
- **SC-008**: Core pages remain fast and usable on a mid-range mobile device (a technology-agnostic restatement of the brief's Lighthouse ≥ 90 mobile target, §11).
- **SC-009**: Every page reachable from primary navigation also exposes a working link to The Code, the Glossary, and Contact.
- **SC-010**: Every current `orbolo.com` URL and both legacy domains resolve (via redirect) to a live, correct page on the new site with zero broken links at launch.
- **SC-011**: Every color combination introduced or changed by the visual-identity delta (FR-042–FR-046) meets WCAG AA contrast (4.5:1 for body text, 3:1 for large/bold text) against its background, verified automatically.

## Assumptions

- **Deployment target is resolved**: Firebase Hosting, EU region (per the project constitution's 2026-09-16 stack amendment) — this was previously undecided for feature 001 and is now fixed project-wide for new work.
- **CMS product choice is deliberately left open** (Sanity, Payload, or Keystatic/Decap/FireCMS) — the brief treats these as interchangeable as long as field-level translation and a missing-translation view are supported; the specific choice is a `plan.md` decision, not a spec-level one.
- **Specific investor economics (minimum ticket, cycle length, target return range, fee, payout timing) are pending business/counsel input** (brief §16) and are modeled as pending Metrics — sections referencing them stay hidden/unpublished until supplied, following the same "pending, hidden until complete" mechanism already validated in `001-orbolo-path-selection`.
- **The Paraguayan contracting entity name(s) are pending legal input** and are likewise modeled as pending content, never hardcoded or guessed.
- **Ranch pipeline seed data (codenames, thresholds, opens dates) is pending from Orbolo** (brief §16); the pipeline mechanism (FR-008–FR-013) must function correctly with zero ranches, one ranch, or many, exactly as the path-selection grid in feature 001 had to tolerate zero-to-many paths.
- **E-signature vendor (Dropbox Sign, DocuSign, or Google Docs eSignature) is left to `plan.md`** — the brief states any of the three works with Papermark's webhook routing.
- **English launches first; Spanish and German are explicitly sequenced after** (brief §13, §15) — User Story 8 establishes the mechanism, not the translated content itself.
- **Analytics tooling (Plausible) and CRM tooling (Google Sheets, Slack, Google Calendar, Papermark) are treated as external systems this feature integrates with via defined behaviors (FR-029, FR-036), not systems this feature builds from scratch.**
- **Legal/counsel sign-off is a process gate outside this spec's testable behavior** (FR-033 states the requirement that it happened; verifying legal correctness of the signed-off content is out of scope for automated tests).
- **The moodboard's specific named typefaces (a Roslindale-style serif, a Helios-Ext-style bold extended grotesk) are commercial/paid faces** — sourcing free-license equivalents that match their visual character (or reusing already-installed families where the match is close enough) is a `plan.md` decision, not a spec-level one; FR-044/FR-045 constrain the *role and treatment* of each face, not the specific family.
