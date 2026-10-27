import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4317', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium',
      testIgnore: [
        '**/overview.spec.ts',
        '**/customers.spec.ts',
        '**/management.spec.ts',
        '**/operations.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      testIgnore: [
        '**/overview.spec.ts',
        '**/customers.spec.ts',
        '**/management.spec.ts',
        '**/operations.spec.ts',
      ],
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'overview-preview',
      // Serialize journeys against the shared development compiler/HMR server.
      workers: 1,
      expect: { timeout: 15_000 },
      // Development compilation and routed refresh checks need more time than production journeys.
      timeout: 90_000,
      testMatch: [
        '**/overview.spec.ts',
        '**/customers.spec.ts',
        '**/management.spec.ts',
        '**/operations.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4318' },
    },
  ],
  webServer: [
    {
      command: 'npm run start -- --hostname 127.0.0.1 --port 4317',
      url: 'http://127.0.0.1:4317',
      reuseExistingServer: false,
      env: { DASHBOARD_UI_PREVIEW: 'true' },
    },
    {
      command: 'npm run dev -- --webpack --hostname 127.0.0.1 --port 4318',
      url: 'http://127.0.0.1:4318',
      reuseExistingServer: false,
      env: { DASHBOARD_UI_PREVIEW: 'true', PLAYWRIGHT_PREVIEW: 'true' },
    },
  ],
});
