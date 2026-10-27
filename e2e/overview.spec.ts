import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 850 },
  { width: 375, height: 850 },
  { width: 425, height: 850 },
  { width: 768, height: 1000 },
  { width: 1024, height: 1000 },
  { width: 1440, height: 1000 },
  { width: 1138, height: 830 },
  { width: 768, height: 600 },
  { width: 1440, height: 700 },
];
for (const viewport of viewports) {
  test(`overview preview fits ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/dashboard');
    await expect(
      page.getByRole('heading', { name: 'Welcome, Admin' }),
    ).toBeVisible();
    await expect(page.locator('[data-slot="chart"]')).toHaveCount(4);
    await expect(page.locator('.recharts-pie-sector')).not.toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBe(viewport.height);
    const main = page.getByRole('main', { name: 'Overview dashboard' });
    expect(
      await main.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);

    await page.getByRole('textbox', { name: 'Search customers' }).fill('test');
    await expect(page.getByRole('status')).toContainText(
      'requires a connected service',
    );
    await page.getByRole('textbox', { name: 'Search customers' }).fill('');
    await page.getByRole('textbox', { name: 'Search customers' }).blur();
    const paths = await page
      .locator('.recharts-pie-sector path')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('d')),
      );
    await page.getByLabel('Date range').selectOption('7');
    expect(
      await page
        .locator('.recharts-pie-sector path')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('d')),
        ),
    ).toEqual(paths);
    await page.getByLabel('Date range').selectOption('30');
    await expect(
      page.getByRole('button', { name: 'Release Funds' }),
    ).toBeDisabled();
    if (viewport.width >= 1120) {
      expect(
        await page
          .getByRole('region', { name: 'Pending KYC', exact: true })
          .evaluate(
            (element) =>
              getComputedStyle(
                element.parentElement!,
              ).gridTemplateColumns.split(' ').length,
          ),
      ).toBe(5);
    }
    if (viewport.width < 1024) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const dialog = page.getByRole('dialog');
      await expect(
        dialog.getByRole('link', { name: 'Overview', exact: true }),
      ).toHaveAttribute('aria-current', 'page');
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(
        page.getByRole('button', { name: 'Open navigation' }),
      ).toBeFocused();
    }
    await main.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect(
      page.getByRole('heading', { name: 'Trade Summary' }),
    ).toBeVisible();
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await main.evaluate((element) => {
      element.scrollTop = 0;
    });
    if ([375, 1138, 1440].includes(viewport.width) && viewport.height >= 830)
      await page.screenshot({
        path: testInfo.outputPath(`overview-${viewport.width}.png`),
        fullPage: true,
      });
    expect(errors).toEqual([]);
  });
}

test('sign-in button opens the preview without credentials or a session', async ({
  page,
  context,
}) => {
  await page.goto('/login');
  const signIn = page.getByRole('button', { name: 'Sign In', exact: true });
  await expect(signIn).toBeEnabled();
  await signIn.click();
  await expect(page).toHaveURL('/dashboard');
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await expect(page.getByRole('note')).toContainText(
    'Static presentation data',
  );
});

test('motion is restrained, does not restart on date selection, and respects reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/dashboard');
  const card = page.getByRole('region', { name: 'Pending KYC', exact: true });
  await expect(card).toBeVisible();
  expect(
    await card.evaluate(
      (element) => getComputedStyle(element).animationDuration,
    ),
  ).toBe('0.28s');
  expect(
    await card.evaluate((element) => getComputedStyle(element).animationDelay),
  ).toBe('0.05s');
  await card.evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations()
        .map((animation) => animation.finished.catch(() => undefined)),
    );
    element.setAttribute('data-restarts', '0');
    element.addEventListener('animationstart', () =>
      element.setAttribute('data-restarts', '1'),
    );
  });
  await page.getByLabel('Date range').selectOption('7');
  await expect(card).toHaveAttribute('data-restarts', '0');
  await expect(page.locator('[data-slot="chart"]')).toHaveCount(4);
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  expect(
    await page
      .getByRole('dialog')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('drawer-in');
  expect(
    await page
      .locator('.drawer-backdrop')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('backdrop-in');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await card.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  expect(
    await page
      .getByRole('dialog')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
