import { test, expect, type Page } from "@playwright/test";

for (const [label, width] of [
  ["desktop", 1440],
  ["mobile", 390],
] as const) {
  test(`docs/screenshot-makers-${label}.png: makers page`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/makers");
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.images) img.loading = "eager";
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    await page.screenshot({
      path: `docs/screenshot-makers-${label}.png`,
      fullPage: true,
    });
  });
}

// Regenerates the README images in docs/. Kept out of the default browser
// suite so running tests never rewrites tracked files. Run after UI changes:
//   npm run build && npm run screenshots

/** Loads the home page in its settled state: no entrance motion, every image decoded. */
async function openHome(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) img.loading = "eager";
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
  });
}

test("docs/screenshot.png: top of the home page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await openHome(page);
  await page.screenshot({ path: "docs/screenshot.png" });
});

test("docs/screenshot-full.png: full home page, desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openHome(page);
  await page.screenshot({ path: "docs/screenshot-full.png", fullPage: true });
});

test("docs/screenshot-mobile.png: full home page, phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openHome(page);
  await page.screenshot({ path: "docs/screenshot-mobile.png", fullPage: true });
});

test("docs/screenshot-quicklook.png: quick look from the library", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openHome(page);
  await page
    .getByRole("button", { name: "Quick look: Moon Sweeper", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Moon Sweeper",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await dialog.locator("img").evaluate(async (img: HTMLImageElement) => {
    await img.decode();
  });
  await page.screenshot({ path: "docs/screenshot-quicklook.png" });
});
