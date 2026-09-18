import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// FR-041, SC-010. firebase.json's `redirects` array is what Firebase Hosting
// actually reads in production — this validates the config is well-formed
// and contains the mechanism's proof-of-life example redirect. A full
// live-redirect check would require a deployed Firebase project (or the
// Firebase emulator with a real hosting target); that's an ops-time
// verification step, not a repo-local one, so this test verifies the
// config Firebase will read is correct, not the live HTTP behavior.
describe("Firebase Hosting redirects (T062/T063)", () => {
  it("firebase.json exists at the repo root with a well-formed redirects array on the production target", () => {
    const config = JSON.parse(readFileSync(join(__dirname, "../../firebase.json"), "utf-8"));
    const production = config.hosting.find((entry: { target: string }) => entry.target === "production");
    expect(production).toBeDefined();
    expect(Array.isArray(production.redirects)).toBe(true);
    expect(production.redirects.length).toBeGreaterThan(0);
    for (const redirect of production.redirects) {
      expect(typeof redirect.source).toBe("string");
      expect(typeof redirect.destination).toBe("string");
      expect(redirect.type).toBe(301);
    }
  });

  it("includes at least one real example redirect from a legacy path into the new site", () => {
    const config = JSON.parse(readFileSync(join(__dirname, "../../firebase.json"), "utf-8"));
    const production = config.hosting.find((entry: { target: string }) => entry.target === "production");
    const example = production.redirects.find((r: { source: string }) => r.source === "/verdant");
    expect(example).toBeDefined();
    expect(example.destination).toBe("/en/invest");
  });
});
