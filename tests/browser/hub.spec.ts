import { test, expect, type Page } from "@playwright/test";

const ACI = "https://aci-series1.vercel.app/";
const PAGES = [
  "/",
  "/about",
  "/games/aci-series-1",
  "/games/devil-game",
  "/games/untitled-obby",
  "/games/moon-sweeper",
];

function trackConsole(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      problems.push(message.text());
  });
  return problems;
}

test("Play links are real anchors to the live game in a new tab", async ({
  page,
}) => {
  await page.goto("/");
  const play = page.getByRole("link", { name: /^Play now: ACI: Series 1/ });
  await expect(play).toHaveCount(2); // featured hero + library row
  for (const link of await play.all()) {
    await expect(link).toHaveAttribute("href", ACI);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAccessibleName(
      "Play now: ACI: Series 1 (opens in a new tab)",
    );
  }
  await expect(page.getByText("aci-series1.vercel.app").first()).toBeVisible();
  // Upcoming games are locked, never links, and flagged as working titles.
  for (const title of ["Devil Game", "Untitled obby", "Moon Sweeper"]) {
    const row = page.locator("li[data-status]", { hasText: title });
    await expect(
      row.getByRole("button", { name: "Coming soon" }),
    ).toBeDisabled();
    await expect(row.getByRole("link", { name: /^Play/ })).toHaveCount(0);
    await expect(row.getByText("Working title")).toBeVisible();
  }
  const aciRow = page.locator("li[data-status='live']");
  await expect(aciRow.getByText("Working title")).toHaveCount(0);
});

test("library filters show only matching rows", async ({ page }) => {
  await page.goto("/");
  const rows = page.locator("li[data-status]");
  await page.getByRole("button", { name: "Coming soon 3" }).click();
  await expect(rows.filter({ visible: true })).toHaveCount(3);
  await page.getByRole("button", { name: "Live 1" }).click();
  await expect(rows.filter({ visible: true })).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("Showing 1 game");
  await page.getByRole("button", { name: "All 4" }).click();
  await expect(rows.filter({ visible: true })).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: /^In development/ }),
  ).toHaveCount(0);
});

test("keyboard: skip link, palette open/search/navigate/close", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();

  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Jump to a game or page" });
  await expect(dialog).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search games and pages" });
  await expect(search).toBeFocused();
  await search.fill("play aci");
  const launch = dialog.getByRole("link", { name: /Play ACI: Series 1/ });
  await expect(launch).toHaveAttribute("href", ACI);
  await expect(launch).toHaveAttribute("target", "_blank");
  await search.fill("zzz");
  await expect(dialog.getByText("No matches.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.keyboard.press("Control+k");
  await search.fill("about");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "I write code.",
  );
  expect(problems).toEqual([]);
});

test("keyboard: gallery lightbox steps, closes, returns focus", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await page.goto("/games/aci-series-1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ACI");
  const first = page.getByRole("button", { name: /^Enlarge: / }).first();
  await first.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /^Close/ })).toBeFocused();
  const title = dialog.getByRole("heading");
  await expect(title).toHaveText("01 — ACI HQ / Office corridor");
  await page.keyboard.press("ArrowRight");
  await expect(title).toHaveText("02 — ACI Building 2 / Atrium");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(title).toHaveText("03 — Zombies / Main lobby");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
  await expect(page.locator("kbd", { hasText: /^C$/ })).toBeVisible();
  expect(problems).toEqual([]);
});

test("sound toggle persists, and still works with storage blocked", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  const sound = page.getByRole("button", { name: "UI sounds" });
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await sound.click();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(sound).toHaveAttribute("aria-pressed", "true");

  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  const problems = trackConsole(blocked);
  await blocked.goto("/");
  const toggle = blocked.getByRole("button", { name: "UI sounds" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(problems).toEqual([]);
  await blocked.close();
});

test("every page fits 360px with reduced motion and logs nothing", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await page.setViewportSize({ width: 360, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of PAGES) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
  expect(problems).toEqual([]);
});

test("redirects, 404s, metadata and static resources", async ({
  request,
  page,
}) => {
  const redirect = await request.get("/play/aci-series-1", { maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers().location).toBe(ACI);
  for (const path of ["/play/unknown-slug", "/play/devil-game", "/games/nope"])
    expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(
      404,
    );
  await page.goto("/play/unknown-slug");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nothing at this address.",
  );
  await expect(
    page.getByRole("link", { name: /Back to the library/ }),
  ).toHaveAttribute("href", "/#library");

  for (const path of [
    "/opengraph-image",
    "/games/aci-series-1/opengraph-image",
    "/games/moon-sweeper/opengraph-image",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/icons/favicon.svg",
    "/icons/apple-touch-icon.png",
  ])
    expect((await request.get(path)).ok(), path).toBe(true);

  const html = await (await request.get("/games/aci-series-1")).text();
  expect(html).toContain(
    '<link rel="canonical" href="https://gamedemoportfolio.vercel.app/games/aci-series-1"',
  );
  expect(html).toContain('property="og:title" content="ACI: Series 1"');
  expect(html).toContain("/games/aci-series-1/opengraph-image");
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  expect(html).toContain('rel="manifest"');
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(
    "https://gamedemoportfolio.vercel.app/games/moon-sweeper",
  );
});

test("live: Play opens the game in a new tab; /play redirect lands there", async ({
  page,
  context,
}) => {
  test.setTimeout(90_000);
  await page.goto("/");
  const [tab] = await Promise.all([
    context.waitForEvent("page"),
    page
      .getByRole("link", { name: /^Play now: ACI: Series 1/ })
      .first()
      .click(),
  ]);
  await tab.waitForURL(`${ACI}**`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/); // the hub stays open
  await tab.close();
  await page.goto("/play/aci-series-1", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(`${ACI}`);
});

test("capture docs/screenshot.png", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Only images in the captured viewport matter; lazy ones below never load.
    const visible = [...document.images].filter(
      (img) => img.getBoundingClientRect().top < window.innerHeight,
    );
    await Promise.all(visible.map((img) => img.decode().catch(() => {})));
  });
  await page.screenshot({ path: "docs/screenshot.png" });
});
