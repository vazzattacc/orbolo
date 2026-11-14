import { describe, expect, it } from "vitest";
import { getLocale, isLocalizedRoute, localizePath, localizedId, stripLocale } from "../../src/i18n";
import { ui } from "../../src/i18n/ui";
import { getInvestPage } from "../../src/lib/invest/invest-repository";
import { getBeefPage } from "../../src/lib/beef/beef-repository";
import { getLandPage } from "../../src/lib/land/land-repository";
import { getAboutPage } from "../../src/lib/about/about-repository";
import { getPaths } from "../../src/lib/paths/path-repository";

const u = (path: string) => new URL(path, "https://orbolo.com");

describe("locale helpers", () => {
  it("reads the locale from the URL; English stays at the root", () => {
    expect(getLocale(u("/"))).toBe("en");
    expect(getLocale(u("/invest/"))).toBe("en");
    expect(getLocale(u("/es"))).toBe("es");
    expect(getLocale(u("/es/beef/"))).toBe("es");
    expect(getLocale(u("/estancia"))).toBe("en");
  });

  it("strips and adds the /es prefix without touching anchors or external links", () => {
    expect(stripLocale("/es/invest/")).toBe("/invest");
    expect(stripLocale("/es")).toBe("/");
    expect(localizePath("/invest", "es")).toBe("/es/invest");
    expect(localizePath("/", "es")).toBe("/es");
    expect(localizePath("/es/land", "en")).toBe("/land");
    expect(localizePath("#closing", "es")).toBe("#closing");
    expect(localizePath("https://example.com", "es")).toBe("https://example.com");
  });

  it("knows which routes exist in both languages", () => {
    expect(isLocalizedRoute("/about")).toBe(true);
    expect(isLocalizedRoute("/privacy")).toBe(false);
    expect(localizedId("invest", "es")).toBe("invest-es");
  });

  it("has the same interface keys in both languages", () => {
    const keys = (o: object): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? keys(v).map((x) => `${k}.${x}`) : [k]));
    expect(keys(ui.es).sort()).toEqual(keys(ui.en).sort());
  });
});

describe("Spanish content", () => {
  it("exists for every translated page and keeps the same shape", async () => {
    const [invest, investEs] = [await getInvestPage(), await getInvestPage("es")];
    expect(investEs.id).toBe("invest-es");
    expect(investEs.howItWorks.steps).toHaveLength(7);
    expect(investEs.faq.items).toHaveLength(invest.faq.items.length);
    expect((await getBeefPage("es")).id).toBe("beef-es");
    expect((await getLandPage("es")).id).toBe("land-es");
    expect((await getAboutPage("es")).id).toBe("about-es");
  });

  it("gives each language its own three path cards", async () => {
    expect((await getPaths()).map((p) => p.id)).toEqual(["investors", "buyers", "landowners"]);
    expect((await getPaths("es")).map((p) => p.id)).toEqual(["investors-es", "buyers-es", "landowners-es"]);
  });

  it("never uses investing vocabulary in Spanish (brief §1)", async () => {
    const text = JSON.stringify([
      await getInvestPage("es"),
      await getBeefPage("es"),
      await getLandPage("es"),
      await getAboutPage("es"),
      await getPaths("es"),
      ui.es,
    ]).toLowerCase();
    for (const word of ["invers", "invertir", "inversor", "rentabilidad", "retorno"]) {
      expect(text, word).not.toContain(word);
    }
  });
});
