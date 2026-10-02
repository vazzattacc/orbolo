import { describe, expect, it } from "vitest";
import { getLegalDocument } from "../../src/lib/legal/legal-repository";
import { legalDocumentSchema } from "../../src/lib/legal/schema";

describe("getLegalDocument", () => {
  it("returns undefined for an entry that exists but isn't approved yet", async () => {
    // Both privacy and terms are fetched but approved: false as of this
    // test (FR-LEG-007) — see research.md §12.
    const privacy = await getLegalDocument("privacy");
    const terms = await getLegalDocument("terms");
    expect(privacy).toBeUndefined();
    expect(terms).toBeUndefined();
  });
});

describe("legalDocumentSchema", () => {
  const validEntry = {
    id: "privacy",
    sourceUrl: "https://www.orbolo.com/privacy-policy",
    fetchedOn: "2026-10-02",
    body: [{ heading: "1. Introduction", paragraphs: ["Some text."] }],
    approved: true,
    reviewNotes: [],
  };

  it("accepts a fully valid entry, including empty reviewNotes", () => {
    expect(legalDocumentSchema.safeParse(validEntry).success).toBe(true);
  });

  it("rejects an id outside the privacy/terms enum", () => {
    expect(legalDocumentSchema.safeParse({ ...validEntry, id: "imprint" }).success).toBe(false);
  });

  it("rejects an entry with an empty body array", () => {
    expect(legalDocumentSchema.safeParse({ ...validEntry, body: [] }).success).toBe(false);
  });

  it("rejects a malformed fetchedOn date", () => {
    expect(legalDocumentSchema.safeParse({ ...validEntry, fetchedOn: "yesterday" }).success).toBe(false);
  });
});
