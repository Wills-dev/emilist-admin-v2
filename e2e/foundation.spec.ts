import { expect, test } from '@playwright/test';

test('root opens the existing login interface', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/login');
  await expect(
    page.getByRole('heading', { name: 'Sign In', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('main', { name: 'Authentication form' }),
  ).toBeVisible();
});

test('dashboard access fails closed without a server session', async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: 'session', value: 'unverified', url: 'http://127.0.0.1:4317' },
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('authenticated', 'true');
  });
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
  await expect(
    page.getByRole('heading', { name: 'Sign In', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Overview', exact: true }),
  ).toHaveCount(0);
});

test('unknown routes recover to the public sign-in entry point', async ({
  page,
}) => {
  const response = await page.goto('/missing-route');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: 'Return to sign in' }).click();
  await expect(page).toHaveURL('/login');
});
