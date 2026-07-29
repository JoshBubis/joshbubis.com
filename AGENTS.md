# AGENTS.md — joshbubis.com

Static GitHub Pages **résumé one-pager**. `/Users/jbair/Projects/joshbubis.com`.

## What this site is (and is not)

As of the 2026-07-29 rebrand this is a plain professional résumé for job
applications. It is **not** the studio. The "I sell custom websites" site moved to
`josh.menu` — see `/Users/jbair/Projects/josh.menu`.

**Do not add, and remove on sight:**

- Selling copy, pricing, packages, or calls to action to hire a studio.
- The concierge chat widget or any contact form. Contact is a plain `mailto:`.
- Any link to `josh.menu`, `contracts.josh.menu`, or `studio.josh.menu`.

That separation is the whole point: an employer who finds this page should see a
software engineer, not a side business. The studio site likewise never links here.

Contact address here is `josh@joshbubis.com`. The studio's `josh@josh.menu` does
not belong on this site.

## Content that only Josh can fill in

The page ships without employment history or education because those were not
mine to invent. If he wants them, add sections in the same shape as
`Selected work` — the CSS already covers them.

## Structure

- `index.html` — the whole page. No JS beyond a one-line copyright year.
- `resume.css` — self-contained. Deliberately not the studio's `style.css`;
  that stylesheet lives in the `josh.menu` repo now. Includes a print stylesheet.
- `fonts/` + `fonts.css` — self-hosted Instrument Sans + Syne.
- `favicon.svg` — the JB maker's mark. This is Josh's personal mark and is
  correct here; the studio uses a JM variant.

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
