/**
 * Decides whether the contact form and its thanks/error pages are published
 * (specs/005-contact-form: FR-GATE-001, data-model.md §4). Pure, so every
 * combination is unit-tested; contact-repository.ts feeds it the real values.
 *
 * Production: live only when the endpoint is configured AND Vaz/counsel
 * approved the privacy wording. Those are the only two conditions (clarified
 * 2026-11-14). The team email is passed through as it is: a person checks it,
 * and the published Privacy page, at go-live.
 *
 * `astro dev` with CONTACT_FORM_PREVIEW=true: the approval is waived so the
 * form can be seen and tested before it exists, and a reserved address
 * (RFC 2606, reaches nobody) stands in for a missing team email. The flag is
 * ignored outside dev, so it can never open the gate in a build.
 */
export interface GateInput {
  /** PUBLIC_CONTACT_ENDPOINT */
  endpoint: string | undefined;
  /** import.meta.env.DEV */
  isDev: boolean;
  /** CONTACT_FORM_PREVIEW */
  preview: boolean;
  /** settings.contactFormPrivacyApproved */
  privacyApproved: boolean;
  /** settings.contactEmail */
  contactEmail: string | undefined;
}

export type ContactFormGate =
  | { live: false }
  | { live: true; endpoint: string; contactEmail: string | undefined; preview: boolean };

export const PREVIEW_CONTACT_EMAIL = "contact@example.com";

export function resolveContactGate(input: GateInput): ContactFormGate {
  if (!input.endpoint) return { live: false };

  if (input.isDev && input.preview) {
    return {
      live: true,
      endpoint: input.endpoint,
      contactEmail: input.contactEmail ?? PREVIEW_CONTACT_EMAIL,
      preview: true,
    };
  }

  if (!input.privacyApproved) return { live: false };
  return { live: true, endpoint: input.endpoint, contactEmail: input.contactEmail, preview: false };
}
