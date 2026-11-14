import { expect, type Page } from "@playwright/test";

/**
 * Approved exception (site owner, 2026-10-28): the Beef page's "What we sell
 * today" sentence says "regenerative standard", against the brief's rule 7
 * ("never 'regenerative' for today's beef"). It must carry its visible review
 * flag, and the word stays banned everywhere else — so callers scan the page
 * with that one section removed.
 */
export async function bodyTextOutsideRegenerativeException(page: Page): Promise<string> {
  const section = page.locator('section[aria-labelledby="what-we-sell-heading"]');
  if ((await section.count()) > 0) {
    await expect(section.locator(".flag")).toBeVisible();
    await section.evaluate((el) => el.remove());
  }
  return (await page.locator("body").innerText()).toLowerCase();
}
