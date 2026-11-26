# Contract: Endpoint extension

Extends `specs/005-contact-form/contracts/contact-endpoint.md` (responses, CORS, timeout, server duties unchanged unless stated). The server is a separate project; nothing here is built in this repository, and the site is tested only against a mock.

## Submissions

One endpoint with a `form` value (FR-API6-001 left this choice to the plan). JSON arrays for `bestDays`/`bestParts`; repeated keys in form encoding. Fields and rules: `../data-model.md` §4.

```json
{"form":"contact","name":"…","email":"…","interest":"remote-rancher",
 "bestDays":["mon","wed"],"bestParts":["morning"],"timeZone":"Europe/Madrid",
 "channel":"phone","phone":"…","notes":"","locale":"en","page":"/capital",
 "renderedAt":1764000000000,"website":""}
```

- `phone` is omitted when `channel` is `video`; a server receiving one then ignores it.
- `interest`: unique per (`projectId`, email trimmed and lower-cased); a repeat answers `201` and stores nothing.
- The form type `interest` and the field `interest` share a name, as in the spec; they never appear in the same submission.

## Counts

`GET {endpoint}/counts` → `200 {"counts":{"buffalo":12,…}}`; `Cache-Control: max-age=300` at most; no personal data. Requested only when the gate is open, once per page load, 5 s limit.

**Pending delta**: 005 FR-API-008 allows cross-origin `POST` only. This call needs `GET` from the same origins. Not yet approved.

## Open before the gate can open

1. No-JS result pages for the four small forms (today only Contact has them).
2. Unsubscribe, for "I'm in" and the newsletter.
3. Consent wording for the newsletter and "I'm in" (counsel, OQ-006-L1/L3).
4. Retention (OQ-006-O2) and team inbox (OQ-006-C2).
5. `order` fields (OQ-006-M3).
