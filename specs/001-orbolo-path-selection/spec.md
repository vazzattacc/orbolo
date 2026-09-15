# Feature Specification: Orbolo Website — Interactive Path Selection Experience

**Feature Branch**: `001-orbolo-path-selection` *(placeholder — confirm against actual branch naming convention before running `/speckit-specify`)*

**Created**: 2026-09-13

**Status**: Draft

**Input**: User description: "Build a website for Orbolo where the first interaction is an immersive, gamified 'choose your path' experience. Instead of a traditional homepage, the landing experience presents several possible paths/products/services within the Orbolo ecosystem (El Tapir, Orbolo Bridge, Verdant, Ganadería a Pasto, and a business-facing meat-purchasing path), each represented by a card with image, title, description and interactive states. Selecting a card guides the user into the corresponding section. The experience must follow a provided moodboard, be reusable/data-driven rather than hardcoded per path, support mouse/keyboard/touch, be responsive, accessible, and keep content, presentation and interaction cleanly separated."

## Clarifications

### Session 2026-09-14

- Q: When the "Business/Meat" path launches with its content still incomplete, should its card be visible on the selection screen (placeholder/"coming soon") or hidden entirely until finished? → A: Hidden entirely until content is finalized — the grid renders only the paths with complete configuration.
- Q: Is a path's "destination" always an internal route within the Orbolo Next.js site, or can some paths point to a different domain/subdomain? → A: All destinations are internal routes within this Next.js site; no external redirects.
- Q: If a path card's image fails to load, what should the card show instead of a broken image icon? → A: A shared branded fallback background (moodboard color/texture) with title/description still visible and the card still selectable.
- Q: When a visitor selects a path, is the transition a real URL navigation (browser back returns to selection) or an in-page state/overlay change with no URL change? → A: Real URL navigation — each destination is its own route/page; back button returns to the selection screen.
- Q: Does SC-004 need a numeric engagement/conversion target now, or should it be dropped for this phase given no business baseline exists? → A: Drop SC-004's numeric target for this phase — success is defined by SC-001–SC-003 only; analytics instrumentation is out of scope here.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and select a path (Priority: P1)

A first-time visitor lands on the Orbolo website and, instead of a conventional homepage, is presented with the set of available paths (El Tapir, Orbolo Bridge, Verdant, Ganadería a Pasto, Business/Meat) as visually prominent cards. The visitor reads each card's title and short description, picks the one that matches what they're looking for, and is guided into that path's corresponding section.

**Why this priority**: This is the entire premise of the project — without it there is no "choose your path" experience, just a list of links. It is the smallest slice that already delivers the core value: a visitor identifying and reaching the right part of the Orbolo ecosystem through an intentional, branded selection moment rather than generic navigation.

**Independent test**: Can be fully tested by loading the landing screen, confirming all configured paths render as cards with image + title + description, selecting one with a mouse click, and confirming the user is transitioned into the correct destination section. Delivers value even before responsive polish, animation refinement, or full accessibility work is layered on.

**Acceptance scenarios**:

1. **Given** a first-time visitor arrives at the Orbolo website, **When** the page finishes loading, **Then** they see a path-selection screen with one card per configured path (not a traditional homepage).
2. **Given** the visitor is viewing the path-selection screen, **When** they click/tap a card (e.g. "Verdant"), **Then** the site transitions them into that path's corresponding section ("Verdant"), with a transition that communicates progression rather than an abrupt page jump.
3. **Given** a path is added or removed in the data configuration, **When** the selection screen is reloaded, **Then** the number and content of displayed cards changes accordingly, with no need to modify the card component's code.

---

### User Story 2 - Fully keyboard- and touch-accessible selection (Priority: P2)

A visitor who cannot or does not use a mouse — using keyboard navigation, a screen reader, or a touch device — needs to be able to browse and select a path with the same clarity and completeness as a mouse user, including visible focus states and no interaction that depends exclusively on hover.

**Why this priority**: The spec explicitly requires keyboard, touch, and non-hover-dependent interaction, and treats accessibility as a first-class requirement, not an afterthought. It's independently valuable and testable without waiting for final visual/animation polish, but it depends on Story 1's card structure existing first.

