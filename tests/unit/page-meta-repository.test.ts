import { describe, expect, it } from "vitest";
import { getPageMeta } from "../../src/lib/pageMeta/page-meta-repository";
import { pageMetaSchema } from "../../src/lib/pageMeta/schema";

describe("getPageMeta", () => {
  it("returns the entry for a known route", async () => {
    const meta = await getPageMeta("/invest");
    expect(meta).toBeDefined();
    expect(meta?.description.length).toBeGreaterThan(0);
    expect(meta?.indexable).toBe(true);
  });

  it("returns undefined for an unknown route", async () => {
    const meta = await getPageMeta("/does-not-exist");
    expect(meta).toBeUndefined();
  });

  it("every known route's description is unique (SC-002, cross-entry check)", async () => {
    const routes = ["/", "/invest", "/beef", "/land", "/contact"];
    const metas = await Promise.all(routes.map((r) => getPageMeta(r)));
    const descriptions = metas.map((m) => m?.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

describe("pageMetaSchema", () => {
  const validEntry = {
    id: "home",
    route: "/",
    description: "A description long enough to pass the minimum length check easily.",
    indexable: true,
  };

  it("accepts a fully valid entry", () => {
    expect(pageMetaSchema.safeParse(validEntry).success).toBe(true);
  });

  it("rejects a route that doesn't start with /", () => {
    expect(pageMetaSchema.safeParse({ ...validEntry, route: "invest" }).success).toBe(false);
  });

  it("rejects a description that's clearly too short to be real", () => {
    expect(pageMetaSchema.safeParse({ ...validEntry, description: "Too short." }).success).toBe(false);
  });
});
