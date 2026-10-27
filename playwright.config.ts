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
      ],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      testIgnore: [
        '**/overview.spec.ts',
        '**/customers.spec.ts',
        '**/management.spec.ts',
      ],
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'overview-preview',
      testMatch: [
        '**/overview.spec.ts',
        '**/customers.spec.ts',
        '**/management.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4318' },
    },
  ],
  webServer: [
    {
      command: 'npm run start -- --hostname 127.0.0.1 --port 4317',
      url: 'http://127.0.0.1:4317',
      reuseExistingServer: false,
      env: { DASHBOARD_UI_PREVIEW: 'false' },
    },
    {
      command: 'npm run start -- --hostname 127.0.0.1 --port 4318',
      url: 'http://127.0.0.1:4318',
      reuseExistingServer: false,
      env: { DASHBOARD_UI_PREVIEW: 'true' },
    },
  ],
});
