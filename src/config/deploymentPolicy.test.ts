import { expect, it } from 'vitest';
import { deploymentBinding } from './deploymentPolicy';
const env = {
  DEMO_ALLOWED_HOSTS: 'demo.example.invalid',
  ADMIN_ALLOWED_HOSTS: 'admin.example.invalid',
  VERCEL: '1',
  VERCEL_ENV: 'production',
  VERCEL_PROJECT_ID: 'prj_demo_test',
  APP_DEPLOYMENT_MODE: 'demo',
  DEMO_VERCEL_PROJECT_ID: 'prj_demo_test',
  ADMIN_VERCEL_PROJECT_ID: 'prj_admin_test',
  EMILIST_VERCEL_TEAM_ID: 'team_test',
  EMILIST_VERCEL_TEAM_SLUG: 'test-team',
};
it('requires separate project identities and explicit deployment configuration', () => {
  expect(deploymentBinding('demo', env).projectId).toBe('prj_demo_test');
  for (const changes of [
    { VERCEL_PROJECT_ID: 'prj_admin_test' },
    { APP_DEPLOYMENT_MODE: 'production' },
    { VERCEL: undefined },
    { EMILIST_VERCEL_TEAM_ID: undefined },
    { ADMIN_VERCEL_PROJECT_ID: 'prj_demo_test' },
    { VERCEL_ENV: 'development' },
    { DASHBOARD_UI_PREVIEW: 'true' },
  ])
    expect(() => deploymentBinding('demo', { ...env, ...changes })).toThrow();
});
it('rejects API origins on demo builds and inconsistent production configuration', () => {
  for (const key of [
    'NEXT_PUBLIC_API_BASE_URL',
    'ADMIN_API_BASE_URL',
    'API_BASE_URL',
  ])
    expect(() =>
      deploymentBinding('demo', {
        ...env,
        [key]: 'https://admin.example.invalid',
      }),
    ).toThrow('APIs');
  expect(() => deploymentBinding('production', env)).toThrow();
  expect(
    deploymentBinding('production', {
      ...env,
      APP_DEPLOYMENT_MODE: 'production',
      VERCEL_PROJECT_ID: 'prj_admin_test',
    }).target,
  ).toBe('production');
});

it('rejects missing, wildcard, overlapping, or URL-shaped hostname allowlists', () => {
  for (const change of [
    { DEMO_ALLOWED_HOSTS: '' },
    { DEMO_ALLOWED_HOSTS: '*.example.invalid' },
    { DEMO_ALLOWED_HOSTS: 'https://demo.example.invalid' },
    { ADMIN_ALLOWED_HOSTS: 'demo.example.invalid' },
  ])
    expect(() => deploymentBinding('demo', { ...env, ...change })).toThrow();
});
