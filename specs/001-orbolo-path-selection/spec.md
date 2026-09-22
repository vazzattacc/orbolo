# Feature Specification: Orbolo Website — Home Page Audience-Path Selector

**Feature Branch**: `001-orbolo-path-selection` *(unchanged — this is a converged revision of the same ticket, not a new feature; see Scope Change below)*

**Created**: 2026-09-13

**Status**: Draft

**Input**: User description (revised 2026-09-19 against the client's builder brief): "The Home page opens with a brief hero/introduction. Roughly half a scroll down the page, an audience-selection section presents three cards — Investors, Buyers, Landowners — each styled as an intentional, premium, lightly gamified choice rather than a plain nav link. Selecting a card's front face flips it to reveal an expanded description and a 'Discover more' action; selecting the flipped card again (other than 'Discover more') flips it back. Activating 'Discover more' guides the visitor into that audience's corresponding section: Investors → Invest (Remote Rancher), Buyers → Beef, Landowners → Land. The cards must be reusable and data-driven (not hardcoded per audience), support mouse/keyboard/touch, be responsive, accessible, and keep content, presentation and interaction cleanly separated."

## Scope Change — 2026-09-19

The client's builder brief (`orbolo-website-brief.md`) became available after this spec's first draft and its `/speckit-clarify` session. It changes the feature's premise significantly enough to record as an explicit delta (Constitution Principle VII) rather than a silent rewrite:

- **Removed**: the "5 equal paths replace the homepage entirely" premise (El Tapir, Orbolo Bridge, Verdant, Ganadería a Pasto, Business/Meat as a full-screen landing takeover).
- **Removed as top-level cards**: El Tapir and Ganadería a Pasto (they are sub-pages under **Land** per the brief's site map, not peers of Invest/Beef/Land) and Orbolo Bridge (a separate top-level nav/footer destination for education and non-profit activity, outside this selector).
- **Renamed**: Verdant → **Remote Rancher**, retired per the brief's explicit non-negotiable ("Product name: Remote Rancher. Verdant is retired.").
- **Resolved**: the former "Business/Meat" placeholder is now the fully-specified **Beef** page from the brief.
- **Added**: the selection cards are now a *section within* the real Home page (hero/intro first, cards roughly half a scroll down), not a replacement for it.
- **Added**: the three cards are audience-based, matching the brief's three funnels (§5): **Investors → Invest (Remote Rancher)**, **Buyers → Beef**, **Landowners → Land**.
- **Added**: selection is now two-step rather than a direct click-to-navigate — a card flips to reveal detail plus a "Discover more" action, which is what actually navigates. See Clarifications, second entry.
- **Resolved (stack)**: the project's technical stack changes from Next.js/React to **Astro**, per the brief's explicit technical stack (§11). See the project constitution for the full amendment.
- **Kept, as a scoped exception**: this feature's card configuration stays a versioned **JSON file with a Firebase-swap path**, as originally planned — a deliberate, narrower choice for this one component's data, independent of whatever CMS (Sanity/Payload, per the brief) the wider site adopts for its general content model. See Assumptions.
- **Still open, not decided in this pass**: whether the "gamification" framing needs softening to match the brief's "serious trading house, not a startup" tone (§B1); i18n/localization requirements for this section (the brief requires EN/ES/DE site-wide, not yet reflected below); and whether "journey"-style language (banned from site copy per §B2.6) needs to be scrubbed from this section's own copy once real copy is written.
- **Resolved 2026-09-19**: concrete typography (HeliosExtC / Suisse Int'l / Verbena / Roslindale Cyr Deck Narrow) and colors (`#516b3e` green, `#f8f4e9` whitish) are now fixed in the constitution, superseding both the placeholder moodboard reference and the brief's own §B1 suggestions. See FR-003.

## Clarifications

### Session 2026-09-19

- Q: Does the gamified path-selection concept still replace the homepage entirely, per the original raw spec, or does it need to be reconciled with the brief's actual Home page (hero, loop diagram, trust strip, audience cards, etc.)? → A: Reconciled — kept as a section, not a replacement. Home opens with a quick hero/intro; the card-selection section appears roughly half a scroll down the page.
- Q: How many cards, and which audiences/destinations, given the brief's real site map? → A: Three cards, matching the brief's three funnels: Investors → Invest (Remote Rancher), Buyers → Beef, Landowners → Land. El Tapir, Ganadería a Pasto, Orbolo Bridge, and Verdant are dropped as top-level cards (see Scope Change).
- Q: The brief mandates Astro; the constitution committed to Next.js/React. Which governs going forward? → A: Astro governs. The constitution is amended accordingly (v1.1).
- Q: The brief's project-wide content plan is Sanity/Payload CMS, with Firebase reserved for the future investor portal; this feature's spec assumed JSON now → Firebase later for its own content. Align with the brief's CMS plan, or keep the original plan? → A: Keep the original plan for this feature specifically — its card configuration stays a JSON file with a documented Firebase-swap path. This is a scoped exception, not a statement about the site's general CMS, which remains an open, separate decision.
- Q: Does selecting a card navigate immediately, or does it reveal more first? → A: It flips (animated) to reveal an expanded description and a "Discover more" action. Only activating "Discover more" navigates. Selecting the flipped card again anywhere other than "Discover more" flips it back to its front-facing state.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and select an audience path (Priority: P1)

A visitor lands on the Orbolo Home page and sees a brief hero/introduction first. Scrolling down roughly half the page, they reach an audience-selection section presented as three visually prominent cards — Investors, Buyers, Landowners. The visitor reads each card's title and short description, and selecting a card flips it to reveal an expanded description and a "Discover more" action; activating that action guides them into that audience's corresponding section (Invest, Beef, or Land).

**Why this priority**: This is the entire premise of the feature — without it, the Home page has no intentional, branded way to route a visitor by audience; it's just a page with links. It is the smallest slice that already delivers the core value: a visitor identifying and reaching the right part of the Orbolo site through a deliberate, on-brand selection moment.

**Independent test**: Can be fully tested by loading the Home page, confirming the hero/intro renders first, scrolling to confirm the three cards render with image + title + description, clicking a card to confirm it flips and reveals "Discover more", and confirming activating that action transitions the visitor to the correct destination (Invest, Beef, or Land). Delivers value even before responsive polish, animation refinement, or full accessibility work is layered on.

**Acceptance scenarios**:

1. **Given** a visitor arrives at the Orbolo Home page, **When** the page finishes loading, **Then** they see a brief hero/introduction as the first content, with no cards visible in the initial viewport.
2. **Given** the visitor scrolls down roughly half the page, **When** the audience-selection section comes into view, **Then** they see exactly three cards — Investors, Buyers, Landowners — each with an image, title, and short description on its front face.
3. **Given** the visitor is viewing the card section, **When** they click/tap a card's front face (e.g. "Buyers"), **Then** the card flips with an animated transition to its back face, revealing an expanded description of that path and a "Discover more" action.
4. **Given** a card is flipped to its back face, **When** the visitor clicks/taps the card again anywhere other than "Discover more", **Then** it flips back to its original front-facing state.
5. **Given** a card is flipped to its back face, **When** the visitor clicks/taps "Discover more", **Then** the site transitions them into that audience's corresponding section (e.g. "Beef"), with a transition that communicates progression rather than an abrupt page jump.
6. **Given** a card's underlying configuration is added, removed, or edited, **When** the Home page is reloaded, **Then** the rendered cards change accordingly, with no need to modify the card component's code.

---

### User Story 2 - Fully keyboard- and touch-accessible selection (Priority: P2)

A visitor who cannot or does not use a mouse — using keyboard navigation, a screen reader, or a touch device — needs to be able to browse, flip, and select an audience path with the same clarity and completeness as a mouse user, including visible focus states and no interaction that depends exclusively on hover.

**Why this priority**: The spec explicitly requires keyboard, touch, and non-hover-dependent interaction, and treats accessibility as a first-class requirement, not an afterthought. The two-step flip-then-discover interaction makes this more consequential, not less: it's independently valuable and testable without waiting for final visual/animation polish, but it depends on Story 1's flip/discover structure existing first.

**Independent test**: Can be tested by navigating the card section using only Tab/Shift+Tab/Enter/Space, confirming every card can be flipped open, that "Discover more" becomes reachable and activatable once flipped, that a flipped card can be flipped back, that focus states are visible at every step, and that the same flow works via touch tap on a mobile device — all without ever triggering a mouse hover event.

**Acceptance scenarios**:

1. **Given** a visitor navigates using only a keyboard, **When** they press Tab to reach a card and press Enter or Space, **Then** the card flips open to its back face and focus moves to "Discover more", so a subsequent Enter press navigates to that destination.
2. **Given** a card is flipped open via keyboard, **When** the visitor reactivates its flip control (or presses Escape), **Then** it flips back to its front-facing state and focus returns to that control.
3. **Given** a visitor uses a touch device, **When** they tap a card, **Then** it flips open to reveal its back face and "Discover more" without requiring any prior hover gesture, and tapping "Discover more" navigates.
4. **Given** a visitor has the system's "reduced motion" preference enabled, **When** they flip a card or activate "Discover more", **Then** the flip and transition animations are reduced or simplified in accordance with that preference.

---

### User Story 3 - Responsive experience across devices (Priority: P2)

A visitor on desktop, tablet, or mobile needs the card section to adapt meaningfully to their viewport — not simply shrink the desktop layout — while keeping readability, touch targets, image visibility, and clear hierarchy on smaller screens.

**Why this priority**: Explicitly called out as a "MUST" across all three device classes, and the spec explicitly forbids naive scaling. The brief additionally establishes mobile-first as a project-wide principle (§3). It's independently testable and shippable as its own increment once Story 1's base experience exists.

**Independent test**: Can be tested by loading the Home page at desktop, tablet, and mobile breakpoints and confirming the card layout, flip interaction, touch target sizes, and content hierarchy are each purpose-fit for that viewport rather than a scaled clone of the desktop version.

**Acceptance scenarios**:

1. **Given** a visitor opens the site on a desktop viewport, **When** they reach the card section, **Then** they see the three cards in a layout optimized for large screens.
2. **Given** a visitor opens the site on a mobile device, **When** they reach the card section, **Then** they see an adapted layout (not a shrunk version of the desktop layout) that prioritizes readability, touch target size, image visibility, and clear hierarchy, and the flip interaction remains comfortable at that size.
3. **Given** a visitor rotates their tablet from portrait to landscape, **When** the viewport changes, **Then** the card layout readjusts without breaking readability, the flip interaction, or focus states.

---

### User Story 4 - Update card content without touching component code (Priority: P3)

A content owner needs to add, remove, or edit an audience card (title, description, image, destination, target audience) purely by editing configuration/content data, without modifying the `PathCard` or `PathGrid` component logic.

**Why this priority**: Explicitly required by the "CMS-friendliness" and "separation of concerns" sections carried over from the original spec. Lower priority than the user-facing stories because it's an internal/operational capability rather than something an end visitor experiences directly.

**Independent test**: Can be tested by editing only the card configuration data (e.g. adjusting the Beef card's title or image) and confirming the change appears correctly on the site with zero edits to component source files.

**Acceptance scenarios**:

1. **Given** a content editor updates a card's title, image, or destination in the data configuration, **When** the site reloads, **Then** the corresponding card reflects the change with no modification to the `PathCard` component.
2. **Given** a fourth audience card were ever added in the future, **When** it is added purely via configuration, **Then** it renders correctly alongside the existing three, flip interaction included, with no component code changes.

---

### Edge Cases

- If a card's image fails to load (broken URL, missing asset), the card falls back to a shared branded background (moodboard color/texture) and remains fully selectable, with title and description still visible (resolved — see FR-022).
- How does the layout behave if a card is temporarily removed from configuration (e.g. only 2 of the 3 cards configured)? Should the section always assume exactly three, or degrade gracefully to fewer?
- How does the system handle a rapid double interaction — double-click/double-tap on a card mid-flip, or on "Discover more" mid-transition?
- Since "Discover more" is a real route-bound link (resolved — see FR-023/FR-024), the system MUST keep it present and reachable in the DOM even without JavaScript, so navigation does not strictly depend on the flip animation succeeding, even though the flip presentation itself is a progressive enhancement.
- How does the experience behave on slow connections, given that each card depends on a prominent image?
- Since selection is a real URL navigation (resolved — see FR-024), pressing the browser "back" button from a destination returns the visitor to the Home page — does it also need to restore the visitor's prior scroll position (back at the card section, not back at the top)?
- What happens if a visitor never scrolls far enough to see the card section at all — is there any above-the-fold affordance (e.g. a scroll cue) hinting that it exists?
- Can more than one card be flipped open at the same time, or does opening one automatically flip back any other open card (an accordion-style behavior)?
- If a visitor flips a card open and then scrolls it out of view without acting, does it reset to its front-facing state, or stay flipped when they scroll back to it?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Home page MUST present a concise hero/introduction as its first content, and MUST NOT show the audience-selection cards within the initial viewport.
- **FR-002**: Approximately half a scroll down the Home page, the system MUST present an audience-selection section with exactly three cards (Investors, Buyers, Landowners), each including an image, title, and short description on its front face, with a visible hover/focus state.
- **FR-003**: The system MUST follow the project's design tokens — **Typography**: titles in HeliosExtC, body text in Suisse Int'l, quotes in Verbena, subtitles in Roslindale Cyr Deck Narrow (these four are referential — a similar-looking, free-license substitute MAY be used for any of them); **Colors**: `#516b3e` (green, primary accent) and `#f8f4e9` (whitish, primary background) — these two are fixed, not referential. All as set in the constitution (2026-09-19), and the system MUST avoid introducing colors outside this set without amending the constitution first. Card images (see FR-020–FR-022) serve a dual purpose: used directly on the live site and as design/style references, per the constitution's Assets note.
- **FR-004**: Selecting a card's front face (click/tap) MUST flip it, with an animated transition, to its back face, revealing an expanded description of that audience path and a "Discover more" action. The flip itself MUST NOT perform navigation.
- **FR-005**: Selecting a flipped card again, anywhere other than "Discover more", MUST flip it back to its front-facing state, reversing the flip animation.
- **FR-006**: Activating "Discover more" on a flipped card MUST navigate the visitor into that card's corresponding destination (Invest, Beef, or Land), with a transition that communicates progression rather than an abrupt page jump.
- **FR-007**: The system MUST implement the cards as a reusable, generic `PathCard` component, with no business logic specific to any individual audience (Invest, Beef, Land).
- **FR-008**: The system MUST generate the set of cards from configuration data (conceptual structure `PathCard { id, title, description, image, destination, targetAudience }`), not via duplicated UI per card. The same `description` value is used for both the front-face teaser and the back-face expanded text; "Discover more" is a fixed UI label, not per-card configuration data.
- **FR-009**: The system MUST support mouse, keyboard, and touch/mobile interaction for all three actions on a card: flipping it open, flipping it back, and activating "Discover more".
- **FR-010**: The system MUST display visible hover, focus, selected, and flipped-open states for each card, none of which is communicated by color alone.
- **FR-011**: No interaction MUST depend exclusively on hover (an equivalent keyboard and touch path must exist for flip-open, flip-back, and "Discover more").
- **FR-012**: The system MUST adapt the card layout to different viewports (desktop, tablet, mobile) without simply scaling the desktop layout when doing so would harm usability.
- **FR-013**: On mobile, the system MUST prioritize readability, touch target size, image visibility, clear hierarchy, and a simple flip/discover interaction.
- **FR-014**: The system MUST keep content (titles, descriptions, images, destinations) separate from presentation logic, such that images are not hardcoded or coupled to each card's UI implementation.
- **FR-015**: The system MUST allow any card's image, title, description, or destination to be replaced by modifying only the configuration/data, with no changes to component code.
- **FR-016**: The system MUST use semantic interactive elements so that each card is accessible: the flip trigger MUST be a real, keyboard-operable control (e.g. a `<button>` exposing its open/closed state via `aria-expanded`), since it toggles a UI state rather than navigating; "Discover more" MUST be a real anchor (`<a href>`) to its destination route, independent of the flip trigger.
- **FR-017**: The system MUST provide appropriate alt text for each card's image.
- **FR-018**: The system MUST maintain sufficient color contrast and MUST NOT communicate information (e.g. selected or flipped-open state) through color alone.
- **FR-019**: The system MUST respect the user's operating system/browser "reduced motion" preference: with it enabled, the flip MUST be near-instant or non-animated rather than a full animated flip, and the destination transition after "Discover more" MUST likewise be minimized.
- **FR-020**: Images across the three cards do NOT need to share the same type of landscape or composition. Images MUST be authentic photographs of Paraguay, and, given that Paraguayan terrain is predominantly flat/low-relief, the system MUST NOT force uniform terrain type (e.g. imposing mountainous landscapes) across cards. Visual coherence with the moodboard must come from consistent photographic treatment (color palette, framing, tone), not from forced landscape similarity.
- **FR-021**: Each card's long-form text (description and any extended copy beyond the short title) MUST be loaded from an external data source, decoupled from component code. This source MUST be a JSON configuration file versioned in the repository. The architecture MUST isolate access to that data (e.g. behind a data interface/service) so that source can be replaced in the future by a Firebase database with no structural changes to `PathCard` or `PathGrid`. *(This is a scoped exception for this feature's own configuration only — it does not imply the wider site's general content model uses JSON or Firebase; see Assumptions.)*
- **FR-022**: If a card's configured image fails to load, the system MUST render a shared branded fallback background in its place (not a broken-image icon), keeping the card's title, description, and flip/discover interaction fully intact.
- **FR-023**: Every card's `destination` MUST resolve to an internal route within this site; the "Discover more" navigation MUST NOT perform an external/cross-domain redirect.
- **FR-024**: "Discover more" MUST be a real semantic anchor with a real `href` to its destination route for every card, present in the DOM regardless of the card's flip/animation state, so navigation works via direct keyboard focus, assistive technology, and with JavaScript disabled — even though the flip presentation itself is a progressive enhancement that may depend on JS/CSS. The browser "back" button from a destination MUST return the visitor to the Home page.
- **FR-025**: The audience-selection section MUST be built as Astro component(s); the flip/disclosure interaction and "Discover more" navigation MUST be implemented as a minimal island, a native disclosure pattern (e.g. `<details>`), or a small client-side script — not by mounting a full application framework for this section alone — consistent with the brief's "plain HTML, islands only where needed" stack direction.

### Non-goals *(mandatory)*

- Replacing the Home page with the card-selection screen — the cards are a section that appears after the hero/intro, not a takeover of the landing experience.
- Navigating directly from a single click on a card's front face — selection is two-step (flip, then "Discover more"); see FR-004–FR-006.
- Hardcoding image URLs or coupling visual assets directly to each card's implementation — explicitly excluded to keep the system CMS-friendly.
- Any interaction depending exclusively on hover — excluded to avoid breaking keyboard/touch accessibility.
- A "conventional video game" aesthetic or feel — the flip should feel intentional and premium, not literally gamified. *(The brief's tone direction — "a serious trading house," "not a startup" — is noted as a still-open tension with this framing; see Scope Change.)*
- Simply scaling the desktop layout to produce the mobile version, when doing so would harm usability.
- Building the full page content for Invest, Beef, or Land — those destinations are separate features; this spec covers only the card-selector section that links to them.
- Redesigning the base components (`PathCard`, `PathGrid`) every time the audience set changes — the architecture must absorb such changes via data.
- Forcing images across cards to share the same type of landscape or terrain (e.g. mountainous) — they must be authentic photographs of Paraguay, whose terrain is predominantly flat.
- Coupling this feature's long-form text to component code, or treating its JSON data source as a statement about the wider site's CMS strategy — the two are independent decisions (see Assumptions).
- Making "Discover more" depend on JavaScript to exist or be reachable — it must be a real link present in the DOM regardless of script execution, even though the flip animation around it is a progressive enhancement.
- Persisting a card's flipped/open state across page loads, or between visitors — it is ephemeral UI state, not configuration data, and always resets to front-facing on load.
- Analytics/engagement instrumentation (event tracking, conversion dashboards, or a numeric time-to-selection target) — no baseline exists yet; deferred to a future feature.
- Localization/i18n for this section — not addressed in this revision; flagged as open in Scope Change.

### Key Entities *(include if feature involves data)*

- **PathCard**: Represents a selectable audience path on the Orbolo Home page. Attributes: `id`, `title`, `description` (used for both the front-face teaser and the back-face expanded text), `image` (replaceable reference, not coupled to the UI), `destination` (an internal route/section of this site — never an external URL), `targetAudience`. The "Discover more" label shown on the back face is a fixed UI string, not a `PathCard` attribute.
- **Path Configuration (collection)**: The ordered list of `PathCard` entries feeding the card section; it is the source of truth for content, decoupled from presentation and interaction logic, and is what a content editor modifies to add/remove/edit cards. Currently exactly three: **Investors → Invest (Remote Rancher)**, **Buyers → Beef**, **Landowners → Land**. El Tapir and Ganadería a Pasto are content within the Land destination, not separate entries here; Orbolo Bridge is a separate top-level site destination, outside this collection entirely. This configuration lives in a JSON file versioned in the repository; access to it must sit behind a layer/service that allows that source to be replaced by a Firebase database later with no changes to UI components.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the cards defined in the configuration (currently 3, and any added later) render correctly in the card section, flip interaction included, with no changes to the `PathCard` component's code.
- **SC-002**: The card section is fully operable using only the keyboard (Tab/Shift+Tab/Enter/Space) — flipping any card open, flipping it back, and reaching every destination via "Discover more" — without using a mouse or touch.
- **SC-003**: The card layout is validated as "adapted" (not scaled) across at least the three reference breakpoints (desktop, tablet, mobile), verified visually against readability, touch-target-size, and hierarchy criteria, with the flip interaction remaining comfortable at each.
- **SC-004**: *(Dropped for this phase. No engagement/conversion baseline exists yet; success for this feature is fully defined by SC-001–SC-003. Analytics instrumentation and a numeric engagement target are explicitly out of scope here and may be defined as a separate future feature once real traffic data exists.)*

## Assumptions

- **Resolved 2026-09-19**: the placeholder moodboard reference and the brief's own §B1 design suggestions are both superseded by the concrete typography and color tokens fixed in the constitution (HeliosExtC/Suisse Int'l/Verbena/Roslindale Cyr Deck Narrow; `#516b3e`/`#f8f4e9`) — see FR-003. The planning agent no longer needs to locate or reconcile a moodboard file for this feature.
- The three cards (Investors → Invest/Remote Rancher, Buyers → Beef, Landowners → Land) are the full initial set, matching the brief's three audience funnels (§5). The architecture must still support adding or removing cards purely via configuration, without assuming the number "3" is structurally fixed.
- **Resolved**: the technical stack is **Astro** (not Next.js/React), per the project constitution as amended 2026-09-19 to match the client's builder brief (§11): TypeScript (strict) · Astro · Tailwind CSS · pnpm · Vitest · Playwright. Animation is implemented via Astro's native View Transitions API or CSS transitions rather than Framer Motion, which requires a React runtime this stack no longer uses.
- **Resolved, scoped exception**: this feature's own card configuration stays a JSON file versioned in the repository, with the data-access layer isolated so it can be swapped for a Firebase database later, exactly as originally planned. This is explicitly a narrower choice for this one component's data — it is not a statement about the wider site's general content model, which the brief plans to run on a headless CMS (Sanity or Payload). That project-wide CMS decision remains open and unaffected by this feature.
- **Resolved**: each card's `destination` is an internal route/section of this Orbolo site — no card redirects to an external domain or subdomain. This keeps the "Discover more" navigation a consistent client-side animated transition for every card.
- The project's design tokens (typography, colors) govern the interface chrome, but do NOT require images across cards to share the same type of landscape: photographs must be representative of Paraguay, whose terrain is predominantly flat/low-relief, so a mountainous landscape must not be assumed or imposed as a common visual reference.
- Localization (English/Spanish/German, per the brief §13) is assumed to apply to this section eventually, but no i18n requirement is specified in this revision — flagged as an open item in Scope Change rather than silently assumed one way or the other.
- Cards flip independently: opening one does NOT automatically flip back any other open card. This is a default assumption, not something the user specified either way — flag if an accordion-style (only one open at a time) behavior is actually wanted.
- A flipped card does not persist its open/closed state across page reloads or across scroll-out/scroll-back-in — it always renders front-facing on load. This is a default assumption, not something the user specified either way.
- After a keyboard user flips a card open, focus moves automatically to "Discover more" (rather than requiring an extra Tab press), so the keyboard flow is flip-then-Enter rather than flip-then-Tab-then-Enter. This is a default assumption made for keyboard efficiency, not something the user specified.
