import { describe, expect, it } from "vitest";
import { getNotFoundContent } from "../../src/lib/notFound/not-found-repository";
import { notFoundContentSchema } from "../../src/lib/notFound/schema";

describe("getNotFoundContent", () => {
  it("returns the 404 copy with every field populated", async () => {
    const content = await getNotFoundContent();
    expect(content.heading.length).toBeGreaterThan(0);
    expect(content.body.length).toBeGreaterThan(0);
    expect(content.homeLinkLabel.length).toBeGreaterThan(0);
  });
});

describe("notFoundContentSchema", () => {
  it("rejects an entry with an empty heading", () => {
    const result = notFoundContentSchema.safeParse({
      id: "notFound",
      heading: "",
      body: "x",
      homeLinkLabel: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-'notFound' id", () => {
    const result = notFoundContentSchema.safeParse({
      id: "somethingElse",
      heading: "x",
      body: "x",
      homeLinkLabel: "x",
    });
    expect(result.success).toBe(false);
  });
});
