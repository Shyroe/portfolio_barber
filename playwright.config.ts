import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://127.0.0.1:${port}`;

// Ubuntu/WSL images often ship a system Chrome that is newer than the bundled
// Playwright browser. Prefer it locally when present; CI and other platforms
// fall back to the Playwright-managed download.
const chromeExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  (process.env.CI || process.platform !== "linux" ? undefined : "/usr/bin/google-chrome");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    // Deterministic by default: the reveal reserves no mid-animation frame for
    // assertions to race. The accessibility suite opts back into motion in the
    // tests that specifically cover the animated path.
    reducedMotion: "reduce",
  },
  projects:
    process.env.PLAYWRIGHT_BROWSERS === "cross"
      ? [
          // `pnpm run test:e2e:cross`: os dois motores extra, sem repetir o
          // Chromium do suite padrão. Pegam o que só aparece fora do Blink
          // (scroll com `behavior: instant`, `animation-fill-mode`, media queries
          // de `scripting`/`prefers-reduced-motion`, âncoras, foco).
          { name: "firefox", use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", use: { ...devices["Desktop Safari"] } },
        ]
      : [
          {
            name: "chromium",
            use: {
              ...devices["Desktop Chrome"],
              launchOptions: {
                executablePath: chromeExecutablePath,
              },
            },
          },
        ],
  webServer: {
    // `output: "export"` has no `next start`: serve the exported document the
    // same way the Cloudflare Worker assets binding does.
    command: `node scripts/build/serve-static.mjs --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
