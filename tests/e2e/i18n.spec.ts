import { test, expect } from "@playwright/test";

test.describe("Multilingual mechanism (User Story 8)", () => {
  test("root redirects toward a supported locale (client-side, static-site pattern)", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/\/(en|es|de)\//, { timeout: 5000 });
    expect(page.url()).toMatch(/\/(en|es|de)\/$/);
  });

  test("a page with no Spanish content shows the English fallback with a clear notice, not a silent draft", async ({ page }) => {
    // Home has no pages_es entry yet (spec.md non-goal: translation content
    // itself is out of scope) — this proves the fallback mechanism (FR-003),
    // which IS in scope, using that real gap rather than a synthetic fixture.
    await page.goto("/es/");
    await expect(page.getByRole("status")).toContainText(/español/i);
    // Content itself is still the real (English) Home page, not an error page.
    await expect(page.getByRole("link", { name: "Invest in a herd" }).first()).toBeVisible();
  });

  test("hreflang tags are present for en/es/de on Home and Invest", async ({ page }) => {
    for (const path of ["/en/", "/en/invest"]) {
      await page.goto(path);
      for (const locale of ["en", "es", "de"]) {
        const link = page.locator(`link[rel="alternate"][hreflang="${locale}"]`);
        await expect(link).toHaveCount(1);
      }
    }
  });

  test("a manual language switcher path is reachable regardless of auto-redirect (nav stays locale-prefixed)", async ({ page }) => {
    await page.goto("/en/");
    // The nav's own links stay within /en/, proving locale-prefixed routing
    // is live (not just the root redirect) — a real switcher UI is a content
    // task, but the routing it would rely on is verified here.
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Invest", exact: true })).toHaveAttribute(
      "href",
      "/en/invest",
    );
  });

  test("The Code and Glossary are translated into Spanish (FR-039)", async ({ page }) => {
    await page.goto("/es/the-code");
    await expect(page.getByText(/Todos los animales en Remote Rancher están etiquetados/)).toBeVisible();

    await page.goto("/es/glossary");
    await expect(page.getByText(/La dieta del animal es pasto/)).toBeVisible();
  });
});
