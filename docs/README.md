# joshbubis.com

Designed personal landing for job applications — short on purpose. Employers get
the full résumé as a PDF; this page is name, positioning, products, and contact.

**Hard rule:** no selling copy, no chat/form, no employer/task lists, no links to
`josh.menu` or studio hostnames. See root [`AGENTS.md`](../AGENTS.md).

### Structure

- `index.html` — hero (JB mark + name + one line + links), short about, selected
  work (four products), focus tags, footer.
- `resume.css` — cool paper atmosphere, large Syne type, red accent, enter
  stagger + project hover motion. Print and reduced-motion friendly.
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
