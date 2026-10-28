import { expect, test } from '@playwright/test';
import { ROUTES } from '../src/constants/routes';
test.setTimeout(60_000);
const screens = [
  {
    path: ROUTES.payments,
    key: 'payments',
    heading: 'Payments',
    table: 'Payments',
  },
  {
    path: ROUTES.support,
    key: 'support',
    heading: 'Support',
    table: 'Support tickets',
  },
  { path: ROUTES.reports, key: 'reports', heading: 'REPORTS', table: null },
  { path: ROUTES.settings, key: 'platform', heading: 'Settings', table: null },
  {
    path: ROUTES.settingsPermissions,
    key: 'permissions',
    heading: 'Settings',
    table: 'Admin roles',
  },
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
  test(`operations screens fit ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const screen of screens) {
      await page.goto(screen.path);
      await expect(
        page
          .getByRole('heading', { name: screen.heading, exact: true })
          .first(),
      ).toBeAttached();
      if (screen.key === 'reports')
        await expect(page.locator('[data-slot="chart"]')).toHaveCount(4);
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
      if (screen.table) {
        const table = page.getByRole('region', {
          name: `${screen.table} table scroll area`,
        });
        await table.focus();
        await expect(table).toBeFocused();
        if (viewport.width < 768)
          expect(
            await table.evaluate((el) => el.scrollWidth > el.clientWidth),
          ).toBe(true);
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await expect(page.locator('tbody')).toContainText('Sample');
        await page
          .getByRole('button', { name: 'Previous', exact: true })
          .click();
      }
      if (screen.key === 'platform') {
        const carousel = page.getByRole('region', {
          name: 'Subscription plans',
        });
        await carousel.focus();
        await expect(carousel).toBeFocused();
      }
      if (viewport.width >= 1024) {
        const label =
          screen.key === 'platform' || screen.key === 'permissions'
            ? 'Settings'
            : screen.key === 'reports'
              ? 'Reports'
              : screen.heading;
        await expect(
          page
            .getByRole('navigation', {
              name:
                label === 'Settings' || label === 'Reports'
                  ? 'Workspace tools'
                  : 'Main navigation',
            })
            .getByRole('link', { name: label, exact: true }),
        ).toHaveAttribute('aria-current', 'page');
      }
      if ([375, 1440].includes(viewport.width) && viewport.height !== 700) {
        await main.evaluate((el) => {
          el.scrollTop = 0;
        });
        await page.evaluate(() => {
          const active = document.activeElement;
          if (active instanceof HTMLElement) active.blur();
        });
        await page.screenshot({
          path: `/tmp/emilist-operations-${screen.key}-${viewport.width}.png`,
        });
        if (viewport.width === 375) {
          await main.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
          await page.screenshot({
            path: `/tmp/emilist-operations-${screen.key}-375-content.png`,
          });
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('payment search, status, pagination and financial action disclosures remain local', async ({
  page,
}) => {
  await page.goto(ROUTES.payments);
  const search = page.getByRole('textbox', {
    name: 'Search transaction count',
  });
  await search.fill('Wallet Top-Up');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.reload();
  await expect(search).toHaveValue('Wallet Top-Up');
  await search.fill('');
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by status').selectOption('Failed');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Demo Customer Five');
  const disclosure = page.getByLabel(
    'Actions for transaction demo-record-64-005',
  );
  await disclosure.click();
  await expect(
    page.getByRole('button', { name: 'Refund — unavailable' }),
  ).toBeDisabled();
  await disclosure.press('Escape');
  await expect(disclosure).toBeFocused();
  await search.fill('does-not-exist');
  await expect(page.locator('tbody')).toContainText('No records match');
});

test('support combined priority/status filters persist and elapsed time never counts down', async ({
  page,
}) => {
  await page.goto(ROUTES.support);
  const time = page.getByLabel('01:25:00, static elapsed-time sample').first();
  const text = await time.textContent();
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by priority').selectOption('Critical');
  await page.getByLabel('Filter by status').selectOption('Resolved');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Demo Customer Six');
  await page.reload();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  expect(
    await page
      .getByLabel('01:25:00, static elapsed-time sample')
      .first()
      .textContent(),
  ).toBe(text);
  await page.getByLabel('Actions for ticket demo-record-74-006').click();
  for (const name of [
    'Assign ticket',
    'Resolve ticket',
    'Escalate',
    'Send message',
  ])
    await expect(
      page.getByRole('button', { name: `${name} — unavailable` }),
    ).toBeDisabled();
});

test('Reports maintains an independent period without recalculating or restarting charts', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTES.reports);
  await expect(page.locator('[data-slot="chart"]')).toHaveCount(4);
  await expect(page.getByText('65,162', { exact: true })).toBeVisible();
  await page.getByLabel('Report date range').selectOption('7');
  await expect(page).toHaveURL(/range=7/);
  await expect(page.getByText('Oct 25 – Oct 31, 2026')).toBeVisible();
  await expect(page.getByText('₦4,860,000', { exact: true })).toBeVisible();
  expect(
    await page
      .locator('.overview-card')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page.reload();
  await expect(page.getByLabel('Report date range')).toHaveValue('7');
  await page.getByRole('textbox', { name: 'Search customers' }).fill('test');
  await expect(page.getByRole('status')).toContainText(
    'requires a connected service',
  );
});

test('configuration drafts cancel, spotlight selections are exclusive, and publication stays unavailable', async ({
  page,
}) => {
  await page.goto(ROUTES.settings);
  const commission = page.getByRole('spinbutton', {
    name: 'Platform Commission (%)',
  });
  await expect(commission).toHaveAttribute('readonly', '');
  await page.getByRole('button', { name: 'Edit platform settings' }).click();
  await commission.fill('101');
  await expect(page.locator('#platform-commission-error')).toContainText(
    'commission',
  );
  await expect(
    page.getByRole('button', { name: 'Save changes — unavailable' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel edits' }).click();
  await expect(commission).toHaveValue('5');
  await page
    .getByLabel('Select Demo Candidate Alpha demo-expert-002', { exact: true })
    .check();
  await expect(
    page.locator('input[name="spotlight-expert"]:checked'),
  ).toHaveCount(1);
  await expect(
    page.getByLabel('Select Demo Customer One demo-expert-001'),
  ).not.toBeChecked();
  await expect(
    page.locator('input[name="spotlight-merchant"]:checked'),
  ).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Publish', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Edit subscription settings' }),
  ).toBeDisabled();
  await page
    .getByRole('textbox', { name: 'Search spotlight candidates' })
    .fill('Beta');
  await expect(
    page.getByText('No candidates match your filters.'),
  ).toBeVisible();
  await expect(
    page.getByLabel('Select Demo Candidate Beta demo-merchant-002'),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Search spotlight candidates' })
    .fill('');
  await page.getByRole('button', { name: 'Toggle spotlight filters' }).click();
  await page.getByLabel('Spotlight category').selectOption('merchant');
  await expect(page.locator('input[name="spotlight-expert"]')).toHaveCount(0);
  const carousel = page.getByRole('region', { name: 'Subscription plans' });
  await page.getByRole('button', { name: 'Next subscription plans' }).click();
  await page
    .getByRole('link', { name: 'User Permissions', exact: true })
    .click();
  await expect(page).toHaveURL(ROUTES.settingsPermissions);
  await page.reload();
  await expect(
    page.getByRole('link', { name: 'User Permissions', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page
    .getByRole('textbox', { name: 'Search admin roles' })
    .fill('Finance');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: '+ Invite new admin' }),
  ).toBeDisabled();
  await page.getByLabel('Actions for Finance role').click();
  await expect(
    page.getByRole('button', { name: 'Edit permissions — unavailable' }),
  ).toBeDisabled();
  await page.getByLabel('Actions for Finance role').press('Escape');
  await expect(carousel).toHaveCount(0);
});

test('mobile drawer reaches operations screens and restores keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(ROUTES.dashboard);
  const trigger = page.locator('#navigation-trigger');
  for (const label of ['Payments', 'Support', 'Reports', 'Settings']) {
    await trigger.click();
    await page
      .getByRole('dialog')
      .getByRole('link', { name: label, exact: true })
      .click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
