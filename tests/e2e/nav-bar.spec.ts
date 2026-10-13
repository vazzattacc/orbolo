import { expect, test } from "@playwright/test";

// SC-007: from any of the four pages, every other page + Contact reachable in one click.

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/invest", label: "Remote Rancher" },
  { path: "/beef", label: "Beef" },
  { path: "/land", label: "Land" },
  { path: "/about", label: "About Us" },
];

for (const { path, label } of PAGES) {
  test(`nav bar on ${label} reaches every other page and Contact`, async ({ page }) => {
    await page.goto(path);
    const nav = page.getByRole("navigation", { name: "Primary" });

    for (const target of [...PAGES.map((p) => p.label), "Contact"]) {
      await expect(nav.getByRole("link", { name: target, exact: true })).toBeVisible();
    }
  });
}

test("/contact renders as the stub page, not a 404", async ({ page }) => {
  const response = await page.goto("/contact");
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
});

test("nav links actually navigate to their target page", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: "Remote Rancher", exact: true }).click();
  await expect(page).toHaveURL(/\/invest\/?$/);

  await nav.getByRole("link", { name: "Beef", exact: true }).click();
  await expect(page).toHaveURL(/\/beef\/?$/);

  await nav.getByRole("link", { name: "Land", exact: true }).click();
  await expect(page).toHaveURL(/\/land\/?$/);

  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/?$/);
});
