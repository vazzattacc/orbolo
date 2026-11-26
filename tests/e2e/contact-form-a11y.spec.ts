import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { fillValidEnquiry, gotoContact, mockContactEndpoint } from "./support/contact-endpoint";

// specs/005-contact-form — FR-UX-014, FR-UX-016, SC-001, SC-005
// (quickstart.md scenarios 6, 7 and 8). Accessibility is a release gate
// (Constitution IX): the form works by keyboard alone, at phone and desktop
// widths, and an automated checker finds nothing in any of its states.
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoViolations(page: Page, state: string) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(
    results.violations.map(
      (v) => `${v.id}: ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.html.slice(0, 140)}`,
    ),
    `axe violations (${state})`,
  ).toEqual([]);
}

const LOCALES = [
  { path: "/contact", topic: "Buying beef", thanks: /\/contact\/thanks\/?$/ },
  { path: "/es/contact", topic: "Comprar carne", thanks: /\/es\/contact\/thanks\/?$/ },
] as const;

for (const l of LOCALES) {
  test(`${l.path}: the form can be completed and sent with the keyboard alone, in field order (SC-001)`, async ({
    page,
  }) => {
    const endpoint = await mockContactEndpoint(page, "success");
    await gotoContact(page, l.path);

    await page.locator("#contact-name").focus();
    const focusedId = () =>
      page.evaluate(
        () =>
          document.activeElement?.id ||
          (document.activeElement as HTMLInputElement | null)?.name ||
          "",
      );
    const visibleFocus = async () => {
      const outline = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement!);
        return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
      });
      expect(outline.style, "focus indicator").not.toBe("none");
      expect(outline.width).toBeGreaterThanOrEqual(2);
    };

    await page.keyboard.type("Ana Pérez");
    await visibleFocus();
    await page.keyboard.press("Tab");
    expect(await focusedId()).toBe("contact-email");
    await page.keyboard.type("ana@example.com");
    await page.keyboard.press("Tab");
    expect(await focusedId()).toBe("contact-phone");
    await page.keyboard.press("Tab");
    expect(await focusedId()).toBe("contact-organisation");
    await page.keyboard.press("Tab");
    // a radio group is one tab stop; arrows move inside it
    expect(await focusedId()).toBe("contact-topic-first");
    await visibleFocus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('input[name="topic"][value="beef"]')).toBeChecked();
    await page.keyboard.press("Tab");
    expect(await focusedId()).toBe("contact-message");
    await page.keyboard.type("We would like to talk about volumes.");
    await page.keyboard.press("Tab");
    expect(await focusedId()).toBe("contact-callMe");
    await visibleFocus();
    await page.keyboard.press("Tab");
    // the honeypot is skipped; the privacy link comes before Send
    expect(
      await page.evaluate(() => document.activeElement?.closest("[data-contact-privacy]") !== null),
    ).toBe(true);
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => document.activeElement?.hasAttribute("data-contact-send")),
    ).toBe(true);
    await visibleFocus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(l.thanks);
    expect(endpoint.posts).toHaveLength(1);
    expect(endpoint.posts[0].body).toMatchObject({
      name: "Ana Pérez",
      email: "ana@example.com",
      topic: "beef",
    });
  });

  test(`${l.path}: axe finds nothing in the idle, error and failure states (SC-005)`, async ({
    page,
  }) => {
    // Reduced motion, so axe reads the settled page: a section still fading
    // in is briefly translucent, which a contrast check would misread.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mockContactEndpoint(page, "serverError");
    await gotoContact(page, l.path);
    await page.locator("[data-split].is-ready").first().waitFor();
    await expectNoViolations(page, "idle");

    await page.locator("[data-contact-send]").click();
    await expect(page.locator("[data-contact-summary]")).toBeFocused();
    await expectNoViolations(page, "errors shown");

    await fillValidEnquiry(page, l.topic);
    await page.locator("[data-contact-send]").click();
    await expect(page.locator("[data-contact-failure]")).toBeVisible();
    await expectNoViolations(page, "failure shown");
  });
}

for (const path of [
  "/contact/thanks",
  "/es/contact/thanks",
  "/contact/error",
  "/es/contact/error",
]) {
  test(`${path}: axe finds nothing (SC-005)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.locator("[data-split].is-ready").first().waitFor();
    await expectNoViolations(page, path);
  });
}

for (const size of [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
]) {
  test.describe(`at ${size.name}px`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const path of ["/contact", "/es/contact"] as const) {
      test(`${path}: no horizontal scroll, 16px inputs, 24px targets (FR-UX-014, FR-UX-016)`, async ({
        page,
      }) => {
        await gotoContact(page, path);
        await page.locator("[data-contact-send]").click(); // the error state is the widest

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, "horizontal overflow").toBeLessThanOrEqual(0);

        for (const control of await page
          .locator(".cform input:not([type=hidden]):not([name=website]), .cform textarea")
          .all()) {
          const type = await control.getAttribute("type");
          const box = (await control.boundingBox())!;
          if (type === "radio" || type === "checkbox") {
            expect(box.width, "target width").toBeGreaterThanOrEqual(24);
            expect(box.height, "target height").toBeGreaterThanOrEqual(24);
          } else {
            // iOS zooms the page when a focused input's text is under 16px
            expect(
              await control.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
            ).toBeGreaterThanOrEqual(16);
            expect(box.height).toBeGreaterThanOrEqual(24);
          }
        }
        const send = (await page.locator("[data-contact-send]").boundingBox())!;
        expect(send.height).toBeGreaterThanOrEqual(24);
        expect(send.width).toBeGreaterThanOrEqual(24);
        for (const link of await page.locator("[data-contact-summary] a").all()) {
          expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(24);
        }
      });

      test(`${path}: neither the error summary nor a focused field is covered by the nav (WCAG 2.4.11)`, async ({
        page,
      }) => {
        await gotoContact(page, path);
        await page.locator("[data-contact-send]").click();
        await expect(page.locator("[data-contact-summary]")).toBeFocused();

        const clearOfNav = async (selector: string) => {
          const { navBottom, top } = await page.evaluate((sel) => {
            const nav = document.querySelector("[data-nav]")!;
            const hidden = nav.classList.contains("is-hidden");
            return {
              navBottom: hidden ? 0 : nav.getBoundingClientRect().bottom,
              top: document.querySelector(sel)!.getBoundingClientRect().top,
            };
          }, selector);
          expect(top, `${selector} is below the nav`).toBeGreaterThanOrEqual(navBottom);
        };
        await clearOfNav("[data-contact-summary]");
        for (const href of ["#contact-message", "#contact-name", "#contact-email"]) {
          await page.locator(`[data-contact-summary] a[href="${href}"]`).click();
          await expect(page.locator(href)).toBeFocused();
          await page.waitForTimeout(200);
          await clearOfNav(href);
        }
      });
    }
  });
}
