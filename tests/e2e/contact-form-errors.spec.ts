import { expect, test } from "@playwright/test";
import { fillValidEnquiry, gotoContact, mockContactEndpoint } from "./support/contact-endpoint";

// specs/005-contact-form — User Story 2 (quickstart.md scenario 4): a failed
// Send says exactly what to fix, moves focus, and loses nothing.
const LOCALES = [
  {
    path: "/contact",
    title: "Contact — Orbolo",
    summary: "There is a problem",
    empty: [
      "Enter your name",
      "Enter your email address",
      "Choose what you're interested in",
      "Write your message",
    ],
    badEmail: "Enter an email address like name@example.com",
    callNeedsPhone: "Add a phone number so we can call you",
    topic: "Buying beef",
  },
  {
    path: "/es/contact",
    title: "Contacto — Orbolo",
    summary: "Hay un problema",
    empty: [
      "Escribe tu nombre",
      "Escribe tu correo electrónico",
      "Elige qué te interesa",
      "Escribe tu mensaje",
    ],
    badEmail: "Escribe un correo como nombre@ejemplo.com",
    callNeedsPhone: "Añade un teléfono para que podamos llamarte",
    topic: "Comprar carne",
  },
] as const;

for (const l of LOCALES) {
  test(`${l.path}: an empty Send lists every problem in field order, focuses the summary and sends nothing (US2-AS1)`, async ({
    page,
  }) => {
    const endpoint = await mockContactEndpoint(page, "success");
    await gotoContact(page, l.path);
    await page.locator("[data-contact-send]").click();

    const summary = page.locator("[data-contact-summary]");
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("heading")).toHaveText(l.summary);
    await expect(summary.locator("li a")).toHaveText([...l.empty]);
    expect(
      await summary
        .locator("li a")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href"))),
    ).toEqual(["#contact-name", "#contact-email", "#contact-topic", "#contact-message"]);
    await expect(page).toHaveTitle(`Error: ${l.title}`);
    expect(endpoint.posts).toHaveLength(0);
  });

  test(`${l.path}: each faulty field is exposed as invalid and tied to its message (US2-AS2)`, async ({
    page,
  }) => {
    await gotoContact(page, l.path);
    await page.locator("[data-contact-send]").click();

    for (const [field, message] of [
      ["name", l.empty[0]],
      ["email", l.empty[1]],
      ["topic", l.empty[2]],
      ["message", l.empty[3]],
    ] as const) {
      const control = page.locator(`#contact-${field}`);
      await expect(control).toHaveAttribute("aria-invalid", "true");
      const describedBy = (await control.getAttribute("aria-describedby")) ?? "";
      expect(describedBy.split(" ")).toContain(`contact-${field}-error`);
      const error = page.locator(`#contact-${field}-error`);
      await expect(error).toBeVisible();
      // the message, behind a prefix that only assistive technology reads (not colour alone: FR-UX-008)
      await expect(error).toHaveText(`Error: ${message}`);
      await expect(error.locator(".sr-only")).toHaveText("Error:");
    }
    // a hint stays first, the error after it
    await expect(page.locator("#contact-message")).toHaveAttribute(
      "aria-describedby",
      "contact-message-remaining contact-message-error",
    );
    // fields without a problem are untouched
    await expect(page.locator("#contact-phone")).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-phone-error")).toHaveCount(0);
  });

  test(`${l.path}: nothing typed is lost, and only the remaining problems are listed after a fix (US2-AS3/AS4)`, async ({
    page,
  }) => {
    const endpoint = await mockContactEndpoint(page, "success");
    await gotoContact(page, l.path);
    await page.locator("#contact-name").fill("Ana Pérez");
    await page.locator("#contact-email").fill("ana-at-example");
    await page.locator("#contact-organisation").fill("Estancia Ejemplo");
    await page.locator("#contact-message").fill("We would like to talk about volumes.");
    await page.locator("[data-contact-send]").click();

    const links = page.locator("[data-contact-summary] li a");
    await expect(links).toHaveText([l.badEmail, l.empty[2]]);
    await expect(page.locator("#contact-name")).toHaveValue("Ana Pérez");
    await expect(page.locator("#contact-email")).toHaveValue("ana-at-example");
    await expect(page.locator("#contact-organisation")).toHaveValue("Estancia Ejemplo");
    await expect(page.locator("#contact-message")).toHaveValue(
      "We would like to talk about volumes.",
    );

    await page.locator("#contact-email").fill("ana@example.com");
    await page.locator("[data-contact-send]").click();
    await expect(links).toHaveText([l.empty[2]]);
    await expect(page.locator("#contact-email")).not.toHaveAttribute("aria-invalid", "true");
    expect(endpoint.posts).toHaveLength(0);

    await page.getByRole("radio", { name: l.topic }).check();
    await page.locator("[data-contact-send]").click();
    await expect(page).toHaveURL(/\/contact\/thanks\/?$/);
    expect(endpoint.posts).toHaveLength(1);
  });

  test(`${l.path}: field errors from the endpoint are shown the same way (US2-AS5)`, async ({
    page,
  }) => {
    await mockContactEndpoint(page, "fieldErrors", { fieldErrors: { email: "invalid" } });
    await gotoContact(page, l.path);
    await fillValidEnquiry(page, l.topic);
    await page.locator("[data-contact-send]").click();

    const summary = page.locator("[data-contact-summary]");
    await expect(summary).toBeFocused();
    await expect(summary.locator("li a")).toHaveText([l.badEmail]);
    await expect(page.locator("#contact-email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-email-error")).toContainText(l.badEmail);
    await expect(page).toHaveTitle(`Error: ${l.title}`);
    await expect(page).toHaveURL(new RegExp(`${l.path}/?$`));
    await expect(page.locator("#contact-name")).toHaveValue("Ana Pérez");
    // the button is usable again
    await expect(page.locator("[data-contact-send]")).not.toHaveAttribute("aria-busy", "true");
  });

  test(`${l.path}: Please call me without a phone number asks for one`, async ({ page }) => {
    await gotoContact(page, l.path);
    await fillValidEnquiry(page, l.topic);
    await page.locator("#contact-callMe").check();
    await page.locator("[data-contact-send]").click();
    await expect(page.locator("[data-contact-summary] li a")).toHaveText([l.callNeedsPhone]);
    await expect(page.locator("#contact-phone")).toHaveAttribute(
      "aria-describedby",
      "contact-phone-hint contact-phone-error",
    );
  });
}

