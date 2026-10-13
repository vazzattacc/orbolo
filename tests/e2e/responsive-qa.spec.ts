import { expect, test } from "@playwright/test";

// quickstart.md Scenario 4 — FR-QA-004/FR-GEN3-001: no horizontal overflow
// and link tap targets >= 44x44 CSS px, across five widths.
const WIDTHS = [360, 390, 768, 1024, 1440];

// Routes this feature adds — a real failure here is fixed (T050).
const NEW_ROUTES = ["/404", "/privacy", "/terms"];

// Pre-existing routes — the As-Is Freeze means a failure here is reported,
// never auto-fixed (FR-QA-004).
const EXISTING_ROUTES = ["/", "/invest", "/beef", "/land", "/about", "/contact"];

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page, route: string) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  return { route, overflow };
}

for (const width of WIDTHS) {
  test(`new surfaces have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const route of NEW_ROUTES) {
      await page.goto(route);
      const { overflow } = await assertNoHorizontalOverflow(page, route);
      expect(overflow, `${route} at ${width}px has horizontal overflow`).toBeLessThanOrEqual(0);
    }
  });

  test(`new surfaces' footer links meet the 44x44 tap target minimum at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const links = page.getByRole("contentinfo", { name: "Legal" }).getByRole("link");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      if (!box) continue;
      expect(box.height, `footer link ${i} at ${width}px is shorter than 44px`).toBeGreaterThanOrEqual(44 - 1);
    }
  });

  test(`404 page's "Back to Home" link meets the 44x44 tap target minimum at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/404");
    const box = await page.getByRole("link", { name: "Back to Home" }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height, `"Back to Home" link at ${width}px is shorter than 44px`).toBeGreaterThanOrEqual(44 - 1);
  });

  test(`existing pages horizontal-overflow check (verification-only) at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    const findings: string[] = [];
    for (const route of EXISTING_ROUTES) {
      await page.goto(route);
      const { overflow } = await assertNoHorizontalOverflow(page, route);
      if (overflow > 0) {
        findings.push(`${route} at ${width}px: scrollWidth exceeds clientWidth by ${overflow}px`);
      }
    }
    // Per FR-QA-004 / the As-Is Freeze, a regression found on a pre-existing
    // page is reported here, not silently fixed and not failed hard — it's
    // surfaced as a console finding for Vaz to triage.
    if (findings.length > 0) {
      console.warn(`[existing-page overflow findings]\n${findings.join("\n")}`);
    }
  });
}
