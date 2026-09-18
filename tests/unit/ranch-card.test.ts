import { describe, it, expect } from "vitest";
import { toRanchView, type RanchInput } from "@/lib/content/ranches";

// RanchCard.astro renders exactly what toRanchView returns — this test
// confirms that contract at the data layer (the component itself has no
// separate logic to diverge from it), complementing the deeper coverage in
// tests/unit/ranches.test.ts.

function makeRanch(overrides: Partial<RanchInput> = {}): RanchInput {
  return {
    codename: "Ranch 09",
    region: "Itapúa",
    hectares: 800,
    system: "silvopasture",
    mpcsStatus: "member",
    checklist: {
      mpcsMember: true,
      minYearsTransition: true,
      waterSecurity: true,
      deforestationFreeSatellite: true,
      contractInPlace: true,
    },
    threshold: 200,
    updatedDate: "2026-09-16",
    manualStatus: "",
    photos: ["a.jpg", "b.jpg"],
    ownerConsentNamed: false,
    ownerConsentPhotographed: false,
    exactName: "Real Owner Name",
    exactLocation: "Exact GPS pin",
    owner: "Real Owner Inc.",
    ...overrides,
  };
}

describe("RanchCard data contract (toRanchView)", () => {
  it("what RanchCard would render never includes exactName/exactLocation/owner", () => {
    const view = toRanchView(makeRanch(), [], new Date("2026-09-17"));
    const serialized = JSON.stringify(view);
    expect(serialized).not.toContain("Real Owner Name");
    expect(serialized).not.toContain("Exact GPS pin");
    expect(serialized).not.toContain("Real Owner Inc.");
  });

  it("uses codename as displayName by default", () => {
    const view = toRanchView(makeRanch(), [], new Date("2026-09-17"));
    expect(view.displayName).toBe("Ranch 09");
  });

  it("omits photos without photographed consent, even though the raw record has them", () => {
    const view = toRanchView(makeRanch(), [], new Date("2026-09-17"));
    expect(view.photos).toBeUndefined();
  });
});
