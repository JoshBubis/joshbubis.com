# joshbubis.com

Static GitHub Pages portfolio for `joshbubis.com`.

**Hub hybrid:** public marketing lives here; Studio, contracts, contact verify,
and Vault live in `/Users/jbair/Projects/hub`. See root [`AGENTS.md`](../AGENTS.md)
and Hub [`AGENTS.md`](/Users/jbair/Projects/hub/AGENTS.md) § Sibling projects.

### Structure

- `index.html` — hero (print-registration treatment: ruled grid, red margin rule, crosshairs, specimen label — no canvas), work rail (native scroll-snap; arrows/dots/keyboard/drag are user-initiated, no auto-drift), approach, about, CTA
- `contact.html` + `contact.js` — form UI → Hub `/webhooks/contact`
- `chat.js` — concierge chat widget → Hub `/webhooks/chat` (polling, no websockets). **Beta-gated:** renders only when `localStorage.jb_chat_beta === "1"`; flip `BETA_GATE` to false in `chat.js` to open it to everyone
- `style.css` / `studio.css` — keep `studio.css` a copy of `style.css`
- `script.js` — reveals (hero + section-head cascades), work-rail scroll/dots/drag
- `images/work/*.jpg` — manual Playwright captures (`npm run capture-work`)
- `AGENTS.md` — agent routing + shipping rules

Work-rail panels use flat "plate" labels (`Nº 01 · domain`) instead of browser
chrome; screenshots stay clickable through `.work-shot-link`.

### Boundaries

| Concern | Folder |
|---|---|
| This marketing UI | `/Users/jbair/Projects/joshbubis.com` |
| Contact verify, SES, Vault, Studio | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

### Deploy

Push `main` → GitHub Pages. Bump `?v=` on CSS/JS/images when shipping so visitors
are not stuck on stale assets.
