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
        '**/demo.spec.ts',
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
        '**/demo.spec.ts',
      ],
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'overview-preview',
      workers: 2,
      expect: { timeout: 15_000 },
      // Allow time for multi-route responsive and refresh journeys.
      timeout: 90_000,
      testMatch: [
        '**/overview.spec.ts',
        '**/customers.spec.ts',
        '**/management.spec.ts',
        '**/operations.spec.ts',
        '**/demo.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4317',
      },
    },
  ],
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1 --port 4317',
    url: 'http://127.0.0.1:4317',
    reuseExistingServer: false,
    // Legacy deployment settings must not prevent public fixture access.
    env: {
      DASHBOARD_UI_PREVIEW: 'false',
      APP_DEPLOYMENT_MODE: 'production',
      VERCEL: '1',
    },
  },
});
