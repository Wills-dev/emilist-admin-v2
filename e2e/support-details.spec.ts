import { expect, test } from '@playwright/test';
import { SUPPORT_ROUTES, ROUTES } from '../src/constants/routes';
const id = 'demo-record-74-001';
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
  test(`support details and dialogs fit ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(SUPPORT_ROUTES.details(id));
    await page.reload();
    await expect(
      page.getByRole('heading', {
        name: 'Wallet top-up error — Ticket Details',
      }),
    ).toBeAttached();
    await expect(
      page.getByRole('list', { name: 'Conversation messages' }).locator('li'),
    ).toHaveCount(5);
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
        path: `/tmp/emilist-support-details-${width}.png`,
      });
    for (const label of ['Escalate/Re-assign Ticket', 'Resolve Ticket']) {
      const trigger = page.getByRole('button', { name: label, exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: label, exact: true });
      await expect(dialog).toBeVisible();
      const bounds = await dialog.boundingBox();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
      await expect(dialog.locator('button[type="submit"]')).toBeDisabled();
      if (width === 375 || (width === 1440 && height === 1100))
        await page.screenshot({
          path: `/tmp/emilist-support-${label === 'Resolve Ticket' ? 'resolve' : 'escalate'}-${width}.png`,
        });
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    }
    const send = page.getByRole('button', { name: 'Send reply' });
    await send.scrollIntoViewIfNeeded();
    await expect(send).toBeInViewport();
    await expect(send).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
test('ticket links, conversation filtering and attachment navigation stay local', async ({
  page,
}) => {
  await page.goto(ROUTES.support);
  await page.getByRole('link', { name: 'View', exact: true }).first().click();
  await expect(page).toHaveURL(SUPPORT_ROUTES.details(id));
  await page.getByRole('button', { name: 'Toggle status filter' }).click();
  await page.getByLabel('Filter by sender').selectOption('Staff');
  await expect(
    page.getByRole('list', { name: 'Conversation messages' }).locator('li'),
  ).toHaveCount(2);
  await page.reload();
  await expect(
    page.getByRole('list', { name: 'Conversation messages' }).locator('li'),
  ).toHaveCount(2);
  await page
    .getByRole('textbox', { name: 'Search ticket conversation' })
    .fill('no matching sample');
  await expect(
    page.getByRole('heading', { name: 'No messages match' }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Search ticket conversation' })
    .fill('');
  const attachments = page.getByRole('region', { name: 'Chat attachments' });
  await page.getByRole('button', { name: 'Next attachments' }).click();
  await expect(attachments.getByRole('img')).toHaveCount(2);
  await expect(
    page.getByRole('button', { name: 'Next attachments' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Previous attachments' }).click();
  await expect(attachments.getByRole('img')).toHaveCount(4);
  await page.getByRole('link', { name: 'Back to Support' }).click();
  await expect(page).toHaveURL(ROUTES.support);
});
test('valid drafts never send messages or change the ticket', async ({
  page,
  request,
}) => {
  await page.goto(SUPPORT_ROUTES.details(id));
  const writes: string[] = [];
  page.on('request', (req) => {
    if (!['GET', 'HEAD'].includes(req.method())) writes.push(req.url());
  });
  await page
    .getByRole('textbox', { name: 'Reply draft' })
    .fill('A synthetic reply draft');
  await expect(page.getByRole('button', { name: 'Send reply' })).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Attach file' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('list', { name: 'Conversation messages' }).locator('li'),
  ).toHaveCount(5);
  await page
    .getByRole('button', { name: 'Resolve Ticket', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Resolution details' }).fill(' ');
  await expect(dialog.getByRole('alert')).toHaveText(
    'Describe how the issue was resolved.',
  );
  await dialog.getByRole('textbox').fill('Sample issue explanation');
  await expect(
    dialog.getByRole('button', { name: 'Resolve Ticket', exact: true }),
  ).toBeDisabled();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.reload();
  await expect(
    page.getByText('Pending Resolution', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Reply draft' })).toHaveValue(
    '',
  );
  expect(writes).toEqual([]);
  expect(
    (
      await request.post(SUPPORT_ROUTES.details(id), {
        data: { status: 'Resolved' },
      })
    ).status(),
  ).toBe(403);
  await page.goto(SUPPORT_ROUTES.details('demo-record-74-002'));
  await expect(
    page.getByRole('button', { name: 'Resolve Ticket', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole('textbox', { name: 'Reply draft' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('heading', { name: 'No messages match' }),
  ).toBeVisible();
  await page.goto(SUPPORT_ROUTES.details('missing'));
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
});