**Independent test**: Can be tested by navigating the entire path-selection screen using only Tab/Shift+Tab/Enter/Space, confirming every card is reachable and selectable, that focus states are visible at every step, and that the same flow works via touch tap on a mobile device — all without ever triggering a mouse hover event.

**Acceptance scenarios**:

1. **Given** a visitor navigates using only a keyboard, **When** they press Tab repeatedly, **Then** focus moves through each path card in a logical, visible order, and **When** they press Enter or Space on a focused card, **Then** that path is selected just as it would be with a mouse click.
2. **Given** a visitor uses a touch device, **When** they tap a card, **Then** the path is selected correctly without requiring any prior hover gesture.
3. **Given** a visitor has the system's "reduced motion" preference enabled, **When** they interact with the selection screen, **Then** the transition animations are reduced or simplified in accordance with that preference.

---

### User Story 3 - Responsive experience across devices (Priority: P2)

A visitor on desktop, tablet, or mobile needs the path-selection experience to adapt meaningfully to their viewport — not simply shrink the desktop layout — while keeping readability, touch targets, image visibility, and clear hierarchy on smaller screens.

**Why this priority**: Explicitly called out as a "MUST" across all three device classes, and the spec explicitly forbids naive scaling. It's independently testable and shippable as its own increment once Story 1's base experience exists.

**Independent test**: Can be tested by loading the path-selection screen at desktop, tablet, and mobile breakpoints and confirming the card layout, touch target sizes, and content hierarchy are each purpose-fit for that viewport rather than a scaled clone of the desktop version.

**Acceptance scenarios**:

1. **Given** a visitor opens the site on a desktop viewport, **When** the selection screen loads, **Then** they see the card grid in a layout optimized for large screens.
2. **Given** a visitor opens the site on a mobile device, **When** the selection screen loads, **Then** they see an adapted layout (not a shrunk version of the desktop layout) that prioritizes readability, touch target size, image visibility, and clear hierarchy.
3. **Given** a visitor rotates their tablet from portrait to landscape, **When** the viewport changes, **Then** the card grid readjusts without breaking readability or interactive states.

---

### User Story 4 - Update path content without touching component code (Priority: P3)

A content owner needs to add, remove, or edit a path (title, description, image, destination, target audience) — including finalizing the still-TBD Business/Meat path — purely by editing configuration/content data, without modifying the `PathCard` or `PathGrid` component logic.

**Why this priority**: Explicitly required by the "CMS-friendliness" and "separation of concerns" sections, and directly unblocks finalizing Path 5, which is currently a placeholder. Lower priority than the user-facing stories because it's an internal/operational capability rather than something an end visitor experiences directly.

