// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import configure from '../../next.config';
afterEach(() => vi.unstubAllEnvs());
it('builds without project identity, hostname, token, or preview configuration', () => {
  for (const key of [
    'DEMO_VERCEL_PROJECT_ID',
    'ADMIN_VERCEL_PROJECT_ID',
    'EMILIST_VERCEL_TEAM_ID',
    'EMILIST_VERCEL_TEAM_SLUG',
    'DEMO_ALLOWED_HOSTS',
    'ADMIN_ALLOWED_HOSTS',
    'VERCEL_OIDC_TOKEN',
  ])
    vi.stubEnv(key, '');
  vi.stubEnv('VERCEL', '1');
  vi.stubEnv('DASHBOARD_UI_PREVIEW', 'false');
  vi.stubEnv('APP_DEPLOYMENT_MODE', 'production');
  expect(() => configure()).not.toThrow();
});
it('ignores retired demo deployment flags on ordinary builds', () => {
  vi.stubEnv('APP_DEPLOYMENT_MODE', 'demo');
  vi.stubEnv('EMILIST_BUILD_TARGET', 'demo');
  vi.stubEnv('EMILIST_OUTPUT_DIRECTORY', '.next-demo');
  vi.stubEnv('NODE_ENV', 'production');
  expect(configure().distDir).toBe('.next');
});
