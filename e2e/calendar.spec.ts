import { expect, test } from '@playwright/test';
import { ROUTES, JOB_ROUTES } from '../src/constants/routes';
for (const [width, height] of [
  [320, 850],
  [375, 850],
  [425, 850],
  [768, 600],
  [1024, 1000],
  [1440, 700],
] as const) {
  test(`shared calendar fits ${width}x${height} and internal tickets is absent`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTES.reports);
    if (width < 1024) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(
        page.getByText('Internal Tickets', { exact: true }),
      ).toHaveCount(0);
      await page.keyboard.press('Escape');
    } else
      await expect(
        page.getByText('Internal Tickets', { exact: true }),
      ).toHaveCount(0);
    const trigger = page.getByRole('button', { name: 'Select report dates' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Select date range' });
    await expect(dialog).toBeVisible();
    await page
      .getByRole('combobox', { name: 'Calendar year' })
      .selectOption('2036');
    await page.getByRole('button', { name: '18 October 2036' }).click();
    await page.getByRole('button', { name: '26 October 2036' }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 375 || width === 1440)
      await page.screenshot({ path: `/tmp/emilist-calendar-${width}.png` });
    await page.getByRole('button', { name: 'Apply dates' }).click();
    await expect(trigger).toBeFocused();
    await expect(page).toHaveURL(/from=2036-10-18/);
    await page.reload();
    await expect(page.getByLabel('Report date range')).toHaveValue('custom');
    await expect(
      page.getByRole('button', { name: 'Select report dates' }),
    ).toContainText('18 October 2036');
    await page.getByLabel('Report date range').selectOption('7');
    await expect(page).toHaveURL(/range=7$/);
  });
}
test('recurring schedules use the same calendar inside dialogs without dismissing the form', async ({
  page,
}) => {
  await page.goto(JOB_ROUTES.details('demo-record-50-009'));
  await page.getByRole('button', { name: 'Convert to Recurring Job' }).click();
  await page.getByRole('button', { name: 'Choose start date' }).click();
  const calendar = page.getByRole('dialog', { name: 'Choose start date' });
  await expect(calendar).toBeVisible();
  await calendar
    .getByRole('combobox', { name: 'Calendar month' })
    .selectOption('9');
  await calendar
    .getByRole('combobox', { name: 'Calendar year' })
    .selectOption('2036');
  await calendar.getByRole('button', { name: '18 October 2036' }).click();
  await expect(page.getByLabel('Start date', { exact: true })).toHaveValue(
    '2036-10-18',
  );
  await expect(
    page.getByRole('dialog', { name: 'Convert to Recurring Job' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Choose end date' }).click();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('dialog', { name: 'Convert to Recurring Job' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Choose end date' }),
  ).toBeFocused();
});
