import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PATHS_JSON = path.resolve(__dirname, "../../lib/paths/paths.json");

test.describe("CMS-friendliness (User Story 4)", () => {
  // Mutates the real content file (and restores it afterwards). Runs in its
  // own "cms-mutation" Playwright project (see playwright.config.ts), which
  // depends on chromium/mobile-chrome finishing first, so no other test is
  // concurrently hitting "/" while paths.json is being rewritten.
  test("adding a path to paths.json, and completing business-meat, changes the grid with zero component changes", async ({ page }) => {
    test.setTimeout(60_000);
    const original = readFileSync(PATHS_JSON, "utf-8");

    try {
      const paths = JSON.parse(original);

      const withSixthPath = [
        ...paths,
        {
          id: "sixth-path-e2e",
          title: "Sixth Path",
          description: "A sixth path added purely via configuration.",
          image: { src: "/images/paths/verdant.svg", alt: "Sixth path placeholder image" },
          destination: "/paths/sixth-path-e2e",
          order: 6,
        },
      ];
      writeFileSync(PATHS_JSON, JSON.stringify(withSixthPath, null, 2));
      await expect(async () => {
        await page.goto("/", { waitUntil: "networkidle" });
        await expect(page.getByRole("list").getByRole("link")).toHaveCount(5);
      }).toPass({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Sixth Path" })).toBeVisible();

      const withBusinessMeatCompleted = withSixthPath.map((entry: { id: string }) =>
        entry.id === "business-meat"
          ? {
              ...entry,
              title: "Business & Meat",
              description: "Business-facing meat purchasing, now configured.",
              image: { src: "/images/paths/verdant.svg", alt: "Business meat placeholder image" },
              destination: "/paths/business-meat",
            }
          : entry,
      );
      writeFileSync(PATHS_JSON, JSON.stringify(withBusinessMeatCompleted, null, 2));
      await expect(async () => {
        await page.goto("/", { waitUntil: "networkidle" });
        await expect(page.getByRole("list").getByRole("link")).toHaveCount(6);
      }).toPass({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Business & Meat" })).toBeVisible();
    } finally {
      writeFileSync(PATHS_JSON, original);
    }
  });
});
