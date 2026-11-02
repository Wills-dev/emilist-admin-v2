import { expect, test } from '@playwright/test';
import { ROUTES, CUSTOMER_ROUTES } from '../src/constants/routes';
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
  test(`reports, profile and admin dialogs fit ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const path of [
      ROUTES.reports,
      ROUTES.profile,
      ROUTES.changePassword,
    ]) {
      await page.goto(path);
      await page.reload();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBe(height);
      if (path === ROUTES.reports) {
        await expect(page.locator('[data-slot="chart"]')).toHaveCount(6);
        await expect(
          page.locator('.recharts-pie-sector').first(),
        ).toBeVisible();
      }
      if (width === 375 || (width === 1440 && height === 1100))
        await page.screenshot({
          path: `/tmp/emilist-admin-${path.replaceAll('/', '-')}-${width}.png`,
        });
    }
    const cases = [
      {
        path: ROUTES.reports,
        trigger: 'Export reports',
        title: 'Export Reports',
      },
      {
        path: ROUTES.profile,
        trigger: '+ Invite new admin',
        title: 'Invite New Admin',
      },
      {
        path: ROUTES.settings,
        trigger: 'Edit subscription settings',
        title: 'Change Subscription Amount',
      },
      {
        path: CUSTOMER_ROUTES.details('demo-customer-001'),
        trigger: 'Suspend Account',
        title: 'Suspend Account',
      },
    ];
    for (const item of cases) {
      await page.goto(item.path);
      const trigger = page.getByRole('button', {
        name: item.trigger,
        exact: true,
      });
      await trigger.click();
      const dialog = page.getByRole('dialog', {
        name: item.title,
        exact: true,
      });
      await expect(dialog).toBeVisible();
      const box = await dialog.boundingBox();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(height);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width === 375 || (width === 1440 && height === 1100))
        await page.screenshot({
          path: `/tmp/emilist-admin-dialog-${item.title.replaceAll(' ', '-')}-${width}.png`,
        });
      await expect(dialog.getByRole('button').last()).toBeDisabled();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}
test('both profile entry points and account dropdown navigation work with keyboard', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(ROUTES.dashboard);
  await page.getByRole('link', { name: 'View profile', exact: true }).click();
  await expect(page).toHaveURL(ROUTES.profile);
  await expect(
    page.getByRole('heading', { name: 'Demo Operator', exact: true }),
  ).toBeVisible();
  await page.getByLabel('Open profile menu').click();
  await expect(page.getByRole('menu', { name: 'Account menu' })).toBeVisible();
  await page.screenshot({ path: '/tmp/emilist-admin-profile-menu-1440.png' });
  await page
    .getByRole('menuitem', { name: 'Change Password', exact: true })
    .click();
  await expect(page).toHaveURL(ROUTES.changePassword);
  await page.getByLabel('Open profile menu').click();
  await page.getByRole('menuitem', { name: 'Profile', exact: true }).click();
  await expect(page).toHaveURL(ROUTES.profile);
  await page.getByLabel('Open profile menu').focus();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Profile', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Change Password', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Open profile menu')).toBeFocused();
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('dialog', { name: 'Workspace navigation' })
    .getByRole('link', { name: 'View profile', exact: true })
    .click();
  await expect(page).toHaveURL(ROUTES.profile);
  await page.getByLabel('Open profile menu').click();
  await page.screenshot({ path: '/tmp/emilist-admin-profile-menu-375.png' });
  await page.keyboard.press('Escape');
});
test('sign-out confirms demo navigation and restores menu or drawer focus on cancellation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(ROUTES.dashboard);
  await page.getByLabel('Open profile menu').click();
  await page.getByRole('menuitem', { name: 'Sign out', exact: true }).click();
  let dialog = page.getByRole('dialog', { name: 'Sign Out', exact: true });
  await expect(dialog).toBeVisible();
  await page.screenshot({ path: '/tmp/emilist-admin-signout-1440.png' });
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('menuitem', { name: 'Sign out', exact: true }),
  ).toBeFocused();
  await page.getByRole('menuitem', { name: 'Sign out', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Sign Out', exact: true });
  await dialog.getByRole('button', { name: 'Sign Out', exact: true }).click();
  await expect(page).toHaveURL(ROUTES.login);
  await page.goto(ROUTES.dashboard);
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('button', { name: 'Leave preview and return to sign in' })
    .click();
  await page.screenshot({ path: '/tmp/emilist-admin-signout-375.png' });
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('dialog', { name: 'Workspace navigation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Leave preview and return to sign in' }),
  ).toBeFocused();
});
test('export uses the shared nested calendar and drafts cannot download, invite, bill or suspend', async ({
  page,
  request,
}) => {
  const writes: string[] = [];
  page.on('request', (req) => {
    if (!['GET', 'HEAD'].includes(req.method())) writes.push(req.url());
  });
  await page.goto(ROUTES.reports);
  await page.getByRole('button', { name: 'Export reports' }).click();
  await page.getByRole('button', { name: 'Choose export start date' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Choose export start date' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  const exportDialog = page.getByRole('dialog', {
    name: 'Export Reports',
    exact: true,
  });
  await expect(exportDialog).toBeVisible();
  await expect(
    exportDialog.getByRole('button', { name: 'Download Report' }),
  ).toBeDisabled();
  await exportDialog.getByRole('radio', { name: 'CSV', exact: true }).check();
  await exportDialog.getByRole('button', { name: 'Cancel' }).click();
  await page.goto(ROUTES.settingsPermissions);
  await page.getByRole('button', { name: '+ Invite new admin' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('bad');
  await expect(page.getByRole('alert')).toHaveText(
    'Enter a valid email address.',
  );
  await expect(
    page.getByRole('button', { name: 'Invite Admin', exact: true }),
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await page.goto(ROUTES.settings);
  await page
    .getByRole('button', { name: 'Edit subscription settings' })
    .click();
  await page.getByRole('spinbutton', { name: /silver Plan/i }).fill('-1');
  await expect(page.getByRole('alert')).toHaveText(
    'Amounts cannot be negative.',
  );
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Save Changes' }),
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(
    page.getByText('₦24,000', { exact: true }).first(),
  ).toBeVisible();
  await page.goto(CUSTOMER_ROUTES.details('demo-customer-001'));
  await page.getByRole('button', { name: 'Suspend Account' }).click();
  await page.getByRole('radio', { name: 'Permanent', exact: true }).check();
  await page
    .getByRole('combobox', { name: 'Select Reason' })
    .selectOption('Policy review');
  await expect(
    page.getByRole('button', { name: 'Suspend User' }),
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible();
  expect(writes).toEqual([]);
  expect(
    (
      await request.post(ROUTES.settingsPermissions, { data: { invite: true } })
    ).status(),
  ).toBe(403);
});
test('password drafts validate and activity ranges filter synthetic records only', async ({
  page,
}) => {
  await page.goto(ROUTES.changePassword);
  await page
    .getByLabel('Current password', { exact: true })
    .fill('OldPassword123!');
  await page
    .getByLabel('New password', { exact: true })
    .fill('NewPassword123!');
  await page
    .getByLabel('Confirm new password', { exact: true })
    .fill('different');
  await expect(page.getByText('Passwords do not match.')).toBeVisible();
  await page
    .getByRole('button', { name: 'Show new password', exact: true })
    .click();
  await expect(
    page.getByLabel('New password', { exact: true }),
  ).toHaveAttribute('type', 'text');
  await expect(
    page.getByRole('button', { name: 'Update Password' }),
  ).toBeDisabled();
  await page.goto(ROUTES.profile);
  await page.getByRole('button', { name: 'Select activity dates' }).click();
  await page
    .getByRole('combobox', { name: 'Calendar year' })
    .selectOption('2036');
  await page.getByRole('button', { name: '18 October 2036' }).click();
  await page.getByRole('button', { name: '26 October 2036' }).click();
  await page.getByRole('button', { name: 'Apply dates' }).click();
  await expect(
    page.getByRole('heading', { name: 'No sample activity' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'No sample activity' }),
  ).toBeVisible();
});
