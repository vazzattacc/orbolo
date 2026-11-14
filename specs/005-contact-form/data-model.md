# Data Model: Contact Form and Background-Photo Refresh

§1–§5 (2026-11-11) model the contact form and are unchanged. §6–§8 (2026-11-14) model the background-photo refresh (FR-IMG-*).

Four contact-form entities. **Enquiry** is the one thing a visitor sends: the website builds it, and only the endpoint stores it. **ContactPageContent** and **Settings (additions)** live in the content layer and are read only through repository functions (Constitution VIII). **ContactFormGate** is derived at build time and never stored.

## 1. Enquiry (sent by the website, stored only by the endpoint)

Field names, codes and limits are the wire contract: see `contracts/contact-endpoint.md`. Rules are shared by `src/lib/contact/validation.ts` (website, for convenience) and the endpoint (authoritative, FR-API-007).

| Field | Type | Required | Rule (applied after trimming) | Error codes |
|---|---|---|---|---|
| `name` | string | yes | 1–120 chars | `required`, `too_long` |
| `email` | string | yes | ≤ 254 chars; shape `local@domain.tld` (no whitespace, exactly one `@`, a dot in the domain, non-empty parts); Unicode allowed | `required`, `invalid`, `too_long` |
| `phone` | string | no; yes if `callMe` | ≤ 40 chars, free format | `required_for_call`, `too_long` |
| `organisation` | string | no | ≤ 160 chars | `too_long` |
| `topic` | enum | yes | `remote-rancher` \| `beef` \| `land` \| `other` | `required`, `invalid` |
| `message` | string | yes | 10–2,000 chars | `required`, `too_short`, `too_long` |
| `callMe` | boolean | no | `true` or absent | – |
| `locale` | enum | yes (hidden) | `en` \| `es` | (server-only) |
| `page` | string | yes (hidden) | the page path, e.g. `/es/contact` | (server-only) |
| `renderedAt` | integer | no (hidden) | epoch ms set at page load; empty without JS | – |
| `website` | string | (honeypot) | must be empty; if filled, the server fakes success and stores nothing | – |
| `receivedAt` | timestamp | – | set by the server only | – |

- **Length unit:** UTF-16 code units, the same as HTML `maxlength`/`minlength` and JS `String.length`, so the browser, the script and the server agree.
- **Validation order:** the website reports errors in the order of the table, which is the field order (US2-AS1).
- **Precedence per field:** `required`, then `invalid`, then `too_short`/`too_long`. Only one code is shown per field at a time.

### Client state (the form on the page)

```text
idle ──Send──▶ validating ──errors──▶ invalid ──(edit, Send)──▶ validating
                    │
                    └──ok──▶ sending ──201──▶ (full navigation to thanks page)
                                 │──422──▶ invalid   (server codes, same rendering)
                                 │──429──▶ failed:rateLimited
                                 └──5xx / network / 15 s timeout──▶ failed:generic
failed:* ──(Send)──▶ validating
```

- Values are never cleared in any transition (FR-UX-007).
- While in `sending`, further Send presses are ignored (FR-UX-009).
- Entering `invalid` focuses the summary and prefixes the title. Entering `failed` announces through the status region.

## 2. ContactPageContent (`src/content/contact/contact.json`)

