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

- Selling copy, pricing, packages, or “hire me to build your site” CTAs.
- Concierge chat, contact forms, or lead capture.
- Employer names, date ranges, or résumé task bullet lists.

**OK / expected:** a Selected work row for **Josh.Menu** (the studio) linking to
`https://josh.menu`. Contact stays `josh@joshbubis.com` for employment; the
studio uses `josh@josh.menu` on its own site.

## Structure

- `index.html` — hero, short about, selected products (incl. Josh.Menu), focus
  tags, footer. JS: enter animation, cursor glow, scroll progress, chip stagger.
- `resume.css` — self-contained. Dark ground, red accent, atmosphere orbs/grain,
  mask name reveal. Sections use spacing + short accent ticks (no full-width
  hairline “page breaks”). Print + `prefers-reduced-motion` covered.
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
