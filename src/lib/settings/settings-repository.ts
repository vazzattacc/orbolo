import { getEntry } from "astro:content";

/**
 * Sole consumer of the `settings` content collection. Throws if the single
 * entry is missing — FR-INV-012's contracting-entity footer line is not
 * optional content, per contracts/page-content-schema.md.
 */
export async function getContractingEntityName(): Promise<string> {
  const entry = await getEntry("settings", "settings");
  if (!entry) {
    throw new Error("getContractingEntityName: the 'settings' content collection has no 'settings' entry");
  }
  return entry.data.contractingEntityName;
}
