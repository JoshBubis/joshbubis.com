## joshbubis.com

Static GitHub Pages portfolio and hireable studio site for `joshbubis.com`.

### Structure

- `index.html` — hero, work rail, approach, about, close CTA
- `contact.html` + `contact.js` — Turnstile-protected contact form (posts to Hub)
- `style.css` — atelier design system (Syne + Instrument Sans, light paper stage)
- `script.js` — hero field (quiet), scroll reveals, work-rail auto-cycle + drag
- `images/work/*.jpg` — homepage captures for work cards (manual refresh)
- `scripts/capture-work.mjs` — regenerate captures with Playwright, then commit + push

Screenshots do **not** auto-update. Re-run the capture script when a product homepage
changes meaningfully, then push.
- `CNAME` — custom domain for GitHub Pages
- `AGENTS.md` — agent folder boundaries

### Visual direction

Light gallery / atelier: cool off-white, ink type, vermillion accent. Flash from
typography, scale, and motion craft — not cyber/neon/hack aesthetics.

### Positioning

- Public face for commissioned static sites and larger web products
- Contact form posts to Hub (`hub.joshbubis.com/webhooks/contact`); secrets stay in Hub Vault
- Contract drafting lives in Hub (**Client Work**)

### Repo boundaries

| Concern | Folder |
|---|---|
| Marketing UI / static pages | `/Users/jbair/Projects/joshbubis.com` (this repo) |
| Contact verify, SES, Vault, Client Work, Access | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

### Deploy

Published from the `main` branch root. Push to `main` updates production.
