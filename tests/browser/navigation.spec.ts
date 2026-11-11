import { test, expect, type Page } from "@playwright/test";
import { open, trackConsole } from "./helpers";

async function atLibrary(page: Page) {
  await expect(page).toHaveURL(/\/#library$/);
  await expect
    .poll(() =>
      page
        .locator("#library")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBeGreaterThanOrEqual(0);
  await expect
    .poll(() =>
      page
        .locator("#library")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBeLessThan(80);
}

for (const motion of ["no-preference", "reduce"] as const) {
  test(`section links work repeatedly with ${motion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: motion });
    const problems = trackConsole(page);
    await open(page, "/#library");
    const historyLength = await page.evaluate(() => history.length);
    for (const name of ["Explore the games", "The games", "Find a game"]) {
      for (let attempt = 0; attempt < 2; attempt++) {
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        await page.getByRole("link", { name, exact: true }).click();
        await atLibrary(page);
        await expect(page.locator("#library")).toBeFocused();
        expect(await page.evaluate(() => history.length)).toBe(historyLength);
      }
    }
    if (motion === "reduce") {
      expect(
        await page
          .locator("[data-section-cue]")
          .evaluate((el) => el.getAnimations().length),
      ).toBe(0);
    }
    expect(problems).toEqual([]);
  });
}

for (const path of [
  "/about",
  "/games/aci-series-1",
  "/games/devil-game",
  "/games/untitled-obby",
  "/games/moon-sweeper",
  "/missing-page",
]) {
  test(`every library link returns correctly from ${path}`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, path);
    const count = await page.locator('a[href="/#library"]').count();
    expect(count).toBeGreaterThan(1);
    for (let index = 0; index < count; index++) {
      if (index > 0) await open(page, path);
      await page.locator('a[href="/#library"]').nth(index).click();
      await atLibrary(page);
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.getByRole("link", { name: "The games", exact: true }).click();
      await atLibrary(page);
    }
  });
}

test("search can revisit the current section without losing focus to its dialog", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/#library");
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.keyboard.press("Control+k");
    await page
      .getByRole("dialog")
      .getByRole("textbox", { name: "Search games and pages" })
      .fill("Game library");
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /Game library/ })
      .click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await atLibrary(page);
    await expect(page.locator("#library")).toBeFocused();
  }
});

test("repeat page links, Back/Forward and the native skip link remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/");
  await page.getByRole("link", { name: "Explore the games" }).click();
  await atLibrary(page);
  await page.getByRole("link", { name: "The idea", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/#library$/);
  await page.getByRole("link", { name: "The games", exact: true }).click();
  await atLibrary(page);
  await page.goForward();
  await expect(page).toHaveURL(/\/about$/);
  const historyLength = await page.evaluate(() => history.length);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await page
    .getByRole("link", { name: "About the collection", exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const skip = page.getByRole("link", { name: "Skip to content" });
    await skip.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  }
});

test("modified section clicks keep native new-tab behavior", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/#library");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  const originalScroll = await page.evaluate(() => scrollY);
  const opened = context.waitForEvent("page");
  await page
    .getByRole("link", { name: "The games", exact: true })
    .click({ modifiers: ["ControlOrMeta"] });
  const tab = await opened;
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/#library$/);
  expect(await page.evaluate(() => scrollY)).toBe(originalScroll);
  await tab.close();
});
