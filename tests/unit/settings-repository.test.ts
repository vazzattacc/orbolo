import { describe, expect, it } from "vitest";
import { getContactSettings } from "../../src/lib/settings/settings-repository";
import { settingsSchema } from "../../src/lib/settings/schema";

// specs/005-contact-form/data-model.md §3.
describe("getContactSettings", () => {
  it("has no team email yet and no privacy approval (OQ-C1, OQ-C3 are open)", async () => {
    expect(await getContactSettings()).toEqual({
      contactEmail: undefined,
      contactFormPrivacyApproved: false,
    });
  });
});

describe("settingsSchema: contact fields", () => {
  const valid = {
    id: "settings",
    contractingEntityName: "Orbolo",
    siteName: "Orbolo",
    socialImagePath: "/images/social/og-default.png",
    socialImageAlt: "The Orbolo wordmark.",
    contactFormPrivacyApproved: false,
  };

  it("accepts an entry without contactEmail", () => {
    expect(settingsSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a real address and rejects a malformed one", () => {
    expect(settingsSchema.safeParse({ ...valid, contactEmail: "team@orbolo.com" }).success).toBe(
      true,
    );
    expect(settingsSchema.safeParse({ ...valid, contactEmail: "team-at-orbolo" }).success).toBe(
      false,
    );
  });

  it("requires the privacy-approval flag to be stated", () => {
    const withoutFlag: Partial<typeof valid> = { ...valid };
    delete withoutFlag.contactFormPrivacyApproved;
    expect(settingsSchema.safeParse(withoutFlag).success).toBe(false);
  });
});
