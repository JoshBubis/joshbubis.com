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
 */
const sites = [
  {
    slug: "catamist",
    url: "https://catamist.com/",
    ready: 'main, [class*="article"], h1',
  },
  {
    slug: "hackychat",
    url: "https://hacky.chat/",
    // Homepage cards hydrate from a large trending_grouped payload (~2MB).
    ready: ".story-card-title",
    readyCount: 3,
    timeoutMs: 90000,
  },
  {
    slug: "relayra",
    url: "https://www.relayra.com/",
    ready: "h1, main",
  },
  {
    slug: "joshmenu",
    url: "https://josh.menu/",
    ready: "h1, main, table, [class*='card']",
  },
  {
    slug: "calledfrom",
    url: "https://calledfrom.com/",
    ready: "h1, main, form",
  },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

async function waitForReady(page, site) {
  const timeout = site.timeoutMs || 45000;
  const selector = site.ready;
  const need = site.readyCount || 1;

  if (!selector) {
    await page.waitForTimeout(2500);
    return;
  }

  await page.waitForFunction(
    ({ sel, n }) => document.querySelectorAll(sel).length >= n,
    { sel: selector, n: need },
    { timeout }
  );

  // Let late images / layout settle after content lands.
  await page.waitForTimeout(site.settleMs || 1200);
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
    console.log("ok", site.slug);
  } catch (err) {
    console.error("fail", site.slug, err.message);
    process.exitCode = 1;
  } finally {
    await page.close();
  }
}

await browser.close();
