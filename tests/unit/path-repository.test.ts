import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * path-repository.ts validates and reads lib/paths/paths.json at import
 * time, so each scenario mocks the JSON module and re-imports fresh via
 * vi.resetModules() rather than testing against the real content file.
 */
async function loadRepositoryWithFixture(fixture: unknown) {
  vi.resetModules();
  vi.doMock("../../lib/paths/paths.json", () => ({ default: fixture }));
  return import("../../lib/paths/path-repository");
}

const basePublished = {
  id: "verdant",
  title: "Verdant",
  description: "Short card copy for Verdant.",
  image: { src: "/images/paths/verdant.svg", alt: "Verdant alt text" },
  destination: "/paths/verdant",
  order: 1,
};

describe("path-repository", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("includes a fully-populated entry in getPublishedPaths()", async () => {
    const repo = await loadRepositoryWithFixture([basePublished]);
    const published = await repo.getPublishedPaths();
    expect(published).toHaveLength(1);
    expect(published[0].id).toBe("verdant");
  });

  it.each([
    ["title", { ...basePublished, title: "" }],
    ["description", { ...basePublished, description: "" }],
    ["image.src", { ...basePublished, image: { ...basePublished.image, src: "" } }],
    ["image.alt", { ...basePublished, image: { ...basePublished.image, alt: "" } }],
    ["destination", { ...basePublished, destination: "" }],
  ])("excludes an entry missing required field %s", async (_field, entry) => {
    const repo = await loadRepositoryWithFixture([entry]);
    const published = await repo.getPublishedPaths();
    expect(published).toHaveLength(0);
  });

  it("appears once a previously-pending entry has all required fields filled in", async () => {
    const pending = {
      id: "business-meat",
      title: "",
      description: "",
      image: { src: "", alt: "" },
      destination: "",
    };
    let repo = await loadRepositoryWithFixture([pending]);
    expect(await repo.getPublishedPaths()).toHaveLength(0);

    const completed = {
      id: "business-meat",
      title: "Business & Meat",
      description: "Business-facing meat purchasing.",
      image: { src: "/images/paths/business-meat.svg", alt: "Business meat alt text" },
      destination: "/paths/business-meat",
    };
    repo = await loadRepositoryWithFixture([completed]);
    expect(await repo.getPublishedPaths()).toHaveLength(1);
  });

  it("sorts published entries by order, then declaration order for entries without order", async () => {
    const b = { ...basePublished, id: "b-path", destination: "/paths/b-path", order: 2 };
    const a = { ...basePublished, id: "a-path", destination: "/paths/a-path", order: 1 };
    const noOrder1 = { ...basePublished, id: "no-order-1", destination: "/paths/no-order-1", order: undefined };
    const noOrder2 = { ...basePublished, id: "no-order-2", destination: "/paths/no-order-2", order: undefined };
    const repo = await loadRepositoryWithFixture([noOrder1, b, noOrder2, a]);
    const published = await repo.getPublishedPaths();
    expect(published.map((p) => p.id)).toEqual(["a-path", "b-path", "no-order-1", "no-order-2"]);
  });

  it("rejects a non-kebab-case id", async () => {
    await expect(
      loadRepositoryWithFixture([{ ...basePublished, id: "Verdant_Path" }]),
    ).rejects.toThrow(/kebab-case/);
  });

  it("rejects a published entry whose destination is not /paths/{id}", async () => {
    await expect(
      loadRepositoryWithFixture([{ ...basePublished, destination: "https://example.com/verdant" }]),
    ).rejects.toThrow(/internal routes/);
  });

  it("rejects duplicate ids", async () => {
    await expect(
      loadRepositoryWithFixture([basePublished, { ...basePublished }]),
    ).rejects.toThrow(/Duplicate/);
  });

  it("getPathById returns a pending entry too (route layer decides visibility)", async () => {
    const pending = {
      id: "business-meat",
      title: "",
      description: "",
      image: { src: "", alt: "" },
      destination: "",
    };
    const repo = await loadRepositoryWithFixture([pending]);
    const found = await repo.getPathById("business-meat");
    expect(found?.id).toBe("business-meat");
    expect(repo.isPathPublished(found!)).toBe(false);
  });

  it("getPathById returns undefined for an unknown id", async () => {
    const repo = await loadRepositoryWithFixture([basePublished]);
    expect(await repo.getPathById("does-not-exist")).toBeUndefined();
  });
});
