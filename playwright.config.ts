import { defineConfig, devices } from "@playwright/test";

// Tests run against the production build on their own port, so a `npm run dev`
// server on 3000 is never picked up by mistake. Run `npm run build` first.
const port = Number(process.env.TEST_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  projects: [
    // Assertions about behavior. Run by `npm run test:browser`.
    { name: "checks", testMatch: /(hub|navigation|makers|carousel)\.spec\.ts/ },
    // Regenerates the README images in docs/. Run by `npm run screenshots`.
    { name: "screenshots", testMatch: /screenshots\.spec\.ts/ },
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    channel: process.env.CI ? "chromium" : "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
