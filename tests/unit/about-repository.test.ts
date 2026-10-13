import { describe, expect, it } from "vitest";
import { getAboutPage } from "../../src/lib/about/about-repository";
import { getMetric } from "../../src/lib/metrics/metrics-repository";

describe("getAboutPage", () => {
  it("returns the about page content with every required field populated", async () => {
    const page = await getAboutPage();

    expect(page.hero.lede.length).toBeGreaterThan(0);
    expect(page.story.paragraphs.length).toBeGreaterThan(0);
    expect(page.howTheGroupWorks.roles.length).toBeGreaterThan(0);
    expect(page.faq.items.length).toBeGreaterThan(0);
    expect(page.closing.ctas.length).toBeGreaterThan(0);
  });

  it("only references metrics that exist, so every figure renders with its date", async () => {
    const page = await getAboutPage();
    expect(await getMetric(page.whereWeAre.animalCountMetricKey)).toBeDefined();
    expect(await getMetric(page.whereWeAre.gappHectaresMetricKey)).toBeDefined();
  });

  it("never names Orbolo as the party that takes the money (brief §1)", async () => {
    const text = JSON.stringify(await getAboutPage()).toLowerCase();
    expect(text).not.toContain("invest");
    expect(text).not.toContain("verdant");
  });
});
