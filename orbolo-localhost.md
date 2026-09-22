# Design Map

## Spacing Scale
8px, 12px, 16px, 24px (dominant), 32px, 40px, 80px (section break) — base unit 8px

## Font Hierarchy
- Hero: 48px / 400 / Trebuchet MS
- H2: 30px / 400 / Trebuchet MS
- H3 (card title): 24px / 400 / Trebuchet MS
- Button: 16px / 400 / Helvetica Neue
- Eyebrow: 14px / 600 / Arial Narrow
- Teaser/body: 14px / 400 / Helvetica Neue

## Color Palette
- Background: `#F8F4E9`
- Text-primary / accent: `#516B3E`
- Text-on-accent: `#F8F4E9`
- Text-secondary: `#516B3E` @ 80% alpha
- No gray anywhere in the palette

## Image Ratios
- Native: 0.81:1 to 1.00:1 (varies per source photo)
- Rendered (card): 350:224 ≈ 1.56:1, uniform `object-cover` crop regardless of native ratio

## Component Tokens
- Radius: 16px (cards) / pill `9999px` (buttons) — no intermediate value
- Shadow: single layer, `rgba(0,0,0,0.1)`, ~2px blur — imperceptible next to the border
- Grid: 3 columns, 32px gutter, 1152px max-width
- Motion: `transform` only, 0.6s, `ease`; `prefers-reduced-motion` and `:focus-visible` both confirmed present

---

# Taste DNA

### Contrast Is a Reward, Not a Backdrop
- **Trigger**: Deciding how much of the palette's contrast to spend on the resting page versus the interaction.
- **Decision**: Chose flat, low-contrast green-on-cream everywhere over spending contrast anywhere before the flip.
- **Reason**: A visitor scanning three audience options shouldn't feel pulled toward one before reading it; the contrast payoff should arrive after commitment, as confirmation.
- **Evidence**: 2-color palette (80%/20% area split); shadows imperceptible (single-layer, 0.1 alpha); the flipped state is the only cream-on-green frame in the entire capture.

### Two Colors, No Escape Hatch
- **Trigger**: Needing to differentiate 3 audiences (Investors/Buyers/Landowners) visually.
- **Decision**: Chose the same 2 hex values for every card and state over a per-audience accent color.
- **Reason**: Three audiences inviting three brand colors is a common trap that turns a selector into a hierarchy by hue; staying inside 2 colors keeps all three paths reading as equally legitimate.
- **Evidence**: `accentCandidates` = the same 2 values across all cards; no audience-specific hue anywhere in `domData`.

### The Hero Argues Before It Shows
- **Trigger**: Opening a page about physical, photogenic things — cattle, pasture, land.
- **Decision**: Chose ~900px of pure typography on flat cream over an image-led, photo-background hero.
- **Reason**: A hero photo front-loads whose land/cattle you're looking at before the visitor has chosen an audience; withholding imagery until the card section means the first photo shown is already relevant to the path they're leaning toward.
- **Evidence**: Hero is `min-h-screen` of type only; `images.length === 3`, all `role: feature`, all inside cards; zero images above the fold.

### Containers Own Spacing, Elements Don't
- **Trigger**: Laying out 3 internally-complex cards (image, eyebrow, title, teaser, plus back-face description and two buttons).
- **Decision**: Chose `margin: 0` on every element plus `gap` on containers over per-element margin tuning.
- **Reason**: A page whose entire content is "3 identical cards, twice" needs the 3 cards to be provably identical — gap-only spacing makes drift between them structurally impossible rather than a matter of discipline.
- **Evidence**: `margin: 0px` on 7/7 sampled tags (section, h1, h2, h3, p, ul, button); `gap` present on `ul` and `section` instead.
