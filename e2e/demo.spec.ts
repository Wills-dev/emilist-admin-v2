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
test('a copied demo artifact denies access under production project identity', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4319/dashboard');
  await expect(page).toHaveURL('http://127.0.0.1:4319/login');
  await expect(
    page.getByRole('button', { name: 'Proceed', exact: true }),
  ).toBeDisabled();
});
test('a demo request without signed Vercel identity is rejected', async ({
  browser,
}) => {
  const bare = await fetch('http://127.0.0.1:4318/dashboard', {
    redirect: 'manual',
  });
  expect(bare.status).toBe(307);
  expect(bare.headers.get('location')).toContain('/login');
  const context = await browser.newContext({
    extraHTTPHeaders: { 'x-vercel-oidc-token': '' },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4318/dashboard');
  await expect(page).toHaveURL('http://127.0.0.1:4318/login');
  await context.close();
});

test('normal production artifact rejects even a valid demo request identity', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4317/dashboard');
  await expect(page).toHaveURL('http://127.0.0.1:4317/login');
  await expect(
    page.getByRole('button', { name: 'Proceed', exact: true }),
  ).toBeDisabled();
});

test('verified demo identity cannot authorize a production hostname', async ({
  request,
}) => {
  const response = await request.get('http://127.0.0.1:4318/dashboard', {
    headers: { host: '127.0.0.1:4317' },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toContain('/login');
});
