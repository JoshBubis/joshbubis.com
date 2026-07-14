import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "images", "work");
fs.mkdirSync(outDir, { recursive: true });

/**
 * Per-site ready checks. Prefer waiting for real content over a fixed sleep —
 * SPAs (especially HackyChat) can still be empty after DOMContentLoaded.
 *
 * HackyChat note: homepage cards hydrate from `trending_grouped` (~2MB / 150
 * groups). Capture must wait for `.story-card-title`; the product itself is
 * slow because that payload is huge — worth trimming server-side later.
 */
const sites = [
  {
    slug: "catamist",
    url: "https://catamist.com/",
    ready: "h1",
    minTextLen: 40,
  },
  {
    slug: "hackychat",
    url: "https://hacky.chat/",
    ready: ".story-card-title",
    readyCount: 3,
    timeoutMs: 90000,
    minBytes: 120000,
  },
  {
    slug: "relayra",
    url: "https://www.relayra.com/",
    ready: "h1",
    minTextLen: 20,
  },
  {
    slug: "joshmenu",
    url: "https://josh.menu/",
    ready: "h1",
    minTextLen: 10,
  },
  {
    slug: "calledfrom",
    url: "https://calledfrom.com/",
    ready: "h1",
    minTextLen: 10,
  },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

async function waitForReady(page, site) {
  const timeout = site.timeoutMs || 45000;
  const selector = site.ready || "body";
  const need = site.readyCount || 1;
  const minText = site.minTextLen || 0;

  await page.waitForFunction(
    ({ sel, n, min }) => {
      const nodes = [...document.querySelectorAll(sel)];
      if (nodes.length < n) return false;
      if (!min) return true;
      const text = nodes.map((el) => (el.textContent || "").trim()).join(" ");
      return text.length >= min;
    },
    { sel: selector, n: need, min: minText },
    { timeout }
  );

  // Let late images / layout settle after content lands.
  await page.waitForTimeout(site.settleMs || 1500);
}

for (const site of sites) {
  const page = await context.newPage();
  try {
    await page.goto(site.url, {
      waitUntil: "domcontentloaded",
      timeout: site.timeoutMs || 60000,
    });

    await waitForReady(page, site);

    await page.evaluate(() => {
      document
        .querySelectorAll(
          '[class*="cookie"], [class*="consent"], [class*="privacy"], [id*="cookie"], [id*="consent"], [role="dialog"], dialog'
        )
        .forEach((el) => {
          const text = (el.textContent || "").toLowerCase();
          if (
            text.includes("cookie") ||
            text.includes("privacy") ||
            text.includes("consent") ||
            text.includes("analytics") ||
            el.getAttribute("role") === "dialog"
          ) {
            el.remove();
          }
        });
    });
    await page.waitForTimeout(300);

    const file = path.join(outDir, `${site.slug}.jpg`);
    await page.screenshot({
      path: file,
      type: "jpeg",
      quality: 82,
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    const bytes = fs.statSync(file).size;
    const minBytes = site.minBytes || 50000;
    if (bytes < minBytes) {
      throw new Error(
        `screenshot too small (${bytes} bytes < ${minBytes}) — likely blank/empty`
      );
    }
    console.log("ok", site.slug, `${Math.round(bytes / 1024)}kb`);
  } catch (err) {
    console.error("fail", site.slug, err.message);
    process.exitCode = 1;
  } finally {
    await page.close();
  }
}

await browser.close();
