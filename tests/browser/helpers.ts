import type { Page } from "@playwright/test";

/**
 * Opens a hub page and waits until React has hydrated it. Hydration finishes a
 * few milliseconds after the load event, so a key press or click sent straight
 * after `goto` can arrive before its handler exists.
 */
export async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => {
    const search = document.querySelector("button[aria-keyshortcuts]");
    return (
      search !== null &&
      Object.keys(search).some((key) => key.startsWith("__reactProps"))
    );
  });
  // Effects (such as the Ctrl+K listener) attach just after the commit.
  await page.evaluate(
    () =>
      new Promise((done) => requestAnimationFrame(() => setTimeout(done, 0))),
  );
}

export function trackConsole(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      problems.push(message.text());
  });
  return problems;
}
