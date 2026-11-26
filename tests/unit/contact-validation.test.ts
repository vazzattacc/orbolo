import { describe, expect, it } from "vitest";
import {
  FIELD_ORDER,
  LIMITS,
  validateEnquiry,
  type EnquiryValues,
} from "../../src/lib/contact/validation";

// specs/005-contact-form: FR-TEST-001, data-model.md §1. The same rules are
// the endpoint's contract (contracts/contact-endpoint.md).
const valid: EnquiryValues = {
  name: "Ana Pérez",
  email: "ana@example.com",
  phone: "",
  organisation: "",
  topic: "beef",
  message: "We would like to talk about volumes.",
  callMe: false,
};
const of = (patch: Partial<EnquiryValues>) => validateEnquiry({ ...valid, ...patch });
const chars = (n: number) => "a".repeat(n);

describe("validateEnquiry", () => {
  it("accepts a valid enquiry", () => {
    expect(of({})).toEqual({});
  });

  it("name: required, 1–120 chars after trimming", () => {
    expect(of({ name: "" }).name).toBe("required");
    expect(of({ name: "   " }).name).toBe("required");
    expect(of({ name: chars(120) }).name).toBeUndefined();
    expect(of({ name: chars(121) }).name).toBe("too_long");
    expect(of({ name: `  ${chars(120)}  ` }).name).toBeUndefined();
    expect(LIMITS.name.max).toBe(120);
  });

  it("email: required, shape local@domain.tld, ≤ 254 chars", () => {
    expect(of({ email: "" }).email).toBe("required");
    for (const bad of [
      "ana",
      "ana@",
      "@example.com",
      "ana@example",
      "ana@@example.com",
      "ana @example.com",
      "ana@.com",
      "ana@example.",
    ]) {
      expect(of({ email: bad }).email, bad).toBe("invalid");
    }
    const local = chars(254 - "@example.com".length);
    expect(of({ email: `${local}@example.com` }).email).toBeUndefined();
    expect(of({ email: `a${local}@example.com` }).email).toBe("too_long");
  });

  it("email: unusual but valid shapes are accepted", () => {
    for (const ok of [
      "ana+orbolo@example.com",
      "ana@mail.example.co.uk",
      "josé@correo.example",
      "ana@bücher.example",
    ]) {
      expect(of({ email: ok }).email, ok).toBeUndefined();
    }
  });

  it("phone: optional, free format, ≤ 40 chars", () => {
    expect(of({ phone: "" }).phone).toBeUndefined();
    expect(of({ phone: "+34 600 00 00 00" }).phone).toBeUndefined();
    expect(of({ phone: chars(40) }).phone).toBeUndefined();
    expect(of({ phone: chars(41) }).phone).toBe("too_long");
  });

  it("phone: required when Please call me is ticked", () => {
    expect(of({ callMe: true, phone: "" }).phone).toBe("required_for_call");
    expect(of({ callMe: true, phone: "  " }).phone).toBe("required_for_call");
    expect(of({ callMe: true, phone: "600 00 00 00" }).phone).toBeUndefined();
  });

  it("organisation: optional, ≤ 160 chars", () => {
    expect(of({ organisation: chars(160) }).organisation).toBeUndefined();
    expect(of({ organisation: chars(161) }).organisation).toBe("too_long");
  });

  it("topic: required, one of the four contract codes", () => {
    expect(of({ topic: "" }).topic).toBe("required");
    expect(of({ topic: "cattle" }).topic).toBe("invalid");
    for (const ok of ["remote-rancher", "beef", "land", "other"]) {
      expect(of({ topic: ok }).topic, ok).toBeUndefined();
    }
  });

  it("message: required, 10–2,000 chars after trimming", () => {
    expect(of({ message: "" }).message).toBe("required");
    expect(of({ message: chars(9) }).message).toBe("too_short");
    expect(of({ message: `   ${chars(9)}   ` }).message).toBe("too_short");
    expect(of({ message: chars(10) }).message).toBeUndefined();
    expect(of({ message: chars(2000) }).message).toBeUndefined();
    expect(of({ message: chars(2001) }).message).toBe("too_long");
  });

  it("reports one code per field, in field order", () => {
    const errors = validateEnquiry({
      name: "",
      email: "x",
      phone: "",
      organisation: chars(200),
      topic: "",
      message: "",
      callMe: true,
    });
    expect(Object.keys(errors)).toEqual([
      "name",
      "email",
      "phone",
      "organisation",
      "topic",
      "message",
    ]);
    expect(Object.keys(errors)).toEqual([...FIELD_ORDER]);
    expect(errors).toEqual({
      name: "required",
      email: "invalid",
      phone: "required_for_call",
      organisation: "too_long",
      topic: "required",
      message: "required",
    });
  });

  it("precedence: required, then invalid, then length", () => {
    // too long AND malformed → invalid wins over too_long
    expect(of({ email: chars(300) }).email).toBe("invalid");
  });
});
