# Quickstart: see it and check it

## See the new site

```bash
pnpm install
pnpm run build && pnpm run start   # what visitors would get
# or: pnpm run dev                 # same behaviour, live reload
```

Open the address it prints. Forms show and do nothing when sent.

## Automated

```bash
pnpm run verify     # astro check, eslint, unit tests, e2e tests – must be green
```

## By hand, at 390 px and 1440 px, with mouse, keyboard and reduced motion

| # | Do | Expect |
|---|---|---|
| 1 | Read each page beside the deck | same text, same order, 25 section titles shown |
| 2 | Menu, three cards, footer, About cycle | every link lands where `contracts/pages-ui.md` says |
| 3 | `/invest`, `/land`, `/beef`, `/es` | end at the new pages |
| 4 | "Request a call" from Home, then Capital | panel opens on Name; nothing preselected, then Remote Rancher |
| 5 | Choose Phone, then Video | phone field appears, then goes |
| 6 | Send empty; then send complete | errors shown; then nothing happens, text stays |
| 7 | Esc, close button, reopen | focus back on the button; text kept |
| 8 | "I’m in" on two projects; "Apply for a seat"; idea; newsletter | right titles; same do-nothing behaviour |
| 9 | FAQ: open two questions; search the page for a word in a closed answer | both stay open; found |
| 10 | Partner band: hover, Tab, Pause; then reduced motion | stops; stops; stops; never moves |
| 11 | JavaScript off | all text readable; inline forms; cards' links work |
| 12 | Network tab during 4–8 | no request except Plausible; no cookies or storage |
| 13 | Lighthouse (mobile) on the build: Home, Capital, Markets, Opportunities, About | ≥ 90 each (SC-008) |
| 14 | Keyboard only: open the panel on Capital, fill it, press send | under 2 minutes (SC-003) |

Contracts: `contracts/pages-ui.md`, `contracts/forms-ui.md`. Wording to review: `contracts/candidate-copy.md`. Photos to approve: `research.md` R13.
