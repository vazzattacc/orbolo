# Contract: Forms and panels

Extends `specs/005-contact-form/contracts/contact-form-ui.md`. Hooks change from `data-contact-*` to `data-form-*`; behaviour carries over unless stated.

## Markup

```text
<form data-form="contact|interest|gathering|idea|newsletter" data-form-gate="open|closed"
      method="post" action="{endpoint}"   (gate open)
      method="dialog"                     (gate closed, no action)
      aria-label | aria-labelledby>
  fields … ids are "<prefix>-<field>", prefix unique per form on the page
  honeypot name="website"; hidden: form, locale, page, renderedAt (+ projectId)
  p[data-form-consent]        forms.consent; link to /privacy only when approved
  button[type=submit][data-form-send]
  [data-form-status]          role="status"
  [data-form-failure] hidden  forms.error (+ email sentence when an address is set; contact only)
  [data-form-success] hidden  tabindex="-1"
<script type="application/json" data-form-messages>
```

Email fields: `type="email" autocapitalize="none" autocorrect="off" spellcheck="false" autocomplete="email"`. Phone: one `type="tel"`.

## Where each form lives

| Form | Place | Prefix |
|---|---|---|
| contact | `dialog#panel-call` on every page except `/contact`; the page body on `/contact` | `call` |
| interest | `dialog#panel-interest` on `/opportunities` + `<noscript>` per card | `interest`, `interest-<projectId>` |
| gathering | `dialog#panel-gathering` on `/opportunities` + `<noscript>` | `gathering` |
| idea | inline on `/opportunities` | `idea` |
| newsletter | footer, every page | `newsletter` |

The call panel is absent from `/contact`, so no id is ever repeated.

## Panels

| Event | Result |
|---|---|
| Opener activated (JS) | `showModal()`; page inert; focus on Name; Lenis stopped |
| Esc · close button · Android Back where supported | closes; focus on the opener; values kept; Lenis running |
| Opener on `/contact` | focus moves to the form's first field; no panel |
| Reopened | same values |
| Opener with `data-interest`, choice untouched | that interest selected |
| Opener without, choice untouched | nothing selected |
| Any opener, visitor has chosen | unchanged |
| "I’m in" | heading = project name; hidden `projectId` set |
| No JS | call openers go to `/contact`; "I’m in" and "Apply for a seat" show the inline `<noscript>` form |

Titles: call = `contact.headline`; interest = project name; gathering = "Apply for a seat" (deck). Level `h2`.

## Sending

| State | Result |
|---|---|
| Closed, invalid | same error summary and inline messages as open |
| Closed, valid | 0 requests; no success, error or "Sending…" text; values, URL and title unchanged; a panel stays open |
| Closed, no JS | browser checks run; 0 requests; URL unchanged |
| Open, valid | 1 JSON POST; button busy; success text replaces the form and takes focus |
| Open, 422 | server codes shown as errors; unknown code → failure |
| Open, 429 / 5xx / network / 15 s | `forms.error`; values kept |

## Contact form specifics

- Field order as FR-CON-001; two fieldsets inside the "Best times" group.
- Phone block: visible only while Phone or WhatsApp is checked (CSS `:has`); script sets `required`/`disabled`.
- Zone: text line with the zone + `select[name=timeZone]`; detected zone preselected with JS, UTC without.

## Privacy invariants

No cookies, no storage, no third-party request except Plausible; no field value in any URL. Holds in both gate states.
