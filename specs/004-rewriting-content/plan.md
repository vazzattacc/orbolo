# Plan — Story-led content rewrite (text only)

## Context
Three new reference files landed in `.specify/references/`: `orbolo_storyline.md` (the site's 8-beat story + one line per page), `orbolo_ecosystem_protocol.md` (Orbolo's values: animal welfare, people, land), and `remote_rancher.md` (only §1–4 used: "You want to keep eating beef", "The offer", "Meet the guide", "Walk a year in the cowboy's boots"). The user wants the site's text rewritten from them: shorter paragraphs, more story than detail, "Remote Rancher" as the product name (never "Verdant"), and no wording that implies investing (legal). Structure, motion and design stay exactly as they are; nothing is committed.

Hard rules carried in from `specs/_shared/references/orbolo-website-brief.md` (and enforced by `tests/e2e/content-compliance.spec.ts`):
- Orbolo facilitates, connects, trades beef. It never takes the money: people contract with and pay the Paraguayan operating company.
- Never promise what isn't delivered today; say plainly what isn't done yet (no closed cycle, no full traceability yet).
- Banned on Invest/Beef/Land: sustainable, holistic, impact, journey, solution, ecosystem, unlock, seamless, leverage, empower, passionate, regenerative, guaranteed, "invest with Orbolo", premium-as-price-claim. So the protocol's vocabulary gets translated, never quoted.
- Every number keeps its date (MetricValue unchanged). No commercial terms published (no prices, ticket size, % returns from remote_rancher.md).
- Content schema limits: `howItWorks.steps` exactly 7; pageMeta descriptions 40–220 chars.

## Approach
Edit text only: content JSON in `src/content/**` plus the few strings hard-coded in `.astro` files. No component markup, class, section, route or id changes. Then update the tests that freeze the old copy.

### Legal wording swap (applies everywhere)
| Old | New |
|---|---|
| invest / investor(s) / investment / investing | own a herd · herd owner · rancher · Remote Rancher |
| Invest (nav label, page title, path card) | Remote Rancher (URL stays `/invest`, structural) |
| investor pack | Remote Rancher pack |
| capital called / no capital | nothing is paid / no money moves |
| return / returns paid | you're paid your share of the sale |
| Verdant (pilot) | the first Remote Rancher herd at El Tapir |

### Story spine (from storyline + RR §1–4)
Paraguay has raised cattle on grass for 400+ years → the Gran Chaco, South America's second-largest wilderness → Remote Rancher modernises the old *capitalización de ganado* idea → a year on the ranch (truck, tags, shade of the algarrobo, the muster) → honest about where we are → released at 60% → how you get in.

### Copy deck (final text to implement)
**Home** — `src/pages/index.astro`, `src/content/paths/paths.json`
- h1: "You own the cattle. Our ranches raise them. Buyers get the beef."
- side: "Grass-fed beef from Paraguay’s Gran Chaco, where cattle have grazed for more than 400 years. Pick your way in."
- Cards (id/image unchanged): Remote Rancher / audience "Herd owners" — "Own tagged cows on a working ranch in the Chaco. Cowboys raise them; you read the reports." · Beef / "Buyers" — "Grass-fed Paraguayan beef at conventional prices today, and first pick of traceable supply tomorrow." · Land / "Landowners" — "Bring your ranch into the system. Cattle graze under the trees, not instead of them."
- strip fallback words: drop "Capital" → "Cattle", "Land", "Beef".

**Remote Rancher page** — `src/content/invest/invest.json`, `src/pages/invest.astro` title
- title: "Remote Rancher — Orbolo"
- Hero h1: "Be a rancher without leaving home." · rule: "Your own herd in the Paraguayan Chaco, raised by our cowboys under the Orbolo Code. A ranch starts once 60% of its herd is committed. No money moves before then." · CTA "See the next ranch" (unchanged)
- What’s included: "Pregnant cows, tagged in your name, on a named ranch you can visit" · "A life on grass and under native trees, without growth hormones or antibiotic promoters" · "A report after every muster: numbers, photos and your tag list" · "Nothing to pay until the ranch is released" · note: "Herd size, cycle length, costs and payout timing vary per ranch, and we can’t publish them here for legal reasons. They’re in the Remote Rancher pack, on request."
- Is this real?: "Yes. El Tapir is the group’s own farm in the Gran Chaco. Not a partner ranch: ours. The first Remote Rancher herd lives there, and it hasn’t closed a full cycle yet. Come and see it."
- Who buys the animal at the end?: "Orbolo’s own trading desk, at market prices. Every herd has its buyer before it’s bought."
- What if not enough people join?: "A ranch is released only when 60% of its herd is committed under signed letters of intent. Below that, nobody pays anything." · "A letter of intent expires after 90 days. If the ranch isn’t at 60% by then, it stays open or is withdrawn. Either way, you’re told."
- What if it goes wrong?: Animal loss "Cattle can be lost to disease, predators or accidents." · Drought "A dry year means fewer calves. The herd is built to hold through it." · Currency "On the ground, money moves in guaraníes, and exchange rates move too." · Policy and export "Export markets and trade rules can change during a cycle." · Liquidity "This isn’t money you can take back on short notice. A herd is committed for its whole cycle." · note: "How each risk is handled is set out in the full data room, open once you sign an NDA."
- How it works (7): 1 "Choose a ranch from the pipeline." 2 "Read the Remote Rancher pack, then open the full data room under NDA." 3 "Sign a letter of intent. It’s non-binding, and nothing is paid." 4 "At 60% committed, the ranch is released." 5 "Only then do you sign with our Paraguayan operating company and pay. Your cows arrive by truck and are tagged in your name." 6 "Cowboys raise them on pasture under the Orbolo Code, all year round." 7 "At the muster, the calves are sold through Orbolo’s trading desk at market prices, and you’re paid your share."
- What you own, precisely: "Specific cows, by ear tag, under a management agreement with our Paraguayan operating company. Not land, and not a share in a fund. Carbon or biodiversity credits stay with the land and the group."
- Who verifies what: "Every animal is raised under the Orbolo Code: room to move, shade, water, no growth hormones."
- FAQ: Do I need to visit Paraguay to own cattle here? → "No. Your reports bring the ranch to your desk. But you’re very welcome, by appointment." · How do I know the animals actually exist? → "Every cow carries an ear tag and a digital tag, both on your list. The details are in the Remote Rancher pack." · Can I leave early? → "Not today. A herd is committed for its cycle. Ask us about your situation." · Can I visit the ranch? → "Yes, by appointment." · Who can become a Remote Rancher? → "That depends on where you live, among other things. Contact us to find out if you’re eligible." · What happens when the cycle ends? → "The animals are sold through Orbolo’s trading desk at market prices, and you’re paid your share."
- Closing: "Released at 60%. Nothing paid before then." · CTAs "Get the Remote Rancher pack", "Book a call" · contracting-entity line unchanged
- Cross-link unchanged ("See where your beef is sold")

