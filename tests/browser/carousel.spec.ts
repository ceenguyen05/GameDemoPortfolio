import { test, expect, type Page } from "@playwright/test";
import { open, trackConsole } from "./helpers";

async function readyPreview(page: Page) {
  const preview = page.locator(".hero-preview");
  await expect(preview.locator(".preview-current")).toHaveJSProperty(
    "complete",
    true,
  );
  await expect(preview.locator(".preview-image")).toHaveAttribute(
    "aria-busy",
    "false",
  );
}

async function startClock(page: Page, path: string) {
  await page.clock.install();
  await open(page, path);
  await page.locator(".hero-preview").scrollIntoViewIfNeeded();
  await readyPreview(page);
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page
    .getByRole("button", { name: "01: preview Startup / ACI HQ" })
    .click();
  await readyPreview(page);
  // Leaving hover starts a fresh full interval, independent of page-load time.
  await page.locator(".hero-preview").hover();
  await page.mouse.move(0, 0);
}

for (const path of ["/", "/games/aci-series-1"]) {
  test(`previews cycle 1–6–1 every five seconds on ${path}`, async ({
    page,
  }, testInfo) => {
    const problems = trackConsole(page);
    await startClock(page, path);
    const counter = page.locator(".preview-counter");
    await page.clock.runFor(4999);
    await expect(counter).toHaveText("01 / 06");
    await page.clock.runFor(1);
    await expect(counter).toHaveText("02 / 06");
    await readyPreview(page);
    for (const number of [3, 4, 5, 6, 1]) {
      await page.clock.runFor(5000);
      await expect(counter).toHaveText(`0${number} / 06`);
      await readyPreview(page);
    }
    await expect(page.locator(".hero-preview figcaption")).toHaveAttribute(
      "aria-live",
      "off",
    );
    await page.locator(".hero-preview").screenshot({
      path: testInfo.outputPath("desktop-preview.png"),
      animations: "disabled",
    });
    expect(problems).toEqual([]);
  });
}

test("hover and keyboard focus pause previews; scrolling resumes normal cycling", async ({
  page,
}) => {
  await startClock(page, "/");
  const preview = page.locator(".hero-preview");
  const counter = preview.locator(".preview-counter");
  await preview.hover();
  await page.clock.runFor(15000);
  await expect(counter).toHaveText("01 / 06");
  await page.mouse.move(0, 0);
  await page.clock.runFor(5000);
  await expect(counter).toHaveText("02 / 06");
  await readyPreview(page);
  const number = preview.getByRole("button", {
    name: "02: preview ACI HQ / Loading yard",
  });
  await page.keyboard.press("Tab");
  await number.focus();
  await page.clock.runFor(15000);
  await expect(counter).toHaveText("02 / 06");
  await expect(preview.locator("figcaption")).toHaveAttribute(
    "aria-live",
    "polite",
  );
  await page.locator("main").focus();
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await page.clock.runFor(5000);
  await expect(counter).toHaveText("03 / 06");
  await readyPreview(page);
  await page.clock.runFor(5000);
  await expect(counter).toHaveText("04 / 06");
});

test("explicit pause persists and manual selection resumes from the chosen image", async ({
  page,
}) => {
  await startClock(page, "/games/aci-series-1");
  const preview = page.locator(".hero-preview");
  await preview.getByRole("button", { name: "Pause slideshow" }).click();
  await preview
    .getByRole("button", { name: "06: preview Zombies / First wave" })
    .click();
  await readyPreview(page);
  await page.mouse.move(0, 0);
  await page.clock.runFor(15000);
  await expect(preview.locator(".preview-counter")).toHaveText("06 / 06");
  await preview.getByRole("button", { name: "Play slideshow" }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(5000);
  await expect(preview.locator(".preview-counter")).toHaveText("01 / 06");
});

test("reduced motion disables autoplay, including when changed during playback", async ({
  page,
}) => {
  await startClock(page, "/games/aci-series-1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Pause slideshow" }),
  ).toHaveCount(0);
  await page.clock.runFor(15000);
  await expect(page.locator(".preview-counter")).toHaveText("01 / 06");
  await page
    .getByRole("button", { name: "03: preview ACI HQ / Assembly line" })
    .click();
  await readyPreview(page);
  await page.mouse.move(0, 0);
  await page.clock.runFor(15000);
  await expect(page.locator(".preview-counter")).toHaveText("03 / 06");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(
    page.getByRole("button", { name: "Pause slideshow" }),
  ).toBeVisible();
  await page.clock.runFor(5000);
  await expect(page.locator(".preview-counter")).toHaveText("04 / 06");
});

