import { expect, test } from '@playwright/test';
import { MATERIAL_ROUTES, ROUTES } from '../src/constants/routes';
const id = 'demo-record-60-004';
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
  test(`listing and de-list dialog fit ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(MATERIAL_ROUTES.listing(id));
    await page.reload();
    await expect(
      page.getByRole('heading', { name: 'Dangote Cement — Listing Details' }),
    ).toBeAttached();
    await expect(
      page.getByText('Total Active Listings', { exact: true }),
    ).toHaveCount(0);
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
        path: `/tmp/emilist-material-listing-${width}.png`,
      });
    const trigger = page.getByRole('button', {
      name: 'De-List Item',
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole('dialog', {
      name: 'De-List Item',
      exact: true,
    });
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
    await expect(dialog.getByRole('button', { name: 'Submit' })).toBeDisabled();
    if (width === 375 || (width === 1440 && height === 1100))
      await page.screenshot({
        path: `/tmp/emilist-material-delist-${width}.png`,
      });
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}
test('catalog View opens selected listing with local tabs, reviews and order links', async ({
  page,
}) => {
  await page.goto(ROUTES.materials);
  await page.getByRole('link', { name: 'View', exact: true }).nth(3).click();
  await expect(page).toHaveURL(MATERIAL_ROUTES.listing(id));
  await expect(
    page.getByText('100,000 bags in stock', { exact: true }),
  ).toBeVisible();
  await page.getByRole('tab', { name: /specifications/i }).click();
  await page.reload();
  await expect(
    page.getByRole('tab', { name: /specifications/i }),
  ).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: /specifications/i }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: /description/i })).toBeFocused();
  await page.getByRole('button', { name: 'Next product image' }).click();
  await expect(
    page.getByRole('img', { name: 'Packaging details — image not supplied' }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Search comments' })
    .fill('Reviewer Two');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Demo Reviewer Two' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Demo Reviewer One' }),
  ).toHaveCount(0);
  await page
    .getByRole('textbox', { name: 'Search comments' })
    .fill('not a comment');
  await expect(
    page.getByRole('heading', { name: 'No comments match' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'View Product Orders' }).click();
  await expect(page).toHaveURL(MATERIAL_ROUTES.productOrders(id));
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Dangote Cement');
});
test('de-listing never changes stock or status and other listings do not borrow reviews', async ({
  page,
}) => {
  await page.goto(MATERIAL_ROUTES.listing(id));
  const writes: string[] = [];
  page.on('request', (req) => {
    if (!['GET', 'HEAD'].includes(req.method())) writes.push(req.url());
  });
  await page.getByRole('button', { name: 'De-List Item', exact: true }).click();
  await page.getByRole('textbox', { name: 'Reason for de-listing' }).fill(' ');
  await expect(page.getByRole('alert')).toHaveText(
    'Enter a reason for de-listing.',
  );
  await page
    .getByRole('textbox', { name: 'Reason for de-listing' })
    .fill('Synthetic obsolete listing');
  await expect(
    page.getByRole('button', { name: 'Submit', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Listed', { exact: true })).toBeVisible();
  expect(writes).toEqual([]);
  await page.goto(MATERIAL_ROUTES.listing('demo-record-60-001'));
  await expect(
    page.getByRole('heading', { name: 'Sharp Sand — Listing Details' }),
  ).toBeAttached();
  await expect(
    page.getByRole('heading', { name: 'Demo Reviewer One' }),
  ).toHaveCount(0);
  await page.goto(MATERIAL_ROUTES.listing('missing'));
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
});