test("a summary link moves focus to its field, without a smooth scroll, and the field is not under the nav", async ({
  page,
}) => {
  await gotoContact(page, "/contact");
  await page.locator("[data-contact-send]").click();
  const summary = page.locator("[data-contact-summary]");
  await expect(summary).toBeFocused();

  const below = async (selector: string) => {
    const navBottom = await page.locator("[data-nav]").evaluate((nav) => {
      const hidden = nav.classList.contains("is-hidden");
      return hidden ? 0 : nav.getBoundingClientRect().bottom;
    });
    const top = await page.locator(selector).evaluate((el) => el.getBoundingClientRect().top);
    expect(top, `${selector} sits below the nav`).toBeGreaterThanOrEqual(navBottom);
  };
  await below("[data-contact-summary]");

  for (const [href, target] of [
    ["#contact-message", "#contact-message"],
    ["#contact-topic", "#contact-topic-first"],
    ["#contact-name", "#contact-name"],
  ]) {
    await summary.locator(`a[href="${href}"]`).click();
    // focus moves at once: motion.ts's 1.4 s anchor scroll must not take the click
    await expect(page.locator(target)).toBeFocused({ timeout: 500 });
    await page.waitForTimeout(250);
    await below(target);
    await expect(page).not.toHaveURL(/#contact-/);
  }
});

test("after a failed Send, leaving a corrected field clears its error (FR-UX-002)", async ({
  page,
}) => {
  await gotoContact(page, "/contact");
  await page.locator("[data-contact-send]").click();
  await expect(page.locator("#contact-name-error")).toBeVisible();

  await page.locator("#contact-name").fill("Ana Pérez");
  await page.locator("#contact-email").focus();
  await expect(page.locator("#contact-name-error")).toHaveCount(0);
  await expect(page.locator("#contact-name")).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("[data-contact-summary] li a")).toHaveCount(3);
});

test("validation waits for Send: typing alone shows no error", async ({ page }) => {
  await gotoContact(page, "/contact");
  await page.locator("#contact-email").fill("not-an-email");
  await page.locator("#contact-name").focus();
  await expect(page.locator("[data-contact-error]")).toHaveCount(0);
  await expect(page.locator("[data-contact-summary]")).toBeHidden();
});

// A message above the pointer disappears when its field is corrected. If that
// happened between press and release, the page would shift and the click
// would land on something else. The re-check waits for the press to finish.
test("correcting a field and then clicking further down still hits what was clicked", async ({
  page,
}) => {
  const endpoint = await mockContactEndpoint(page, "success");
  await gotoContact(page, "/contact");
  await page.locator("[data-contact-send]").click();
  await expect(page.locator("#contact-email-error")).toBeVisible();

  await page.locator("#contact-name").fill("Ana Pérez");
  await page.locator("#contact-email").fill("ana@example.com");
  // focus is in Email; its message sits above the radios and goes away on blur
  await page.getByRole("radio", { name: "Working with my land" }).click();
  await expect(page.getByRole("radio", { name: "Working with my land" })).toBeChecked();
  await expect(page.locator("#contact-email-error")).toHaveCount(0);

  await page.locator("#contact-message").fill("We would like to talk about volumes.");
  // focus is in Message; its message sits above Send and goes away on blur
  await page.locator("[data-contact-send]").click();
  await expect(page).toHaveURL(/\/contact\/thanks\/?$/);
  expect(endpoint.posts).toHaveLength(1);
});