There is one entry per locale, `contact` and `contact-es`. It is read by `getContactPage(locale)`, which throws if the entry is missing (the page can't render without it, like `getInvestPage`). All strings are `z.string().min(1)`. `{n}` and `{email}` are the only placeholders, and they are replaced by simple token substitution.

```text
id                      "contact" | "contact-es"
title                   page <title>                        (moved from ui.ts contact.title)
h1                      hero heading                        (moved from ui.ts contact.h1)
stubBody                today's stub text, gate closed      (moved from ui.ts contact.body, verbatim)
intro                   hero side text, gate live           (FR-GEN5-004)
previewNote             dev-preview flag text (§3 research)
form:
  heading               Edit-section sticky heading
  optionalMarker        "(optional)"
  fields:
    name                { label, hint? }
    email               { label, hint? }
    phone               { label, hint? }
    organisation        { label, hint? }
    message             { label, hint?, remaining }          remaining contains {n}
    callMe              { label }
  topic:
    legend
    options             { "remote-rancher", "beef", "land", "other" } → label   (keys = contract codes)
  send                  { label, sending }
  privacyLine           { text, linkLabel }                 FR-LEG5-001
errors:
  summaryHeading
  titlePrefix           "Error: "                           FR-UX-006
  inlinePrefix          visually-hidden "Error:"
  name                  { required, too_long }
  email                 { required, invalid, too_long }
  phone                 { required_for_call, too_long }
  organisation          { too_long }
  topic                 { required, invalid }
  message               { required, too_short, too_long }
failure:
  generic               message near Send                   US3-AS1
  rateLimited           "try again in a few minutes"        US3-AS2
  emailLead             text before the mailto link, contains {email}
thanks:                 { title, h1, body, homeLabel }      FR-PAGE-001 (OQ-C6: neutral wording until a reply time is confirmed)
errorPage:              { title, h1, body, backLabel }      FR-PAGE-002
```

**Schema rule:** every `errors.<field>` object must have exactly the codes listed in §1 for that field. It's a Zod `z.object` with those keys, so a missing translation fails the build.

**Compliance:** all strings pass `content-compliance.spec.ts` (FR-GEN5-003). No reply time is promised unless OQ-C6 supplies one.

## 3. Settings additions (`src/content/settings/settings.json`, existing singleton)

| Field | Type | Default | Meaning |
|---|---|---|---|
| `contactEmail` | `z.email().optional()` | absent | The team inbox shown as the `mailto:` fallback in both languages (FR-UX-012). Absent until OQ-C1 is answered. |
| `contactFormPrivacyApproved` | `z.boolean()` | `false` | Vaz/counsel approved the privacy line and the Privacy-page section for the form (FR-LEG5-002, OQ-C3). |

`getContactSettings()` is added to `settings-repository.ts`, beside `getSocialPreviewDefaults()`.

**Deviation from the spec's Key Entities:** the spec groups these two values under ContactFormContent. They live in `settings` so the shared, non-localized values exist once (`research.md` §6). There is no behaviour difference.

## 4. ContactFormGate (derived at build time, never stored)

```ts
type GateInput = {
  endpoint: string | undefined;          // PUBLIC_CONTACT_ENDPOINT
  isDev: boolean;                        // import.meta.env.DEV
  preview: boolean;                      // CONTACT_FORM_PREVIEW
  privacyApproved: boolean;              // settings.contactFormPrivacyApproved
  privacyPagePublished: boolean;         // getLegalDocument("privacy") !== undefined
  contactEmail: string | undefined;      // settings.contactEmail
};

type ContactFormGate =
  | { live: false }
  | { live: true; endpoint: string; contactEmail: string; preview: boolean };
```

| Condition | Production build (`isDev = false`) | Dev with `preview = true` |
|---|---|---|
| endpoint set | required | required |
| privacyApproved | required | waived |
| privacyPagePublished | required | waived |
| contactEmail set | required | falls back to `contact@example.com` |

- `preview` is ignored unless `isDev`.
- When the gate is live with `preview: true`, the page shows `previewNote`.

**Consumers:**
- `[...lang]/contact.astro`: renders the form or the stub.
- `[...lang]/contact/thanks.astro` and `contact/error.astro`: their `getStaticPaths` return `[]` when closed.
- `sitemap.xml.ts`: unchanged, because the result pages are `indexable: false`.

## 5. PageMeta additions (`src/content/pageMeta/pageMeta.json`)

| id | route | indexable |
|---|---|---|
| `contactThanks` | `/contact/thanks` | false |
| `contactThanksEs` | `/es/contact/thanks` | false |
| `contactError` | `/contact/error` | false |
| `contactErrorEs` | `/es/contact/error` | false |

The descriptions (40–220 chars, per the existing schema) are written in the same voice as the other entries. The existing `contact` and `contactEs` entries are unchanged.

## 6. Photo (`src/assets/photos/index.ts`), added 2026-11-14

A replacement photo and its prepared frames. Masters are JPEG files in `src/assets/photos/`, imported so that `astro:assets` can process them (`research.md` §17, §18). This is not a content collection: which photo a section shows stays in that section's component, as today (spec Non-goals; AGENTS.md known gap).

```ts
import type { ImageMetadata } from "astro";

type Photo = {
  name: string;           // stable name, rendered as data-photo
  wide?: ImageMetadata;   // landscape frame
  tall?: ImageMetadata;   // portrait frame
};
```

| Rule | Reason |
|---|---|
| At least one of `wide` and `tall` is present. | A photo with no frame can't render. |
| A master's long edge is at most 2560 px. | The 1–4 MB originals never reach the build (FR-IMG-006). |
| `name` is unique and describes the picture, not the page. | One master can serve several slots; tests select by it. |
| Masters are made by crop and resize only. | FR-IMG-004. The crop rectangle is recorded in `_IMAGES.md` (FR-IMG-012). |

Entries (default for OQ-D1 = `06`):

| `name` | `wide` | `tall` | Source |
|---|---|---|---|
| `pasture-herd` | `pasture-herd-wide.jpg` | `pasture-herd-tall.jpg` | `06` |
| `calves-sky` | `calves-sky-wide.jpg` | `calves-sky-tall.jpg` | `05` |
| `corral-cow` | `corral-cow-wide.jpg` | `corral-cow-tall.jpg` | `09` |
| `cows-bells` | – | `cows-bells-tall.jpg` | `11` |
| `cow-grazing` | `cow-grazing-wide.jpg` | `cow-grazing-tall.jpg` | `08` |

A **kept photo** has no entry. It stays a path string into `public/images/site/` and is never transformed (FR-IMG-002).

## 7. BackgroundPhotoSlot (the spec's Key Entity), added 2026-11-14

One place a shell shows a photo. A slot is the set of props a section component passes to its shell; it is not stored anywhere else.

| Attribute | Type | Source |
|---|---|---|
| shell | `PhotoHero` \| `Band` \| `Split` \| `CtaCollage` | the component used |
| image | `Photo` (replacement) or `string` (kept photo) | prop `image` / `images` |
| role | hero (LCP) or below the fold | fixed by the shell (`research.md` §22) |
| focus | CSS `object-position`, optional | prop `focus` |
| focusNarrow | CSS `object-position` at ≤ 991 px, optional | prop `focusNarrow` |
| alt | string; empty for decorative photos | `Split` only: `whatWeSellAlt`, `gappAlt` in `ui.ts` |

Slots that change (FR-IMG-001). Starting focus values are in `research.md` §20.

| Page | Section (component) | Shell | Today | After |
|---|---|---|---|---|
| Home | hero (`pages/[...lang]/index.astro`) | PhotoHero | `hero-mist.jpg` | `pasture-herd` |
| Invest | hero (`invest/Hero.astro`) | PhotoHero | `rider-herd.jpg` | `calves-sky` |
| Beef | hero (`beef/Hero.astro`) | PhotoHero | `orbolo-grassfed.jpg` | `corral-cow` |
| Beef | What we sell today (`beef/WhatWeSellToday.astro`) | Split | `zebu-close.jpg` | `cows-bells` |
| Land | Ganadería a Pasto (`land/GanaderiaAPasto.astro`) | Split | `rider-green.jpg` | `cow-grazing` |
| About | Why Paraguay (`pages/[...lang]/about.astro`) | Band | `rider-green.jpg` | `cow-grazing` |
| Beef | closing CTA, 2nd image (`beef/Ctas.astro`) | CtaCollage | `rider-green.jpg` | `cow-grazing` |

No page shows the same photo twice: `cow-grazing` appears once each on Land, About and Beef.

Slots that must not change (FR-IMG-002), all still path strings:

| Page | Section | Shell | File |
|---|---|---|---|
| Land | hero | PhotoHero | `orbolo-palms.jpg` |
| About | hero | PhotoHero | `shade-tree.jpg` |
| Contact | hero | PhotoHero | `brahman-four.jpg` |
| 404 | hero | PhotoHero | `orbolo-walk.jpg` |
| Invest | What you own | Band | `pasture-top.jpg` |
| Beef | First pick | Band | `nelore-herd.jpg` |
| Invest | Offer box; Who buys at the end | Split | `gaucho-nelore.jpg`; `grazing-bright.jpg` |
| Beef | Why supply is different | Split | `shade-tree.jpg` |
| About | founder split | Split | `florian.jpg` |
| Beef | closing CTA, 1st and 3rd | CtaCollage | `orbolo-cattle-shade.jpg`, `brahman-four.jpg` |
| About | closing CTA | CtaCollage | `orbolo-cattle-shade.jpg`, `orbolo-gauchos.jpg`, `orbolo-walk.jpg` |
| every other closing CTA | default images | CtaCollage | `orbolo-cattle-shade.jpg`, `florian.jpg`, `orbolo-walk.jpg` |
| every `Split` with `sketch` | sketch | Split | `cow-lines-lime.png` |

## 8. Shade tokens (`src/styles/global.css`), added 2026-11-14

| Token | Value | Applies behind | Guarantees over a white photo |
|---|---|---|---|
| `--shade-text` | `0.76` | paper text of any size; lime text that is large | 4.5:1 for paper (floor 0.73); 3:1 for large lime (floor 0.75) |
| `--shade-text-lime` | `0.9` | lime text at normal size (the nav strip at the top of a hero, combined with the nav's own gradient) | 4.5:1 for lime (floor 0.89) |
| `--shade-clear` | `0.06` | every part of a photo with no text | – (no text there) |

All three are opacities of forest `#36472B`. The floors are derived in `research.md` §23. Lowering `--shade-text` or `--shade-text-lime` below its floor fails `photo-contrast.spec.ts`.
