export type RanchStatus =
  | "Planned"
  | "Due diligence"
  | "Open for LOI"
  | "Released"
  | "Filling"
  | "Full"
  | "Deployed";

const RELEASE_THRESHOLD = 0.6;
const LOI_EXPIRY_DAYS = 90;

export interface RanchInput {
  codename: string;
  region: string;
  hectares: number;
  system: string;
  yearsInHolisticManagement?: number;
  mpcsStatus: "member" | "in transition" | "not yet";
  checklist: {
    mpcsMember: boolean;
    minYearsTransition: boolean;
    waterSecurity: boolean;
    deforestationFreeSatellite: boolean;
    contractInPlace: boolean;
  };
  threshold: number;
  cycleLength?: string;
  opensDate?: string;
  updatedDate: string;
  manualStatus: "" | "Planned" | "Due diligence" | "Filling" | "Deployed";
  photos: string[];
  ownerConsentNamed: boolean;
  ownerConsentPhotographed: boolean;
  // Private layer — intentionally typed here so computeRanchStatus can be
  // tested against realistic input, but RanchView (below) never includes it.
  exactName?: string;
  exactLocation?: string;
  owner?: string;
}

export interface LoiInput {
  ranch: string; // matches RanchInput.codename
  headCount: number;
  signedDate: string; // ISO date
  converted: boolean;
}

/**
 * Pure function — no I/O, no astro:content import — so it is directly
 * unit-testable (tests/unit/ranches.test.ts) without the Astro content
 * runtime. FR-009–FR-013.
 */
export function computeRanchStatus(
  ranch: RanchInput,
  allLois: LoiInput[],
  now: Date,
): { committedUnderLoi: number; status: RanchStatus } {
  const activeLois = allLois.filter((loi) => {
    if (loi.ranch !== ranch.codename) return false;
    if (loi.converted) return true; // a converted LOI's animals are committed regardless of the 90-day clock
    const signed = new Date(loi.signedDate);
    const expiry = new Date(signed);
    expiry.setDate(expiry.getDate() + LOI_EXPIRY_DAYS);
    return now <= expiry;
  });

  const committedUnderLoi = activeLois.reduce((sum, loi) => sum + loi.headCount, 0);
  const ratio = ranch.threshold > 0 ? committedUnderLoi / ranch.threshold : 0;

  // Manual/operational states are never derivable from LOI math and always
  // win: a ranch can be "Planned" or in "Due diligence" before any LOI
  // exists, and "Deployed" reflects a real-world animal purchase that a
  // count-based heuristic can't observe.
  if (ranch.manualStatus === "Planned" || ranch.manualStatus === "Due diligence" || ranch.manualStatus === "Deployed") {
    return { committedUnderLoi, status: ranch.manualStatus };
  }

  // Below release threshold: still collecting LOIs.
  if (ratio < RELEASE_THRESHOLD) {
    return { committedUnderLoi, status: "Open for LOI" };
  }

  // At or above 100%: Full, regardless of any "Filling" manual label — once
  // it's fully committed the computed truth wins.
  if (ratio >= 1) {
    return { committedUnderLoi, status: "Full" };
  }

  // Between 60% and 100%: "released for deployment... keeps filling to 100%"
  // (FR-010) — this band never demotes below Released even if committedUnderLoi
  // later dips (e.g. an LOI expires post-release), since a downgrade would
  // contradict "no capital called before release" read the other way around:
  // release, once reached, is a forward-only state until Full or a manual
  // override. An editor may optionally label it "Filling" for display nuance.
  return { committedUnderLoi, status: ranch.manualStatus === "Filling" ? "Filling" : "Released" };
}

export interface RanchView {
  codename: string;
  region: string;
  hectares: number;
  system: string;
  yearsInHolisticManagement?: number;
  mpcsStatus: "member" | "in transition" | "not yet";
  checklist: RanchInput["checklist"];
  threshold: number;
  committedUnderLoi: number;
  status: RanchStatus;
  cycleLength?: string;
  opensDate?: string;
  updatedDate: string;
  photos?: string[];
  displayName: string;
}

export function toRanchView(ranch: RanchInput, allLois: LoiInput[], now: Date): RanchView {
  const { committedUnderLoi, status } = computeRanchStatus(ranch, allLois, now);
  return {
    codename: ranch.codename,
    region: ranch.region,
    hectares: ranch.hectares,
    system: ranch.system,
    yearsInHolisticManagement: ranch.yearsInHolisticManagement,
    mpcsStatus: ranch.mpcsStatus,
    checklist: ranch.checklist,
    threshold: ranch.threshold,
    committedUnderLoi,
    status,
    cycleLength: ranch.cycleLength,
    opensDate: ranch.opensDate,
    updatedDate: ranch.updatedDate,
    photos: ranch.ownerConsentPhotographed ? ranch.photos : undefined,
    // FR-012/FR-020: never reveal exactName unless consent is on file — the
    // public view structurally has no exactName field to leak in the first
    // place (see RanchView above), this is the display-name fallback.
    displayName: ranch.ownerConsentNamed && ranch.exactName ? ranch.exactName : ranch.codename,
  };
}

/**
 * Returns every Ranch's public view. Private-layer fields (exactName,
 * exactLocation, owner, contracts, pastureAssessment, waterInfrastructure,
 * vetHistory, visitBooking) are structurally absent from RanchView's type —
 * a page template cannot render what this function's return type doesn't
 * expose (FR-014).
 */
export async function getPublishedRanches(): Promise<RanchView[]> {
  const { getCollection } = await import("astro:content");
  const [ranchEntries, loiEntries] = await Promise.all([getCollection("ranches"), getCollection("lois")]);

  const lois: LoiInput[] = loiEntries.map((entry) => ({
    ranch: entry.data.ranch,
    headCount: entry.data.headCount,
    signedDate: entry.data.signedDate,
    converted: entry.data.converted,
  }));

  const now = new Date();
  return ranchEntries.map((entry) => toRanchView(entry.data as RanchInput, lois, now));
}
