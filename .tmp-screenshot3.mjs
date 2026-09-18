import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4321/en/", { waitUntil: "networkidle" });
const el = await page.getByRole("list", { name: "Partners" }).elementHandle();
const box = await el.boundingBox();
await page.screenshot({
  path: "/private/tmp/claude-501/-Users-vsmbatyan-Repositories-claude-webs-orbolo/d6b1cdd4-ae68-4d72-bca7-84061fd020e1/scratchpad/screenshots/home-partnerstrip-fixed2.png",
  clip: { x: 0, y: Math.max(0, box.y - 100), width: 1440, height: box.height + 200 },
});
await browser.close();
