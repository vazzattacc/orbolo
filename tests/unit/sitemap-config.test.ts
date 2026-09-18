import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// FR-040. The sitemap only exists in a production build (dev mode never
// generates it), so this is a structural regression guard for the two
// requirements a real `pnpm build` proved necessary (research.md §11):
// the `site` config (without it @astrojs/sitemap silently no-ops) and the
// sitemap integration itself being registered.
describe("sitemap configuration (T059)", () => {
  it("astro.config.mjs declares a `site` URL and the sitemap integration", () => {
    const config = readFileSync(join(__dirname, "../../astro.config.mjs"), "utf-8");
    expect(config).toMatch(/site:\s*["']https?:\/\//);
    expect(config).toMatch(/sitemap\(\)/);
  });

  it("@astrojs/sitemap is pinned to an exact, Astro-4-compatible version (not a caret range)", () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, "../../package.json"), "utf-8"));
    expect(pkg.dependencies["@astrojs/sitemap"]).not.toMatch(/^[\^~]/);
  });
});
