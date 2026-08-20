import { defineConfig, devices } from '@playwright/test';

// Frontend dev server runs on 3001 (NOT 3000 — that port is the backend api-gateway).
// Allow overriding via env for different setups.
const FRONTEND_PORT = process.env.PLAYWRIGHT_PORT ?? '3001';
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: FRONTEND_URL,
    reuseExistingServer: !process.env.CI,
  },
});
