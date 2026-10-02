import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (Settings / ContractingEntity entity) and
 * specs/003-site-launch-essentials/data-model.md (3 fields added 2026-10-01
 * for the shared social-preview default). Single-entry collection.
 */
export const settingsSchema = z.object({
  id: z.literal("settings"),
  contractingEntityName: z.string().min(1),
  siteName: z.string().min(1),
  socialImagePath: z.string().startsWith("/", "socialImagePath must be a root-relative path"),
  socialImageAlt: z.string().min(1),
});

export type Settings = z.infer<typeof settingsSchema>;
