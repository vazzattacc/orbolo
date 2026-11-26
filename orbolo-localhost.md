# Design Map

Captured 2026-11-15 from `http://localhost:4321/`, `/beef` and `/contact` at 1440×900, after the 005 photo refresh. Replaces the 2026-10-02 analysis of the earlier cream design.

## Spacing Scale
- Base: `1em = max(13px, 0.96vw)` = 13.824px at 1440; every size and gap is an em multiple
- Gutter `--pad`: max(18px, 2.2vw) = 31.68px
- Common values: 12.44px (0.9em), 19.35px (1.4em), 22.12px (1.6em), 27.65px (2em), 49.77px (3.6em), 85.71px (6.2em, section padding), 102.3px (7.4em, split/band top padding)
- Method: `gap` on grid/flex containers; padding for section rhythm

## Font Hierarchy
- h1--xl: 63.59px (4.6em) / 700 / Orbolo Title, uppercase
- h1: 48.38px (3.5em) / 700 / Orbolo Title, uppercase
- h2: 37.32px (2.7em) / 700 / Orbolo Title, uppercase
- script tagline: 34.56px (2.5em) / 400 / Orbolo Script
- h3, card title: 33.18px (2.4em) / 400 / Orbolo Serif, uppercase
- strip word: 30.41px (2.2em) / 400 / Orbolo Serif, uppercase
- lede: 17.97px (1.3em) / 400 / Orbolo Text, max-width 34em
- copy: 14.93px (1.08em) / 400 / Orbolo Text, max-width 38em
- button label: 11.06px (0.8em) / 400, uppercase, 0.12em tracking
- caps label: 10.78px (0.78em) / 400, uppercase, 0.12em tracking; small 9.40px

## Color Palette
- Forest `#36472B`: every section background (77.6–99.5% of painted area)
- Paper `#FFFDF3`: body text, alternate headings
- Lime `#BFD55D`: alternate headings, current nav link, flags, hairlines, checked form controls, focus outline; fills only flip-card backs and hovered buttons
- Forest-light `#4A6342`, forest-deep `#263518`: collage squares, image fallback
- Photo shade: forest at 0.76 behind text, 0.90 behind normal-size lime text (nav strip), 0.06 elsewhere on the photo

## Image Ratios
- Photo hero: 3:2 on landscape screens, 2:3 crop on portrait screens; full bleed, min-height max(100svh, 44em)
- Split photo: 3:4 or 2:3, half width
- Band photo: 3:2 (16:10 crop where portrait source), full bleed
- Collage photo: 1:1
- Path-card thumbnail: 3:2

## Component Tokens
- Radius: 0px everywhere
- Shadow: one, `0 1.6em 2.4em -1.4em rgba(0,0,0,0.5)`, path-card photo only
- Hairline: 1.5px, lime (dividers at 35% opacity), paper at 55% on form inputs
- Button: 1.5px currentColor box, 4×4px dot either side, fill wipes up on hover
- Grid: hero 1.3fr / 1fr; editorial 1fr / 1fr with sticky heading; path cards 3 columns; gap 27.65px × 31.68px; no max-width
- Motion: transform/opacity only, `cubic-bezier(0.7, 0, 0.2, 1)`, 0.45–0.8s; hero drift scale 1→1.07 over 24s; all skipped under `prefers-reduced-motion`
- Focus: `:focus-visible`, 2px lime outline, 3px offset

---

# Taste DNA

### The photograph is the only light in the room
- **Trigger**: When the site needed to feel brighter and warmer without breaking the forest identity…
- **Decision**: Kept every section on forest and let bright daylight photos carry the lightness, over introducing a cream or white section background.
- **Reason**: A single dark ground makes each photo read like a window onto the pasture; a light section would compete with the photos and turn them back into rectangles on a page.
- **Evidence**: forest is 77.6% / 79.1% / 99.5% of background area on Home / Beef / Contact; no gray or cream value anywhere; the replaced heroes are sunlit pasture (Home, Invest) and a sunlit corral (Beef).

### Darkness only where the words are
- **Trigger**: When bright skies sat behind white titles and caps labels…
- **Decision**: Pooled forest behind each block of text and left the rest of the photo almost bare, over darkening the whole photo evenly.
- **Reason**: Readers need contrast exactly under the letters and nowhere else; an even overlay buys legibility by dimming the very photo meant to lift the mood.
- **Evidence**: `--shade-text: 0.76` against `--shade-clear: 0.06`; lowest measured text contrast 4.76:1 even over a pure white photo; the Contact hero shows clear pasture between the title pool and the side-text pool.

### No boxes, no depth
- **Trigger**: When grouping buttons, form fields, cards and FAQs…
- **Decision**: Built every component from 1.5px hairlines on a flat surface, over rounded cards with shadows, the usual way marketing sites separate content.
- **Reason**: A ranch and its paperwork feel closer to a printed field ledger than to an app; flat lines keep attention on the content and the photos instead of on component chrome.
- **Evidence**: border-radius 0px on all 3 pages; one shadow site-wide (path-card photo, 3 instances); the button is a 1.5px box with two 4×4px dots; contact-form inputs are hairline boxes with a square lime check.

### Big signposts, small print
- **Trigger**: When ordering headings, labels and body text…
- **Decision**: Jumped from 37–64px uppercase titles straight to 11–18px text, over a graduated scale with intermediate sizes.
- **Reason**: Visitors skim a marketing page by its titles; a large gap makes each title an unmistakable stop, and everything under it reads as the detail you choose to read.
- **Evidence**: 63.6 → 48.4 → 37.3px (1.30× steps), then 37.3 → 18.0px (2.08×); weights 400 and 700 only, 700 reserved for Orbolo Title.
