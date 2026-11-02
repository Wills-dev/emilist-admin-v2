import { expect, test } from '@playwright/test';
import { MATERIAL_ROUTES, ROUTES } from '../src/constants/routes';
const id = 'order-demo-record-60-004';
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
  test(`material order fits ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(MATERIAL_ROUTES.order(id));
    await expect(
      page.getByRole('heading', {
        name: 'Dangote Cement — Order Details',
        exact: true,
      }),
    ).toBeAttached();
    await expect(
      page.getByText('Total Active Listings', { exact: true }),
    ).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole('link', { name: 'Back to Orders' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBe(height);
    if (width === 375 || (width === 1440 && height === 1100))
      await page.screenshot({
        path: `/tmp/emilist-material-order-${width}.png`,
      });
    const trigger = page.getByRole('button', {
      name: 'Initiate Return',
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Initiate Order Return' });
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
    await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    if (width === 375 || (width === 1440 && height === 1100))
      await page.screenshot({ path: `/tmp/emilist-order-return-${width}.png` });
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}
test('order links, stock, comments and product tabs retain selected identity', async ({
  page,
}) => {
  await page.goto(ROUTES.materialOrders);
  await page.getByRole('link', { name: 'View', exact: true }).nth(3).click();
  await expect(page).toHaveURL(MATERIAL_ROUTES.order(id));
  await page
    .getByRole('tab', { name: /^specifications$/i, exact: true })
    .click();
  await expect(page.getByRole('tabpanel')).toContainText('255');
  await page.reload();
  await expect(
    page.getByRole('tab', { name: /^specifications$/i }),
  ).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: /^specifications$/i }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: /^description$/i })).toBeFocused();
  await page.getByRole('button', { name: 'Next product image' }).click();
  await expect(
    page.getByRole('img', { name: 'Packaging details — image not supplied' }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Search comments' })
    .fill('Reviewer Two');
  await expect(
    page.getByRole('heading', { name: 'Demo Reviewer Two' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Demo Reviewer One' }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'Search comments' }),
  ).toHaveValue('Reviewer Two');
  await page
    .getByRole('textbox', { name: 'Search comments' })
    .fill('no such comment');
  await expect(
    page.getByRole('heading', { name: 'No comments match' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'View Product Stock' }).click();
  await expect(page).toHaveURL(MATERIAL_ROUTES.stock('demo-record-60-004'));
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Dangote Cement');
});
test('returns and quantities never mutate records or submit requests', async ({
  page,
}) => {
  await page.goto(MATERIAL_ROUTES.order(id));
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.method() !== 'HEAD')
      writes.push(request.url());
  });
  await expect(
    page.getByRole('button', { name: 'Increase order quantity' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Decrease order quantity' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Helpful', exact: true }).first(),
  ).toBeDisabled();
  await page
    .getByRole('button', { name: 'Initiate Return', exact: true })
    .click();
  await page.getByRole('textbox', { name: 'Reason for return' }).fill(' ');
  await expect(page.getByRole('alert')).toHaveText(
    'Enter a reason for the return.',
  );
  await page
    .getByRole('textbox', { name: 'Reason for return' })
    .fill('Synthetic damaged packaging');
  await expect(
    page.getByRole('button', { name: 'Submit', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Delivered', { exact: true })).toBeVisible();
  expect(writes).toEqual([]);
  await page.goto(MATERIAL_ROUTES.order('order-demo-record-60-001'));
  await expect(
    page.getByRole('heading', { name: 'Sharp Sand — Order Details' }),
  ).toBeAttached();
  await expect(
    page.getByRole('heading', { name: 'Demo Reviewer One' }),
  ).toHaveCount(0);
  await page.goto(MATERIAL_ROUTES.order('missing'));
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
});
