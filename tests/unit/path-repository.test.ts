import { describe, expect, it } from "vitest";
import { getPaths } from "../../src/lib/paths/path-repository";
import { pathCardSchema } from "../../src/lib/paths/schema";

describe("getPaths", () => {
  it("returns exactly the 3 configured entries, sorted by order", async () => {
    const paths = await getPaths();

    expect(paths).toHaveLength(3);
    expect(paths.map((p) => p.id)).toEqual(["investors", "buyers", "landowners"]);
  });

  it("returns entries with all required PathCard fields populated", async () => {
    const paths = await getPaths();

    for (const path of paths) {
      expect(path.title.length).toBeGreaterThan(0);
      expect(path.description.length).toBeGreaterThan(0);
      expect(path.image.src.length).toBeGreaterThan(0);
      expect(path.image.alt.length).toBeGreaterThan(0);
      expect(path.destination.startsWith("/")).toBe(true);
      expect(path.targetAudience.length).toBeGreaterThan(0);
    }
  });
});

describe("pathCardSchema", () => {
  const validEntry = {
    id: "landowners",
    title: "Land",
    description: "Put idle land to work.",
    image: { src: "/images/paths/landowners.jpg", alt: "A grazing pasture." },
    destination: "/land",
    targetAudience: "Landowners",
    order: 3,
  };

  it("accepts a fully valid entry", () => {
    expect(pathCardSchema.safeParse(validEntry).success).toBe(true);
  });

  it("rejects a destination that isn't an internal route (FR-023)", () => {
    const result = pathCardSchema.safeParse({
      ...validEntry,
      destination: "https://example.com/land",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty id, title, description, or alt text (FR-017)", () => {
    expect(pathCardSchema.safeParse({ ...validEntry, id: "" }).success).toBe(false);
    expect(pathCardSchema.safeParse({ ...validEntry, title: "" }).success).toBe(false);
    expect(pathCardSchema.safeParse({ ...validEntry, description: "" }).success).toBe(false);
    expect(
      pathCardSchema.safeParse({ ...validEntry, image: { ...validEntry.image, alt: "" } })
        .success,
    ).toBe(false);
  });

  it("rejects a non-slug id", () => {
    expect(pathCardSchema.safeParse({ ...validEntry, id: "Land Owners!" }).success).toBe(false);
  });
});
