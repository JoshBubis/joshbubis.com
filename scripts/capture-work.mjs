import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "images", "work");
fs.mkdirSync(outDir, { recursive: true });

const sites = [
  { slug: "catamist", url: "https://catamist.com/" },
  { slug: "hackychat", url: "https://hacky.chat/" },
  { slug: "relayra", url: "https://www.relayra.com/" },
  { slug: "joshmenu", url: "https://josh.menu/" },
  { slug: "calledfrom", url: "https://calledfrom.com/" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const site of sites) {
  const page = await context.newPage();
  try {
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      document.querySelectorAll(
        '[class*="cookie"], [class*="consent"], [class*="privacy"], [id*="cookie"], [id*="consent"], [role="dialog"], dialog'
      ).forEach((el) => {
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
    await page.waitForTimeout(500);
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
  } finally {
    await page.close();
  }
}

await browser.close();
