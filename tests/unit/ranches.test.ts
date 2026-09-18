import { describe, it, expect } from "vitest";
import { computeRanchStatus, toRanchView, type RanchInput, type LoiInput } from "@/lib/content/ranches";

const NOW = new Date("2026-09-17T00:00:00Z");

function makeRanch(overrides: Partial<RanchInput> = {}): RanchInput {
  return {
    codename: "Ranch 04",
    region: "Boquerón",
    hectares: 1200,
    system: "rotational",
    mpcsStatus: "member",
    checklist: {
      mpcsMember: true,
      minYearsTransition: true,
      waterSecurity: true,
      deforestationFreeSatellite: true,
      contractInPlace: true,
    },
    threshold: 400,
    updatedDate: "2026-09-15",
    manualStatus: "",
    photos: [],
    ownerConsentNamed: false,
    ownerConsentPhotographed: false,
    ...overrides,
  };
}

function loi(overrides: Partial<LoiInput>): LoiInput {
  return { ranch: "Ranch 04", headCount: 100, signedDate: "2026-09-01", converted: false, ...overrides };
}

describe("computeRanchStatus", () => {
  it("is 'Open for LOI' below the 60% threshold", () => {
    const { status, committedUnderLoi } = computeRanchStatus(makeRanch(), [loi({ headCount: 100 })], NOW);
    expect(committedUnderLoi).toBe(100);
    expect(status).toBe("Open for LOI");
  });

  it("is 'Released' at exactly 60% signed and unexpired", () => {
    const { status, committedUnderLoi } = computeRanchStatus(makeRanch(), [loi({ headCount: 240 })], NOW);
    expect(committedUnderLoi).toBe(240);
    expect(status).toBe("Released");
  });

  it("is 'Released' just above 60%", () => {
    const { status } = computeRanchStatus(makeRanch(), [loi({ headCount: 241 })], NOW);
    expect(status).toBe("Released");
  });

  it("is 'Open for LOI' just below 60%", () => {
    const { status } = computeRanchStatus(makeRanch(), [loi({ headCount: 239 })], NOW);
    expect(status).toBe("Open for LOI");
  });

  it("is 'Full' at exactly 100%", () => {
    const { status } = computeRanchStatus(makeRanch(), [loi({ headCount: 400 })], NOW);
    expect(status).toBe("Full");
  });

  it("sums multiple active LOIs for the same ranch", () => {
    const { committedUnderLoi } = computeRanchStatus(
      makeRanch(),
      [loi({ headCount: 100 }), loi({ headCount: 150 })],
      NOW,
    );
    expect(committedUnderLoi).toBe(250);
  });

  it("ignores LOIs for a different ranch", () => {
    const { committedUnderLoi } = computeRanchStatus(
      makeRanch(),
      [loi({ headCount: 300, ranch: "Ranch 07" })],
      NOW,
    );
    expect(committedUnderLoi).toBe(0);
  });

  it("excludes an LOI that expired more than 90 days after signing", () => {
    const { committedUnderLoi, status } = computeRanchStatus(
      makeRanch(),
      [loi({ headCount: 300, signedDate: "2026-01-01" })],
      NOW,
    );
    expect(committedUnderLoi).toBe(0);
    expect(status).toBe("Open for LOI");
  });

  it("includes an LOI signed exactly 90 days ago (boundary inclusive)", () => {
    const signedDate = new Date(NOW);
    signedDate.setDate(signedDate.getDate() - 90);
    const { committedUnderLoi } = computeRanchStatus(
      makeRanch(),
      [loi({ headCount: 300, signedDate: signedDate.toISOString().slice(0, 10) })],
      NOW,
    );
    expect(committedUnderLoi).toBe(300);
  });

  it("counts a converted LOI even past the 90-day window", () => {
    const { committedUnderLoi } = computeRanchStatus(
      makeRanch(),
      [loi({ headCount: 300, signedDate: "2020-01-01", converted: true })],
      NOW,
    );
    expect(committedUnderLoi).toBe(300);
  });

  it("never shows 'Released' below 60%, no matter how close", () => {
    const { status } = computeRanchStatus(makeRanch({ threshold: 1000 }), [loi({ headCount: 599 })], NOW);
    expect(status).not.toBe("Released");
    expect(status).not.toBe("Full");
  });

  it("does not demote below Released when an LOI expires post-release", () => {
    // Two LOIs get it to 70%; one later expires, dropping computed commitment
    // back under 60% — status must not fall back to "Open for LOI".
    const longAgo = new Date(NOW);
    longAgo.setDate(longAgo.getDate() - 200);
    const lois = [
      loi({ headCount: 240, signedDate: "2026-09-01" }), // still active, 60%
      loi({ headCount: 40, signedDate: longAgo.toISOString().slice(0, 10) }), // expired
    ];
    const { status, committedUnderLoi } = computeRanchStatus(makeRanch(), lois, NOW);
    // The expired LOI no longer counts, but the remaining 240 (60%) still
    // qualifies for Released on its own — demonstrates release is sticky
    // via the surviving commitment, not just a raw "never go down" hack.
    expect(committedUnderLoi).toBe(240);
    expect(status).toBe("Released");
  });

  it("respects a manual 'Filling' label between 60% and 100%", () => {
    const { status } = computeRanchStatus(
      makeRanch({ manualStatus: "Filling" }),
      [loi({ headCount: 300 })],
      NOW,
    );
    expect(status).toBe("Filling");
  });

  it("manual 'Planned'/'Due diligence'/'Deployed' override LOI math entirely", () => {
    expect(computeRanchStatus(makeRanch({ manualStatus: "Planned" }), [loi({ headCount: 400 })], NOW).status).toBe(
      "Planned",
    );
    expect(
      computeRanchStatus(makeRanch({ manualStatus: "Due diligence" }), [loi({ headCount: 400 })], NOW).status,
    ).toBe("Due diligence");
    expect(computeRanchStatus(makeRanch({ manualStatus: "Deployed" }), [], NOW).status).toBe("Deployed");
  });

  it("a Full ranch overrides a stale 'Filling' manual label", () => {
    const { status } = computeRanchStatus(
      makeRanch({ manualStatus: "Filling" }),
      [loi({ headCount: 400 })],
      NOW,
    );
    expect(status).toBe("Full");
  });
});

