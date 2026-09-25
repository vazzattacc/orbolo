import { describe, expect, it } from "vitest";
import { getMetric } from "../../src/lib/metrics/metrics-repository";
import { metricSchema } from "../../src/lib/metrics/schema";

describe("getMetric", () => {
  it("returns a known metric with its value, date, and source", async () => {
    const metric = await getMetric("elTapirHectares");

    expect(metric).toBeDefined();
    expect(metric?.value).toBe(1000);
    expect(metric?.unit).toBe("ha");
    expect(metric?.asOfDate.length).toBeGreaterThan(0);
    expect(metric?.sourceDocumentRef.length).toBeGreaterThan(0);
  });

  it("returns undefined for a key that doesn't exist in the collection", async () => {
    const metric = await getMetric("doesNotExist");
    expect(metric).toBeUndefined();
  });
});

describe("metricSchema (FR-GEN-005: a number without a date+source must not be publishable)", () => {
  const validEntry = {
    id: "someMetric",
    value: 42,
    unit: "head",
    asOfDate: "2026-09-24",
    sourceDocumentRef: "Vaz, direct input, 2026-09-24",
  };

  it("accepts a fully valid entry", () => {
    expect(metricSchema.safeParse(validEntry).success).toBe(true);
  });

  it("rejects an entry missing asOfDate", () => {
    const withoutDate: Partial<typeof validEntry> = { ...validEntry };
    delete withoutDate.asOfDate;
    expect(metricSchema.safeParse(withoutDate).success).toBe(false);
  });

  it("rejects an entry with an empty sourceDocumentRef", () => {
    expect(metricSchema.safeParse({ ...validEntry, sourceDocumentRef: "" }).success).toBe(false);
  });

  it("rejects a malformed asOfDate", () => {
    expect(metricSchema.safeParse({ ...validEntry, asOfDate: "not-a-date" }).success).toBe(false);
  });
});
