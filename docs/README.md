# joshbubis.com

Static GitHub Pages portfolio and hireable studio site for `joshbubis.com`.

**Start here for Hub↔portfolio context:** Hub’s
[`docs/portfolio-hybrid.md`](/Users/jbair/Projects/hub/docs/portfolio-hybrid.md)
and this repo’s [`AGENTS.md`](../AGENTS.md).

### Structure

- `index.html` — hero, work rail (shots + arrows/dots/drag), approach, about, close CTA
- `contact.html` + `contact.js` — Turnstile-protected contact form (posts to Hub)
- `style.css` / `studio.css` — atelier design system (keep `studio.css` a copy of `style.css`)
- `script.js` — hero field, scroll reveals, work-rail drift + drag threshold + arrows
- `images/work/*.jpg` — homepage captures for work cards (**manual** refresh only)
- `scripts/capture-work.mjs` — Playwright capture (`npm run capture-work`)
- `package.json` — Playwright devDependency for captures only
- `CNAME` — custom domain for GitHub Pages
- `AGENTS.md` — agent folder boundaries + shipping rules

### Screenshots (not live)

Screenshots do **not** auto-update and are **not** fetched on page load. They only
change when someone runs the capture script and deploys. HackyChat needs a long
wait for `.story-card-title` because `trending_grouped` is large (~2MB).

### Visual direction

Light gallery / atelier: cool off-white, ink type, vermillion accent. Flash from
typography, scale, and motion craft — not cyber/neon/hack aesthetics.

### Positioning

- Public face for commissioned static sites and larger web products
- Contact form posts to Hub (`hub.joshbubis.com/webhooks/contact`); secrets stay in Hub Vault
- Contract drafting / Studio live in Hub (**Client Work**), not this repo
- Hostnames: see Hub `docs/portfolio-hybrid.md`

### Repo boundaries

| Concern | Folder |
|---|---|
| Marketing UI / static pages | `/Users/jbair/Projects/joshbubis.com` (this repo) |
| Contact verify, SES, Vault, Studio/Client Work, Access | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

### Deploy

Published from the `main` branch root. Push to `main` updates production.
Bump `?v=` query params on CSS/JS/images so visitors are not stuck on stale assets.
HTML at the edge can lag ~10 minutes (GitHub/Fastly); Hub can purge Cloudflare for
`joshbubis.com` via `POST /webhooks/cache_purges` when that path is healthy.
