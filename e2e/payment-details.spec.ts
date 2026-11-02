import { expect, test } from '@playwright/test';
import { PAYMENT_ROUTES, ROUTES } from '../src/constants/routes';
const cases = [
  {
    id: 'demo-record-64-001',
    label: 'pending-credit',
    direction: 'Credit',
    badge: 'Transaction Processing',
  },
  {
    id: 'demo-record-64-002',
    label: 'successful-debit',
    direction: 'Debit',
    badge: 'Transaction Successful',
  },
  {
    id: 'sample-payment-9',
    label: 'successful-credit',
    direction: 'Credit',
    badge: 'Transaction Successful',
  },
  {
    id: 'demo-record-64-005',
    label: 'failed-credit',
    direction: 'Credit',
    badge: 'Failed',
  },
];
for (const [width, height] of [
  [320, 850],
  [375, 850],
  [425, 850],
  [768, 1000],
  [1024, 1000],
  [1440, 1100],
  [768, 600],
  [1440, 700],
] as const) {
  test(`transaction variants fit ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const item of cases) {
      await page.goto(PAYMENT_ROUTES.details(item.id));
      await page.reload();
      await expect(
        page.getByRole('heading', { name: 'Transaction Details' }),
      ).toBeAttached();
      await expect(
        page.getByText(item.direction, { exact: true }),
      ).toBeVisible();
      await expect(
        page.locator('header').getByText(item.badge, { exact: true }),
      ).toBeVisible();
      await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
      await expect(
        page.getByRole('navigation', { name: 'Main navigation' }),
      ).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBe(height);
      const workspace = page.getByRole('main', {
        name: 'Transaction details workspace',
      });
      expect(
        await workspace.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      const pdf = page.getByRole('button', { name: 'Download PDF' });
      await pdf.scrollIntoViewIfNeeded();
      await expect(pdf).toBeInViewport();
      await expect(pdf).toBeDisabled();
      if (width === 375 || (width === 1440 && height === 1100))
        await page.screenshot({
          path: `/tmp/emilist-payment-${item.label}-${width}.png`,
        });
    }
    expect(errors).toEqual([]);
  });
}
test('Payments View and row actions open the selected receipt and dismissal returns to list', async ({
  page,
}) => {
  await page.goto(ROUTES.payments);
  await page.getByRole('link', { name: 'View', exact: true }).nth(1).click();
  await expect(page).toHaveURL(PAYMENT_ROUTES.details('demo-record-64-002'));
  await expect(page.getByText('Outflow', { exact: true })).toBeVisible();
  await expect(page.getByText('Completed', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Back', exact: true }).click();
  await expect(page).toHaveURL(ROUTES.payments);
  await page.getByLabel('Actions for transaction demo-record-64-001').click();
  await page
    .getByRole('link', { name: 'View transaction', exact: true })
    .click();
  await expect(page).toHaveURL(PAYMENT_ROUTES.details('demo-record-64-001'));
  await page.getByRole('link', { name: 'Close transaction details' }).click();
  await expect(page).toHaveURL(ROUTES.payments);
  await page.goto(PAYMENT_ROUTES.details('demo-record-64-005'));
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(ROUTES.payments);
});
test('receipt details preserve sample values and have no download or mutation transport', async ({
  page,
  request,
}) => {
  await page.goto(PAYMENT_ROUTES.details('demo-record-64-001'));
  const writes: string[] = [];
  page.on('request', (req) => {
    if (!['GET', 'HEAD'].includes(req.method())) writes.push(req.url());
  });
  await expect(
    page.getByText('Demo Customer One', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();
  await expect(page.getByText('AMOUNT RECEIVED', { exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Copy transaction ID' }).focus();
  await expect(
    page.getByRole('button', { name: 'Copy transaction ID' }),
  ).toBeFocused();
  await expect(
    page.getByRole('button', { name: 'Download PDF' }),
  ).toBeDisabled();
  expect(writes).toEqual([]);
  expect(
    (
      await request.post(PAYMENT_ROUTES.details('demo-record-64-001'), {
        data: { status: 'Successful' },
      })
    ).status(),
  ).toBe(403);
  await page.goto(PAYMENT_ROUTES.details('missing'));
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
});
