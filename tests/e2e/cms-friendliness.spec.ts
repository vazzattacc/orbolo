import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PATHS_JSON = path.resolve(__dirname, "../../lib/paths/paths.json");

test.describe("CMS-friendliness (User Story 4)", () => {
  // Mutates the real content file (and restores it afterwards). Runs in its
  // own "cms-mutation" Playwright project (see playwright.config.ts), which
  // depends on chromium/mobile-chrome finishing first, so no other test is
  // concurrently hitting "/" while paths.json is being rewritten.
  test("adding a path, and completing a previously-pending entry, changes the grid with zero component changes", async ({ page }) => {
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
          image: { src: "/images/paths/remote-rancher.svg", alt: "Sixth path placeholder image" },
          destination: "/paths/sixth-path-e2e",
          order: 6,
        },
      ];
      writeFileSync(PATHS_JSON, JSON.stringify(withSixthPath, null, 2));
      await expect(async () => {
        await page.goto("/", { waitUntil: "networkidle" });
        await expect(page.getByRole("list").getByRole("link")).toHaveCount(6);
      }).toPass({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Sixth Path" })).toBeVisible();

      // A fresh, still-pending 7th entry (not tied to any real product) —
      // proves the FR-018 pending/hidden mechanism independently of whether
      // any real launch path happens to be pending right now.
      const withSeventhPathPending = [
        ...withSixthPath,
        {
          id: "seventh-path-e2e",
          title: "",
          description: "",
          image: { src: "", alt: "" },
          destination: "",
          order: 7,
        },
      ];
      writeFileSync(PATHS_JSON, JSON.stringify(withSeventhPathPending, null, 2));
      await expect(async () => {
        await page.goto("/", { waitUntil: "networkidle" });
        await expect(page.getByRole("list").getByRole("link")).toHaveCount(6);
      }).toPass({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Seventh Path" })).not.toBeVisible();

      const withSeventhPathCompleted = withSeventhPathPending.map((entry: { id: string }) =>
        entry.id === "seventh-path-e2e"
          ? {
              ...entry,
              title: "Seventh Path",
              description: "A seventh path, completed purely via configuration.",
              image: { src: "/images/paths/remote-rancher.svg", alt: "Seventh path placeholder image" },
              destination: "/paths/seventh-path-e2e",
            }
          : entry,
      );
      writeFileSync(PATHS_JSON, JSON.stringify(withSeventhPathCompleted, null, 2));
      await expect(async () => {
        await page.goto("/", { waitUntil: "networkidle" });
        await expect(page.getByRole("list").getByRole("link")).toHaveCount(7);
      }).toPass({ timeout: 15_000 });
      await expect(page.getByRole("heading", { name: "Seventh Path" })).toBeVisible();
    } finally {
      writeFileSync(PATHS_JSON, original);
    }
  });
});
