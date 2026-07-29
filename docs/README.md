# joshbubis.com

Static GitHub Pages **résumé site** for job applications (software + IT/ops).

Until 2026-07-29 this repo was the "I sell custom websites" marketing site.
That site moved to [`josh.menu`](/Users/jbair/Projects/josh.menu). What lives
here now is a professional page for employers — products shipped, experience
without heavy date ranges, and skills spanning build / ship / IT tooling.

**Hard rule:** no selling copy, no chat widget, no contact form, and no links to
`josh.menu` or any studio hostname. See root [`AGENTS.md`](../AGENTS.md).

### Structure

- `index.html` — masthead, about, products, experience, skills, education,
  how I work, footer. The only script is a one-line copyright year.
- `resume.css` — self-contained paper-and-ink look (hairline rules, one red
  accent) without sales apparatus. Ends with a print stylesheet.
- `fonts/` + `fonts.css` — self-hosted Instrument Sans + Syne.
- `favicon.svg` — the JB maker's mark (ink block, red J, paper B).

Experience dates are intentionally light on the page; the PDF résumé Josh
attaches to applications can carry the full timeline.

### Boundaries

| Concern | Folder |
|---|---|
| This résumé page | `/Users/jbair/Projects/joshbubis.com` |
| Studio sales site (`josh.menu`) | `/Users/jbair/Projects/josh.menu` |
| Vault, SES, Access, Studio backend | `/Users/jbair/Projects/hub` |
| Commissioned client sites | `/Users/jbair/Projects/clients/<domain>` |
| Product apps | Their own folders |

### Deploy

Push `main` → GitHub Pages. Bump `?v=` on `resume.css` when shipping so visitors
are not stuck on a stale stylesheet.
