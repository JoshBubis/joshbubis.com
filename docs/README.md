# joshbubis.com


**Cloudflare / Turnstile / purge (portfolio):** [`shared_docs/CLOUDFLARE.md`](../../shared_docs/CLOUDFLARE.md) — Hub owns the API token; 401 on purge ≠ rotate Vault.

Designed personal landing for job applications — short on purpose. Employers get
the full résumé as a PDF; this page is name, positioning, products, and contact.

**Hard rule:** no selling copy, no chat/form, no employer/task lists. Josh.Menu
in Selected work is expected. See root [`AGENTS.md`](../AGENTS.md).

### Structure

- `index.html` — full-bleed night-city hero (name in the sky, product districts
  as signed buildings: roof names, Catamist globe, Relayra antenna), then
  charter lede, focus tags, footer.
- `resume.css` — self-contained city + type. Dark ground, red accent, per-product
  neon, wet street, print + reduced-motion. Mobile is a horizontal snap-scroll
  avenue (not stacked cards). No film grain.
- `resume.js` — enter animation, cursor glow, scroll progress, chip stagger,
  skyline parallax, avenue snap lighting + dots, coarse-pointer tap-to-inspect
  on wide viewports.
- `fonts/` + `fonts.css` — Instrument Sans + Syne.
- `favicon.svg` — JB mark.
- `404.html` — branded Pages 404 (self-contained; no studio links).

### City interaction

Desktop: product names stay readable on the buildings at rest. Hover or
keyboard focus lights that district the same way, shows a dossier at the
*foot* of the block (never over the sign), and the stack as floor plates.
Click the district to open the product.

Mobile: swipe the avenue left-to-right (scroll-snap). Far skyline stays put;
the current block lights, neighbors peek. Dossier + stack stay on the plaque
under that block. Dots / `01 / 05` jump to a district. A swipe does not
follow the product link — a tap does.

Coarse pointers on a wide viewport get tap-to-inspect, then a second tap
follows the link.

### Boundaries

| Concern | Folder |
|---|---|
| This page | `/Users/jbair/Projects/joshbubis.com` |
| Studio (`josh.menu`) | `/Users/jbair/Projects/josh.menu` |
| Hub / Studio backend | `/Users/jbair/Projects/hub` |
| Client sites | `/Users/jbair/Projects/clients/<domain>` |

### Deploy

Push `main` → GitHub Pages. Bump `resume.css?v=` (and `resume.js?v=` if the
script changed) on style/behavior changes.
