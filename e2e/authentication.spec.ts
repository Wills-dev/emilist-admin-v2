import { expect, test } from '@playwright/test';
import {
  ADMIN_LOGIN_ENROLLMENT_FIXTURE,
  ADMIN_LOGIN_CHALLENGE_FIXTURE,
  ADMIN_MFA_RESPONSE_FIXTURE,
} from '../src/features/auth/test/adminLoginResponseFixture';

// Never let browser fixtures reach the live authentication backend.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/admin-auth/**', (route) =>
    route.request().url().endsWith('/logout') ||
    route.request().url().endsWith('/invitation')
      ? route.continue()
      : route.abort(),
  );
  await page.route('**/api/admin-auth/current-user', (route) =>
    route.fulfill({ json: ADMIN_MFA_RESPONSE_FIXTURE }),
  );
});

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

test('sign-in submits credentials and reports rejected authentication', async ({
  page,
}) => {
  let payload: unknown;
  await page.route('**/api/admin-auth/login', async (route) => {
    const headers = { 'Access-Control-Allow-Origin': '*' };
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          ...headers,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'content-type',
        },
      });
      return;
    }
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 401, json: {}, headers });
  });
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
  await expect(page.getByRole('checkbox')).toBeDisabled();
  await page.getByLabel('Enter Password', { exact: true }).press('Enter');
  await expect(
    page.getByRole('alert').filter({ hasText: 'Sign-in was rejected' }),
  ).toBeVisible();
  await expect(page.locator('[data-sonner-toast]')).toContainText(
    'Sign-in was rejected. Check your email and password.',
  );
  expect(payload).toEqual({
    email: 'admin@example.com',
    password: 'LocalPassword1!',
  });
  await expect(page).toHaveURL('/login');
  await page.goto('/login');
  await expect(
    page.getByRole('button', { name: 'Sign In', exact: true }),
  ).toBeEnabled();
  await page.getByRole('link', { name: 'Forgot Password?' }).click();
  await expect(page).toHaveURL('/forgot-password');
  await page.getByRole('link', { name: 'Back to Sign In' }).click();
  await page.getByRole('link', { name: 'Accept invite' }).click();
  await expect(page).toHaveURL('/accept-invite');
  await expect(
    page.getByRole('alert').filter({ hasText: 'Open the invitation link' }),
  ).toBeVisible();
  await page.goto('/accept-invite/password');
  await expect(
    page.getByRole('heading', { name: 'Create New Password' }),
  ).toBeVisible();
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

test('login MFA enrollment submits its code and clears on refresh', async ({
  page,
}) => {
  let enrollmentPayload: unknown;
  await page.route('**/api/admin-auth/verify', async (route) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'content-type',
    };
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers });
      return;
    }
    enrollmentPayload = route.request().postDataJSON();
    await route.fulfill({ status: 401, json: {}, headers });
  });
  await page.route('**/api/admin-auth/login', async (route) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'content-type',
    };
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers });
      return;
    }
    await route.fulfill({
      json: ADMIN_LOGIN_ENROLLMENT_FIXTURE,
      headers,
    });
  });
  await page.goto('/login');
  await page.getByLabel('Enter Work Email').fill('admin@example.invalid');
  await page
    .getByLabel('Enter Password', { exact: true })
    .fill('LocalPassword1!');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Set up your authenticator' }),
  ).toBeVisible();
  await expect(page.getByText('admin@example.invalid')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Confirm Enrollment' }),
  ).toBeEnabled();
  await page.getByLabel('Verification digit 1', { exact: true }).fill('012345');
  await page.getByRole('button', { name: 'Confirm Enrollment' }).click();
  await expect(
    page.getByRole('alert').filter({
      hasText: 'Verification was rejected.',
    }),
  ).toBeVisible();
  expect(enrollmentPayload).toEqual({
    mode: 'enroll',
    flowToken: 'synthetic-enrollment-token',
    code: '012345',
  });
  await expect(
    page.locator('[data-sonner-toast]').filter({
      hasText: 'Verification was rejected.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Confirm Enrollment' }),
  ).toBeEnabled();
  await expect(page.getByText('synthetic-enrollment-token')).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  await expect(page).toHaveURL('/login');
  await page.reload();
  await expect(page.getByLabel('Enter Password', { exact: true })).toHaveValue(
    '',
  );
  await expect(page.getByText('admin@example.invalid')).toHaveCount(0);
});

