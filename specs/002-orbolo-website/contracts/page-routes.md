# Contract: Page routes & navigation

Per `research.md` §6, routes are locale-prefixed (`/en/…`, `/es/…`, `/de/…`) via Astro's built-in i18n routing, `en` as default locale with root-level `Accept-Language` redirect (still overridable by a manual switcher, FR-038).

## Primary navigation (every page, per FR-001, FR-022)

`Invest · Beef · Land · The Code · About` + highlighted button `Invest in a herd` (→ `/invest`). The Code, Glossary, and Contact are additionally linked from every page's footer/trust-layer area regardless of primary nav presence.

## Route map

| Path | Page | Primary funnel | Priority (spec.md story) |
|---|---|---|---|
| `/` | Home | entry hub | US1 (P1) |
| `/invest` | Invest (Remote Rancher) | Investor | US2 (P1) |
| `/invest/pipeline` *(or a section of `/invest`)* | Deployment pipeline | Investor | US2 (P1) |
| `/beef` | Beef | Buyer | US3 (P1) |
| `/land` | Land (El Tapir, partner ranches, Ganadería a Pasto) | Landowner | US4 (P2) |
| `/the-code` | The Code | Trust | US5 (P2) |
| `/glossary` | Glossary | Trust | US5 (P2) |
| `/the-opportunity` | The Opportunity | Trust | US5 (P2) |
| `/about` | About | Supporting | US7 (P3) |
| `/orbolo-bridge` | Orbolo Bridge (+ future sub-pages) | Supporting | US7 (P3) |
| `/orbolo-bridge/*` | Bridge sub-pages | Supporting | US7 (P3), added without nav changes (FR-004) |
| `/contact` | Contact (routed forms) | Supporting | US7 (P3) |
| `/blog`, `/blog/[slug]` | Blog | Supporting | footer-only, non-goal for this spec's detailed FRs beyond existing as a content type |

**Out of this feature's route map** (external, link-out only): `dataroom.orbolo.com` (Papermark, entrance page at `/dataroom` redirecting out per brief §10 — "Not in main nav"), the e-signature flow (external, linked from inside the full data room), Google Calendar scheduling links, Google Forms embeds.

## Redirects (FR-041)

- Every current `orbolo.com` URL → its corresponding new-site page (301).
- `verdant-by-orbolo.manus.space/*` → corresponding new-site page (301).
- `ganaderiapasto.com/*` → `/land` (or a dedicated Ganadería a Pasto anchor within it) (301).

*(The exact old→new URL mapping table is a content/ops deliverable at launch time, not a design-time contract — this feature's routing MUST simply support arbitrary 301 rules being added without code changes, e.g. via Firebase Hosting's `redirects` config.)*
