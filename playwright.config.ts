import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const identity: { env: Record<string, string>; token: string } = JSON.parse(
  readFileSync('.test-deployment/identity.json', 'utf8'),
);
const demoEnv = {
  ...identity.env,
  NODE_OPTIONS: `--import ${resolve('e2e/helpers/mockVercel.mjs')}`,
};
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
        baseURL: 'http://127.0.0.1:4318',
        extraHTTPHeaders: { 'x-vercel-oidc-token': identity.token },
      },
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
      command: 'npm run start:demo -- --hostname 127.0.0.1 --port 4318',
      url: 'http://127.0.0.1:4318',
      reuseExistingServer: false,
      env: demoEnv,
    },
    {
      command: 'npm run start:demo -- --hostname 127.0.0.1 --port 4319',
      url: 'http://127.0.0.1:4319',
      reuseExistingServer: false,
      env: {
        ...demoEnv,
        VERCEL_PROJECT_ID: identity.env.ADMIN_VERCEL_PROJECT_ID!,
        APP_DEPLOYMENT_MODE: 'demo',
      },
    },
  ],
});
