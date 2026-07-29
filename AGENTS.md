# AGENTS.md — joshbubis.com

Static GitHub Pages **résumé site** for job applications.
`/Users/jbair/Projects/joshbubis.com`.

## What this site is (and is not)

Professional résumé for employers — software engineering **and** IT/ops
background. It is **not** the studio. The "I sell custom websites" site is
`josh.menu` — see `/Users/jbair/Projects/josh.menu`.

**Do not add, and remove on sight:**

- Selling copy, pricing, packages, or calls to action to hire a studio.
- The concierge chat widget or any contact form. Contact is a plain `mailto:`.
- Any link to `josh.menu`, `contracts.josh.menu`, or `studio.josh.menu`.

That separation is the whole point: an employer who finds this page should see
an engineer / systems person, not a side business. The studio site likewise
never links here.

Contact address here is `josh@joshbubis.com`. The studio's `josh@josh.menu`
does not belong on this site.

## Content notes

- Experience is **date-light and employer-anonymous on purpose** (capability
  clusters + outcomes, no company names). Full employers/dates live on the
  PDF résumé Josh attaches to applications; the page says he’s happy to walk
  through timing in an interview.
- Do **not** invent employers, titles, or education. Stick to what Josh has
  confirmed (current source of truth was his 2026 PDF + this page).
- Phone number: keep off the public page unless he asks — email + LinkedIn +
  GitHub is enough for recruiters.

## Structure

- `index.html` — the whole page. No JS beyond a one-line copyright year.
- `resume.css` — self-contained. Deliberately not the studio's `style.css`.
  Includes a print stylesheet.
- `fonts/` + `fonts.css` — self-hosted Instrument Sans + Syne.
- `favicon.svg` — the JB maker's mark. This is Josh's personal mark; the
  studio uses a JM variant.

## Shipping

1. Bump `?v=` on `resume.css` when styles change.
2. Push `main` → GitHub Pages. CDN can lag ~10 minutes.
3. Update `docs/README.md` when structure changes.

| Change | Folder |
|---|---|
| This résumé page | this repo |
| Studio sales site | `/Users/jbair/Projects/josh.menu` |
| Vault, SES, Access, Studio backend | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |
| Commissioned client sites | `/Users/jbair/Projects/clients/<domain>` |
