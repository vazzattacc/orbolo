# Contract: Contact Endpoint (FR-API-001…009)

This is the HTTP interface the website depends on. The server lives in a separate repository with its own spec. It **must** honour this contract. The website is tested only against a mock that implements it (`research.md` §15).

## Endpoint

`POST {PUBLIC_CONTACT_ENDPOINT}`: HTTPS only, on an Orbolo-controlled hostname (candidate `https://api.orbolo.com/contact`, OQ-C5).

## Request

The same field names are used for both encodings. Field rules and error codes are in `../data-model.md` §1.

| Field | JSON type | Form encoding |
|---|---|---|
| `name` | string | text |
| `email` | string | text |
| `phone` | string, may be `""` | text, may be empty |
| `organisation` | string, may be `""` | text, may be empty |
| `topic` | `"remote-rancher"` \| `"beef"` \| `"land"` \| `"other"` | text |
| `message` | string | text |
| `callMe` | `true`, or the key omitted | `true`, or the field absent |
| `locale` | `"en"` \| `"es"` | text |
| `page` | string (path) | text |
| `renderedAt` | integer (epoch ms), or omitted | text, may be empty |
| `website` | string, expected `""` (honeypot) | text, expected empty |

### With JavaScript

```http
POST /contact HTTP/1.1
Origin: https://orbolo.com
Content-Type: application/json

{"name":"Ana Pérez","email":"ana@example.com","phone":"","organisation":"","topic":"beef",
 "message":"We'd like to talk about volumes.","locale":"es","page":"/es/contact",
 "renderedAt":1762851600000,"website":""}
```

### Without JavaScript

`Content-Type: application/x-www-form-urlencoded`, sent as an ordinary top-level form navigation.

## Responses

| Situation | JSON request | Form request |
|---|---|---|
| Accepted (FR-API-003) | `201`, body `{"ok":true}` | `303`, `Location: https://orbolo.com{/es}/contact/thanks` |
| Spam: honeypot filled, or less than 3 s since `renderedAt` (FR-API-006) | **identical to accepted**; nothing stored or emailed | **identical to accepted** |
| Validation failure (FR-API-004) | `422`, body `{"errors":{"<field>":"<code>", …}}` | `303`, `Location: …{/es}/contact/error` |
| Rate limited (FR-API-005) | `429` (body optional, ignored) | `303` → failure page |
| Server error (FR-API-005) | `5xx` (body ignored) | `303` → failure page |

Rules:
- **Locale of redirects:** the `303` target uses the request's `locale` (`en` → no prefix, `es` → `/es`).
- **No query strings:** `Location` never carries a query string or fragment, so no form data can reach analytics (`research.md` §14).
- **Error codes:** `422` codes are exactly those in `data-model.md` §1. The body never contains visitor-facing text, because the website owns all wording.
- **Unknown codes:** if the website receives a field or code it doesn't know, it treats the response as `failed:generic`.
- **Empty `renderedAt`:** when `renderedAt` is empty or absent (no JS), the server skips the minimum-fill-time check.

## CORS (FR-API-008)

- `OPTIONS` preflight: `204` with these headers:
  - `Access-Control-Allow-Origin: https://orbolo.com` (and the preview origin while one exists; never `*`);
  - `Access-Control-Allow-Methods: POST`;
  - `Access-Control-Allow-Headers: Content-Type`;
  - `Access-Control-Max-Age: 600`.
- Every JSON response repeats `Access-Control-Allow-Origin` for the requesting allowed origin.
- No credentials: the website never sends cookies (`credentials: "omit"`), and the server never sets them.

## Website timeout

The website aborts a JSON request after **15 s** and treats it as `failed:generic` (FR-UX-011). The server should answer well inside that.

## Server-side obligations (recorded for the backend spec, not tested here)

FR-API-007 (authoritative validation) and FR-API-009:
- store the submission before emailing it;
- use the visitor's email address only as `Reply-To`;
- retry failed email delivery;
- delete submissions after the retention period (OQ-C2);
- rate-limit per client;
- HTTPS only;
- send email through an authenticated relay with SPF/DKIM;
- keep encrypted off-machine backups;
- keep the host in the EU (OQ-C7).
