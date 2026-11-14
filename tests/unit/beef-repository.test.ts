import { describe, expect, it } from "vitest";
import { getBeefPage } from "../../src/lib/beef/beef-repository";

describe("getBeefPage", () => {
  it("returns the beef page content with every required field populated", async () => {
    const page = await getBeefPage();

    expect(page.hero.headline.length).toBeGreaterThan(0);
    expect(page.whatWeSellToday.body.length).toBeGreaterThan(0);
    expect(page.ctas.length).toBeGreaterThan(0);
    expect(page.crossLinkToInvest.href).toBe("/invest");
  });

  it("does not render a roadmap (OQ-010: no dated milestones yet)", async () => {
    const page = await getBeefPage();
    expect(page.roadmap).toBeUndefined();
  });

  it("does not render named verifiers (OQ-002: partner data not yet supplied)", async () => {
    const page = await getBeefPage();
    expect(page.whoVerifies.verifiers).toBeUndefined();
  });

  it("never mentions a named customer anywhere (OQ-011: resolved No)", async () => {
    const page = await getBeefPage();
    const rendered = JSON.stringify(page).toLowerCase();
    expect(rendered).not.toContain("customer");
  });

  // FR-BEEF-010, with one owner-approved exception (2026-10-28): the
  // What-we-sell sentence may say "regenerative" only while it carries a
  // visible review flag. The word stays banned everywhere else.
  it("calls today's beef regenerative only in the flagged What-we-sell sentence (FR-BEEF-010)", async () => {
    const page = await getBeefPage();
    const { whatWeSellToday, ...rest } = page;
    expect(JSON.stringify(rest).toLowerCase()).not.toContain("regenerative");
    expect(whatWeSellToday.noFullHistoryNote.toLowerCase()).not.toContain("regenerative");
    if (whatWeSellToday.body.toLowerCase().includes("regenerative")) {
      expect(whatWeSellToday.reviewNote).toBeTruthy();
    }
  });
});
