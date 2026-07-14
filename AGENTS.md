# AGENTS.md — joshbubis.com

Static GitHub Pages portfolio / hireable site. Local path:
`/Users/jbair/Projects/joshbubis.com`.

**Hybrid with Hub:** this site is the public face; Hub owns Studio, contracts,
contact verify, Vault, and Access. Cursor often has Hub open as the workspace —
still edit **this** folder for portfolio UI. Full map:
`/Users/jbair/Projects/hub/docs/portfolio-hybrid.md`.

## What belongs here

- Public marketing HTML/CSS/JS (`index.html`, `contact.html`, `style.css`, `script.js`)
- Work-rail UI (static homepage JPEGs, arrows/dots/drag, clickable shot links)
- Copy, layout, and client-side contact form UX that **posts to Hub**

## What does **not** belong here

| Concern | Work in instead |
|---|---|
| Client Work / Studio, PDF, accept links, `contracts.joshbubis.com`, `studio.joshbubis.com` | `/Users/jbair/Projects/hub` |
| Contact form Turnstile **secret**, SES send, Vault keys | `/Users/jbair/Projects/hub` (`/webhooks/contact`) |
| Catamist, HackyChat, Relayra, CalledFrom product code | Their own project folders |

Do not merge this repo into Hub unless Josh explicitly asks.

## Shipping checklist (every user-visible change)

1. Edit files in **this** repo only (for UI).
2. Bump `?v=` on `style.css` / `script.js` (and image URLs if JPEGs changed).
3. Sync `studio.css` from `style.css` if you changed shared styles (`cp style.css studio.css`).
4. Push `main` → GitHub Pages. Expect up to ~10 minutes of CDN/HTML cache lag
   unless Hub purges Cloudflare for `joshbubis.com`.
5. Update `docs/README.md` when behavior or structure changes.

## Work screenshots

- Static files: `images/work/{slug}.jpg` — **not** live captures per page view.
- Refresh: `npm install && npm run capture-work`, then commit the JPEGs.
- Capture waits for real content (HackyChat needs `.story-card-title`). Rejects
  suspiciously small/blank files.
- Work panels must **not** use scroll-reveal opacity — off-screen rail cards
  would stay invisible.

## Scroll / nav

- Wheel/trackpad: native (`scroll-behavior: auto`).
- Hash links: JS `scrollIntoView` + `scroll-padding-top: var(--header-offset)` only.
- Never stack `scroll-margin-top` on sections on top of that padding.

## See also

- Hub `docs/portfolio-hybrid.md`, `docs/portfolio-contact.md`, `docs/studio.md`
- Hub `AGENTS.md` § Sibling projects
