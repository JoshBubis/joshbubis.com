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

## Shared portfolio ops

- Cloudflare / Turnstile / edge purge: `/Users/jbair/Projects/shared_docs/CLOUDFLARE.md`
  (Hub owns the only API token; Turnstile ≠ CDN purge; **401 on purge ≠ rotate Vault**).

## Structure

- `index.html` — HUD (name, status, email / LinkedIn / GitHub), night-city of
  product districts (Josh.Menu + four products), charter lede, focus tags,
  footer. JS: enter animation, cursor glow, scroll progress, chip stagger,
  skyline parallax, tap-to-inspect on coarse pointers.
- `resume.css` — self-contained city + type. Dark ground, red accent, per-product
  neon signs, wet street, mask name reveal. Print, reduced-motion, and a mobile
  avenue reflow (no film grain).
- `fonts/` + `fonts.css` — Instrument Sans + Syne.
- `favicon.svg` — JB maker’s mark (personal; studio uses JM).

## Shipping

1. Bump `?v=` on `resume.css` / `resume.js` (and favicon if changed) when shipping.
2. Push `main` → GitHub Pages (~10 min CDN lag).
3. Update `docs/README.md` when structure changes.

| Change | Folder |
|---|---|
| This page | this repo |
| Studio sales site | `/Users/jbair/Projects/josh.menu` |
| Vault / Studio backend | `/Users/jbair/Projects/hub` |
| Client sites | `/Users/jbair/Projects/clients/<domain>` |
| Product apps | Their own folders |
