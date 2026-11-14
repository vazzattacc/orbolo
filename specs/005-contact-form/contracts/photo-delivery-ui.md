# Contract: Photo Delivery UI (DOM, attributes and shade)

Added 2026-11-14 for the background-photo refresh (FR-IMG-*). This is the stable surface that `motion.ts`, `global.css` and the photo e2e tests rely on. Encoder settings and the exact gradient shapes are free to change. **These hooks are not.**

Data: `data-model.md` §6–§8. Decisions: `research.md` §17–§27.

## 1. Shell props

All four shells keep their current props. Additions:

| Shell | Prop | Type | Meaning |
|---|---|---|---|
| PhotoHero, Band, Split | `image` | `string \| Photo` | `string` = a kept photo's path into `public/`; `Photo` = a replacement from `src/assets/photos/`. |
| CtaCollage | `images` | `[string \| Photo, string \| Photo, string \| Photo]` | Same, per image. |
| PhotoHero, Band, Split | `focus?`, `focusNarrow?` | CSS `object-position` | Focal point; `focusNarrow` applies at ≤ 991 px. Absent = today's position. |
| CtaCollage | `focus?` | `[string?, string?, string?]` | Focal point per image. |

A call that passes only a path string renders the same `<img>` as before this feature, apart from the attributes in §3.

## 2. Markup per photo

**Kept photo (path string)**: one element.

```text
<img src="/images/site/<file>" alt="…" decoding="async" data-photo="<file without extension>" [priority attributes, §3]>
```

**Replacement (`Photo`)**: one `<picture>`.

```text
<picture>
  [only if the photo has both frames]
  <source media="(max-width: 991px) and (orientation: portrait)" type="image/avif" srcset="… 480w, …" sizes="…" width height>
  <source media="(max-width: 991px) and (orientation: portrait)" type="image/webp" srcset="…" sizes="…" width height>
  <source type="image/avif" srcset="… 960w, …" sizes="…">
  <source type="image/webp" srcset="…" sizes="…">
  <img src="<jpeg>" srcset="<jpeg ladder>" sizes="…" width height alt="…" decoding="async"
       data-photo="<Photo.name>" style="--photo-focus: …; --photo-focus-narrow: …" [priority attributes, §3]>
</picture>
```

Rules:

- Source order is tall frame before wide frame, and AVIF before WebP within a frame. The `<img>` is the JPEG fallback.
- Every `srcset` uses `w` descriptors and comes with `sizes`. Widths and `sizes` per slot are in `research.md` §19.
- `width` and `height` are the intrinsic size of the frame they describe.
- `data-photo` is on the `<img>` in both cases. Tests select photos by it and never by URL, because image URLs differ between `astro dev` and the build.
- No photo is a CSS `background-image`.

## 3. Priority attributes

| Shell | `fetchpriority` | `loading` |
|---|---|---|
| PhotoHero | `high` | absent |
| Band, Split, CtaCollage, Split's sketch | absent | `lazy` |

- Exactly one element per page has `fetchpriority="high"`, and it is the PhotoHero `<img>`.
- No element has `fetchpriority="low"` or `fetchpriority="auto"`.
- No `<link rel="preload" as="image">` is emitted for photos.

## 4. Layout and motion hooks (unchanged selectors)

`motion.ts` and the `heroDrift` rule are not edited by this feature. Each selector below must match exactly one element per photo, with the same box as today:

| Selector | Used by | Matches |
|---|---|---|
| `.phero__media` | GSAP scroll parallax | the wrapper (unchanged) |
| `.phero__media img` | CSS `heroDrift`; reduced-motion rule | the `<img>` (inside `<picture>` for a replacement) |
| `.split__media img` | GSAP settle | the `<img>` |
| `.band__bg` | GSAP band drift; `.band > :not(.band__bg)` layout rule | the outermost photo element: `<picture>` for a replacement, `<img>` for a kept photo |
| `.cta__collage > *` and `.c1`, `.c2`, `.c3` | GSAP drop-in; collage layout | the outermost photo element, a direct child of `.cta__collage` |

Where the outermost element is a `<picture>`, its `<img>` fills it (`width: 100%; height: 100%; object-fit: cover`).

`object-position` on every shell photo reads `var(--photo-focus, <today's value>)`, and at ≤ 991 px `var(--photo-focus-narrow, var(--photo-focus, <today's value>))`.

Under `prefers-reduced-motion: reduce`, the hero photo has no animation, as today.

## 5. Shade

Tokens (`data-model.md` §8): `--shade-text`, `--shade-text-lime`, `--shade-clear`.

- Every text block over a photo carries its own forest pool: `.phero__title`, `.phero__side`, `.phero__scroll`, the Band's default-slot wrapper and `.band__foot`. Inside the block's box the shade is at least `--shade-text`.
- `.phero__shade` and `.band__shade` stay in the DOM with `aria-hidden="true"`. They provide the strip under the nav at the top of a hero (at least `--shade-text-lime` together with the nav's own gradient), a blend into the forest section below, and `--shade-clear` elsewhere.
- Elements with their own opaque background (`.flag`, `.card--glass`, a hovered `Btn`) are outside this rule; their own pairing already passes.
- No `text-shadow` is used to reach contrast. No section gets a background other than forest.
- No `prefers-contrast` block is added.

**Measured guarantee** (`tests/e2e/photo-contrast.spec.ts`): for every line of text inside `.phero`, `.band` and the nav at the top of the page, the lightest pixel behind it gives at least 4.5:1 against the text colour, or 3:1 when the text is at least 24 px, or at least 18.66 px and bold. This holds with the real photo and with the photo replaced by white.

## 6. Forced colours and failed loads

- Inside `@media (forced-colors: active)`, each text block listed in §5 has `background-color: Canvas`.
- `forced-color-adjust` is not set on any element.
- `.phero`, `.band` and `.split__media` keep `background: var(--forest)`, so a photo that fails to load leaves forest behind the text.
- Decorative photos keep `alt=""`. Only the two Split photos in FR-IMG-010 have alt text.

## 7. Byte budgets (production build)

Measured on the AVIF response of each replaced photo (`research.md` §21):

| Viewport | Pixel density | Budget |
|---|---|---|
| 390 × 844 | 3× | ≤ 200 KB |
| 1440 × 900 | 1× | ≤ 450 KB |
| 1440 × 900 | 2× | ≤ 450 KB |

No response for a replaced photo is wider than 2560 px or larger than 1 MB.
