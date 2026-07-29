# joshbubis.com

Static GitHub Pages **résumé one-pager** for job applications.

Until 2026-07-29 this repo was the "I sell custom websites" marketing site. That
site moved to [`josh.menu`](/Users/jbair/Projects/josh.menu) so the studio brand
could stand on its own and stay separate from Josh's employment. What is left here
is deliberately plain.

**Hard rule:** no selling copy, no chat widget, no contact form, and no links to
`josh.menu` or any studio hostname. See root [`AGENTS.md`](../AGENTS.md).

### Structure

- `index.html` — the entire page: masthead, about, selected work, stack,
  engineering practice, footer. The only script is a one-line copyright year.
- `resume.css` — self-contained, same paper-and-ink language as the studio site
  (hairline rules, one red accent) without its sales apparatus. Ends with a print
  stylesheet so the page prints as a clean résumé.
- `fonts/` + `fonts.css` — self-hosted Instrument Sans + Syne.
- `favicon.svg` — the JB maker's mark (ink block, red J, paper B). Josh's personal
  mark; the studio uses a JM variant in its own repo.

Employment history and education are intentionally absent — see `AGENTS.md`.

### Boundaries

| Concern | Folder |
|---|---|
| This résumé page | `/Users/jbair/Projects/joshbubis.com` |
| Studio sales site (`josh.menu`) | `/Users/jbair/Projects/josh.menu` |
| Vault, SES, Access, Studio backend | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

### Deploy

Push `main` → GitHub Pages. Bump `?v=` on `resume.css` when shipping so visitors
are not stuck on a stale stylesheet.