**Independent test**: Can be tested by editing only the path configuration data (e.g. adding a 6th path or finalizing Path 5's title/image/destination) and confirming the change appears correctly on the site with zero edits to component source files.

**Acceptance scenarios**:

1. **Given** a content editor updates a path's title, image, or destination in the data configuration, **When** the site reloads, **Then** the corresponding card reflects the change with no modification to the `PathCard` component.
2. **Given** the "Business/Meat" path still has its name and destination pending, **When** the editor fills in those fields in the configuration, **Then** the card moves from placeholder state to final state with no code changes.

---

### Edge Cases

- If a card's image fails to load (broken URL, missing asset), the card falls back to a shared branded background (moodboard color/texture) and remains fully selectable, with title and description still visible (resolved — see Clarifications).
- How does the grid behave with fewer than 5 configured paths, or more than 5 (e.g. a sixth path added in the future)?
- The "Business/Meat" path stays hidden from the grid entirely while its fields are incomplete (resolved — see Clarifications); it does not block deployment of the other paths.
- How does the system handle a rapid double selection (double-click/double-tap) during the transition to the destination section?
- Since each destination is a real route (resolved — see Clarifications), the system MUST provide a non-JS-dependent navigation path (a real anchor `href` per card) so selection still works with JavaScript disabled, even though the animated transition itself requires JS.
- How does the experience behave on slow connections, given that each card depends on a prominent image?
- Since selection is a real URL navigation (resolved — see Clarifications), pressing the browser "back" button from a destination returns the visitor to the selection screen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present, as the site's first interaction, a path-selection screen instead of a traditional homepage.
- **FR-002**: The system MUST represent each path in the Orbolo ecosystem as a visually prominent card that includes an image, title, short description, and an interactive hover/focus state.
- **FR-003**: The system MUST follow the visual language of the provided moodboard (typography, color palette, visual hierarchy, mood, spacing/composition, and overall art direction), and MUST avoid introducing colors, fonts, or styles that conflict with it. *(See the Assumptions note on the moodboard's location.)*
- **FR-004**: The system MUST guide the user, after selecting a card, into the corresponding section/product/service, with a transition that communicates progression ("enters the ecosystem → sees the paths → identifies their objective → selects → progresses").
- **FR-005**: The system MUST implement the cards as a reusable, generic `PathCard` component, with no business logic specific to any individual path (El Tapir, Verdant, Orbolo Bridge, etc.).
- **FR-006**: The system MUST generate the set of cards from configuration data (conceptual structure `PathCard { id, title, description, image, destination, targetAudience }`), not via duplicated UI per path.
- **FR-007**: The system MUST support mouse, keyboard, and touch/mobile interaction for navigating and selecting a path.
- **FR-008**: The system MUST display visible hover, focus, and selected/active states for each card.
- **FR-009**: No interaction MUST depend exclusively on hover (an equivalent keyboard and touch path must exist).
- **FR-010**: The system MUST adapt the card layout to different viewports (desktop, tablet, mobile) without simply scaling the desktop layout when doing so would harm usability.
- **FR-011**: On mobile, the system MUST prioritize readability, touch target size, image visibility, clear hierarchy, and simple path selection.
- **FR-012**: The system MUST keep content (titles, descriptions, images, destinations) separate from presentation logic, such that images are not hardcoded or coupled to each card's UI implementation.
- **FR-013**: The system MUST allow any path's image, title, description, or destination to be replaced by modifying only the configuration/data, with no changes to component code.
- **FR-014**: The system MUST use semantic interactive elements (not `div`s with `onClick` and no equivalent semantics) so that each card is accessible.
- **FR-015**: The system MUST provide appropriate alt text for each card's image.
- **FR-016**: The system MUST maintain sufficient color contrast and MUST NOT communicate information (e.g. selected state) through color alone.
- **FR-017**: The system MUST respect the user's operating system/browser "reduced motion" preference in transition animations.
- **FR-018**: The system MUST support the "Business/Meat" path as one more configuration entry. While its name, description, image, and destination remain pending, the system MUST exclude it from the rendered `PathGrid` (the grid displays only entries with complete, valid configuration) rather than showing a placeholder card; once its fields are filled in, it MUST appear automatically with no code changes.
- **FR-019**: Images across the different cards do NOT need to share the same type of landscape or composition. Images MUST be authentic photographs of Paraguay, and, given that Paraguayan terrain is predominantly flat/low-relief, the system MUST NOT force uniform terrain type (e.g. imposing mountainous landscapes) across paths. Visual coherence with the moodboard must come from consistent photographic treatment (color palette, framing, tone), not from forced landscape similarity.
- **FR-020**: Each path's long-form text (description and any extended copy beyond the short title) MUST be loaded from an external data source, decoupled from component code. In this initial phase, that source MUST be a JSON configuration file versioned in the repository. The architecture MUST isolate access to that data (e.g. behind a data interface/service) so that source can be replaced in the future by a Firebase database with no structural changes to `PathCard` or `PathGrid`.
- **FR-021**: If a path card's configured image fails to load, the system MUST render a shared branded fallback background in its place (not a broken-image icon), keeping the card's title, description, and selectability fully intact.
- **FR-022**: Every path's `destination` MUST resolve to an internal route within this site; the selection-to-destination transition MUST NOT perform an external/cross-domain redirect.
- **FR-023**: Each path card MUST be a real link (a semantic anchor with a real `href` to its destination route), so selecting a path is a genuine navigation: the browser "back" button returns the visitor to the selection screen, and selection remains functional (without the animated transition) if JavaScript is disabled.

### Non-goals *(mandatory)*

- Hardcoding image URLs or coupling visual assets directly to each card's implementation — explicitly excluded to keep the system CMS-friendly.
- Any interaction depending exclusively on hover — excluded to avoid breaking keyboard/touch accessibility.
- A "conventional video game" aesthetic or feel — gamification must be subtle and sophisticated, not literal.
- Simply scaling the desktop layout to produce the mobile version, when doing so would harm usability.
- Finalizing, at this stage, the definitive name, description, image, and destination for the "Business/Meat" path — left as pending configuration, not a decision of this spec.
- Redesigning the base components (`PathCard`, `PathGrid`) every time the path ecosystem changes — the architecture must absorb those changes via data.
- Forcing images across paths to share the same type of landscape or terrain (e.g. mountainous) — they must be authentic photographs of Paraguay, whose terrain is predominantly flat.
- Coupling each path's long-form text to component code, or assuming the current data source (JSON) is permanent — it must stay isolated to allow migrating to Firebase without touching the UI.
- Analytics/engagement instrumentation (event tracking, conversion dashboards, or a numeric time-to-selection target) — no baseline exists yet; this is deferred to a future feature once real traffic data is available.

### Key Entities *(include if feature involves data)*

- **PathCard**: Represents a selectable path in the Orbolo ecosystem. Attributes: `id`, `title`, `description`, `image` (replaceable reference, not coupled to the UI), `destination` (an internal route/section of this site — never an external URL), `targetAudience`.
- **Path Configuration (collection)**: The ordered list of `PathCard` entries feeding the `PathGrid`; it is the source of truth for content, decoupled from presentation and interaction logic, and is what a content editor modifies to add/remove/edit paths (currently includes: El Tapir, Orbolo Bridge, Verdant, Ganadería a Pasto, Business/Meat). In this initial phase it lives in a JSON file versioned in the repository; access to this data must sit behind a layer/service that allows that source to be replaced by a Firebase database later with no changes to UI components.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the paths defined in the configuration (the current 5, and any added later) render correctly on the selection screen with no changes to the `PathCard` component's code.
- **SC-002**: The path-selection screen is fully operable using only the keyboard (Tab/Shift+Tab/Enter/Space), reaching every destination without using a mouse or touch.
- **SC-003**: The card layout is validated as "adapted" (not scaled) across at least the three reference breakpoints (desktop, tablet, mobile), verified visually against readability, touch-target-size, and hierarchy criteria.
- **SC-004**: *(Dropped for this phase — resolved, see Clarifications. No engagement/conversion baseline exists yet; success for this feature is fully defined by SC-001–SC-003. Analytics instrumentation and a numeric engagement target are explicitly out of scope here and may be defined as a separate future feature once real traffic data exists.)*

## Assumptions

- The moodboard referenced as the design reference was not included as an attached file in this round; it is assumed to be available in the project's own reference folder (e.g. `.specify/` or `references/`), as indicated when this document was generated. The planning agent MUST locate it there before fixing design tokens (typography, palette, spacing).
- The five listed paths (El Tapir, Orbolo Bridge, Verdant, Ganadería a Pasto, Business/Meat) are the initial launch set; the architecture must support adding or removing paths purely via configuration, without assuming the number "5" is fixed.
- The "Business/Meat" path is a deliberate placeholder: its final name, description, image, and destination will be defined later and must not be hardcoded anywhere in the code. Until that data is complete, the path-selection screen launches with 4 visible cards, not 5; the "Business/Meat" entry appears automatically once its configuration is filled in.
- **Resolved**: each path's "destination" is an internal route/section of this Orbolo Next.js site — no path redirects to an external domain or subdomain. This keeps the selection-to-destination transition a consistent client-side animated navigation for every path.
- **Resolved**: the technical stack is fixed by the project constitution (`.specify/memory/constitution.md`, Additional Constraints): TypeScript (strict) · Next.js App Router · React · Tailwind CSS · Framer Motion · pnpm · Vitest · Playwright. This satisfies the earlier open question on framework choice and unblocks `/speckit-plan`.
- **Resolved**: the content source for long-form text (and, by extension, the rest of `PathCard`'s fields) will be a JSON configuration file versioned in the repository during this initial phase. The data-access layer must be designed so that JSON can be replaced by a Firebase database in a later phase with no changes required to `PathCard` or `PathGrid` — the earlier `[NEEDS CLARIFICATION]` on content source no longer applies.
- The moodboard governs art direction (typography, color palette, photographic treatment, composition), but does NOT require images across paths to share the same type of landscape: photographs must be representative of Paraguay, whose terrain is predominantly flat/low-relief, so a mountainous landscape must not be assumed or imposed as a common visual reference.
