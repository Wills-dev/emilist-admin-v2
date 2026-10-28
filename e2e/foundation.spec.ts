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

test('public fixture dashboard opens directly without a session', async ({
  page,
  context,
}) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
  expect(await context.cookies()).toEqual([]);
});

test('unknown request paths remain blocked in the public fixture preview', async ({
  page,
}) => {
  const response = await page.goto('/missing-route');
  expect(response?.status()).toBe(403);
  await expect(
    page.getByText('Unavailable in Demo Mode.', { exact: false }),
  ).toBeVisible();
});
