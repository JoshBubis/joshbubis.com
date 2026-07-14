# AGENTS.md — joshbubis.com

Static GitHub Pages portfolio / hireable site.
`/Users/jbair/Projects/joshbubis.com`.

## Hybrid with Hub (keep this in mind)

This site is the **public face**. Hub owns Studio, contracts, contact verify,
Vault, and Access. Cursor often has Hub open as the workspace — still edit
**this** folder for portfolio UI. Do not merge the two repos unless Josh asks.

| Host | Owns it |
|---|---|
| `joshbubis.com` | **This repo** (Pages) |
| `hub.joshbubis.com` / `studio.joshbubis.com` / `contracts.joshbubis.com` | Hub |

| Change | Folder |
|---|---|
| HTML/CSS/JS, work rail, screenshots, contact form UI | this repo |
| Turnstile secret, SES, Vault, Studio/Client Work | `/Users/jbair/Projects/hub` |
| Product apps | Their own folders |

## Shipping (user-visible)

1. Bump `?v=` on `style.css` / `script.js` (and images if JPEGs changed).
2. `cp style.css studio.css` when styles change.
3. Push `main`. CDN/HTML can lag ~10 minutes.
4. Update `docs/README.md` when structure/behavior changes.

## Easy foot-guns

- Work shots are **static JPEGs** (`images/work/`), not live. Refresh with
  `npm install && npm run capture-work`, then commit.
- Do **not** put scroll-reveal opacity on work panels (off-screen rail cards stay invisible).
- Nav jumps: `scroll-padding-top` only — never also `scroll-margin-top` on sections.

Hub details: `/Users/jbair/Projects/hub/AGENTS.md`, `docs/portfolio-contact.md`, `docs/studio.md`.
