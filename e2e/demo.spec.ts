import { expect, test } from '@playwright/test';
import { ROUTES, CUSTOMER_ROUTES } from '../src/constants/routes';
const routes = [
  ROUTES.dashboard,
  ROUTES.customers,
  CUSTOMER_ROUTES.details('demo-customer-001'),
  ...(
    [
      'services',
      'jobs',
      'listedItems',
      'orders',
      'sales',
      'transactions',
      'subscriptions',
    ] as const
  ).map((tab) => CUSTOMER_ROUTES.tab('demo-customer-001', tab)),
  ROUTES.jobs,
  ROUTES.materials,
  ROUTES.materialOrders,
  ROUTES.payments,
  ROUTES.support,
  ROUTES.reports,
  ROUTES.settings,
  ROUTES.settingsPermissions,
];
test('dedicated demo artifact permits Sign In navigation without credentials or a session', async ({
  page,
  context,
}) => {
  await page.goto(ROUTES.login);
  await expect(page.getByRole('note')).toContainText(
    'not an authenticated session',
  );
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(ROUTES.dashboard);
  await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
test('every demo dashboard route supports direct navigation and refresh', async ({
  page,
}) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(route);
    await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
  }
});
test('demo has no API or mutation transport and blocks external administrative connections', async ({
  page,
  request,
}) => {
  await page.goto(ROUTES.payments);
  await expect(
    page.getByRole('button', { name: 'View', exact: true }).first(),
  ).toBeDisabled();
  const response = await request.get('/api/private');
  expect(response.status()).toBe(403);
  for (const path of [ROUTES.dashboard, '/api/payments', '/reports/export'])
    expect(
      (
        await request.post(path, {
          headers: { 'next-action': 'untrusted-action' },
          data: { action: 'mutate' },
        })
      ).status(),
    ).toBe(403);
  expect((await request.get('/reports/export')).status()).toBe(403);
  let dispatched = false;
  await page.route('https://administration.example.invalid/**', (route) => {
    dispatched = true;
    return route.abort();
  });
  expect(
    await page.evaluate(async () => {
      try {
        await fetch('https://administration.example.invalid/private');
        return false;
      } catch {
        return true;
      }
    }),
  ).toBe(true);
  expect(dispatched).toBe(false);
});
test('dashboard access ignores missing or mismatched deployment identities', async ({
  browser,
}) => {
  const context = await browser.newContext({
    extraHTTPHeaders: { 'x-vercel-oidc-token': 'invalid' },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4317/dashboard');
  await expect(page).toHaveURL('http://127.0.0.1:4317/dashboard');
  await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
  await context.close();
});
