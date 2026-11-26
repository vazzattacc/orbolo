/**
 * Field rules for a contact enquiry (specs/005-contact-form: FR-FIELD-001,
 * data-model.md §1). Pure TypeScript with no dependency, because the same
 * module runs in the browser (src/scripts/contact-form.ts) and in unit
 * tests. The endpoint applies the same rules and is authoritative
 * (FR-API-007); these are a convenience for the visitor.
 *
 * Lengths are counted after trimming, in UTF-16 code units: the same unit
 * as HTML `maxlength` and `String.length`, so browser, script and server agree.
 */
export const FIELD_ORDER = ["name", "email", "phone", "organisation", "topic", "message"] as const;
export type Field = (typeof FIELD_ORDER)[number];

export const TOPICS = ["remote-rancher", "beef", "land", "other"] as const;
export type Topic = (typeof TOPICS)[number];

export const LIMITS = {
  name: { max: 120 },
  email: { max: 254 },
  phone: { max: 40 },
  organisation: { max: 160 },
  message: { min: 10, max: 2000 },
} as const;

/** Every code a field can carry: locally, or in the endpoint's 422 body. */
export const ERROR_CODES = {
  name: ["required", "too_long"],
  email: ["required", "invalid", "too_long"],
  phone: ["required_for_call", "too_long"],
  organisation: ["too_long"],
  topic: ["required", "invalid"],
  message: ["required", "too_short", "too_long"],
} as const satisfies Record<Field, readonly string[]>;
export type ErrorCode = (typeof ERROR_CODES)[Field][number];
export type FieldErrors = Partial<Record<Field, ErrorCode>>;

export interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  topic: string;
  message: string;
  callMe: boolean;
}

/** something@something.tld: shape only, never deliverability. */
function hasEmailShape(value: string): boolean {
  if (/\s/.test(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  const labels = domain.split(".");
  return labels.length >= 2 && labels.every((label) => label.length > 0);
}

/**
 * One code per field, in field order. Precedence within a field:
 * required, then invalid, then too_short / too_long.
 */
export function validateEnquiry(values: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "required";
  else if (name.length > LIMITS.name.max) errors.name = "too_long";

  const email = values.email.trim();
  if (!email) errors.email = "required";
  else if (!hasEmailShape(email)) errors.email = "invalid";
  else if (email.length > LIMITS.email.max) errors.email = "too_long";

  const phone = values.phone.trim();
  if (!phone && values.callMe) errors.phone = "required_for_call";
  else if (phone.length > LIMITS.phone.max) errors.phone = "too_long";

  if (values.organisation.trim().length > LIMITS.organisation.max) errors.organisation = "too_long";

  if (!values.topic) errors.topic = "required";
  else if (!(TOPICS as readonly string[]).includes(values.topic)) errors.topic = "invalid";

  const message = values.message.trim();
  if (!message) errors.message = "required";
  else if (message.length < LIMITS.message.min) errors.message = "too_short";
  else if (message.length > LIMITS.message.max) errors.message = "too_long";

  return errors;
}
