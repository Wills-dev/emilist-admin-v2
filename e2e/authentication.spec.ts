import { expect, test } from '@playwright/test';

const routes = [
  ['/login', 'Sign In'],
  ['/login/verify', 'Two-Factor Verification'],
  ['/accept-invite', 'Admin Account Setup'],
  ['/accept-invite/password', 'Create New Password'],
  ['/accept-invite/authenticator', 'Secure Account'],
  ['/forgot-password', 'Reset Password'],
  ['/forgot-password/sent', 'Reset Link Status'],
  ['/reset-password/verify', 'Two-Factor Verification'],
  ['/reset-password', 'Create New Password'],
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
for (const { width, height } of viewports) {
  test(`authentication screens remain usable at ${width}x${height}`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height });
    for (const [route, title] of routes) {
      await page.goto(route);
      await expect(
        page.getByRole('heading', { name: title, exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      if (width < 768)
        await expect(page.getByTestId('auth-illustration')).toBeHidden();
      else await expect(page.getByTestId('auth-illustration')).toBeVisible();
      const shell = page.getByTestId('auth-shell');
      const panel = page.getByRole('main', { name: 'Authentication form' });
      const header = page.getByRole('banner');
      expect((await shell.boundingBox())?.height).toBe(height);
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBe(height);
      const headerBefore = await header.boundingBox();
      const illustrationBefore = await page
        .getByTestId('auth-illustration')
        .boundingBox();
      const panelBox = await panel.boundingBox();
      expect(panelBox?.y).toBe(headerBefore?.height);
      expect(Math.round((panelBox?.height || 0) + (panelBox?.y || 0))).toBe(
        height,
      );
      expect(
        await panel.evaluate((element) => getComputedStyle(element).overflowY),
      ).toBe('auto');
      expect(
        await panel.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      await panel.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
      const finalButton = panel.locator('button[type="submit"]').last();
      if (await finalButton.count()) {
        const buttonBox = await finalButton.boundingBox();
        expect(buttonBox?.y).toBeGreaterThanOrEqual(panelBox?.y || 0);
        expect(
          (buttonBox?.y || 0) + (buttonBox?.height || 0),
        ).toBeLessThanOrEqual(height);
      }
      expect(await header.boundingBox()).toEqual(headerBefore);
      expect(await page.getByTestId('auth-illustration').boundingBox()).toEqual(
        illustrationBefore,
      );
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      // Wheel events outside the panel must not scroll the document or artwork.
      await page.mouse.move(10, 10);
      await page.mouse.wheel(0, 800);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await panel.evaluate((element) => {
        element.scrollTop = 0;
      });
      for (const button of await page.locator('button[type="submit"]').all()) {
        if (route === '/login') await expect(button).toBeEnabled();
        else await expect(button).toBeDisabled();
      }
      if (testInfo.project.name === 'chromium' && [375, 1440].includes(width)) {
        await page.screenshot({
          path: testInfo.outputPath(
            `${route.slice(1).replaceAll('/', '-')}-${width}.png`,
          ),
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}

test('sign-in navigation and local validation never authenticate', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('Enter Work Email').fill('invalid');
  await page.getByLabel('Enter Work Email').blur();
  await expect(
    page.getByText('Enter a valid work email address.'),
  ).toBeVisible();
  await page.getByLabel('Enter Work Email').fill('admin@example.com');
  await page
    .getByLabel('Enter Password', { exact: true })
    .fill('LocalPassword1!');
  await page.getByRole('button', { name: 'Show enter password' }).click();
  await expect(
    page.getByLabel('Enter Password', { exact: true }),
  ).toHaveAttribute('type', 'text');
  await page.getByRole('checkbox').check();
  await page.getByLabel('Enter Password', { exact: true }).press('Enter');
  await expect(page).toHaveURL('/dashboard');
  await page.goto('/login');
  await expect(
    page.getByRole('button', { name: 'Sign In', exact: true }),
  ).toBeEnabled();
  await page.getByRole('link', { name: 'Forgot Password?' }).click();
  await expect(page).toHaveURL('/forgot-password');
  await page.getByRole('link', { name: 'Back to Sign In' }).click();
  await page.getByRole('link', { name: 'Accept invite' }).click();
  await expect(page).toHaveURL('/accept-invite');
  await page.getByRole('link', { name: /Password/ }).click();
  await expect(page).toHaveURL('/accept-invite/password');
});

test('password requirements and OTP interactions stay local', async ({
  page,
}, testInfo) => {
  const width = testInfo.project.name === 'chromium' ? 1440 : 375;
  await page.setViewportSize({ width, height: width === 1440 ? 1000 : 850 });
  await page.goto('/accept-invite/password');
  await page
    .getByLabel('Create Password', { exact: true })
    .fill('LongPassword12!');
  await page.getByLabel('Confirm Password', { exact: true }).fill('wrong');
  await expect(page.getByText('Passwords do not match.')).toBeVisible();
  await page
    .getByLabel('Confirm Password', { exact: true })
    .fill('LongPassword12!');
  await expect(
    page.getByRole('button', { name: 'Create Password', exact: true }),
  ).toBeDisabled();
  await page.screenshot({
    path: testInfo.outputPath(`new-password-valid-${width}.png`),
    fullPage: true,
  });
  await page.goto('/login/verify');
  await page.getByLabel('Verification digit 1', { exact: true }).fill('123456');
  await expect(
    page.getByLabel('Verification digit 6', { exact: true }),
  ).toHaveValue('6');
  await expect(
    page.getByLabel('Verification digit 6', { exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('button', { name: 'Complete Sign In' }),
  ).toBeDisabled();
  await page.screenshot({
    path: testInfo.outputPath(`verification-filled-${width}.png`),
    fullPage: true,
  });
  await page
    .getByLabel('Verification digit 6', { exact: true })
    .press('Backspace');
  await expect(
    page.getByLabel('Verification digit 6', { exact: true }),
  ).toHaveValue('');
  await page
    .getByLabel('Verification digit 6', { exact: true })
    .press('Backspace');
  await expect(
    page.getByLabel('Verification digit 5', { exact: true }),
  ).toBeFocused();
});

for (const width of [375, 768, 1440]) {
  test(`short authentication panel scrolls with visible keyboard focus at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 700 : 600 });
    await page.goto('/accept-invite/authenticator');
    const panel = page.getByRole('main', { name: 'Authentication form' });
    const headerBefore = await page.getByRole('banner').boundingBox();
    const imageBefore = await page
      .getByTestId('auth-illustration')
      .boundingBox();
    expect(
      await panel.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    const lastLink = page.getByRole('link', { name: 'Back to Sign In' });
    for (let index = 0; index < 20; index++) {
      await page.keyboard.press('Tab');
      if (
        await lastLink.evaluate((element) => element === document.activeElement)
      )
        break;
    }
    await expect(lastLink).toBeFocused();
    const box = await lastLink.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(panelBox?.y || 0);
    expect((box?.y || 0) + (box?.height || 0)).toBeLessThanOrEqual(
      width === 1440 ? 700 : 600,
    );
    expect(
      await panel.evaluate((element) => element.scrollTop),
    ).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.getByRole('banner').boundingBox()).toEqual(headerBefore);
    expect(await page.getByTestId('auth-illustration').boundingBox()).toEqual(
      imageBefore,
    );
  });
}
