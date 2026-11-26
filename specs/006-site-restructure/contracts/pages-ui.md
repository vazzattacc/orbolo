# Contract: Pages (DOM and behaviour the tests rely on)

## Every page

- One `h1` = the hero headline. Section headings `h2`; FAQ groups, risk cards, project cards `h3`. Each section: `<section aria-labelledby>` when it has a heading.
- `header`: `nav[aria-label="Primary"]` with Capital, Markets, Opportunities, About us, then `a[data-panel-open="call"][href="/contact"]`, then the language switch only if R3 finds another locale. All links visible at 360–1440 px. `aria-current="page"` on the current one.
- `footer`: `footer.line`, `footer.company`, `nav[aria-label="Footer"]` (five links: Capital, Markets, Opportunities, About us, Media kit), `nav[aria-label="Legal"]` (absent when no legal document is approved), newsletter form, "© ‹current year› Orbolo". No other text.
- `<title>` and description from `pageMeta`; no page passes its own.
- Absent assets: no `<img>`, `<svg>`, `<figure>` or link is left behind.

## Section order and ids

| Page | Sections in order (id) |
|---|---|
| `/` | hero · story · capital-nature · choose · visit · partners · closing · faq |
| `/capital` | hero · problem · offer · proof · promise · `prefer-land` · risks · urgency · closing |
| `/markets` | hero · products · possible · why · order · closing |
| `/opportunities` | hero · steps · `projects` (cards `project-<id>`, then "More ideas") · early · proof · gatherings · join · closing |
| `/about` | hero · ch1 · ch2 · ch3 · ch4 · pillars · principles · team · partners · glossary · closing |
| `/contact` | hero (headline, subline) · form |
| `/media` | hero (headline) · body · intro · downloads (absent while empty) |
| 404 | hero with headline, body, button |

Every section element carries `data-section="<name>"`; order tests read that attribute.

## Components and their shells

| Section | Shell / pattern |
|---|---|
| Heroes | `PhotoHero` |
| Story | `Edit` blocks with figures between the paragraphs |
| Icon strip | `ul` of seven labels in hairline cells; optional icon before each |
| Choice cards | existing `PathCard`/`PathGrid`, renamed `ChoiceCard`/`ChoiceGrid`; front = photo + title; back = body + link + Back |
| Problem | section on `--forest-deep` (FR-CAP-004; no new token) |
| Offer, early supporters | one `StackBox` component: hairline box, list, closing line |
| Risks | `.cards` |
| Tiles | `.cards` grid of five; no photo now |
| Steps | `ol` (`StepList`): `line` variant (Opportunities), `timeline` variant (Markets) |
| FAQ, More ideas, glossary | `.faq` `<details>`; glossary holds a `<dl>` |
| Cycle | `ol` of four links, laid out as a ring by CSS from 992 px; a plain list below and without CSS. Education sits in the middle |
| Quote | `<figure><blockquote>…<figcaption>`, Verbena |
| Partner band | `PartnerBand` (R12) |
| Closings | `CtaCollage` |

## Behaviour

| Event | Result |
|---|---|
| Choice card | as today (001 rules); link label per card |
| "See the projects ↓/↑" | in-page link to `#projects`; the arrow is `aria-hidden` |
| About → Education | lands on `/opportunities#project-education`, below the fixed nav |
| About → Production | lands on `/capital#prefer-land`, below the fixed nav |
| FAQ | opening one leaves others as they are; all closed at load; answers in the DOM |
| Partner band, motion allowed | moves; stops on hover, focus, or Pause; the button then reads Play |
| Partner band, reduced motion or no JS | still, no button, every name readable |
| Old routes | `/invest`, `/land` → `/capital`; `/beef` → `/markets`; `/es…` → English twin |
| FAQ JSON-LD | one `script[type="application/ld+json"]` on `/` only; text equal to the visible FAQ |
