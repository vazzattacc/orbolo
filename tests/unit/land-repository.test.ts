import { describe, expect, it } from "vitest";
import { getLandPage } from "../../src/lib/land/land-repository";

describe("getLandPage", () => {
  it("returns the land page content with every required field populated", async () => {
    const page = await getLandPage();

    expect(page.elTapir.intro.length).toBeGreaterThan(0);
    expect(page.elTapir.hectaresMetricKey).toBe("elTapirHectares");
    expect(page.ganaderiaAPasto.body.length).toBeGreaterThan(0);
    expect(page.workWithUs.ctaLabel.length).toBeGreaterThan(0);
  });

  it("does not render an expansion-target note (still unanswered)", async () => {
    const page = await getLandPage();
    expect(page.elTapir.expansionTargetNote).toBeUndefined();
  });

  it("does not render partner ranches (OQ-013: no real ranch data yet)", async () => {
    const page = await getLandPage();
    expect(page.partnerRanches).toBeUndefined();
  });
});
