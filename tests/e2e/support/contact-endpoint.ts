import type { Page, Request } from "@playwright/test";

/**
 * Stands in for the contact endpoint (specs/005-contact-form/contracts/
 * contact-endpoint.md, research.md §15). The real server lives in another
 * repository; the website is only ever tested against this mock. The dev
 * endpoint in .env.development is on a reserved `.test` host, so a request
 * that isn't intercepted here can never reach anything.
 */
export const CONTACT_ENDPOINT = "https://contact-endpoint.orbolo.test/contact";

export type EndpointBehaviour =
  "success" | "fieldErrors" | "rateLimited" | "serverError" | "networkError" | "hang";

export interface EndpointMock {
  /** Every POST received, in order. */
  posts: Array<{ contentType: string; body: Record<string, unknown> }>;
}

interface MockOptions {
  /** Body of the 422 for `fieldErrors`. */
  fieldErrors?: Record<string, string>;
}

function readBody(request: Request): Record<string, unknown> {
  const contentType = request.headers()["content-type"] ?? "";
  if (contentType.includes("application/json"))
    return request.postDataJSON() as Record<string, unknown>;
  return Object.fromEntries(new URLSearchParams(request.postData() ?? ""));
}

export async function mockContactEndpoint(
  page: Page,
  behaviour: EndpointBehaviour,
  options: MockOptions = {},
): Promise<EndpointMock> {
  const mock: EndpointMock = { posts: [] };

  await page.route("https://contact-endpoint.orbolo.test/**", async (route) => {
    const request = route.request();
    const origin = request.headers()["origin"] ?? new URL(page.url()).origin;
    const cors = { "Access-Control-Allow-Origin": origin };

    // FR-API-008: the preflight a real server answers for a cross-origin JSON POST
    if (request.method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          ...cors,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "600",
        },
      });
      return;
    }

    const contentType = request.headers()["content-type"] ?? "";
    const body = readBody(request);
    mock.posts.push({ contentType, body });

    // Without JavaScript the form posts natively and the server redirects
    // (FR-API-003…005): to the thanks page, or to the failure page.
    if (!contentType.includes("application/json")) {
      const prefix = body.locale === "es" ? "/es" : "";
      const target = behaviour === "success" ? "thanks" : "error";
      await route.fulfill({
        status: 303,
        headers: { Location: `${origin}${prefix}/contact/${target}` },
      });
      return;
    }

    switch (behaviour) {
      case "success":
        await route.fulfill({
          status: 201,
          headers: cors,
          contentType: "application/json",
          body: '{"ok":true}',
        });
        return;
      case "fieldErrors":
        await route.fulfill({
          status: 422,
          headers: cors,
          contentType: "application/json",
          body: JSON.stringify({ errors: options.fieldErrors ?? { email: "invalid" } }),
        });
        return;
      case "rateLimited":
        await route.fulfill({ status: 429, headers: cors });
        return;
      case "serverError":
        await route.fulfill({ status: 500, headers: cors });
        return;
      case "networkError":
        await route.abort();
        return;
      case "hang":
        // never answered: the page's own 15 s limit has to end it
        return;
    }
  });

  return mock;
}

/** Fills the four required fields with valid values. */
export async function fillValidEnquiry(page: Page, topicLabel: string) {
  await page.locator("#contact-name").fill("Ana Pérez");
  await page.locator("#contact-email").fill("ana@example.com");
  await page.getByRole("radio", { name: topicLabel }).check();
  await page.locator("#contact-message").fill("We would like to talk about volumes.");
}

/** The page is ready for the script-driven tests once the form script has wired itself. */
export async function gotoContact(page: Page, path: "/contact" | "/es/contact") {
  await page.goto(path);
  await page.locator("[data-contact-form][data-contact-ready]").waitFor();
}
