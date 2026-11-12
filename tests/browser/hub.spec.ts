import { test, expect } from "@playwright/test";
import { open, trackConsole } from "./helpers";

const ACI = "https://aci-series1.vercel.app/";
const PAGES = [
  "/",
  "/about",
  "/makers",
  "/games/aci-series-1",
  "/games/devil-game",
  "/games/untitled-obby",
  "/games/moon-sweeper",
];

test("Play links are real anchors to the live game in a new tab", async ({
  page,
}) => {
  await open(page, "/");
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
  // Upcoming games are locked, never links, and use the confirmed display names.
  for (const title of ["Devil 2", "Multi Player Obby", "Moon Sweeper"]) {
    const row = page.locator("li[data-status]", { hasText: title });
    await expect(
      row.getByRole("button", { name: "Coming soon" }),
    ).toBeDisabled();
    await expect(row.getByRole("link", { name: /^Play/ })).toHaveCount(0);
  }
});

test("library filters show only matching rows", async ({ page }) => {
  await open(page, "/");
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
  await open(page, "/");
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
    "A place for games.",
  );
  expect(problems).toEqual([]);
});

test("keyboard: gallery lightbox steps, closes, returns focus", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await open(page, "/games/aci-series-1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ACI");
  await expect(page.getByRole("button", { name: /^Enlarge: / })).toHaveCount(6);
  await expect(page.locator(".hero-preview button[aria-pressed]")).toHaveCount(
    6,
  );
  const first = page.getByRole("button", { name: /^Enlarge: / }).first();
  await first.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /^Close/ })).toBeFocused();
  const title = dialog.getByRole("heading");
  await expect(title).toHaveText("01 — ACI HQ / Loading yard");
  await page.keyboard.press("ArrowRight");
  await expect(title).toHaveText("02 — ACI HQ / Assembly line");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(title).toHaveText("06 — Zombies / First wave");
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
  await open(page, "/");
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
  await open(blocked, "/");
  const toggle = blocked.getByRole("button", { name: "UI sounds" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(problems).toEqual([]);
  await blocked.close();
});

test("every page fits narrow phones and tablets with reduced motion and logs nothing", async ({
  page,
}) => {
  const problems = trackConsole(page);
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 780 });
    for (const path of PAGES) {
      await open(page, path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
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
  await open(page, "/play/unknown-slug");
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
  await open(page, "/");
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

test("creator information belongs to the correct game, never the shared hub", async ({
  page,
}) => {
  for (const path of ["/", "/about"]) {
    await open(page, path);
    await expect(page.locator("body")).not.toContainText("Casey Nguyen");
    await expect(page.locator("body")).not.toContainText("Trea Edwards");
    await expect(
      page.locator('a[href^="mailto:"], a[href*="github.com"]'),
    ).toHaveCount(0);
    await expect(page.locator('meta[name="author"]')).toHaveCount(0);
  }
  for (const slug of ["aci-series-1", "untitled-obby", "moon-sweeper"]) {
    await open(page, "/games/" + slug);
    await expect(
      page.getByRole("heading", { name: "Casey Nguyen", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "ceen2327@gmail.com" }),
    ).toHaveAttribute("href", "mailto:ceen2327@gmail.com");
    await expect(page.locator('meta[name="author"]')).toHaveAttribute(
      "content",
      "Casey Nguyen",
    );
  }
  await open(page, "/games/devil-game");
  await expect(
    page.getByRole("heading", { name: "Trea Edwards", exact: true }),
  ).toBeVisible();
  await expect(page.locator('meta[name="author"]')).toHaveAttribute(
    "content",
    "Trea Edwards",
  );
  await expect(
    page.locator('a[href^="mailto:"], a[href*="github.com"]'),
  ).toHaveCount(0);
});

test("featured preview changes with the keyboard and exposes its selection", async ({
  page,
}) => {
  await open(page, "/");
  const preview = page.getByRole("button", {
    name: "02: preview ACI HQ / Loading yard",
  });
  await preview.focus();
  await page.keyboard.press("Enter");
  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("button", { name: "03: preview ACI HQ / Assembly line" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".hero-preview figcaption")).toHaveText(
    "ACI HQ / Loading yard",
  );
  await expect(
    page.locator(".hero-preview img.preview-current"),
  ).toHaveAttribute("alt", /loading yard/);
  await page
    .getByRole("button", { name: "01: preview Startup / ACI HQ" })
    .click();
  await expect(preview).toHaveAttribute("aria-pressed", "false");
});

test("sharing copies the game page and offers a fallback when clipboard access fails", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "/games/aci-series-1");
  await page.getByRole("button", { name: "Copy game link" }).click();
  await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "https://gamedemoportfolio.vercel.app/games/aci-series-1",
  );
  await open(page, "/games/devil-game");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Blocked");
        },
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Copy game link" }).click();
  const fallback = page.getByRole("textbox", { name: "Game page link" });
  await expect(fallback).toHaveValue(
    "https://gamedemoportfolio.vercel.app/games/devil-game",
  );
  await fallback.focus();
  expect(
    await fallback.evaluate(
      (element: HTMLInputElement) => element.selectionEnd,
    ),
  ).toBe((await fallback.inputValue()).length);
});

