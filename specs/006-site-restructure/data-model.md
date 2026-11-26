# Data Model: 006

Conventions: every entry has `id` = `<name>` (English) or `<name>-es`. `text` = non-empty string. `?` = optional; an absent optional **asset** leaves its element out and keeps the text (FR-GEN6-005). Deck keys are JSON paths. *(H)* = heading from FR-GEN6-008: deck wording, key named here. *(C)* = candidate wording, see `contracts/candidate-copy.md`.

## 1. Shared shapes

| Shape | Fields | Rules |
|---|---|---|
| `Photo` | `name`, `alt`, `focus?`, `focusNarrow?` | `name` must be in the photo library; `alt` may be `""` only in decorative slots |
| `Action` | `{ kind: "link", label, href }` · `{ kind: "call", label, interest? }` · `{ kind: "order", label }` | `href` starts with `/` or `#`; never `#` alone. `interest` is a contract code. `order` renders only when the order page is published (always false in 006 until OQ-006-M3) |
| `Closing` | `line`, `cta: Action` | |
| `Labelled` | `label`, `body` | |

## 2. Page collections

| Collection | Content (deck keys unless marked) |
|---|---|
| `home` | `hero{headline, subline, ctas[2] Action, photo}` · `story{heading, paragraphs[4], photos[3]?}` · `capitalNature{heading, body, icons[7]{label, icon?}}` · `choose{heading}` (hidden, "Your part in it") · `visit{heading, body, photos?, logo?, map?}` · `closing` · `faq{heading}` *(H)* |
| `capital` | `hero{headline, subline, cta, photo}` · `problem{body}` · `offer{heading, stack[7], effort}` · `proof{heading (H), body, photos?}` · `promise{heading (H), body}` · `land{heading (H), body}` id `prefer-land` · `risks{heading (H), cards[3] Labelled}` · `urgency{heading (H), body}` · `closing` |
| `markets` | `hero` · `products{heading (H), tiles[5]{text, photo?}}` · `possible{heading (H), body}` · `why{heading (H), body, photo?}` · `order{heading (H), steps[4]}` · `closing{line, cta, next{text, label, href}}` |
| `opportunities` | `hero` · `stepsHeading` *(H)*, `steps[3]` · `roadmap{heading (H), button{label, note, first, count}, moreLabel, more[4]}` id `projects` · `early{heading (H), stack[4], price}` · `proof{heading (H), body, photo?}` · `gatherings{heading (H), body, photo?, cta{label}}` · `join{heading (H), partner, skills, idea, introduce}` each `{text, label}` (+ Action) · `closing` |
| `about` | `hero` · `ch1…ch4{heading (H), body, photo?}`, `ch2.quote{text, attribution}`, `ch3.amazon` · `pillars{heading (H), intro, parts[4]{label, href}}` · `principles{heading (H), body}` · `team{heading (H), intro}` · `partners{heading (H), body}` · `glossary{heading (H), items[6]{term, definition}}` · `closing` |
| `contact` | `headline, subline, fields, button, success` + form strings *(C)* + `thanks`, `errorPage` *(C)* · `photo` |
| `media` | `headline, body{before, link, after}, introLabel (C), intro, downloads[]{id, label, href}` (empty now) · `photo` |
| `notFound` | `headline, body, cta` · `photo` |

`roadmap.count` = `"{n} people are in."` (Vaz, 2026-11-25). `body` with a link inside is split around the linked words, so no HTML lives in JSON. The joined parts must equal the deck text (tested).

## 3. Shared collections

| Collection | Fields | Rules |
|---|---|---|
| `site` | `nav[]`, `callButton`, `footer{line, company, links[], newsletter}`, interface labels *(C)* | `nav` order fixed by code list, labels by content |
| `forms` | `consent{text, linkLabel}`, `error`, shared messages *(C)*, `interest{fields, button, success}`, `gathering{…, options[2]{id, label}}`, `idea{label (C), placeholder, send, success}`, `newsletter{emailLabel, button, success}` | |
| `choices` | `id, title, body, linkLabel, destination, image{src, alt}, order, locale` | replaces `paths`; exactly 3 per locale on Home |
| `faq` | `id, group (about\|invest\|buy\|visit), groupLabel via site order, order, question, answer, locale` | counts 4 / 7 / 3 / 1 = 15 |
| `partners` | `id, name, qualifier?, logo?, order, locale` | 4 |
| `team` | `id, name, role?, photo?, order, locale` | 5 names |
| `projects` | `projectId, name, line, photo?, order, locale` | 5; `projectId` one of `remote-beekeeper`, `buffalo`, `native-forest`, `education`, `amazon-to-chaco`; card element id `project-<projectId>` |
| `pageMeta` | + `title` (exact deck title) | `description` optional for 404 only |
| `settings` | `contactEmail?`, `contactFormPrivacyApproved` (stays `false`), + `interestThreshold: 10`, `siteName`, social defaults | `contractingEntityName` removed |
| `legal` | `id` adds `imprint` | gate unchanged; no imprint entry is created |

**Deleted collections**: `invest`, `beef`, `land`, `ranches`, `paths`. `metrics`, its repository and `MetricValue` stay, unused, as the spec allows (OQ-006-G3); the two labels `MetricValue` takes from `ui.ts` move to `site`.

## 4. Submissions (client side)

Common: `form, locale, page, renderedAt, website` (honeypot).

| `form` | Fields and rules | Error codes |
|---|---|---|
| `contact` | `name` 1–120 · `email` shape, ≤ 254 · `interest` one of 7 codes · `bestDays[]` ≥ 1 of `mon…sun` · `bestParts[]` ≥ 1 of `morning, afternoon, evening` · `timeZone` IANA name · `channel` `video\|phone\|whatsapp` · `phone` ≤ 40, ≥ 6 digits, only when channel ≠ video · `notes` ≤ 2,000 | `required`, `invalid`, `too_long`, `too_short` |
| `interest` | `name`, `email`, `projectId` | same |
| `gathering` | `name`, `email`, `gathering` (`villa-weiss-2027-04`, `paraguay-2027-10`), `bring` 1–300 | same |
| `idea` | `idea` 1–280 | same |
| `newsletter` | `email` | same |

Lengths are counted after trimming, in UTF-16 units (005 rule).

## 5. States

**Gate**: `closed` (endpoint unset **or** approval `false`) → forms render with `method="dialog"`, no action, no requests; `open` → `method="post"`, `action=endpoint`.

**Form**: `idle → invalid` (summary + inline errors) · `idle → sending → sent | invalid (422) | failed`. Closed gate: a valid send stays `idle`.

**Interest choice**: `untouched` (each opener sets its preselection or none) → `chosen` (first change by the visitor; no opener changes it until the next page load).

**Counter**: `unknown` (start, closed gate, error, 5 s timeout, no JS) → "Be one of the first." · `known ≥ threshold` → count text only · `known < threshold` → "Be one of the first."

**Page locale**: built only if entry + `pageMeta` exist for that locale.
