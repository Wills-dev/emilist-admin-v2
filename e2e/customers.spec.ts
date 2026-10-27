import { expect, test } from '@playwright/test';

const profile = '/customers/demo-customer-001';
const screens = [
  ['/customers', null],
  [profile, 'User Details'],
  [`${profile}/services`, 'Services'],
  [`${profile}/jobs`, 'Jobs'],
  [`${profile}/listed-items`, 'Listed Items'],
  [`${profile}/orders`, 'Orders'],
  [`${profile}/sales`, 'Sales'],
  [`${profile}/transactions`, 'Transactions'],
  [`${profile}/subscriptions`, 'Subscriptions'],
] as const;
const viewports = [
  { width: 320, height: 850 },
  { width: 375, height: 850 },
  { width: 425, height: 850 },
  { width: 768, height: 1000 },
  { width: 1024, height: 1000 },
  { width: 1440, height: 1000 },
  { width: 768, height: 600 },
  { width: 1440, height: 700 },
];
for (const viewport of viewports) {
  test(`all customer screens fit ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [route, tab] of screens) {
      await page.goto(route);
      if (tab) {
        await expect(
          page.getByRole('heading', {
            name: 'Demo Customer One',
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page
            .getByRole('navigation', { name: 'Customer profile sections' })
            .getByRole('link', { name: tab, exact: true }),
        ).toHaveAttribute('aria-current', 'page');
      }
      if (tab === 'Services')
        await expect(
          page.getByRole('heading', { name: 'Demo Woodworks Studio' }),
        ).toBeVisible();
      else
        await expect(page.getByRole('table')).toHaveCount(
          tab === 'User Details' ? 0 : 1,
        );
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
        await main.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      for (const region of await page.getByRole('region').all()) {
        const box = await region.boundingBox();
        if (box)
          expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
      }
      if ([375, 1440].includes(viewport.width) && viewport.height >= 850) {
        await page.screenshot({
          path: testInfo.outputPath(
            `${tab?.toLowerCase().replaceAll(' ', '-') || 'customers'}-${viewport.width}.png`,
          ),
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}

test('customer search, filters, pagination, and empty results use URL state', async ({
  page,
}) => {
  await page.goto('/customers');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(
    page.getByRole('table').getByText('Sample Customer Ten'),
  ).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Search customer count' });
  await search.fill('Demo Customer One');
  await expect(
    page.getByRole('table').getByText('Demo Customer One', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
  await page.reload();
  await expect(search).toHaveValue('Demo Customer One');
  await search.fill('');
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by status').selectOption('Suspended');
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(2);
  await expect(page).toHaveURL(/status=Suspended/);
  await search.fill('nothing-matches');
  await expect(
    page.getByText('No records match your search or filters.'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Next', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: '+ Create new customer' }),
  ).toBeDisabled();
});

test('view links retain the real selected customer ID and do not reuse another profile data', async ({
  page,
}) => {
  await page.goto('/customers');
  await page
    .getByRole('link', { name: 'View Demo Customer Three', exact: true })
    .click();
  await expect(page).toHaveURL('/customers/demo-user-003');
  await expect(
    page.getByRole('heading', { name: 'Demo Customer Three', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Not provided', { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole('main', { name: 'Administration workspace' })
    .getByRole('link', { name: 'Jobs', exact: true })
    .click();
  await expect(page).toHaveURL('/customers/demo-user-003/jobs');
  await expect(
    page.getByText('No records match your search or filters.'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Suspend Account' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Credit Wallet' }),
  ).toBeDisabled();
  await page.goto('/customers/does-not-exist');
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
});

test('all profile tabs persist on refresh and use the shared header', async ({
  page,
}) => {
  await page.goto(profile);
  for (const [route, tab] of screens.slice(1)) {
    if (!tab) continue;
    await page
      .getByRole('navigation', { name: 'Customer profile sections' })
      .getByRole('link', { name: tab, exact: true })
      .click();
    await expect(page).toHaveURL(route);
    await page.reload();
    await expect(
      page
        .getByRole('navigation', { name: 'Customer profile sections' })
        .getByRole('link', { name: tab, exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      page.getByRole('region', { name: 'Customer profile', exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: 'Trigger Password Reset' }),
    ).toBeDisabled();
  }
});

test('customer action disclosure closes with Escape and returns keyboard focus', async ({
  page,
}) => {
  await page.goto('/customers');
  const summary = page.locator(
    'summary[aria-label="Actions for Demo Customer One"]',
  );
  await summary.click();
  await expect(
    page.getByRole('link', { name: 'View customer', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('link', { name: 'View customer', exact: true }),
  ).toBeHidden();
  await expect(summary).toBeFocused();
});

test('services and document galleries support category and keyboard navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${profile}/services`);
  await page.getByRole('button', { name: 'Bricklayer', exact: true }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Bricklayer service details unavailable',
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Carpenter', exact: true }).click();
  const service = page.getByRole('region', {
    name: 'Service images',
    exact: true,
  });
  await service.getByRole('button', { name: 'Next service images' }).click();
  await expect(service.getByRole('status')).toHaveText('2 of 7');
  const photo = service.getByRole('button', {
    name: 'Service images: Service photo 2, image unavailable',
  });
  await photo.focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    service.getByRole('button', {
      name: 'Service images: Service photo 3, image unavailable',
    }),
  ).toBeFocused();
  const documents = page.getByRole('region', {
    name: 'Supporting documents',
    exact: true,
  });
  await documents
    .getByRole('button', { name: 'Next supporting documents' })
    .click();
  await expect(documents.getByRole('status')).toHaveText('2 of 4');
  expect(
    await service
      .getByRole('button')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionProperty),
  ).toBe('none');
});

test('jobs pagination, filtering, and subscription plan browsing stay local', async ({
  page,
}) => {
  await page.goto(`${profile}/jobs`);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(
    page.getByRole('table').getByText('Sample Building Maintenance'),
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Search job count' }).fill('Roofing');
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
  await page.goto(`${profile}/subscriptions`);
  const plans = page.getByRole('region', { name: 'Subscription plans' });
  await page.getByRole('button', { name: 'Next subscription plans' }).click();
  await expect
    .poll(() => plans.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  await expect(
    page.getByRole('button', { name: 'April_Inv.pdf' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Print receipt unavailable' }).first(),
  ).toBeDisabled();
});

test('mobile drawer links to Customers and restores focus on dismissal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 600 });
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Customers', exact: true })
    .click();
  await expect(page).toHaveURL('/customers');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('link', { name: 'Customers', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Open navigation' }),
  ).toBeFocused();
});