test("background tabs pause without catching up on missed slides", async ({
  page,
}) => {
  await startClock(page, "/games/aci-series-1");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(30000);
  await expect(page.locator(".preview-counter")).toHaveText("01 / 06");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(5000);
  await expect(page.locator(".preview-counter")).toHaveText("02 / 06");
});

test("changing motion preference preserves playback-button focus and resumes on blur", async ({
  page,
}) => {
  await startClock(page, "/games/aci-series-1");
  await page.keyboard.press("Tab");
  const playback = page.locator(".preview-playback");
  await playback.focus();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(playback).toBeFocused();
  await expect(playback).toHaveAttribute("aria-disabled", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.runFor(10000);
  await expect(page.locator(".preview-counter")).toHaveText("01 / 06");
  await page.locator("main").focus();
  await page.clock.runFor(5000);
  await expect(page.locator(".preview-counter")).toHaveText("02 / 06");
});

test("every preview control fits a 320px touch screen and pause works on mobile", async ({
  browser,
  baseURL,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 780 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const problems = trackConsole(page);
  await page.clock.install();
  for (const path of ["/", "/games/aci-series-1"]) {
    await open(page, path);
    const preview = page.locator(".hero-preview");
    await preview.scrollIntoViewIfNeeded();
    const container = (await preview.boundingBox())!;
    for (const button of await preview.getByRole("button").all()) {
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(container.x);
      expect(box.x + box.width).toBeLessThanOrEqual(
        container.x + container.width,
      );
    }
    await preview.getByRole("button", { name: "Pause slideshow" }).tap();
    await preview
      .getByRole("button", { name: "06: preview Zombies / First wave" })
      .tap();
    await readyPreview(page);
    await page.clock.runFor(10000);
    await expect(preview.locator(".preview-counter")).toHaveText("06 / 06");
    await preview.getByRole("button", { name: "Play slideshow" }).tap();
    await page.clock.runFor(5000);
    await expect(preview.locator(".preview-counter")).toHaveText("01 / 06");
    await readyPreview(page);
    await preview.screenshot({
      path: testInfo.outputPath(
        path === "/" ? "spotlight-mobile.png" : "game-preview-mobile.png",
      ),
      animations: "disabled",
    });

    const image = preview.locator(".preview-image");
    await image.scrollIntoViewIfNeeded();
    const box = (await image.boundingBox())!;
    const cdp = await context.newCDPSession(page);
    const x = box.x + box.width * 0.75;
    const y = box.y + box.height / 2;
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
    await expect(preview.locator(".preview-counter")).toHaveText("02 / 06");
    await readyPreview(page);
    const beforeScroll = await page.evaluate(() => scrollY);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - 100 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(beforeScroll);
    await page.clock.runFor(5000);
    await expect(preview.locator(".preview-counter")).toHaveText("03 / 06");
    await cdp.detach();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
  }
  expect(problems).toEqual([]);
  await context.close();
});

test("single-image upcoming games remain static without slideshow controls", async ({
  page,
}) => {
  await open(page, "/games/devil-game");
  await expect(page.locator(".hero-preview .preview-playback")).toHaveCount(0);
  await expect(page.locator(".preview-counter")).toHaveText("01 / 01");
});
