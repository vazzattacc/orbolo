import { describe, it, expect } from "vitest";
import { filterDisplayablePartners, type PartnerInput } from "@/lib/content/partners";

function entry(id: string, data: Partial<PartnerInput> = {}) {
  return { id, data: { name: id, logo: "/logo.png", role: "partner", ...data } as PartnerInput };
}

describe("filterDisplayablePartners (PartnerStrip's rendering rule)", () => {
  it("includes a partner with a role", () => {
    const result = filterDisplayablePartners([entry("vet-co", { role: "vet/audit partner" })], ["vet-co"]);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("vet/audit partner");
  });

  it("excludes a partner with an empty role (FR-035: no bare logo walls)", () => {
    const result = filterDisplayablePartners([entry("bare-logo", { role: "" })], ["bare-logo"]);
    expect(result).toHaveLength(0);
  });

  it("excludes a partner with a whitespace-only role", () => {
    const result = filterDisplayablePartners([entry("bare-logo", { role: "   " })], ["bare-logo"]);
    expect(result).toHaveLength(0);
  });

  it("excludes a requested slug that doesn't resolve to any partner", () => {
    const result = filterDisplayablePartners([entry("vet-co")], ["does-not-exist"]);
    expect(result).toHaveLength(0);
  });

  it("preserves the requested order", () => {
    const result = filterDisplayablePartners([entry("a"), entry("b"), entry("c")], ["c", "a", "b"]);
    expect(result.map((p) => p.name)).toEqual(["c", "a", "b"]);
  });
});
