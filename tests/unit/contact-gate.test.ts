import { describe, expect, it } from "vitest";
import { resolveContactGate, type GateInput } from "../../src/lib/contact/gate";

// specs/005-contact-form: FR-GATE-001 (two conditions, clarified 2026-11-14),
// data-model.md §4.
const ENDPOINT = "https://api.orbolo.com/contact";
const production: GateInput = {
  endpoint: ENDPOINT,
  isDev: false,
  preview: false,
  privacyApproved: true,
  contactEmail: "team@orbolo.com",
};

describe("resolveContactGate: production build", () => {
  it("is live when the endpoint is set and the privacy wording is approved", () => {
    expect(resolveContactGate(production)).toEqual({
      live: true,
      endpoint: ENDPOINT,
      contactEmail: "team@orbolo.com",
      preview: false,
    });
  });

  it("is closed without an endpoint", () => {
    expect(resolveContactGate({ ...production, endpoint: undefined })).toEqual({ live: false });
    expect(resolveContactGate({ ...production, endpoint: "" })).toEqual({ live: false });
  });

  it("is closed without the privacy approval", () => {
    expect(resolveContactGate({ ...production, privacyApproved: false })).toEqual({ live: false });
  });

  it("does not treat the team email as a condition: it is passed through as given", () => {
    expect(resolveContactGate({ ...production, contactEmail: undefined })).toEqual({
      live: true,
      endpoint: ENDPOINT,
      contactEmail: undefined,
      preview: false,
    });
  });

  it("ignores the preview flag", () => {
    expect(resolveContactGate({ ...production, privacyApproved: false, preview: true })).toEqual({
      live: false,
    });
    expect(resolveContactGate({ ...production, preview: true })).toMatchObject({
      live: true,
      preview: false,
    });
  });
});

describe("resolveContactGate: dev preview", () => {
  const dev: GateInput = {
    endpoint: ENDPOINT,
    isDev: true,
    preview: true,
    privacyApproved: false,
    contactEmail: undefined,
  };

  it("is live without the privacy approval, with the reserved fallback address", () => {
    expect(resolveContactGate(dev)).toEqual({
      live: true,
      endpoint: ENDPOINT,
      contactEmail: "contact@example.com",
      preview: true,
    });
  });

  it("keeps a real team email when one is set", () => {
    expect(resolveContactGate({ ...dev, contactEmail: "team@orbolo.com" })).toMatchObject({
      contactEmail: "team@orbolo.com",
    });
  });

  it("is still closed without an endpoint", () => {
    expect(resolveContactGate({ ...dev, endpoint: undefined })).toEqual({ live: false });
  });

  it("behaves like production when the preview flag is off", () => {
    expect(resolveContactGate({ ...dev, preview: false })).toEqual({ live: false });
    expect(resolveContactGate({ ...dev, preview: false, privacyApproved: true })).toEqual({
      live: true,
      endpoint: ENDPOINT,
      contactEmail: undefined,
      preview: false,
    });
  });
});
