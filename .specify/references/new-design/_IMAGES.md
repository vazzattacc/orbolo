# new_design – image index

Order: 00 = design reference · 01–04 golden hour / dusk herds · 05–08 green pasture · 09–11 dry ranch. Suffix = orientation.

| File | Size (px) | Description | Photographer (Pexels) | Original filename |
|---|---|---|---|---|
| `00-ref-hero-mockup.jpg` | 1920x1080 | Design reference (not a site asset): hero mockup built on photo 01 | — | `WhatsApp Image 2026-11-03 at 20.52.02.jpeg` |
| `01-hero-herd-dusk-landscape.jpg` | 5472x3648 | Herd in open pasture, pink dusk sky – the hero photo in the mockup | Helena Lopes | `pexels-helenalopes-4731085.jpg` |
| `02-herd-golden-hour-landscape.jpg` | 5472x3648 | Dense herd, warm orange golden-hour light | Helena Lopes | `pexels-helenalopes-4731097.jpg` |
| `03-herd-sunset-sunburst-landscape.jpg` | 4936x3291 | Herd silhouetted against a sunset sunburst | Helena Lopes | `pexels-helenalopes-4773615.jpg` |
| `04-herd-golden-field-portrait.jpg` | 3537x5305 | Black-and-white cows, golden field, blurred grass foreground | framesbyeline | `pexels-framesbyeline-33301801.jpg` |
| `05-pasture-small-group-blue-sky-landscape.jpg` | 5472x3648 | Small group of cows, wide pasture, trees, blue sky | Helena Lopes | `pexels-helenalopes-4725954.jpg` |
| `06-pasture-green-black-cattle-landscape.jpg` | 5429x3632 | Black/white-faced cattle on bright green pasture, blue sky | Tom Fisk | `pexels-tomfisk-10357325.jpg` |
| `07-pasture-highland-cattle-mist-landscape.jpg` | 3253x2169 | Highland cattle grazing, misty green meadow | Nikola | `pexels-nikola-4391808-5920923.jpg` |
| `08-pasture-cow-grazing-leaves-portrait.jpg` | 6336x9504 | Brown cow grazing, framed by out-of-focus leaves | Ruben Boekeloo | `pexels-ruben-boekeloo-521336009-27916385.jpg` |
| `09-ranch-white-cow-closeup-landscape.jpg` | 5472x3648 | White cow facing camera, dry ranch corral | Rachel Claire | `pexels-rachel-claire-5531547.jpg` |
| `10-ranch-dry-hills-landscape.jpg` | 5472x3648 | Cattle on dry, sandy hills with trees | Rachel Claire | `pexels-rachel-claire-7276572.jpg` |
| `11-ranch-cows-bells-tree-portrait.jpg` | 3261x4343 | Brown cows with bells under a tree | Malama Mushitu | `pexels-malama-mushitu-2148898721-34198073.jpg` |

## Site masters (added 2026-11-14, specs/005-contact-form)

The files the site actually uses, in `src/assets/photos/`. Each is a crop and resize of an original above and nothing else: no grading, filters, retouching or added text (FR-IMG-004). Saved as sRGB JPEG, quality 90, metadata stripped, with sharp 0.35.4 (the encoder Astro uses). Astro generates every delivered size and format (AVIF, WebP, JPEG) from these at build time.

Crop rectangles are in pixels of the original: left, top, width × height. "Full frame" means no crop.

| Master | From | Crop of the original | Size (px) | Used in |
|---|---|---|---|---|
| `pasture-herd-wide.jpg` | `06` | full frame | 2560 × 1713 | Home hero, landscape screens |
| `pasture-herd-tall.jpg` | `06` | 1613, 0, 2421 × 3632 | 1080 × 1620 | Home hero, portrait screens |
| `calves-sky-wide.jpg` | `05` | full frame | 2560 × 1707 | Invest hero, landscape screens |
| `calves-sky-tall.jpg` | `05` | 1520, 0, 2432 × 3648 | 1080 × 1620 | Invest hero, portrait screens |
| `corral-cow-wide.jpg` | `09` | full frame | 2560 × 1707 | Beef hero, landscape screens |
| `corral-cow-tall.jpg` | `09` | 1411, 0, 2432 × 3648 | 1080 × 1620 | Beef hero, portrait screens |
| `cows-bells-tall.jpg` | `11` | full frame | 1440 × 1918 | Beef "What we sell today" |
| `cow-grazing-tall.jpg` | `08` | full frame | 1440 × 2160 | Land "Ganadería a Pasto"; About band, portrait screens; Beef closing collage |
| `cow-grazing-wide.jpg` | `08` | 0, 2582, 6336 × 3960 | 2560 × 1600 | About band, landscape screens |

Not used on the site: `00` (mockup), `01`, `02`, `03` (allowed only as the Home hero, OQ-D1), `04`, `07` (excluded), `10`.
