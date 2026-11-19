import { expect, test } from '@playwright/test';
import {
  ADMIN_MFA_RESPONSE_FIXTURE,
  ADMIN_LOGIN_CHALLENGE_FIXTURE,
  AUTHENTICATED_ADMIN_FIXTURE,
} from '../src/features/auth/test/adminLoginResponseFixture';

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'emilist_admin_token',
      value: 'synthetic-session',
      url: 'http://127.0.0.1:4317',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  // Browser fixtures must never contact the live current-user endpoint.
  await page.route('**/api/admin-auth/current-user', (route) => route.abort());
});

test('profile loading is localized and one request populates the account identity', async ({
  page,
}) => {
  let release: () => void = () => {};
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requests = 0;
  await page.route('**/api/admin-auth/current-user', async (route) => {
    requests++;
    await ready;
    await route.fulfill({ json: ADMIN_MFA_RESPONSE_FIXTURE });
  });
  await page.goto('/dashboard');
  const header = page.getByRole('banner');
  await expect(
    header.getByRole('status', { name: 'Loading header profile' }),
  ).toBeVisible();
  await expect(header.getByLabel('Open profile menu')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Welcome, Admin', exact: true }),
  ).toBeVisible();
  release();
  await expect(header.getByLabel('Open profile menu')).toContainText(
    'Sample Admin',
  );
  await expect(header.getByText('Admin', { exact: true })).toBeVisible();
  await expect(header.getByText('Demo Mode', { exact: true })).toHaveCount(0);
  expect(requests).toBe(1);
  await header.getByLabel('Open profile menu').click();
  const menu = page.getByRole('menu', { name: 'Account menu' });
  await expect(menu.getByText('Sample Admin', { exact: true })).toBeVisible();
  await expect(
    menu.getByText('admin@example.invalid', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    'synthetic-session',
  );
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
});

test('profile errors can be retried without discarding the public workspace', async ({
  page,
}) => {
  let requests = 0;
  await page.route('**/api/admin-auth/current-user', (route) => {
    requests++;
    return requests === 1
      ? route.fulfill({ status: 403, json: { code: 'forbidden' } })
      : route.fulfill({ json: ADMIN_MFA_RESPONSE_FIXTURE });
  });
  await page.goto('/dashboard');
  const header = page.getByRole('banner');
  await header.getByRole('button', { name: 'Retry loading profile' }).click();
  await expect(header.getByLabel('Open profile menu')).toContainText(
    'Sample Admin',
  );
  await expect(page).toHaveURL('/dashboard');
  expect(requests).toBe(2);
});

test('confirmed session expiry clears the cookie and returns to sign-in once', async ({
  page,
  context,
}) => {
  let requests = 0;
  await page.route('**/api/admin-auth/current-user', (route) => {
    requests++;
    return route.fulfill({
      status: 401,
      json: { code: 'unauthorized' },
      headers: {
        'Set-Cookie':
          'emilist_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      },
    });
  });
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
  await expect(page.getByLabel('Enter Password', { exact: true })).toHaveValue(
    '',
  );
  expect(
    (await context.cookies()).find(
      (cookie) => cookie.name === 'emilist_admin_token',
    ),
  ).toBeUndefined();
  expect(requests).toBe(1);
  await expect(
    page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Your session has expired' }),
  ).toBeVisible();
});

test('authenticated identity fits the header across mobile, tablet, and desktop', async ({
  page,
}) => {
  await page.route('**/api/admin-auth/current-user', (route) =>
    route.fulfill({ json: ADMIN_MFA_RESPONSE_FIXTURE }),
  );
  await page.goto('/dashboard');
  const header = page.getByRole('banner');
  await expect(header.getByLabel('Open profile menu')).toContainText(
    'Sample Admin',
  );
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await header.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(header.getByLabel('Open profile menu')).toBeVisible();
  }
});

test('a completed MFA login replaces a cached preview identity with the current user', async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.route('**/api/admin-auth/login', (route) =>
    route.fulfill({
      json: ADMIN_LOGIN_CHALLENGE_FIXTURE,
    }),
  );
  await page.route('**/api/admin-auth/verify', (route) =>
    route.fulfill({
      json: ADMIN_MFA_RESPONSE_FIXTURE,
      headers: {
        'Set-Cookie':
          'emilist_admin_token=synthetic-session; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800',
      },
    }),
  );
  await page.route('**/api/admin-auth/current-user', (route) =>
    route.fulfill({
      json: ADMIN_MFA_RESPONSE_FIXTURE,
    }),
  );
  await page.goto('/dashboard');
  await expect(
    page.getByRole('banner').getByLabel('Open profile menu'),
  ).toContainText('DM');
  await page.goto('/login');
  await page.getByLabel('Enter Work Email').fill('admin@example.invalid');
  await page
    .getByLabel('Enter Password', { exact: true })
    .fill('LocalPassword1!');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByLabel('Verification digit 1', { exact: true }).fill('012345');
  await page.getByRole('button', { name: 'Verify Code', exact: true }).click();
  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByRole('banner').getByLabel('Open profile menu'),
  ).toContainText('Sample Admin');
});

test('the header shows today in Lagos and long emails stay readable without overflow', async ({
  page,
}) => {
  const longEmail = `${'a'.repeat(60)}@${'b'.repeat(60)}.${'c'.repeat(60)}.example.invalid`;
  await page.route('**/api/admin-auth/current-user', (route) =>
    route.fulfill({
      json: {
        message: 'success',
        data: { admin: { ...AUTHENTICATED_ADMIN_FIXTURE, email: longEmail } },
      },
    }),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/dashboard');
  const header = page.getByRole('banner');
  await expect(header.getByText('Admin', { exact: true })).toBeVisible();
  const expectedDate = await page.evaluate(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  await expect(header.locator('time')).toHaveAttribute(
    'datetime',
    expectedDate,
  );
  await expect(header.locator('time')).toBeVisible();
  await expect(header).not.toContainText('sample date');
  const sidebarEmail = page
    .getByRole('complementary')
    .getByTitle(longEmail, { exact: true });
  await expect(sidebarEmail).toHaveCSS('text-overflow', 'ellipsis');
  expect(
    await sidebarEmail.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .getByRole('complementary')
      .evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const drawer = page.getByRole('dialog', { name: 'Workspace navigation' });
  await expect(drawer.getByTitle(longEmail, { exact: true })).toHaveCSS(
    'text-overflow',
    'ellipsis',
  );
  expect(
    await drawer.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Close navigation' }).click();
  await header.getByLabel('Open profile menu').click();
  const fullEmail = page
    .getByRole('menu', { name: 'Account menu' })
    .getByText(longEmail, { exact: true });
  await expect(fullEmail).toBeVisible();
  await expect(fullEmail).toHaveCSS('word-break', 'break-all');
  expect(
    await fullEmail.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
});
