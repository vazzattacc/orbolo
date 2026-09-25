import { describe, expect, it } from "vitest";
import { getRanches } from "../../src/lib/ranches/ranches-repository";
import { ranchCardSchema } from "../../src/lib/ranches/schema";

describe("getRanches", () => {
  it("returns an empty array without throwing when the collection has no entries (OQ-008/OQ-013)", async () => {
    const ranches = await getRanches();
    expect(ranches).toEqual([]);
  });
});

describe("ranchCardSchema", () => {
  const validEntry = {
    id: "ranch-04",
    codename: "Ranch 04",
    region: "Presidente Hayes",
    hectares: 1200,
    grazingSystem: "Rotational holistic",
    yearsInTransition: 3,
    mpcsStatus: "member",
    checklistFlags: {
      mpcsMember: true,
      minYearsTransition: true,
      waterSecurity: true,
      deforestationFreeSatellite: true,
      contractInPlace: false,
    },
    threshold: 200,
    committedUnderLoi: 0,
    status: "Open for LOI",
    updatedDate: "2026-09-24",
  };

  it("accepts a fully valid entry", () => {
    expect(ranchCardSchema.safeParse(validEntry).success).toBe(true);
  });

  it("rejects an invalid status value", () => {
    expect(ranchCardSchema.safeParse({ ...validEntry, status: "Somewhere in between" }).success).toBe(false);
  });

  it("rejects a negative hectares value", () => {
    expect(ranchCardSchema.safeParse({ ...validEntry, hectares: -10 }).success).toBe(false);
  });
});
