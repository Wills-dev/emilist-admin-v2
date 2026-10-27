import { expect, test } from '@playwright/test';
import { ROUTES } from '../src/constants/routes';

const screens = [
  { path: ROUTES.jobs, title: 'Jobs' },
  { path: ROUTES.materials, title: 'Product Catalog' },
  { path: ROUTES.materialOrders, title: 'Material Orders' },
];
for (const viewport of [
  { width: 320, height: 850 },
  { width: 375, height: 850 },
  { width: 425, height: 850 },
  { width: 768, height: 1000 },
  { width: 1024, height: 1000 },
  { width: 1440, height: 1100 },
  { width: 768, height: 600 },
  { width: 1440, height: 700 },
]) {
  test(`Jobs and Materials fit ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const screen of screens) {
      await page.goto(screen.path);
      await expect(
        page.getByRole('heading', { name: screen.title, exact: true }),
      ).toBeAttached();
      await expect(page.locator('tbody tr')).toHaveCount(9);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBe(viewport.height);
      const main = page.getByRole('main', { name: 'Administration workspace' });
      expect(
        await main.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      expect(
        await page
          .locator('.overview-card')
          .first()
          .evaluate((el) => getComputedStyle(el).animationName),
      ).toBe('none');
      const area = page.getByRole('region', {
        name: `${screen.title} table scroll area`,
      });
      await area.focus();
      await expect(area).toBeFocused();
      if (viewport.width < 1024) {
        expect(
          await area.evaluate((el) => el.scrollWidth > el.clientWidth),
        ).toBe(true);
        await area.press('ArrowRight');
      }
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(page.locator('tbody')).toContainText('Sample');
      await page.getByRole('button', { name: 'Previous', exact: true }).click();
      if ([375, 1440].includes(viewport.width) && viewport.height !== 700) {
        await area.evaluate((el) => {
          el.scrollLeft = 0;
        });
        await main.evaluate((el) => {
          el.scrollTop = 0;
        });
        await page.screenshot({
          path: `/tmp/emilist-${screen.title.toLowerCase().replaceAll(' ', '-')}-${viewport.width}.png`,
        });
        if (viewport.width === 375) {
          await main.evaluate((el) => {
            const search = el.querySelector('input');
            if (search)
              el.scrollTop +=
                search.getBoundingClientRect().top -
                el.getBoundingClientRect().top -
                85;
          });
          await page.screenshot({
            path: `/tmp/emilist-${screen.title.toLowerCase().replaceAll(' ', '-')}-375-table.png`,
          });
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('Jobs search, status, pagination, customer links and row disclosure work locally', async ({
  page,
}) => {
  await page.goto(ROUTES.jobs);
  const search = page.getByRole('textbox', { name: 'Search job count' });
  await search.fill('Roofing');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.reload();
  await expect(search).toHaveValue('Roofing');
  await search.fill('missing-record');
  await expect(page.locator('tbody')).toContainText('No records match');
  await search.fill('');
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by status').selectOption('Overdue');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Post-Site Cleaning');
  await page.getByLabel('Filter by status').selectOption('all');
  const summary = page.getByLabel('Actions for Home Furniture Upgrade 1234501');
  await summary.click();
  await expect(
    page.getByRole('button', { name: 'Pause job — unavailable' }),
  ).toBeDisabled();
  await summary.press('Escape');
  await expect(summary).toBeFocused();
  await expect(page.locator('details[open]')).toHaveCount(0);
  await page
    .locator('tbody tr')
    .first()
    .getByRole('link', { name: 'tkwill75' })
    .click();
  await expect(page).toHaveURL(/\/customers\/612c54$/);
});

test('Materials tabs, stock, payment and delivery filters persist and never submit backend actions', async ({
  page,
}) => {
  await page.goto(ROUTES.materials);
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by status').selectOption('Out of Stock');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('GP Water Tank');
  await page.getByRole('link', { name: 'Orders', exact: true }).click();
  await expect(page).toHaveURL(ROUTES.materialOrders);
  await expect(
    page.getByRole('link', { name: 'Orders', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by payment').selectOption('Pending');
  await page.getByLabel('Filter by status').selectOption('Returned');
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await expect(page.getByLabel('Filter by payment')).toHaveValue('Pending');
  await page
    .getByRole('textbox', { name: 'Search order samples' })
    .fill('Ceiling');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'View', exact: true }),
  ).toBeDisabled();
  await page
    .getByRole('link', { name: 'Product Catalog', exact: true })
    .click();
  await expect(page).toHaveURL(ROUTES.materials);
});

test('mobile navigation opens Jobs and Materials and restores focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(ROUTES.dashboard);
  const trigger = page.locator('#navigation-trigger');
  await trigger.click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Jobs', exact: true })
    .click();
  await expect(page).toHaveURL(ROUTES.jobs);
  await expect(
    page.getByRole('heading', { name: 'Jobs', exact: true }),
  ).toBeAttached();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await trigger.click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Materials', exact: true })
    .click();
  await expect(page).toHaveURL(ROUTES.materials);
  await expect(
    page.getByRole('heading', { name: 'Materials', exact: true }),
  ).toBeAttached();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('metric entrances do not restart on filtering and honor reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(ROUTES.jobs);
  const card = page.locator('.overview-card').first();
  await expect(card).toHaveCSS('animation-name', 'overview-enter');
  await page.waitForTimeout(550);
  await page.getByRole('textbox', { name: 'Search job count' }).fill('Roofing');
  expect(await card.evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('animation-name', 'none');
});
