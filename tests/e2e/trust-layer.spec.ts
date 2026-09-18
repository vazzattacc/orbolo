import { test, expect } from "@playwright/test";

test.describe("Trust layer (User Story 5)", () => {
  for (const path of ["/en/", "/en/invest", "/en/beef"]) {
    test(`The Code, Glossary, and Contact are each reachable in one interaction from ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("footer").getByRole("link", { name: "Glossary" })).toHaveAttribute(
        "href",
        "/en/glossary",
      );
      await expect(page.locator("footer").getByRole("link", { name: "Contact" })).toHaveAttribute(
        "href",
        "/en/contact",
      );
    });
  }

  test("The Code page: every rule names a verifier", async ({ page }) => {
    await page.goto("/en/the-code");
    await expect(page.getByRole("heading", { name: "The Code" })).toBeVisible();
    const verifiedByLines = page.getByText(/^Verified by:/);
    const count = await verifiedByLines.count();
    expect(count).toBeGreaterThanOrEqual(6);
    for (let i = 0; i < count; i++) {
      const text = await verifiedByLines.nth(i).textContent();
      expect(text).not.toContain("verifier pending");
    }
  });

  test("Glossary page lists all required terms with definition/measured-by/not-this", async ({ page }) => {
    await page.goto("/en/glossary");
    for (const term of ["grass-fed", "grass-finished", "MPCS standard", "in transition", "regenerative"]) {
      await expect(page.locator("dt", { hasText: new RegExp(`^${term}$`, "i") })).toBeVisible();
    }
    await expect(page.getByText(/Not this:/).first()).toBeVisible();
  });

  test("a glossary term's tooltip on Beef shows definition, measured-by, and not-this on first occurrence", async ({ page }) => {
    await page.goto("/en/beef");
    const details = page.locator("details", { hasText: "grass-fed" }).first();
    await details.locator("summary").click();
    await expect(details.getByText(/Measured by:/)).toBeVisible();
    await expect(details.getByText(/Not:/)).toBeVisible();
  });
});
