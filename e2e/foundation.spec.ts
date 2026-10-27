import { expect, test } from '@playwright/test';

test('root redirects to the dashboard foundation', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByRole('heading', { name: 'Overview', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'No live data connected' }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('dashboard.png'),
    fullPage: true,
  });
});

test('mobile navigation opens and closes', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile-chromium',
    'Mobile navigation only',
  );
  await page.goto('/dashboard');
  await page
    .getByRole('button', { name: 'Open navigation', exact: true })
    .click();
  await expect(
    page.getByRole('link', { name: 'Overview', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Close navigation', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Open navigation', exact: true }),
  ).toHaveAttribute('aria-expanded', 'false');
  await expect(
    page.getByRole('button', { name: 'Open navigation', exact: true }),
  ).toBeFocused();
  await page
    .getByRole('button', { name: 'Open navigation', exact: true })
    .click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Open navigation', exact: true }),
  ).toBeFocused();
});

test('unknown routes show a recovery link', async ({ page }) => {
  const response = await page.goto('/missing-route');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('link', { name: 'Return to overview' }),
  ).toBeVisible();
});