test("every cover in the deck can be reached by moving across it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, "/");
  const deck = page.locator(".cover-deck");
  await expect(deck.getByRole("link")).toHaveCount(4);
  // Let the entrance animation finish so the cards sit in their fan positions.
  await page.waitForTimeout(1200);
  const box = (await deck.boundingBox())!;
  const y = box.y + box.height * 0.55;

  // Sweep the pointer across the fan and record each card as it is raised.
  const sweep = async (from: number, to: number) => {
    const raised: string[] = [];
    for (let step = 0; step <= 60; step++) {
      await page.mouse.move(from + ((to - from) * step) / 60, y);
      await page.waitForTimeout(30);
      const label = await page.evaluate(
        () =>
          document
            .querySelector(".deck-card:hover")
            ?.getAttribute("aria-label") ?? null,
      );
      if (label && raised.at(-1) !== label) raised.push(label);
    }
    return raised;
  };
  const order = [
    "Explore ACI: Series 1",
    "Explore Devil 2",
    "Explore Multi Player Obby",
    "Explore Moon Sweeper",
  ];
  expect(await sweep(box.x + 20, box.x + box.width - 20)).toEqual(order);
  expect(await sweep(box.x + box.width - 20, box.x + 20)).toEqual(
    [...order].reverse(),
  );
});

test("source and share links on a game page open in a new tab", async ({
  page,
}) => {
  await open(page, "/games/aci-series-1");
  const source = page.getByRole("link", {
    name: /github\.com\/ceenguyen05\/ACI-Series1/,
  });
  await expect(source).toHaveAttribute(
    "href",
    "https://github.com/ceenguyen05/ACI-Series1",
  );
  await expect(source).toHaveAttribute("target", "_blank");
  await expect(source).toHaveAttribute("rel", /noopener/);
  const maker = page.getByRole("link", { name: "GitHub", exact: true });
  await expect(maker).toHaveAttribute("target", "_blank");
});

test("sections below the fold reveal on scroll and are never left hidden", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await open(page, "/");
  const banner = page.locator(".share-banner");
  await expect(banner).toHaveAttribute("data-reveal", "pending");
  await banner.scrollIntoViewIfNeeded();
  await expect(banner).toHaveAttribute("data-reveal", "");
  await expect(banner).toHaveCSS("opacity", "1");

  // With reduced motion nothing is hidden in the first place.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator('[data-reveal="pending"]')).toHaveCount(0);
});

test("saved picks persist and follow the visitor between the library and game pages", async ({
  page,
}) => {
  await open(page, "/");
  await page
    .getByRole("button", { name: "Save for later: Moon Sweeper", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved: Moon Sweeper", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^Saved 1$/ }).click();
  await expect(
    page.locator("li[data-status]").filter({ visible: true }),
  ).toHaveCount(1);
  await expect(
    page.locator("li[data-status]").filter({ visible: true }),
  ).toContainText("Moon Sweeper");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Saved: Moon Sweeper", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .locator("li[data-slug='moon-sweeper']")
    .getByRole("link", { name: "Moon Sweeper", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved: Moon Sweeper", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Saved: Moon Sweeper", exact: true })
    .click();
  await open(page, "/");
  await page.getByRole("button", { name: /^Saved 0$/ }).click();
  await expect(
    page.getByRole("heading", { name: "Your next favorites belong here." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore all games" }).click();
  await expect(
    page.locator("li[data-status]").filter({ visible: true }),
  ).toHaveCount(4);
});

test("removing the last saved tile returns focus to the saved filter", async ({
  page,
}) => {
  await open(page, "/");
  await page
    .getByRole("button", { name: "Save for later: Devil 2", exact: true })
    .click();
  await page.getByRole("button", { name: /^Saved 1$/ }).click();
  await page
    .getByRole("button", { name: "Saved: Devil 2", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^Saved 0$/ })).toBeFocused();
  await expect(
    page.locator("li[data-status]").filter({ visible: true }),
  ).toHaveCount(0);
});

test("saved games work for the visit when browser storage is blocked", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  const problems = trackConsole(page);
  await open(page, "/");
  await page
    .getByRole("button", {
      name: "Save for later: Multi Player Obby",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /^Saved 1$/ }).click();
  await expect(page.getByText("Saved for this visit.")).toBeVisible();
  await expect(
    page.locator("li[data-status]").filter({ visible: true }),
  ).toHaveCount(1);
  expect(problems).toEqual([]);
});

test("saved filters ignore stale or malformed storage entries", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "playroom-saved-games",
      '["unknown-game",null,123,"moon-sweeper","moon-sweeper"]',
    ),
  );
  await open(page, "/");
  await expect(page.getByRole("button", { name: /^Saved 1$/ })).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem("playroom-saved-games", "broken json");
    window.dispatchEvent(
      new StorageEvent("storage", { key: "playroom-saved-games" }),
    );
  });
  await expect(page.getByRole("button", { name: /^Saved 0$/ })).toBeVisible();
});

