import { getEntry } from "astro:content";
import { PUBLIC_CONTACT_ENDPOINT } from "astro:env/client";
import { CONTACT_FORM_PREVIEW } from "astro:env/server";
import { localizedId, type Locale } from "@/i18n";
import { getContactSettings } from "@/lib/settings/settings-repository";
import { resolveContactGate, type ContactFormGate } from "./gate";
import type { ContactPage } from "./schema";

/**
 * Sole consumer of the `contact` content collection. Throws if the entry is
 * missing, like getInvestPage: the page can't render without its copy.
 */
export async function getContactPage(locale: Locale = "en"): Promise<ContactPage> {
  const id = localizedId("contact", locale);
  const entry = await getEntry("contact", id);
  if (!entry) {
    throw new Error(`getContactPage: the 'contact' content collection has no '${id}' entry`);
  }
  return entry.data;
}

/**
 * The one place that decides whether the form is published (FR-GATE-001).
 * The Contact page and both result pages all call this, so they can't
 * disagree. The rules themselves live in gate.ts.
 */
export async function getContactFormGate(): Promise<ContactFormGate> {
  const settings = await getContactSettings();
  return resolveContactGate({
    endpoint: PUBLIC_CONTACT_ENDPOINT,
    isDev: import.meta.env.DEV,
    preview: CONTACT_FORM_PREVIEW,
    privacyApproved: settings.contactFormPrivacyApproved,
    contactEmail: settings.contactEmail,
  });
}
