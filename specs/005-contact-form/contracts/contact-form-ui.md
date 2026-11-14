# Contract: Contact Form UI (DOM, ARIA and behaviour)

This is the stable surface the client script, the e2e tests and the axe checks all rely on. Visual styling is free to change. **These hooks are not.**

## Gate-closed rendering (production until FR-GATE-001 is met)

- `/contact` and `/es/contact` render `PhotoHero` with `h1` = `title`/`h1` from `contact.json` and the side text = `stubBody` (the same text the stub shows today).
- There is no `<form>` and no `[data-contact-form]` anywhere on the page.
- `/contact/thanks`, `/contact/error` and their `/es` twins are not built (404), and are absent from `/sitemap.xml`.

## Gate-live rendering

```text
<section class="photo-hero">           h1 + intro
<section class="sec">  (Edit shell)
  head:  <h2 id="contact-form-heading">
  body:
    [data-contact-preview]              .flag, only in dev preview (research §3)
    [data-contact-summary]              tabindex="-1", hidden until errors; contains
        <h2>{errors.summaryHeading}</h2>
        <ul> <li><a href="#contact-<field>">message</a></li> … </ul>
    <form data-contact-form method="post" action="{endpoint}" data-astro-reload
          aria-labelledby="contact-form-heading">
      input#contact-name          name="name"          autocomplete="name"         required maxlength=120
      input#contact-email         name="email"         type="email" autocomplete="email" required maxlength=254
      input#contact-phone         name="phone"         type="tel"  autocomplete="tel"   maxlength=40
      input#contact-organisation  name="organisation"  autocomplete="organization"     maxlength=160
      fieldset#contact-topic      <legend>; 4 × input[type=radio][name=topic] (first has id contact-topic-first), required
      textarea#contact-message    name="message"       required minlength=10 maxlength=2000
        p#contact-message-remaining   visible count; separate debounced polite live region
      input#contact-callMe        name="callMe" type="checkbox" value="true"
      div[aria-hidden=true].contact-hp > input name="website" tabindex="-1" autocomplete="off"
      input type=hidden name="locale" | name="page" | name="renderedAt"
      p[data-contact-privacy]     text + <a href="/privacy">                     (FR-LEG5-001)
      button.btn[type=submit][data-contact-send]
      [data-contact-status]       role="status" aria-live="polite"
      [data-contact-failure]      hidden until failure; text + <a href="mailto:{contactEmail}">
    </form>
    <script type="application/json" data-contact-messages>  localized errors/states  </script>
```

- Labels: `<label for>` sits above each control. Optional fields end with `optionalMarker` inside the label. No placeholder replaces a label (FR-UX-001).
- Hints and inline errors are linked with `aria-describedby="<hint-id> <error-id>"`. An inline error is `p#contact-<field>-error`, present only while its error stands (FR-UX-004).
- On the Spanish page, `href="/privacy"` stays as written: Privacy is English-only, and `localizePath` leaves it alone.

## Behaviour hooks (asserted by e2e tests)

| Event | Observable result |
|---|---|
| Script init | `form` gains `novalidate`; `renderedAt` filled; `data-contact-ready` set on the form |
| Send with errors | 0 requests; `[data-contact-summary]` visible and focused; entries in field order; each errored control has `aria-invalid="true"` and its `#…-error`; `document.title` starts with `errors.titlePrefix` |
| Summary link click | focus on `#contact-<field>` (or `#contact-topic-first`); no smooth-scroll hijack; focused box below the nav's bottom edge |
| Send valid | exactly 1 POST with the JSON body in `contact-endpoint.md`; button `aria-busy="true"` with label `send.sending`; status region announces |
| Second press while sending | still exactly 1 POST |
| `201` | `location` becomes `{/es}/contact/thanks` |
| `422` | as "Send with errors", using the server codes |
| `429` / `5xx` / network / 15 s | `[data-contact-failure]` visible with the `mailto:` link; values intact; URL unchanged; status announces the failure |
| No JS, valid | native POST; `303` mock → thanks page |
| No JS, endpoint fails | `303` mock → `/contact/error` with the `mailto:` link and a link back to Contact |

## Result pages

- `/contact/thanks` and `/es/contact/thanks`: `h1` + body + a link to Home. They carry `<meta name="robots" content="noindex">`.
- `/contact/error` and `/es/contact/error`: `h1` + body + a `mailto:` link + a link back to that locale's Contact page. They also carry `noindex`.
- The language switch on a result page goes to the other locale's twin (`LOCALIZED_ROUTES`).

## Network and privacy invariants (FR-AN5-002, SC-003 as amended in research §13)

On every gate-live Contact and result page:
- `context.cookies()` is empty;
- `localStorage` and `sessionStorage` are untouched by the form;
- every request host is in the allowlist: the site origin, the endpoint origin, `plausible.io`;
- no request to `plausible.io` contains form values.
