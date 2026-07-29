# AGENTS.md — joshbubis.com

Static GitHub Pages **personal landing / résumé pointer** for job applications.
`/Users/jbair/Projects/joshbubis.com`.

## What this site is (and is not)

A short, designed page for employers — who Josh is, what he’s shipped, how to
reach him. The detailed résumé (employers, dates, bullets) lives in the PDF he
attaches to applications, **not** on this page.

It is **not** the studio. Selling websites lives at `josh.menu`
(`/Users/jbair/Projects/josh.menu`).

**Do not add, and remove on sight:**

- Selling copy, pricing, packages, or CTAs to hire a studio.
- Concierge chat, contact forms, or lead capture.
- Employer names, date ranges, or résumé task bullet lists.
- Any link to `josh.menu`, `contracts.josh.menu`, or `studio.josh.menu`.

Contact: `josh@joshbubis.com` only (not `josh@josh.menu`).

## Structure

- `index.html` — hero, short about, selected products, focus tags, footer.
  Minimal JS: copyright year + `is-ready` for enter animation.
- `resume.css` — self-contained. Cool paper wash, Syne display, red accent,
  staggered reveal + project-row hover. Print + `prefers-reduced-motion` covered.
- `fonts/` + `fonts.css` — Instrument Sans + Syne.
- `favicon.svg` — JB maker’s mark (personal; studio uses JM).

## Shipping

1. Bump `?v=` on `resume.css` (and favicon if changed) when shipping styles.
2. Push `main` → GitHub Pages (~10 min CDN lag).
3. Update `docs/README.md` when structure changes.

| Change | Folder |
|---|---|
| This page | this repo |
| Studio sales site | `/Users/jbair/Projects/josh.menu` |
| Vault / Studio backend | `/Users/jbair/Projects/hub` |
| Client sites | `/Users/jbair/Projects/clients/<domain>` |
| Product apps | Their own folders |
