# joshbubis.com

Static GitHub Pages portfolio for `joshbubis.com`.

**Hub hybrid:** public marketing lives here; Studio, contracts, contact verify,
and Vault live in `/Users/jbair/Projects/hub`. See root [`AGENTS.md`](../AGENTS.md)
and Hub [`AGENTS.md`](/Users/jbair/Projects/hub/AGENTS.md) § Sibling projects.

### Structure

- `index.html` — hero, work rail (static shots + arrows/dots/drag), approach, about, CTA
- `contact.html` + `contact.js` — form UI → Hub `/webhooks/contact`
- `style.css` / `studio.css` — keep `studio.css` a copy of `style.css`
- `script.js` — reveals (hero + section-head cascades), work-rail drift/drag/arrows (hover eases drift to ~30%, never freezes)
- `images/work/*.jpg` — manual Playwright captures (`npm run capture-work`)
- `AGENTS.md` — agent routing + shipping rules

### Boundaries

| Concern | Folder |
|---|---|
| This marketing UI | `/Users/jbair/Projects/joshbubis.com` |
| Contact verify, SES, Vault, Studio | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

### Deploy

Push `main` → GitHub Pages. Bump `?v=` on CSS/JS/images when shipping so visitors
are not stuck on stale assets.
