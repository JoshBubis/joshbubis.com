# joshbubis.com

Designed personal landing for job applications — short on purpose. Employers get
the full résumé as a PDF; this page is name, positioning, products, and contact.

**Hard rule:** no selling copy, no chat/form, no employer/task lists. Josh.Menu
in Selected work is expected. See root [`AGENTS.md`](../AGENTS.md).

### Structure

- `index.html` — cinematic hero (mask name reveal, status chip, links including
  Josh.Menu), about, selected work (Josh.Menu + four products), focus tags, footer.
- `resume.css` — dark ground, red accent, cursor glow, scroll progress, soft
  orb wash (no film grain). Print and reduced-motion friendly.
- `fonts/` + `fonts.css` — Instrument Sans + Syne.
- `favicon.svg` — JB mark.
- `404.html` — branded Pages 404 (self-contained; no studio links).

### Boundaries

| Concern | Folder |
|---|---|
| This page | `/Users/jbair/Projects/joshbubis.com` |
| Studio (`josh.menu`) | `/Users/jbair/Projects/josh.menu` |
| Hub / Studio backend | `/Users/jbair/Projects/hub` |
| Client sites | `/Users/jbair/Projects/clients/<domain>` |

### Deploy

Push `main` → GitHub Pages. Bump `resume.css?v=` on style changes.
