import { getCollection } from "astro:content";

export interface RanchChecklist {
  mpcsMember: boolean;
  minYearsTransition: boolean;
  waterSecurity: boolean;
  deforestationFreeSatellite: boolean;
  contractInPlace: boolean;
}

export interface RanchCard {
  id: string;
  codename: string;
  region: string;
  hectares: number;
  grazingSystem: string;
  yearsInTransition: number;
  mpcsStatus: string;
  checklistFlags: RanchChecklist;
  threshold: number;
  committedUnderLoi: number;
  status: string;
  updatedDate: string;
}

/**
 * Sole consumer of the `ranches` content collection, shared by Invest's
 * Deployment Pipeline (FR-INV-008) and Land's Partner ranches (FR-LAND-002).
 * No real entries exist yet (OQ-008/OQ-013, confirmed 2026-09-24: no data,
 * not invented) — this tolerates an empty collection the same way
 * `getPaths()` tolerates zero-to-many paths.
 */
export async function getRanches(): Promise<RanchCard[]> {
  const entries = await getCollection("ranches");

  return entries.map((entry): RanchCard => ({
    id: entry.data.id,
    codename: entry.data.codename,
    region: entry.data.region,
    hectares: entry.data.hectares,
    grazingSystem: entry.data.grazingSystem,
    yearsInTransition: entry.data.yearsInTransition,
    mpcsStatus: entry.data.mpcsStatus,
    checklistFlags: entry.data.checklistFlags,
    threshold: entry.data.threshold,
    committedUnderLoi: entry.data.committedUnderLoi,
    status: entry.data.status,
    updatedDate: entry.data.updatedDate,
  }));
}
