# Design Map

## Spacing Scale
8px, 12px, 16px, 24px, 32px, 40px, 80px, 96px — base unit 8px, no single ratio between steps

## Font Hierarchy
- h1: 48px / 400 / Trebuchet MS
- h2: 30px / 400 / Trebuchet MS
- h3: 24px / 400 / Trebuchet MS
- body: 18px / 400 / Helvetica Neue, max-width 672px
- eyebrow label: 14px / 600 / Arial Narrow, uppercase

## Color Palette
- Background: `#F8F4E9` (68.6% of sampled surface)
- Text/fill: `#516B3E` (31.4% of sampled surface)
- Text-on-fill: `#F8F4E9`
- Accent (interaction-only): `#BFD55D` — 0% of resting-state surface; appears only on hover and one flip-revealed border

## Image Ratios
- Hero background: full-bleed, ~3.2:1 visible crop
- Logo: 2.26:1
- Photographed audience card (Landowners): 1.00:1
- Placeholder audience cards (Investors, Buyers): flat `#516B3E` fill, no photo rendered despite valid image files

## Component Tokens
- Radius: 16px (cards) / pill (buttons) — no intermediate value
- Shadow: `rgba(0,0,0,0.1) 0px 1px` — single layer, PathCard faces only, near-imperceptible
- Grid: 3 columns, 32px gutter, fixed 352px track width (`ul.path-grid`)
- Motion: `transform 0.6s ease` (PathCard flip), respects `prefers-reduced-motion`; one stray `transition: all` also present in the render tree
- Focus: `:focus-visible` confirmed in use site-wide

---

# Taste DNA

### Accent-at-Interaction-Only
- **Trigger**: A third brand color (`#BFD55D`) was approved for use, but it measures 1.48:1 against the cream background — unreadable as a resting fill or text color.
- **Decision**: Confined it entirely to moments the visitor causes (a button's hover fill, a card's flip-revealed border) over using it anywhere in the page's idle state.
- **Reason**: A color that only appears because you did something reads as feedback, not decoration — it confirms the action registered without ever asking anyone to read text on a 1.48:1 background.
- **Evidence**: 0% static-area presence for `#BFD55D` in the DOM color sample; the token exists in `global.css` but never surfaces in a resting-state snapshot.

### Two-Radius System
- **Trigger**: Needing to distinguish "this is a container" from "this is an action" across dozens of repeated components.
- **Decision**: Every rounded corner is exactly 16px or a full pill over a graduated radius scale that could soften different components differently.
- **Reason**: Two shapes are enough vocabulary to be instantly legible without thinking; a third intermediate radius would ask the eye to classify a distinction nobody needs.
- **Evidence**: `effects.radii` — 16px (9×) and pill/`9999px` (6×) are the only two values across the whole sampled tree.

### Single Weight Pair
- **Trigger**: A page with 6 distinct font sizes (48px→14px) already had plenty of hierarchy machinery available from size alone.
- **Decision**: Exactly two font weights (400, 600) for the entire page over a fuller ladder that would let size, weight, and color all carry hierarchy independently.
- **Reason**: Stacking weight variation on top of an already-wide size range multiplies the number of "looks" a reader has to parse as meaningfully different; two weights keeps emphasis legible at a glance.
- **Evidence**: `weightDistribution` — 400 (24×) everywhere else, 600 (9×) used only for the 3 uppercase eyebrow labels (INVESTORS/BUYERS/LANDOWNERS).

### Alignment as Mode-Switch
- **Trigger**: The page mixes two reading modes — "here is one statement to receive" (hero) and "here are three things to compare" (the audience cards).
- **Decision**: Center-aligned every full-bleed, singular block (hero copy, section heading, footer) but left-aligned everything living inside a bounded card, over picking one alignment site-wide.
- **Reason**: Centering signals "there's nothing to scan, just read this," while left-alignment signals "this is a list item, compare it to its neighbors" — the alignment itself tells the visitor which mental mode to switch into before reading a word.
- **Evidence**: Hero/heading/footer text-align center; PathCard title/description text-align left — confirmed in both the DOM sample and the screenshot.
