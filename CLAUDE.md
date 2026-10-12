## Design Taste
*Source: adapted 2026-10-10 from the Orbolo preview site (https://orbolo-preview.vercel.app) — design and motion only; page structure and content unchanged. Supersedes the 2026-10-02 /taste analysis (orbolo-localhost.md), which describes the previous cream design. Re-run /taste on localhost to regenerate the full analysis.*

### Tokens
Colors: `#36472B` forest (every section background), `#FFFDF3` paper (body text, alternate headings), `#BFD55D` lime (alternate headings, hairlines, fills — forest text on lime), `#263518` / `#4A6342` (collage squares, fallbacks only). Fonts (public/fonts): HeliosExt (titles, uppercase), Roslindale (sub-titles, numbers, card titles, uppercase), Suisse Intl (body + 0.12em-tracked caps labels), Verbena (script accent). Base size `max(13px, .96vw)`; everything else in em. Radius: none — square edges everywhere. Gutter `--pad: max(18px, 2.2vw)`; sections 6.2em vertical.

### Directives
Headings alternate paper / lime down the page; body copy is paper. Every text pairing passes AA (paper/forest ≈9.6:1, lime/forest and forest/lime ≈6.2:1). Photography is the main contrast source: full-screen drifting photo heroes under a forest shade, 50/50 photo splits, full-bleed parallax bands, a photo collage on closing CTAs — alternated with plain editorial sections (sticky heading left, content right). Buttons are hairline boxes with a dot either side, fill wiping up on hover (src/components/ui/Btn.astro). Motion lives in src/scripts/motion.ts (Lenis, GSAP SplitText random character reveals, scrubbed photo parallax, staggered entrances); reveals animate opacity only and everything is skipped under prefers-reduced-motion. Reuse the src/components/ui/* shells (PhotoHero, Split, Edit, Band, CtaCollage) rather than one-off section styles.

### Anti-patterns
Never: rounded corners, a cream/light section background, lime as body-copy colour, hiding content with visibility/display for an animation (tests and AT must see it), a hamburger that hides the Primary nav links, links inside the `Legal` footer that aren't approved legal pages, text-transform on metric values (tests read innerText).
