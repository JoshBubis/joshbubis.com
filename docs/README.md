## joshbubis.com

Static GitHub Pages portfolio and services pitch site for `joshbubis.com`.

### Structure

- `index.html` — hero, site types, shipped systems, about, contact CTA
- `contact.html` + `contact.js` — Turnstile-protected contact form (posts to Hub)
- `style.css` — layout, atmosphere, responsive rules
- `script.js` — typing animation, site-type + project card data
- `CNAME` — custom domain for GitHub Pages

### Positioning

- Public face for commissioned static sites (GitHub / Cloudflare Pages) and larger web products
- **Site types** explain what kind of site Josh builds; **Systems shipped** (Catamist, HackyChat, Relayra) prove full-stack delivery
- Contact form posts to Hub (`hub.joshbubis.com/webhooks/contact`); Turnstile keys and mail live in Hub Vault — never in this repo
- Contract drafting/sending lives in Hub (**Client Work**), not here

### Repo boundaries (don’t conflate)

Canonical agent map: root [`AGENTS.md`](../AGENTS.md) and
`.cursor/rules/repo-scope.mdc` (mirrored in Hub’s `AGENTS.md`).

| Concern | Folder |
|---|---|
| Marketing UI / static pages | `/Users/jbair/Projects/joshbubis.com` (this repo) |
| Contact verify, SES, Vault, Client Work, Access | `/Users/jbair/Projects/hub` |
| Product apps (Catamist, etc.) | Their own folders — not this site |

Cursor may open Hub as the workspace; still edit portfolio files under `joshbubis.com`.

### Deploy

Published from the `main` branch root. Push to `main` updates production.