test("quick look is keyboard accessible and keeps live launches separate from upcoming games", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await open(page, "/");
  const trigger = page.getByRole("button", {
    name: "Quick look: ACI: Series 1",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", {
    name: "ACI: Series 1",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /Close/ })).toBeFocused();
  const play = dialog.getByRole("link", { name: /^Play now/ });
  await expect(play).toHaveAttribute("href", ACI);
  await expect(play).toHaveAttribute("target", "_blank");
  await dialog
    .getByRole("button", { name: "Save for later: ACI: Series 1", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("button", { name: /^Saved 1$/ })).toBeVisible();
  await page
    .getByRole("button", { name: "Quick look: Devil 2", exact: true })
    .click();
  const upcoming = page.getByRole("dialog", { name: "Devil 2", exact: true });
  await expect(
    upcoming.getByRole("button", { name: "Coming soon", exact: true }),
  ).toBeDisabled();
  await expect(upcoming.getByRole("link", { name: /^Play now/ })).toHaveCount(
    0,
  );
  await upcoming.getByRole("link", { name: "Explore the game" }).click();
  await expect(page).toHaveURL(/games\/devil-game$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(problems).toEqual([]);
});

test("touch gestures change previews horizontally without intercepting vertical scroll", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await open(page, "/games/aci-series-1");
  const preview = page.locator(".preview-image");
  await preview.scrollIntoViewIfNeeded();
  const box = (await preview.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  const x = box.x + box.width * 0.7,
    y = box.y + box.height * 0.5;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x - 90, y: y + 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator(".hero-preview figcaption")).toHaveText(
    "ACI HQ / Loading yard",
  );
  await expect(preview).toHaveCSS("touch-action", "pan-y pinch-zoom");
  await context.close();
});

test("motion preference changes reveal pending sections and turn off pointer lighting", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await open(page, "/");
  const tile = page.locator("li[data-slug='aci-series-1']");
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  await expect(tile).toHaveAttribute("data-lit", "");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(tile).not.toHaveAttribute("data-lit", "");
  await expect(page.locator('[data-reveal="pending"]')).toHaveCount(0);
});

test("quick look fits narrow phones", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  const problems = trackConsole(page);
  await open(page, "/");
  await expect(
    page.getByRole("dialog", { name: "Moon Sweeper", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Quick look: Moon Sweeper", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Moon Sweeper",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
  expect(
    await dialog.evaluate((el) => el.scrollWidth - el.clientWidth),
  ).toBeLessThanOrEqual(0);
  await page.keyboard.press("Escape");
  expect(problems).toEqual([]);
});

test("ACI captures appear across the collection and all six gallery images load", async ({
  page,
}) => {
  await open(page, "/");
  const cover = /url=%2Fgames%2Faci-series-1%2Fcover.webp/;
  await expect(
    page.locator('.deck-card[href="/games/aci-series-1"] img'),
  ).toHaveAttribute("src", cover);
  await expect(
    page.locator(".hero-preview img.preview-current"),
  ).toHaveAttribute("src", cover);
  const tile = page.locator('[data-slug="aci-series-1"]');
  await expect(tile.locator("img.tile-cover")).toHaveAttribute("src", cover);
  await expect(tile.locator("img.tile-alternate")).toHaveAttribute(
    "src",
    /screenshot-01.webp/,
  );
  await page
    .getByRole("button", { name: "Quick look: ACI: Series 1", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator("img")).toHaveAttribute(
    "src",
    cover,
  );
  await page.keyboard.press("Escape");
  await page.locator('.deck-card[href="/games/aci-series-1"]').click();
  await expect(page).toHaveURL(/games\/aci-series-1$/);
  await expect(
    page.locator(".hero-preview img.preview-current"),
  ).toHaveAttribute("src", cover);
  await expect(page.getByRole("button", { name: /^Enlarge: / })).toHaveCount(6);
  const images = page
    .getByRole("button", { name: /^Enlarge: / })
    .locator("img");
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
    expect(
      await img.evaluate(async (el: HTMLImageElement) => {
        await el.decode();
        return el.naturalWidth > 0;
      }),
    ).toBe(true);
  }
});
