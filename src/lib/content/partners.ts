export interface PartnerEntry {
  id: string;
  data: PartnerInput;
}

export async function getAllPartners(): Promise<PartnerEntry[]> {
  const { getCollection } = await import("astro:content");
  return getCollection("partners");
}

export interface PartnerInput {
  name: string;
  logo: string;
  role: string;
  quote?: string;
  pages?: string[];
}

/**
 * Pure — no I/O — directly unit-testable. Resolves the requested slugs
 * against the full partner list and drops any without a role: FR-035, "no
 * bare logo walls" is a structural filter, not a content-authoring hope.
 */
export function filterDisplayablePartners(
  allPartners: { id: string; data: PartnerInput }[],
  requestedSlugs: string[],
): PartnerInput[] {
  return requestedSlugs
    .map((slug) => allPartners.find((entry) => entry.id === slug)?.data)
    .filter((partner): partner is PartnerInput => Boolean(partner && partner.role && partner.role.trim() !== ""));
}
