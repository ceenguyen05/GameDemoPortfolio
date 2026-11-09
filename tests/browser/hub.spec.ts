import { test, expect } from "@playwright/test";
test("home filters, real launch links, command palette and sound preference", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "LESS SETUP.",
  );
  const playLinks = page.getByRole("link", {
    name: "Play ACI: Series 1",
    exact: true,
  });
  await expect(playLinks).toHaveCount(2);
  for (const link of await playLinks.all()) {
    await expect(link).toHaveAttribute(
      "href",
      "https://aci-series1.vercel.app/",
    );
    await expect(link).not.toHaveAttribute("target");
  }
  await page
    .getByRole("button", { name: "Coming soon 2", exact: true })
    .click();
  await expect(page.locator(".game-card")).toHaveCount(2);
  await expect(page.locator(".game-card a[href^='https://aci']")).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "In development 0", exact: true })
    .click();
  await expect(page.getByText("Nothing in this category. Yet.")).toBeVisible();
  await page.getByRole("button", { name: "Show all games" }).click();
  await expect(page.locator(".game-card")).toHaveCount(3);
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search games and pages" });
  await expect(search).toBeFocused();
  await search.fill("Play ACI");
  await expect(dialog.getByRole("link", { name: /Play ACI/ })).toHaveAttribute(
    "href",
    "https://aci-series1.vercel.app/",
  );
  await search.fill("no-such-game");
  await expect(dialog.getByText("No matches.", { exact: false })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  const sound = page.getByRole("button", { name: /^UI sound / });
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await sound.click();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await sound.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }),
    );
  });
  await page.screenshot({ path: "docs/screenshot.png", fullPage: true });
  expect(errors).toEqual([]);
});
test("gallery is keyboard accessible, restores focus, and cycles images", async ({
  page,
}) => {
  await page.goto("/games/aci-series-1");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ACISeries 1",
  );
  const image = page.getByRole("button", { name: /Enlarge image 1/ });
  await image.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close image gallery" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText(
    "ACI Building 2 / Development capture",
  );
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading")).toHaveText("ACI HQ / Outbreak");
  await page.keyboard.press("Escape");
  await expect(image).toBeFocused();
  await expect(page.locator("kbd").filter({ hasText: /^C$/ })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/detail-desktop.png",
    fullPage: true,
  });
});
test("all pages fit 360px and reduced motion, including classified slots", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/",
    "/games/aci-series-1",
    "/games/classified-02",
    "/games/classified-03",
    "/about",
    "/play/unknown-slug",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (path === "/")
      await page.screenshot({
        path: "test-results/home-mobile.png",
        fullPage: true,
      });
    if (path.includes("classified")) {
      await expect(
        page.getByRole("button", { name: "Coming soon" }).first(),
      ).toBeDisabled();
      await expect(page.getByRole("link", { name: /^Play / })).toHaveCount(0);
    }
  }
  await expect(
    page.getByRole("heading", { name: "OUTSIDE THE PLAYABLE AREA." }),
  ).toBeVisible();
});
test("redirects, metadata, OG images and static resources are correct", async ({
  request,
}) => {
  const redirect = await request.get("/play/aci-series-1", { maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers().location).toBe("https://aci-series1.vercel.app/");
  expect((await request.get("/play/unknown-slug")).status()).toBe(404);
  for (const path of [
    "/opengraph-image",
    "/games/aci-series-1/opengraph-image",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/icons/favicon.svg",
  ])
    expect((await request.get(path)).ok()).toBe(true);
  const html = await (await request.get("/games/aci-series-1")).text();
  expect(html).toContain('property="og:title" content="ACI: Series 1"');
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
});
test("launch links and share redirect reach the live game and Back returns", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page
    .getByRole("link", { name: "Play ACI: Series 1", exact: true })
    .first()
    .click();
  await page.waitForURL("https://aci-series1.vercel.app/", {
    waitUntil: "domcontentloaded",
  });
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "LESS SETUP.",
  );
  await page.goto("/play/aci-series-1", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL("https://aci-series1.vercel.app/");
});
test("storage unavailable does not crash the UI", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: /^UI sound / }).click();
  await expect(
    page.getByRole("button", { name: /^UI sound / }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(errors).toEqual([]);
});
