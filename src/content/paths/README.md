# Editing `paths.json`

This file is the sole content source for the Home page's audience-selection
cards. See `specs/001-orbolo-path-selection/data-model.md` for the full
field contract and validation rules; summary:

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Lowercase, URL-safe slug (`a-z0-9-`), unique |
| `title` | yes | Non-empty |
| `description` | yes | Non-empty — used for both the front-face teaser and the back-face expanded text |
| `image.src` | yes | Path under `public/images/paths/` |
| `image.alt` | yes | Non-empty — required for accessibility |
| `destination` | yes | Must start with `/` — internal routes only, never an external URL |
| `targetAudience` | yes | Non-empty |
| `order` | no | Optional; entries without it render in file order |

Adding, removing, or editing an entry here is reflected on the Home page
with **no changes to any component code** (`PathCard.astro`/`PathGrid.astro`).
An invalid entry (e.g. an external `destination`) fails `astro check`/the
build loudly rather than shipping silently — see `src/content.config.ts`
and `src/lib/paths/schema.ts`.
