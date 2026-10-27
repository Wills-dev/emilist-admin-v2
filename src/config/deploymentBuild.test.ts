// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import configure from '../../next.config';
afterEach(() => vi.unstubAllEnvs());
it('a normal artifact stays protected despite legacy preview flags', async () => {
  vi.stubEnv('VERCEL', '');
  vi.stubEnv('EMILIST_BUILD_TARGET', 'production');
  vi.stubEnv('APP_DEPLOYMENT_MODE', 'production');
  vi.stubEnv('DASHBOARD_UI_PREVIEW', 'true');
  expect(
    (await configure(PHASE_PRODUCTION_BUILD)).env?.EMILIST_BUILD_TARGET,
  ).toBe('production');
});
it('rejects a demo runtime configuration on a normal production build', async () => {
  vi.stubEnv('EMILIST_BUILD_TARGET', 'production');
  vi.stubEnv('APP_DEPLOYMENT_MODE', 'demo');
  await expect(configure(PHASE_PRODUCTION_BUILD)).rejects.toThrow(
    'normal production artifact',
  );
});
it('rejects demo builds without deployment identity and rejects API credentials', async () => {
  vi.stubEnv('EMILIST_BUILD_TARGET', 'demo');
  vi.stubEnv('VERCEL', '');
  await expect(configure(PHASE_PRODUCTION_BUILD)).rejects.toThrow();
});
it('rejects a configured Vercel demo build when its signed build token is missing', async () => {
  const values = {
    EMILIST_BUILD_TARGET: 'demo',
    APP_DEPLOYMENT_MODE: 'demo',
    DEMO_ALLOWED_HOSTS: 'demo.example.invalid',
    ADMIN_ALLOWED_HOSTS: 'admin.example.invalid',
    VERCEL: '1',
    VERCEL_ENV: 'production',
    VERCEL_PROJECT_ID: 'prj_demo_test',
    DEMO_VERCEL_PROJECT_ID: 'prj_demo_test',
    ADMIN_VERCEL_PROJECT_ID: 'prj_admin_test',
    EMILIST_VERCEL_TEAM_ID: 'team_test',
    EMILIST_VERCEL_TEAM_SLUG: 'test-team',
    DASHBOARD_UI_PREVIEW: 'false',
    VERCEL_OIDC_TOKEN: '',
    NEXT_PUBLIC_API_BASE_URL: '',
    API_BASE_URL: '',
    ADMIN_API_BASE_URL: '',
  };
  for (const [key, value] of Object.entries(values)) vi.stubEnv(key, value);
  await expect(configure(PHASE_PRODUCTION_BUILD)).rejects.toThrow(
    'signed build identity',
  );
});