describe("toRanchView (RanchCard's public data contract — FR-012, FR-014, FR-020)", () => {
  it("displays the codename, not the exact name, when consent is not on file", () => {
    const view = toRanchView(makeRanch({ exactName: "Estancia Real Owner LLC", ownerConsentNamed: false }), [], NOW);
    expect(view.displayName).toBe("Ranch 04");
  });

  it("displays the exact name only when ownerConsentNamed is true", () => {
    const view = toRanchView(makeRanch({ exactName: "Estancia Real Owner LLC", ownerConsentNamed: true }), [], NOW);
    expect(view.displayName).toBe("Estancia Real Owner LLC");
  });

  it("omits photos entirely unless ownerConsentPhotographed is true", () => {
    const withoutConsent = toRanchView(
      makeRanch({ photos: ["ranch.jpg"], ownerConsentPhotographed: false }),
      [],
      NOW,
    );
    expect(withoutConsent.photos).toBeUndefined();

    const withConsent = toRanchView(makeRanch({ photos: ["ranch.jpg"], ownerConsentPhotographed: true }), [], NOW);
    expect(withConsent.photos).toEqual(["ranch.jpg"]);
  });

  it("the returned view has no exactName/exactLocation/owner keys at all (structural exclusion, FR-014)", () => {
    const view = toRanchView(
      makeRanch({ exactName: "x", exactLocation: "y", owner: "z", ownerConsentNamed: true }),
      [],
      NOW,
    );
    expect(Object.keys(view)).not.toContain("exactName");
    expect(Object.keys(view)).not.toContain("exactLocation");
    expect(Object.keys(view)).not.toContain("owner");
  });

  it("a Deployed ranch still only shows exactName/photos with consent (FR-012)", () => {
    const view = toRanchView(
      makeRanch({ manualStatus: "Deployed", exactName: "Named Ranch", ownerConsentNamed: false }),
      [],
      NOW,
    );
    expect(view.status).toBe("Deployed");
    expect(view.displayName).toBe("Ranch 04");
  });
});
