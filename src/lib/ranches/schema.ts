import { z } from "astro/zod";

/**
 * Validation rules per specs/002-page-content-specification/data-model.md
 * (RanchCard entity). Public-layer fields only — exact ranch name, exact
 * location, owner, and contracts are explicitly out of scope for these
 * public pages (spec.md §7) and have no field here to accidentally leak
 * through.
 */
export const ranchStatusEnum = z.enum([
  "Planned",
  "Due diligence",
  "Open for LOI",
  "Released",
  "Filling",
  "Full",
  "Deployed",
]);

export const ranchCardSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be a lowercase, URL-safe slug"),
  codename: z.string().min(1),
  region: z.string().min(1),
  hectares: z.number().positive(),
  grazingSystem: z.string().min(1),
  yearsInTransition: z.number().nonnegative(),
  mpcsStatus: z.string().min(1),
  checklistFlags: z.object({
    mpcsMember: z.boolean(),
    minYearsTransition: z.boolean(),
    waterSecurity: z.boolean(),
    deforestationFreeSatellite: z.boolean(),
    contractInPlace: z.boolean(),
  }),
  threshold: z.number().positive(),
  committedUnderLoi: z.number().nonnegative(),
  status: ranchStatusEnum,
  updatedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updatedDate must be an ISO date (YYYY-MM-DD)"),
});

export type RanchCard = z.infer<typeof ranchCardSchema>;