**Beef** — `src/content/beef/beef.json`
- h1: "Grass-fed beef from Paraguay, at conventional prices." · deck: "Paraguay has raised cattle on grass for over 400 years. We trade its beef today, and we’re aligning a 300,000-head producer alliance behind it."
- What we sell today: "Grass-fed Paraguayan beef under the MPCS standard, bought on the market and sold at conventional prices." · "What we can’t offer yet: a full ear-tag-to-box history. We’re building that first."
- The promise: "We don’t need a higher price to make this work. We compete on resilience and scale, and a better product is how we mean to change what conventional beef looks like."
- First pick: "Trade with us now, and you’re first in line when traceable supply from our own herds comes online."
- Why supply from the group is different: "Our own herds and the alliance herds are raised under one Code. That’s supply we control and can vouch for, not just source and hope."
- Who verifies what: unchanged. CTAs/cross-link unchanged.

**Land** — `src/content/land/land.json`, `src/components/land/WorkWithUs.astro`
- El Tapir intro: "South America’s second-largest wilderness after the Amazon, home to the jaguar, the tapir and the giant anteater, and to our first Remote Rancher herd. Not a partner ranch: ours. It’s growing, and open to visitors by appointment." (avoid "expansion" — tested)
- Ganadería a Pasto: "How we grow supply. Ganadería a Pasto is the group’s technical arm: people in the field, helping ranches move to cattle raised on grass."
- Work with us body: "Bring your ranch into the system. Cattle graze under the trees, not instead of them."

**Contact** — `src/pages/contact.astro`: replace the internal OQ-015 placeholder note with "Own a herd, buy beef, or bring your land: this is where we talk. Our contact form is on its way."

**Meta** — `src/content/pageMeta/pageMeta.json`: rewrite all five descriptions without invest/investor wording (40–220 chars).

Untouched: 404 copy, privacy/terms, footer, nav structure, metrics, ranches, all components' markup.

### Tests that freeze old copy → update to new copy
- `tests/e2e/as-is-freeze.spec.ts`: h1 for `/`, `/invest`, `/beef`; `/invest` title.
- `tests/e2e/seo-meta.spec.ts`: `/invest` title + og:title.
- `tests/e2e/nav-bar.spec.ts`: label "Invest" → "Remote Rancher" (`src/components/Nav.astro` label too).
- `tests/e2e/invest-page.spec.ts`: last h2 + FAQ question text.

### Self-review (done)
- Banned words / "invest" scan of every new string: clean. "premium" avoided entirely.
- Nothing from remote_rancher.md §5+ used (no prices, %, exit terms, FAQ answers).
- No new claims beyond the sources; honesty lines kept (no closed cycle, no full history).
- Mobile nav: "Remote Rancher" still fits the single links row at 360px (flex-wrap as safety).

## Execution order
1. Write `specs/004-rewriting-content/plan.md` (this plan) and `tasks.md` (task per file, grouped by page, checkboxes); re-review tasks against the copy deck.
2. Apply content edits (JSON, then .astro strings, then Nav label).
3. Update the copy-freezing tests.
4. Verify, tick tasks.md. No commit.

## Verification
- `pnpm astro check`, `pnpm lint`, `pnpm test:unit` (schemas: 7 steps, meta lengths).
- `pnpm exec playwright test` (dev server via `pnpm dev`, stopped afterwards).
- `grep -rniE "invest|verdant|capital|return" src/content src/pages src/components` → only route/code identifiers left.
- Screenshot Home/Remote Rancher/Beef/Land at 1440 and 390 to confirm no layout breakage from new text lengths.