for (const mode of ['enrollment', 'challenge'] as const) {
  test(`complete ${mode} MFA signs in without browser token storage`, async ({
    page,
  }) => {
    const enrollment = mode === 'enrollment';
    await page.route('**/api/admin-auth/login', (route) =>
      route.fulfill({
        json: enrollment
          ? ADMIN_LOGIN_ENROLLMENT_FIXTURE
          : ADMIN_LOGIN_CHALLENGE_FIXTURE,
      }),
    );
    let verificationPayload: unknown;
    await page.route('**/api/admin-auth/verify', (route) => {
      verificationPayload = route.request().postDataJSON();
      return route.fulfill({ json: ADMIN_MFA_RESPONSE_FIXTURE });
    });
    await page.goto('/login');
    await page.getByLabel('Enter Work Email').fill('admin@example.invalid');
    await page
      .getByLabel('Enter Password', { exact: true })
      .fill('LocalPassword1!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    if (enrollment) {
      await expect(
        page.getByRole('img', { name: 'Scan to set up your authenticator' }),
      ).toBeVisible();
      await expect(
        page.getByText(
          ADMIN_LOGIN_ENROLLMENT_FIXTURE.data.authenticator.secret,
        ),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole('heading', { name: 'Two-Factor Verification' }),
      ).toBeVisible();
      await expect(
        page.getByRole('img', { name: 'Scan to set up your authenticator' }),
      ).toHaveCount(0);
      await expect(
        page.getByText(
          ADMIN_LOGIN_ENROLLMENT_FIXTURE.data.authenticator.secret,
        ),
      ).toHaveCount(0);
    }
    await page
      .getByLabel('Verification digit 1', { exact: true })
      .fill('012345');
    await page
      .getByRole('button', {
        name: enrollment ? 'Confirm Enrollment' : 'Verify Code',
        exact: true,
      })
      .click();
    await expect(page).toHaveURL('/dashboard');
    expect(verificationPayload).toEqual({
      mode: enrollment ? 'enroll' : 'login',
      flowToken: enrollment
        ? 'synthetic-enrollment-token'
        : 'synthetic-challenge-token',
      code: '012345',
    });
    expect(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
    ).toBe(0);
    await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
    await page.goto('/login');
    await expect(
      page.getByLabel('Enter Password', { exact: true }),
    ).toHaveValue('');
  });
}

test('expired MFA challenge returns to empty credential login', async ({
  page,
}) => {
  await page.route('**/api/admin-auth/login', (route) =>
    route.fulfill({ json: ADMIN_LOGIN_CHALLENGE_FIXTURE }),
  );
  await page.route('**/api/admin-auth/verify', (route) =>
    route.fulfill({
      status: 401,
      json: { code: 'flow_expired' },
    }),
  );
  await page.goto('/login');
  await page.getByLabel('Enter Work Email').fill('admin@example.invalid');
  await page
    .getByLabel('Enter Password', { exact: true })
    .fill('LocalPassword1!');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByLabel('Verification digit 1', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Verify Code', exact: true }).click();
  await expect(page.getByLabel('Enter Password', { exact: true })).toHaveValue(
    '',
  );
  await expect(
    page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'challenge expired' }),
  ).toBeVisible();
  await expect(
    page.getByLabel('Verification digit 1', { exact: true }),
  ).toHaveCount(0);
});

test('sign-out clears the HttpOnly browser session cookie', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'emilist_admin_token',
      value: 'synthetic-session',
      url: 'http://127.0.0.1:4317',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/dashboard');
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    'synthetic-session',
  );
  await page.getByLabel('Open profile menu').click();
  await page.getByRole('menuitem', { name: 'Sign out', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Sign Out', exact: true })
    .getByRole('button', { name: 'Sign Out', exact: true })
    .click();
  await expect(page).toHaveURL('/login');
  expect(
    (await context.cookies()).find(
      (cookie) => cookie.name === 'emilist_admin_token',
    ),
  ).toBeUndefined();
});
