import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { assertContentCompliance, BANNED_WORDS } from "@/lib/content/compliance";

describe("assertContentCompliance", () => {
  it("passes clean, compliant copy", () => {
    const result = assertContentCompliance(
      "Investors own the cattle. Our ranches raise them. Orbolo's trading desk sells the beef.",
    );
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it.each(BANNED_WORDS)("flags the banned word '%s'", (word) => {
    const result = assertContentCompliance(`This is a ${word} approach to ranching.`);
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.type === "banned-word" && v.match.toLowerCase() === word)).toBe(true);
  });

  it("is case-insensitive for banned words", () => {
    const result = assertContentCompliance("This is a SUSTAINABLE approach.");
    expect(result.passed).toBe(false);
  });

  it("flags 'regenerative' by default (general context)", () => {
    const result = assertContentCompliance("Our beef today is regenerative.");
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.type === "regenerative")).toBe(true);
  });

  it("allows 'regenerative' in glossary context", () => {
    const result = assertContentCompliance("Regenerative: a term we do not yet apply to our beef.", {
      context: "glossary",
    });
    expect(result.violations.some((v) => v.type === "regenerative")).toBe(false);
  });

  it("flags 'guaranteed'", () => {
    const result = assertContentCompliance("Your returns are guaranteed.");
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.type === "guaranteed")).toBe(true);
  });

  it("allows the FR-015-required negated phrasing 'never guaranteed'", () => {
    const result = assertContentCompliance("Target ranges only — returns are never guaranteed.");
    expect(result.violations.some((v) => v.type === "guaranteed")).toBe(false);
  });

  it("allows 'not guaranteed' and 'no guaranteed return' too", () => {
    expect(
      assertContentCompliance("This is not guaranteed.").violations.some((v) => v.type === "guaranteed"),
    ).toBe(false);
    expect(
      assertContentCompliance("There is no guaranteed outcome here.").violations.some((v) => v.type === "guaranteed"),
    ).toBe(false);
  });

  it("does not false-positive on substrings (e.g. 'sustainability' vs a hypothetical banned root)", () => {
    // "impact" is banned as a whole word; "impacted" should still match \bimpact\b? No —
    // \b anchors mean "impacted" does NOT match \bimpact\b as a whole word.
    const result = assertContentCompliance("The rainfall impacted grazing this season.");
    expect(result.violations.some((v) => v.type === "banned-word" && v.match.toLowerCase() === "impact")).toBe(
      false,
    );
  });

  it("reports context around each match", () => {
    const result = assertContentCompliance("We take a holistic approach to land.");
    expect(result.violations[0].context).toContain("holistic");
  });
});

describe("assertContentCompliance against real authored content (regression, T037)", () => {
  it("the populated Beef page passes the compliance gate", () => {
    const raw = JSON.parse(readFileSync(join(__dirname, "../../src/content/pages_en/beef.json"), "utf-8"));
    const sections = JSON.parse(raw.sectionsJson);
    const strings: string[] = [];
    const collect = (value: unknown) => {
      if (typeof value === "string") strings.push(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") Object.values(value).forEach(collect);
    };
    collect(sections);
    const result = assertContentCompliance([raw.title, raw.seoDescription, ...strings].join("\n"));
    expect(result.violations).toEqual([]);
    expect(result.passed).toBe(true);
  });
});
