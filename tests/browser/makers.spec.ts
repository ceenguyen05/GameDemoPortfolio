import { test, expect } from "@playwright/test";
import { open, trackConsole } from "./helpers";

test("header, search, footer and game credits lead to the makers", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await open(page, "/");
  const nav = page.getByRole("navigation", { name: "Main", exact: true });
  await expect(nav.getByRole("link")).toHaveText([
    "The games",
    "The idea",
    "The makers",
  ]);
  await nav.getByRole("link", { name: "The makers" }).click();
  await expect(page).toHaveURL(/\/makers$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Different minds.Shared curiosity.",
  );
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Search games and pages" })
    .fill("makers");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator("main")).toBeFocused();
  const casey = page.locator("#casey-nguyen");
  await expect(casey.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/caseynguyen2327",
  );
  await expect(
    casey.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("target", "_blank");
  await casey.getByRole("link", { name: /ACI: Series 1/ }).click();
  await page.getByRole("link", { name: "More about Casey Nguyen" }).click();
  await expect(page).toHaveURL(/\/makers#casey-nguyen$/);
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Meet the makers" }),
  ).toHaveAttribute("href", "/makers");
  expect(problems).toEqual([]);
});

test("maker jump links focus their targets and background sections work by keyboard", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await open(page, "/makers");
  const index = page.getByRole("navigation", { name: "Meet a maker" });
  await index.getByRole("link", { name: /Trea Edwards/ }).click();
  await expect(page.locator("#trea-edwards")).toBeFocused();
  await expect(page.locator("#trea-edwards .maker-game")).toHaveCount(1);
  await expect(page.locator("#trea-edwards .maker-game")).toContainText(
    "Devil 2",
  );
  await expect(
    page.locator(
      '#trea-edwards a[href^="mailto:"], #trea-edwards a[target="_blank"]',
    ),
  ).toHaveCount(0);
  await index.getByRole("link", { name: /Casey Nguyen/ }).click();
  await expect(page.locator("#casey-nguyen")).toBeFocused();
  const experience = page.locator("summary", { hasText: "Experience" });
  await experience.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      name: "Software Engineer · Applied Concepts, Inc.",
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("heading", {
      name: "Software Engineer · Applied Concepts, Inc.",
      exact: true,
    }),
  ).toBeHidden();
  const education = page.locator("summary", { hasText: "Education" });
  await education.click();
  await expect(
    page.getByRole("heading", {
      name: "M.S. in Artificial Intelligence · UT Austin",
    }),
  ).toBeVisible();
  await expect(page.locator("#casey-nguyen .maker-game")).toHaveCount(3);
  expect(problems).toEqual([]);
});

test("all navigation stays visible on narrow screens with reduced motion", async ({
  page,
}) => {
  const problems = trackConsole(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "/makers");
    for (const name of ["The games", "The idea", "The makers"])
      await expect(
        page
          .getByRole("navigation", { name: "Main", exact: true })
          .getByRole("link", { name }),
      ).toBeVisible();
    await page.locator("summary", { hasText: "Education" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      `width ${width}`,
    ).toBeLessThanOrEqual(0);
    await expect(page.locator('[data-reveal="pending"]')).toHaveCount(0);
  }
  expect(problems).toEqual([]);
});

test("maker content and disclosures are available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/makers");
  await page.locator("summary", { hasText: "Education" }).click();
  await expect(
    page.getByRole("heading", { name: "B.S. in Computer Science · UT Dallas" }),
  ).toBeVisible();
  await expect(page.locator(".maker-game")).toHaveCount(4);
  await page
    .getByRole("navigation", { name: "Meet a maker" })
    .getByRole("link", { name: /Trea Edwards/ })
    .click();
  await expect(page).toHaveURL(/#trea-edwards$/);
  await context.close();
});

test("makers page has canonical social metadata and a sitemap entry", async ({
  request,
}) => {
  const response = await request.get("/makers");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(
    '<link rel="canonical" href="https://gamedemoportfolio.vercel.app/makers"',
  );
  expect(html).toContain('property="og:title" content="The makers"');
  expect(html).toContain('name="twitter:title" content="The makers"');
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    "https://gamedemoportfolio.vercel.app/makers",
  );
});
