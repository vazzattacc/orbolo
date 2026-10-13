import { describe, expect, it } from "vitest";
import { getInvestPage } from "../../src/lib/invest/invest-repository";
import { investPageSchema } from "../../src/lib/invest/schema";

describe("getInvestPage", () => {
  it("returns the invest page content with every required field populated", async () => {
    const page = await getInvestPage();

    expect(page.hero.headline.length).toBeGreaterThan(0);
    expect(page.offerBox.included.length).toBeGreaterThan(0);
    expect(page.howItWorks.steps).toHaveLength(7);
    expect(page.closing.ctas.length).toBeGreaterThan(0);
    expect(page.crossLinkToBeef.href).toBe("/beef");
  });

  it("does not render a Deployment Pipeline (OQ-008: no real ranch data yet)", async () => {
    const page = await getInvestPage();
    expect(page.deploymentPipeline).toBeUndefined();
  });

  it("does not render named verifiers (OQ-002: partner data not yet supplied)", async () => {
    const page = await getInvestPage();
    expect(page.whoVerifies.verifiers).toBeUndefined();
  });

  it("never claims a specific commercial term (OQ-004/OQ-005: terms are on request, not published)", async () => {
    const page = await getInvestPage();
    expect(page.offerBox.termsOnRequestNote.toLowerCase()).toContain("request");
  });
});

describe("investPageSchema", () => {
  it("rejects an entry with fewer than 7 how-it-works steps", () => {
    const invalidSteps = Array.from({ length: 6 }, (_, i) => ({ step: i + 1, body: "x" }));
    const result = investPageSchema.safeParse({
      id: "invest",
      hero: { headline: "h", releaseRule: "r", ctaLabel: "c", ctaHref: "/x" },
      offerBox: { included: ["a"], termsOnRequestNote: "n" },
      isThisReal: {
        elTapirIntro: "i",
        animalCountMetricKey: "animalCount",
        visitBookingCtaLabel: "l",
        visitBookingCtaHref: "/x",
      },
      whoBuysAtEnd: { body: "b" },
      whatIfNotEnough: { releaseRuleBody: "b", loiExpiryBody: "b" },
      whatIfWrong: { categories: [{ label: "l", body: "b" }], dataRoomNote: "n" },
      howItWorks: { steps: invalidSteps },
      whatYouOwn: { body: "b" },
      whoVerifies: { codeReferenceNote: "n" },
      faq: { items: [{ question: "q", answer: "a" }] },
      closing: { releaseLine: "r", ctas: [{ label: "l", href: "/x" }] },
      crossLinkToBeef: { label: "l", href: "/beef" },
    });
    expect(result.success).toBe(false);
  });
});
