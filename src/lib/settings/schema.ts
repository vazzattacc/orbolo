import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/README.md
 * (Settings / ContractingEntity entity) and
 * specs/003-site-launch-essentials/README.md (3 fields added 2026-10-01
 * for the shared social-preview default). Single-entry collection.
 */
export const settingsSchema = z.object({
  id: z.literal("settings"),
  contractingEntityName: z.string().min(1),
  siteName: z.string().min(1),
  socialImagePath: z.string().startsWith("/", "socialImagePath must be a root-relative path"),
  socialImageAlt: z.string().min(1),
  // specs/005-contact-form/data-model.md §3. Shared by both languages.
  // contactEmail stays absent until Orbolo names the team inbox (OQ-C1).
  // contactFormPrivacyApproved is the record of Vaz/counsel approving the
  // form's privacy wording (FR-LEG5-002); it is one of the two conditions of
  // the publishing gate (FR-GATE-001). Never set it to true without that approval.
  contactEmail: z.email().optional(),
  contactFormPrivacyApproved: z.boolean(),
});

export type Settings = z.infer<typeof settingsSchema>;
