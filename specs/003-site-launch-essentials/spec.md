# Feature Specification: Orbolo Website – Site Launch Essentials (SEO, Legal Pages, Analytics, Quality Baseline)

**Feature Branch**: `003-site-launch-essentials` *(directory name only – no git branch was created by this specify pass; branch creation is Vaz's call)*

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description (2026-09-25): "I want to add these important key things into the Orbolo website: custom 404 page, CTA above the fold, meta title per page, meta description per page, Open Graph image, favicon set, robots.txt, sitemap.xml, alt text on every image, mobile breakpoints, sticky mobile CTA, loading states, form error states, thank-you page, privacy policy page, terms page, cookie banner, analytics installed, real contact address." Refined in the same conversation: "Apply only the ones that do not collide with my earlier approved rules and decisions. Don't touch Contact. Don't add the CTA above the fold. Don't do any change that impacts the as-is of the website now – only improvements from the keys I passed. Privacy and Terms content: take it from orbolo.com – don't fetch it yourself, put it in the spec so the implementing agent goes to orbolo.com and fetches it."

## Governing Rule for This Feature: The As-Is Freeze

Everything a visitor sees on the website today (Home, Invest, Beef, Land, Contact – as built by `001-orbolo-path-selection` and `002-page-content-specification`) MUST look and behave exactly as it does now after this feature ships. This feature is **additive only**:

- It MAY add things a visitor does not see on the existing pages (document metadata, social-preview data, crawler files, favicon formats, analytics).
- It MAY add **new** pages (404, Privacy, Terms).
- It MAY add exactly **one** new visible element to existing pages: a minimal site footer carrying the Privacy and Terms links (see Scope Change below – a deliberate, Vaz-approved exception).
- It MAY apply the new `#bfd55d` accent token to existing pages' fills (button backgrounds, borders, decorative blocks) per the 2026-09-30 Scope Change below – a second deliberate, Vaz-approved exception, distinct from and narrower than a general design refresh: it changes color fills only, never copy, section order, components, layout, navigation bar, page titles, images, or interactions.
- It MUST NOT change any existing page's copy, section order, components, layout, navigation bar, page titles, images, or interactions.

Any requirement below that cannot be met without breaking this freeze MUST stop and be escalated to Vaz as a finding – never resolved by quietly changing the existing site.

## Scope Change – 2026-09-25 (delta against earlier approved specs, per Constitution Principle VII)

- **Added (amends 002 FR-GEN-001 design freeze and its Non-goals entry)**: a minimal site-wide footer containing only "Privacy" and "Terms" links. Approved by Vaz 2026-09-25 as the second scoped exception to the header/chrome freeze (the first being the 002 top navigation bar, FR-GEN-009). The top navigation bar itself (FR-GEN-009) is **not** changed – Privacy and Terms are **not** added to it.
- **Added**: the Contact stub page (`/contact`) receives document-level metadata (description, social-preview data) and is listed in the sitemap – Vaz decision 2026-09-25. Its visible content, its route, and OQ-015 remain untouched.
- **Confirmed, not changed**: analytics follows the brief exactly – Plausible (EU, cookieless), and **no cookie banner** (brief §12 Tooling and §B8 launch checklist: "Plausible live; no cookie banner").

## Scope Change – 2026-09-30 (third color token, delta against the As-Is Freeze and FR-GEN3-002, per Constitution Principle VII)

- **Added**: a third palette token, accent `#bfd55d` (lime-green), per the constitution's Additional Constraints (Colors, amended 2026-09-30). Source: the brief's own editorial moodboard reference, which uses this exact value both as bold display-heading color over cream and as a solid background block with light text over it.
- **Contrast finding (recorded, not silently resolved)**: `#bfd55d` against the existing `#f8f4e9` background is **1.48:1** either direction – far below WCAG AA (4.5:1 text, 3:1 large text). Vaz reviewed this finding 2026-09-30 and made an explicit, informed decision: ship `#bfd55d` as given, restricted to **accent/fill use only** (background blocks, button fills, borders, decorative elements) – **never as the color of running text** (body copy or headings read directly against it or through it). Any text placed over a `#bfd55d` fill needs its own separately-legible color (not `#f8f4e9`), chosen and contrast-checked at the point of use, not assumed from this entry.
- **Amends the As-Is Freeze**: this is a **site-wide** palette change, not scoped to 003's own new pages. FR-GEN3-001/FR-GEN3-002 (below) are updated accordingly – the freeze still holds for copy, section order, components, layout, nav, images, and interactions, but **no longer** holds the palette at exactly two tokens. Applying the new accent to already-shipped 001/002 UI (e.g. button fills) is in scope for this feature and does **not** count as a freeze violation; changing anything else on those pages still does.
- **Reference images**: Vaz is supplying new images for `.specify/references/` to replace the current set (2026-09-30, in progress at spec-amendment time) – existing filenames are guides, not contracts; the implementing agent uses its judgement on which new image serves which purpose. Not yet available as of this entry; `research.md`/`plan.md` for the feature that applies them records what arrived and how each was used.

## Key Selection – What Is In and Out

Of the 19 keys supplied (the unnamed 20th item is dropped by Vaz's instruction), each was checked against the constitution, the brief, specs 001/002, and the as-is freeze:

| # | Key | Decision | Reason |
|---|-----|----------|--------|
| 1 | Custom 404 page | **In** – US1 | New page; no existing page changes. |
| 2 | CTA above the fold | **Out** | Vaz decision 2026-09-25; would change 001's approved Home hero. |
| 3 | Meta title per page | **In** – US2 (verify + new pages only) | Existing titles are already unique per page and stay exactly as they are; new pages get their own. |
| 4 | Meta description per page | **In** – US2 | Not visible on the page. |
| 5 | Open Graph image | **In** – US2 | Not visible on the page. |
| 6 | Favicon set | **In** – US2 | Additional formats of the **existing** icon only; the tab icon a visitor sees today does not change. |
| 7 | robots.txt | **In** – US2 | Not visible. |
| 8 | sitemap.xml | **In** – US2 | Not visible. |
| 9 | Alt text on every image | **In** – US4 (guard only) | Every current image already complies; this adds an automated guard and applies the rule to new pages. |
| 10 | Mobile breakpoints | **In** – US4 (new elements + non-regression check) | New pages/footer must be responsive; existing pages are only verified, never altered here. |
| 11 | Sticky mobile CTA | **Out** | Adds a new visible element over every existing page (breaks the as-is freeze), and its destination would be Contact (off-limits) or the brief's not-yet-built "Invest in a herd" button. Note: the brief's §B8 launch checklist lists "sticky CTA bar" – it stays a future feature, not dropped from the product. |
| 12 | Loading states | **Out** | The site is static; the only asynchronous interaction would be the Contact form, which is off-limits. Nothing else loads asynchronously. |
| 13 | Form error states | **Out** | No form exists outside Contact (off-limits, OQ-015). |
| 14 | Thank-you page | **Out** | Only meaningful after a form submission; depends on Contact (off-limits). |
| 15 | Privacy policy page | **In** – US3 | New page. |
| 16 | Terms page | **In** – US3 | New page. |
| 17 | Cookie banner | **Out** | Collides with the approved brief (§12, §B8: cookieless analytics, "no cookie banner"). Vaz confirmed 2026-09-25: follow the brief. |
| 18 | Analytics installed | **In** – US5 | Plausible, cookieless, per brief §12. Not visible. |
| 19 | Real contact address | **Out** | Belongs to Contact (off-limits, OQ-015). |

## Clarifications

### Session 2026-09-25

- Q: One spec or several? → A: One spec. After the exclusions, every remaining item is launch-hygiene work with no dependency on the others; each is an independently testable user story below.
- Q: Analytics – Google Analytics with a consent banner, or cookieless? → A: Follow the brief: Plausible (EU, cookieless), no cookie banner. The cookie-banner key is therefore out of scope (collides with brief §12/§B8).
- Q: Should this feature touch Contact? → A: No – with one exception decided afterwards: Contact receives document metadata and a sitemap entry only (see next).
- Q: Should Contact be left out of the sitemap and per-page metadata while it is a placeholder? → A: No – include it. Contact gets its own meta description / social-preview data and a sitemap entry. Its visible page stays untouched.
- Q: How do visitors reach Privacy and Terms, given the brief puts them in a footer that doesn't exist yet? → A: A minimal new footer with only "Privacy · Terms", using the existing two color tokens. Not added to the top nav bar.
- Q: Where does the Privacy/Terms text come from? → A: From the live site `orbolo.com`. The spec author does not fetch it; the implementing agent fetches it at implementation time under the rules in US3 / FR-LEG-*.
- Q: CTA above the fold? → A: Not in this feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 – A lost visitor lands on a branded 404, not a dead end (Priority: P1)

A visitor follows a broken or outdated link (for example, an old `orbolo.com` URL that no longer exists on the new site) and lands on a page that is clearly Orbolo's, tells them plainly the page doesn't exist, and gives them a way back to Home and to the rest of the site.

**Why this priority**: Today a missing URL shows the host's generic error page – off-brand and a dead end. The brief plans 301 redirects from every current URL (§11), but any URL not covered lands here, so this is the safety net for the whole relaunch.

**Independent Test**: Request any non-existent path (e.g. `/this-does-not-exist`) and confirm: HTTP status 404, the site's existing top nav bar is present, a heading and one short line explain the page wasn't found, a link returns to Home, and the page uses only the two color tokens.

**Acceptance Scenarios**:

1. **Given** a visitor requests a URL that doesn't exist, **When** the page loads, **Then** the response status is 404 (not 200) and the branded not-found page renders.
2. **Given** the not-found page is shown, **When** the visitor looks for a way forward, **Then** the existing top navigation bar (unchanged, per 002 FR-GEN-009) and a clear link back to Home are both available and keyboard-reachable.
3. **Given** the not-found page, **When** a crawler reads it, **Then** it is marked not-to-be-indexed and it does not appear in the sitemap.

---

### User Story 2 – Search engines and social shares represent every page correctly (Priority: P1)

When someone finds Orbolo in a search engine, bookmarks it, or shares a page link on LinkedIn/WhatsApp/Slack, each page shows its own clear title, a one-sentence description, a branded preview image, and the Orbolo icon – and search engines can discover every public page.

**Why this priority**: The brief's investor funnel starts at "Awareness – LinkedIn, referrals, blog" and the buyer funnel at "EN/ES SEO" (§5). Today, a shared link shows no description and no preview image, and there is no sitemap or crawler file. This is invisible to the on-page experience, so it carries zero risk to the as-is freeze.

**Independent Test**: For each public page, inspect the page's document metadata and confirm: unique title, unique description, complete social-preview set (title, description, image, image alt text, URL, type), favicon formats all resolve (no 404s); fetch `/robots.txt` and `/sitemap.xml` and confirm contents; paste a page URL into a social-preview debugger and confirm a correct card.

**Acceptance Scenarios**:

1. **Given** any public page (Home, Invest, Beef, Land, Contact, Privacy, Terms), **When** its document metadata is read, **Then** it has a title and a description that no other page shares.
2. **Given** the existing pages, **When** their titles are compared before and after this feature, **Then** they are identical (Home "Orbolo", "Invest — Orbolo", "Beef — Orbolo", "Land — Orbolo", "Contact — Orbolo").
3. **Given** a page link is shared on a social platform, **When** the platform builds a preview, **Then** it shows that page's title, its description, and the Orbolo social-preview image.
4. **Given** a browser, phone home screen, or bookmark requests the site icon in any common format, **When** the request is made, **Then** a valid icon is returned, and it is the same mark the site shows today.
5. **Given** a crawler, **When** it requests `/robots.txt`, **Then** it is allowed to crawl the site and is pointed to the sitemap.
6. **Given** a crawler, **When** it requests `/sitemap.xml`, **Then** it lists every public page (including Contact, Privacy and Terms once shipped) with absolute URLs, and excludes the not-found page.

---

### User Story 3 – A visitor can read Orbolo's Privacy Policy and Terms (Priority: P2)

A visitor – particularly an investor doing due diligence – scrolls to the bottom of any page, finds "Privacy" and "Terms" links in a small footer, and reads Orbolo's current privacy policy and terms and conditions, carried over from the live `orbolo.com` site.

**Why this priority**: These pages are legally expected and part of the brief's footer (§4 "Footer: … Imprint · Terms · Privacy"), and their absence undermines the "serious trading house" trust the brief asks for. P2 rather than P1 because their content depends on an external source (the live site) and on Vaz/counsel sign-off before shipping.

**Independent Test**: Load any page, confirm the footer shows exactly "Privacy" and "Terms" and nothing else; follow each link and confirm the page renders the text fetched from `orbolo.com`, with the fetch source and date recorded, inside the site's existing Layout and top nav bar.

**Acceptance Scenarios**:

1. **Given** any page on the site, **When** the visitor reaches the bottom, **Then** a footer shows "Privacy" and "Terms" links, visible, keyboard-reachable, with a visible focus state, and nothing above the footer has moved or changed.
2. **Given** the visitor opens Privacy (or Terms), **When** the page renders, **Then** it shows the legal text carried over from `orbolo.com`, with a visible "last updated" date.
3. **Given** the implementing agent could not find a privacy policy or terms page on `orbolo.com`, **When** the feature is implemented, **Then** that page is not shipped, its footer link is not rendered (no dead link), and the gap is reported to Vaz – no legal text is written from scratch.
4. **Given** the text fetched from `orbolo.com` contains statements that no longer match the new site (see FR-LEG-005), **When** it is carried over, **Then** those statements are reported to Vaz for review and are not silently rewritten.

---

### User Story 4 – Every image is described and the new pieces work on every screen size (Priority: P2)

A screen-reader user hears a meaningful description of every content image on every page, and a phone user can use the new 404, Privacy and Terms pages and the footer without zooming or horizontal scrolling – while the existing pages stay protected against regression.

**Why this priority**: Accessibility is a release gate (Constitution Principle IX). All current images already have alt text and the current pages are already responsive (001's `path-grid-responsive` coverage), so the value here is protecting that permanently with automated checks and applying the same bar to everything this feature adds.

**Independent Test**: Run the automated alt-text check across every page (fails if any image lacks an alt attribute); run the responsive check at the defined widths on every page (fails on horizontal overflow).

**Acceptance Scenarios**:

1. **Given** any page, **When** its images are inspected, **Then** every content image has a meaningful text alternative and every purely decorative image has an explicitly empty one.
2. **Given** the 404, Privacy, and Terms pages and the footer, **When** viewed at each defined width (FR-QA-003), **Then** there is no horizontal scrolling, text is readable without zooming, and links are comfortably tappable.
3. **Given** the existing pages, **When** the responsive check runs, **Then** it only verifies; if an existing page fails, the failure is reported to Vaz as a separate finding and **not** fixed within this feature (as-is freeze).

---

### User Story 5 – Orbolo sees how many people visit, without tracking them (Priority: P3)

Vaz and the Orbolo team can see page visits and traffic sources for the site in a privacy-friendly analytics dashboard, with no cookies set on visitors and therefore no cookie banner.

**Why this priority**: Required by the brief for launch (§12 Tooling, §15 step 5 "Launch – redirects, Plausible, DNS", §B8 "Plausible live; no cookie banner"). P3 because it produces value only once the site is on its production domain.

**Independent Test**: On the production domain, load pages and confirm visits appear in the Plausible dashboard; inspect the browser and confirm the site sets no cookies and shows no consent banner; on a non-production host (local, preview channel), confirm no visits are reported.

**Acceptance Scenarios**:

1. **Given** a visitor on the production domain, **When** they view any page, **Then** a page view is recorded in the analytics dashboard.
2. **Given** any visitor, **When** they browse the site, **Then** no cookies or similar storage are set for analytics and no consent banner appears.
3. **Given** the analytics service is unreachable or blocked by the visitor's browser, **When** the page loads, **Then** the page looks and works exactly the same.
4. **Given** a local build or a preview channel, **When** pages are viewed, **Then** no page views are sent to the production analytics dashboard.

---

### Edge Cases

- **Nested or trailing-slash URLs** (`/invest/`, `/invest/extra`, `/INVEST`): existing routes behave as they do today; a genuinely non-existent path shows the 404 page with a 404 status.
- **404 page and the nav bar's active state**: no nav item is marked current on the 404, Privacy, or Terms pages (none of them is in the nav).
- **orbolo.com unreachable at implementation time** (e.g. the sandbox network block recorded in 002's Content Sources method note): the implementing agent reports it and stops that story; it never reconstructs or paraphrases legal text from memory or from a third-party source.
- **orbolo.com legal text mentions the retired "Verdant" name, the old project set (El Tapir, Orbolo Bridge, Ganadería a Pasto as separate products), the old website platform, cookies, or tracking tools the new site doesn't use**: flagged per FR-LEG-005, not silently edited.
- **Legal text contains words on the brief's §B2.6 banned list**: legal text is not rewritten to satisfy the banned-word rule; hits are listed in the report to Vaz (FR-LEG-005). 002's SC-002 banned-word check applies to the Invest/Beef/Land pages only and is not extended to legal pages.
- **Invest already has an in-page closing line naming the contracting entity (002 FR-INV-012)**: the new site footer does not duplicate, move, or replace it.
- **Social platforms cache old previews**: re-scraping is an operational step after launch, not a requirement of this feature.
- **The site is not yet on its production domain**: sitemap and social-preview URLs still use the production domain (see FR-SEO-008), so they are correct from the moment the site goes live.
- **Analytics blocked by an ad blocker**: no visible effect, no console errors that break page scripts (the Home flip cards must keep working).

## Requirements *(mandatory)*

### General

- **FR-GEN3-001**: This feature MUST NOT change the visible content, section order, components, layout, navigation bar, page titles, images, or interactions of any existing page (Home, Invest, Beef, Land, Contact). The only permitted visible addition to existing pages is the footer defined in FR-LEG-001.
- **FR-GEN3-002**: Every new visible element (404 page, Privacy page, Terms page, footer) MUST use only the constitution's palette tokens (`#F8F4E9` background, `#516B3E` text/headings, `#BFD55D` accent/fill only – never as text color, per the 2026-09-30 Scope Change above), the constitution's typography, the existing Layout and top navigation bar, and the `CLAUDE.md` design rules (radius 16px or pill only, 8px spacing base, spacing through container `gap` rather than per-element margins, no hero photography). `CLAUDE.md`'s "never add a 3rd accent color" anti-pattern is itself superseded by the 2026-09-30 constitution amendment – `CLAUDE.md` should be regenerated (re-run `/taste` against the running site) once this feature's visible changes ship, rather than hand-edited.
- **FR-GEN3-003**: All new editorial content introduced by this feature (404 copy, meta descriptions, social-preview text, footer labels, legal page text) MUST live in the site's content data layer, not hard-coded inside components (Constitution Principle VIII). Existing page titles stay where they are today – moving them is a refactor outside this feature's scope (Principle VI).
- **FR-GEN3-004**: All new copy written for this feature (404 copy, meta descriptions, social-preview text) MUST follow the brief's voice rules (§B2: second person, present tense, short declarative sentences) and MUST NOT use any §B2.6 banned word (sustainable, holistic, impact, journey, solution, ecosystem, unlock, seamless, leverage, empower, passionate, "premium" as a price claim), and MUST NOT describe Orbolo as collecting investor capital (002 FR-GEN-004). English only (002 language scope).
- **FR-GEN3-005**: Every new interactive element MUST meet Constitution Principle IX (keyboard operable, visible focus, semantic markup, sufficient contrast, no hover-only behavior).

### Custom 404 (US1)

- **FR-404-001**: Any request for a path that does not exist MUST return HTTP status 404 and render a branded not-found page.
- **FR-404-002**: The not-found page MUST include the existing top navigation bar unchanged, a heading, one short explanatory sentence, and a clearly labelled link back to Home.
- **FR-404-003**: The not-found page MUST be marked not-to-be-indexed and MUST NOT be listed in the sitemap.
- **FR-404-004**: The not-found page MUST contain no photography (CLAUDE.md directive) and no invented claims or numbers.

### SEO, Social Preview, Favicons, Crawlers (US2)

- **FR-SEO-001**: Every public page MUST have a document title unique across the site. Existing titles MUST remain exactly as they are today (Home "Orbolo"; "Invest — Orbolo"; "Beef — Orbolo"; "Land — Orbolo"; "Contact — Orbolo"). New pages MUST follow the same "‹Page› — Orbolo" pattern ("Privacy — Orbolo", "Terms — Orbolo", "Page not found — Orbolo").
- **FR-SEO-002**: Every public page, including Contact, MUST have a meta description unique across the site, of roughly 120–160 characters, drawn only from that page's already-approved content (no new claims, no numbers that aren't already on the page with their date and source per 002 FR-GEN-005). Meta descriptions MUST be approved by Vaz at the implementation review gate.
- **FR-SEO-003**: Every public page MUST expose a complete social-preview set: title, description (same as FR-SEO-001/002), absolute canonical page URL, content type, site name "Orbolo", preview image, preview image alt text, and a large-image card format for platforms that support it.
- **FR-SEO-004**: One shared, site-wide social-preview image MUST be provided at the standard large-card size (1200×630), built only from existing brand assets (the Orbolo logo in `public/images/branding/`) and the two color tokens – no new photography, no new artwork, no text beyond the "Orbolo" wordmark. Per-page preview images are out of scope.
- **FR-SEO-005**: Every page MUST declare a canonical URL on the production domain.
- **FR-SEO-006**: The site MUST provide a favicon set derived from the **existing** `favicon.svg` mark (unchanged in shape and color): the existing SVG, a legacy multi-size ICO, a 180×180 home-screen icon for iOS, and 192×192 and 512×512 icons referenced from a web app manifest. The icon visible in the browser tab today MUST NOT change.
- **FR-SEO-007**: `/robots.txt` MUST allow all crawlers to crawl all public pages and MUST reference the absolute sitemap URL.
- **FR-SEO-008**: `/sitemap.xml` MUST list every public page – Home, Invest, Beef, Land, Contact, and Privacy/Terms when they ship – with absolute URLs on the production host [NEEDS CLARIFICATION: canonical production host – `https://orbolo.com` (the brief §11: "orbolo.com primary") or `https://www.orbolo.com` (what the live site serves today)?]. It MUST exclude the not-found page and any page that is hidden or not shipped. English URLs only; per-language sitemaps and hreflang (brief §11/§13) are out of scope until Spanish ships.

### Legal Pages and Footer (US3)

- **FR-LEG-001**: Every page (existing and new) MUST end with a minimal site footer, below all existing page content, containing only a "Privacy" link and a "Terms" link, as a labelled navigation landmark. It MUST NOT alter, overlap, or reflow any existing section above it. A link MUST be rendered only if its destination page ships (no dead links).
- **FR-LEG-002**: The site MUST have a Privacy page and a Terms page, each using the existing Layout and top navigation bar, with the Privacy and Terms content sourced as defined in FR-LEG-003.
- **FR-LEG-003** – **Content sourcing instruction for the implementing agent**: At implementation time, the implementing agent MUST itself go to the live site `https://www.orbolo.com/` (and `https://orbolo.com/` if the former redirects), locate its privacy policy and its terms and conditions (checking the footer, legal links, and common paths such as `/privacy-policy`, `/privacy`, `/terms`, `/terms-and-conditions`, `/terms-of-use`, `/legal`), fetch their full text, and carry that text over **verbatim in meaning and structure** (headings, numbered clauses, lists preserved). The spec author did not fetch this content; none of it is in this spec. The agent MUST record, in the feature's `research.md`, for each page: the exact source URL, the fetch date, the fetch method, and the "last updated" date stated on the source page (if any).
- **FR-LEG-004**: If either legal document cannot be found on, or fetched from, `orbolo.com`, the implementing agent MUST NOT write, generate, paraphrase from memory, or copy legal text from any other source. That page is not shipped, its footer link is not rendered (FR-LEG-001), and the gap is reported to Vaz.
- **FR-LEG-005**: The implementing agent MUST NOT rewrite the legal meaning of the fetched text. It MUST produce a review list for Vaz of every passage that may no longer match the new site, including at minimum: mentions of the retired "Verdant" name; references to the old project set or old site structure; references to the old website platform/hosting provider (the new site is hosted on Firebase, EU – constitution); statements about cookies, tracking, or analytics tools (the new site uses cookieless Plausible and sets no cookies – FR-AN-002); references to forms or data collection the new site doesn't yet have; and any §B2.6 banned words. Only purely mechanical adaptations (e.g. converting the source's formatting into the site's markup, fixing broken links to pages that don't exist on the new site by removing the link and keeping the text) are allowed without review, and each must be listed.
- **FR-LEG-006**: Each legal page MUST show a visible "last updated" date: the source page's own date if it states one; otherwise the fetch date labelled as such.
- **FR-LEG-007**: The Privacy and Terms pages MUST NOT go live until Vaz (and counsel, if Vaz decides legal pages need it – the brief requires counsel review for investor-facing legal items, §16/§B8, but does not name Privacy/Terms explicitly) has approved the text and the FR-LEG-005 review list. Until approved, they are treated as not shipped (FR-LEG-001).

### Image Alt Text and Responsive Quality (US4)

- **FR-QA-001**: Every image on every page MUST have a text alternative: meaningful for content images (sourced from the content layer, as 001's path cards already do), explicitly empty for purely decorative images. CSS background images (e.g. the Home hero background) are decorative and exempt. An automated check MUST fail if any image lacks an alt attribute.
- **FR-QA-002**: The shared social-preview image MUST carry alt text (FR-SEO-003).
- **FR-QA-003**: The 404, Privacy, and Terms pages and the footer MUST work without horizontal scrolling and without zooming at widths of 360px, 390px, 768px, 1024px, and 1440px, with tap targets of at least 44×44 CSS px on touch widths.
- **FR-QA-004**: An automated check MUST verify every existing page for horizontal overflow at the same widths. This check is verification-only: if an existing page fails, the implementing agent MUST report it to Vaz as a separate finding and MUST NOT modify the existing page within this feature (FR-GEN3-001).

### Analytics (US5)

- **FR-AN-001**: Every page MUST report page views to Plausible (EU-hosted), per the brief's §12 Tooling table.
- **FR-AN-002**: Analytics MUST NOT set cookies or use browser storage to identify visitors, and the site MUST NOT show a cookie or consent banner (brief §B8: "Plausible live; no cookie banner").
- **FR-AN-003**: Page views MUST be reported only from the production domain; local builds and preview channels MUST NOT send data to the production dashboard.
- **FR-AN-004**: Analytics MUST load without blocking page rendering, and its failure or blocking MUST have no visible or functional effect on any page (including the Home flip cards).
- **FR-AN-005**: Only page views are tracked in this feature. Custom events (CTA clicks, outbound links, form events) are out of scope.

### Key Entities

- **PageMeta**: Per-page document metadata. Attributes: `route`, `title` (existing pages: read-only, unchanged), `description`, `canonicalUrl`, `indexable` (false only for the not-found page). One per public page.
- **SocialPreview**: Site-wide defaults for link previews. Attributes: `siteName` ("Orbolo"), `imagePath`, `imageAlt`, `imageWidth`/`imageHeight` (1200/630), `cardType` (large image).
- **LegalDocument**: A carried-over legal page. Attributes: `kind` (privacy | terms), `sourceUrl`, `fetchedOn`, `sourceLastUpdated` (optional), `body` (structured text), `approved` (boolean – gates shipping per FR-LEG-007), `reviewNotes` (the FR-LEG-005 list).
- **FooterLink**: Attributes: `label` ("Privacy" | "Terms"), `href`, `rendered` (true only when the target LegalDocument ships).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A before/after visual comparison of Home, Invest, Beef, Land, and Contact at 390px and 1440px shows zero differences above the new footer.
- **SC-002**: 100% of public pages have a unique title and a unique description; 0 duplicates across the site.
- **SC-003**: Sharing any public page URL on LinkedIn produces a preview card with the page's own title, description, and the Orbolo image in 100% of pages tested.
- **SC-004**: 100% of requests for non-existent URLs return the branded not-found page with a 404 status.
- **SC-005**: `/robots.txt` and `/sitemap.xml` are both reachable, and the sitemap lists exactly the shipped public pages (currently 5, rising to 7 when Privacy and Terms ship) and no others.
- **SC-006**: 0 favicon, manifest, or social-image requests return an error.
- **SC-007**: 0 images across the site lack an alt attribute (automated check).
- **SC-008**: 0 pages scroll horizontally at any of the five defined widths (automated check).
- **SC-009**: Browsing the site sets 0 cookies and shows 0 consent banners; production page views appear in the analytics dashboard within minutes of a visit.
- **SC-010**: Privacy and Terms each have a recorded source URL and fetch date and an approved review list before going live; 0 lines of legal text are written from scratch.
- **SC-011**: The project's single verification command stays green with every requirement above covered by at least one test (Constitution Principle II).

## Assumptions

- The Plausible account and the site registration in it are provided by Vaz/Orbolo; the implementing agent does not create accounts. Adding the analytics script, and any tooling used to generate the sitemap or favicon formats, is a dependency that MUST be justified in `plan.md` (Constitution Principle V).
- The live `orbolo.com` has a privacy policy and terms page (typical for its hosting platform); if not, FR-LEG-004 applies. The implementing environment may not be able to reach `orbolo.com` directly (see 002's Content Sources method note); a reachable fetch method is a planning decision, not a content decision.
- The existing `favicon.svg` (a solid `#516b3e` circle) remains the site's icon; replacing it with the Orbolo logo would be a visible design change and is not part of this feature.
- The shared social-preview image is a new asset but not a visible change to any page, so it does not break the as-is freeze.
- Imprint / legal notice ("Imprint" in the brief's footer list) is not in the supplied keys and is out of scope; so are the brief's other footer items (Glossary, The Opportunity, Data room, Contact, Orbolo Bridge, Blog, newsletter, LinkedIn, Instagram) – they are added to the footer only when those pages or accounts exist, in their own features.
- Out of scope, per the Key Selection table: CTA above the fold, sticky mobile CTA, loading states, form error states, thank-you page, cookie banner, real contact address. Also out of scope: Lighthouse ≥ 90 targets, 301 redirects from old URLs and domains, hreflang/multi-language SEO, structured data (schema.org), and any change to Contact beyond its document metadata and sitemap entry.
