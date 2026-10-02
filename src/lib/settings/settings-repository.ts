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

export interface SocialPreviewDefaults {
  siteName: string;
  socialImagePath: string;
  socialImageAlt: string;
}

/**
 * Added 2026-10-01 (specs/003-site-launch-essentials) alongside
 * getContractingEntityName() above, which is untouched — reads the same
 * `settings` entry, same "always expected to exist" contract.
 */
export async function getSocialPreviewDefaults(): Promise<SocialPreviewDefaults> {
  const entry = await getEntry("settings", "settings");
  if (!entry) {
    throw new Error("getSocialPreviewDefaults: the 'settings' content collection has no 'settings' entry");
  }
  return {
    siteName: entry.data.siteName,
    socialImagePath: entry.data.socialImagePath,
    socialImageAlt: entry.data.socialImageAlt,
  };
}
