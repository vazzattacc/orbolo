import { z } from "astro/zod";

/**
 * Validation rules per specs/005-contact-form/data-model.md §2
 * (ContactPageContent): every visitor-facing string of the Contact page,
 * its form and its thanks/failure pages (FR-GEN5-002). One entry per locale.
 *
 * Each `errors.<field>` object lists exactly the codes that field can carry
 * (src/lib/contact/validation.ts → ERROR_CODES), so a missing translation
 * fails the build rather than showing an empty message.
 */
const text = z.string().min(1);
const fieldCopy = z.object({ label: text, hint: text.optional() });

export const contactPageSchema = z.object({
  id: z.enum(["contact", "contact-es"]),
  title: text,
  h1: text,
  // shown while the publishing gate is closed (FR-GATE-001)
  stubBody: text,
  // shown once the form is live (FR-GEN5-004)
  intro: text,
  // shown only in `astro dev` preview (research.md §3)
  previewNote: text,
  form: z.object({
    heading: text,
    optionalMarker: text,
    fields: z.object({
      name: fieldCopy,
      email: fieldCopy,
      phone: fieldCopy,
      organisation: fieldCopy,
      // `remaining` contains {n}
      message: fieldCopy.extend({ remaining: text }),
      callMe: z.object({ label: text }),
    }),
    topic: z.object({
      legend: text,
      // keys are the contract codes (contracts/contact-endpoint.md)
      options: z.object({ "remote-rancher": text, beef: text, land: text, other: text }),
    }),
    send: z.object({ label: text, sending: text }),
    privacyLine: z.object({ text, linkLabel: text }),
  }),
  errors: z.object({
    summaryHeading: text,
    titlePrefix: text,
    inlinePrefix: text,
    name: z.object({ required: text, too_long: text }),
    email: z.object({ required: text, invalid: text, too_long: text }),
    phone: z.object({ required_for_call: text, too_long: text }),
    organisation: z.object({ too_long: text }),
    topic: z.object({ required: text, invalid: text }),
    message: z.object({ required: text, too_short: text, too_long: text }),
  }),
  failure: z.object({
    generic: text,
    rateLimited: text,
    // contains {email}
    emailLead: text,
  }),
  thanks: z.object({ title: text, h1: text, body: text, homeLabel: text }),
  errorPage: z.object({ title: text, h1: text, body: text, backLabel: text }),
});

export type ContactPage = z.infer<typeof contactPageSchema>;
