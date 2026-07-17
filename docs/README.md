# joshbubis.com

Static GitHub Pages portfolio for `joshbubis.com`.

**Hub hybrid:** public marketing lives here; Studio, contracts, contact verify,
and Vault live in `/Users/jbair/Projects/hub`. See root [`AGENTS.md`](../AGENTS.md)
and Hub [`AGENTS.md`](/Users/jbair/Projects/hub/AGENTS.md) § Sibling projects.

### Structure

- `index.html` — hero (print-registration treatment: ruled grid, red margin rule, crosshairs, maker's line — no canvas; brand letters lift on hover), work rail (native scroll-snap; arrows/dots/keyboard/drag are user-initiated, no auto-drift), approach, process (5-step "how it goes down" timeline; red spine inks in on scroll via #process-rail-fill), about, CTA
- `contact.html` + `contact.js` — form UI → Hub `/webhooks/contact`
- `chat.js` — concierge chat widget → Hub `/webhooks/chat` (polling, no websockets). **Beta-gated:** renders only when `localStorage.jb_chat_beta === "1"`; flip `BETA_GATE` to false in `chat.js` to open it to everyone
- `style.css` / `studio.css` — keep `studio.css` a copy of `style.css`
- `script.js` — reveals (hero + section-head cascades), work-rail scroll/dots/drag
- `images/work/*.jpg` — manual Playwright captures (`npm run capture-work`)
- `AGENTS.md` — agent routing + shipping rules

Work-rail panels use flat "plate" labels (JB maker's mark + domain) instead of
browser chrome; screenshots stay clickable through `.work-shot-link`. The
`.jb-mark` chip (ink block, red J — the favicon in type) is the brand mark;
reuse it rather than inventing new label motifs.

### Boundaries

| Concern | Folder |
|---|---|
| This marketing UI | `/Users/jbair/Projects/joshbubis.com` |
| Contact verify, SES, Vault, Studio | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

### Deploy

Push `main` → GitHub Pages. Bump `?v=` on CSS/JS/images when shipping so visitors
are not stuck on stale assets.
