import { expect, test } from '@playwright/test';
import { JOB_ROUTES, ROUTES } from '../src/constants/routes';
const id = 'demo-record-50-001';
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
  test(`job sections fit ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const tab of [
      'details',
      'applicants',
      'invoices',
      'payments',
    ] as const) {
      await page.goto(JOB_ROUTES.tab(id, tab));
      await expect(
        page.getByRole('navigation', { name: 'Job sections' }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBe(height);
      await page.reload();
      await expect(
        page
          .getByRole('navigation', { name: 'Job sections' })
          .locator('[aria-current="page"]'),
      ).toHaveCount(1);
      if (width === 375 || (width === 1440 && height === 1100))
        await page.screenshot({ path: `/tmp/emilist-job-${tab}-${width}.png` });
    }
    expect(errors).toEqual([]);
  });
}
test('status dialogs remain read-only and restore keyboard focus', async ({
  page,
}) => {
  for (const [jobId, action, title] of [
    [id, 'Pause Job', 'Pause Job'],
    [id, 'Cancel Job', 'Cancel Job'],
    ['sample-job-10', 'Remove Listing', 'Remove Job Listing'],
    ['demo-record-50-002', 'Approve Listing', 'Approve Job Listing'],
    ['demo-record-50-007', 'Resume Job', 'Resume Job'],
    [
      'demo-record-50-009',
      'Convert to Recurring Job',
      'Convert to Recurring Job',
    ],
  ] as const) {
    await page.goto(JOB_ROUTES.details(jobId));
    const trigger = page.getByRole('button', { name: action, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: title, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('button[type="submit"]')).toBeDisabled();
    await page.screenshot({
      path: `/tmp/emilist-job-dialog-${action.replaceAll(' ', '-')}.png`,
    });
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});
test('financial filters and applicant selection preserve route state', async ({
  page,
}) => {
  await page.goto(JOB_ROUTES.tab(id, 'payments'));
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by status').selectOption('Paid');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: /Print payment/ }),
  ).toBeDisabled();
  await page.goto(JOB_ROUTES.tab(id, 'invoices'));
  await expect(
    page.getByRole('button', { name: 'Download Invoice' }),
  ).toHaveCount(4);
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by status').selectOption('Paid');
  await expect(
    page.getByRole('button', { name: 'Download Invoice' }),
  ).toHaveCount(1);
  await page.goto(JOB_ROUTES.tab(id, 'applicants'));
  await page
    .getByRole('button', { name: 'View profile: Demo Cedar Workshop' })
    .click();
  await expect(page).toHaveURL(/applicant=demo-applicant-002/);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'View profile: Demo Cedar Workshop' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('listing links, milestone navigation, and draft validation stay local', async ({
  page,
}) => {
  await page.goto(ROUTES.jobs);
  await page.getByRole('link', { name: 'View', exact: true }).first().click();
  await expect(page).toHaveURL(JOB_ROUTES.details(id));
  await page.getByRole('button', { name: 'Next job image' }).click();
  await expect(
    page.getByRole('img', { name: 'Cabinet repairs — image not supplied' }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Job sections' })
    .getByRole('link', { name: 'Invoices', exact: true })
    .click();
  await page.getByRole('link', { name: 'Milestone 1', exact: true }).click();
  await expect(page).toHaveURL(/milestone=demo-milestone-001/);
  await page.goto(JOB_ROUTES.details('sample-job-10'));
  await page.getByRole('button', { name: 'Remove Listing' }).click();
  await page.getByRole('textbox', { name: 'Reason', exact: true }).fill('  ');
  await expect(page.getByRole('alert')).toHaveText('Enter a reason.');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Cancel', exact: true })
    .click();
  await page.goto(JOB_ROUTES.details('demo-record-50-009'));
  await page.getByRole('button', { name: 'Convert to Recurring Job' }).click();
  await page.getByLabel('Start date', { exact: true }).fill('2026-11-02');
  await page.getByLabel('End date', { exact: true }).fill('2026-10-01');
  await page.getByLabel('Recurring amount', { exact: true }).fill('0');
  await expect(
    page.getByText('End date must be on or after the start date.'),
  ).toBeVisible();
  await expect(
    page.getByText('Enter a positive recurring budget.'),
  ).toBeVisible();
  await expect(
    page
      .getByRole('dialog')
      .getByRole('button', { name: 'Confirm', exact: true }),
  ).toBeDisabled();
});
