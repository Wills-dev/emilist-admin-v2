import { expect, test } from '@playwright/test';
import {
  invitationFixture,
  INVITATION_SETUP_FIXTURE,
} from '../src/features/auth/test/adminInvitationFixtures';
import { ADMIN_MFA_RESPONSE_FIXTURE } from '../src/features/auth/test/adminLoginResponseFixture';

const link =
  '/accept-invite?token=synthetic-invitation&fullName=Jane+Doe&email=jane%2Binvited%40example.invalid&role=admin&invitedBy=John+Tom';

test.beforeEach(async ({ page }) => {
  // No synthetic invitation or password may reach the live backend.
  await page.route('**/api/admin-auth/**', (route) => route.abort());
});

test('invitation populates decoded details and completes password, QR, and activation', async ({
  page,
}) => {
  let passwordCreated = false;
  let passwordPayload: unknown;
  let activationPayload: unknown;
  await page.route('**/api/admin-auth/invitation', async (route) => {
    if (route.request().method() === 'POST') {
      expect(route.request().postDataJSON()).toEqual({
        token: 'synthetic-invitation',
      });
    }
    await route.fulfill({
      json: invitationFixture(passwordCreated ? 'authenticator' : 'password'),
    });
  });
  await page.route('**/api/admin-auth/invitation/password', (route) => {
    passwordCreated = true;
    passwordPayload = route.request().postDataJSON();
    return route.fulfill({ json: INVITATION_SETUP_FIXTURE });
  });
  await page.route('**/api/admin-auth/invitation/activate', (route) => {
    activationPayload = route.request().postDataJSON();
    return route.fulfill({ json: ADMIN_MFA_RESPONSE_FIXTURE });
  });
  await page.goto(link);
  await expect(page.getByText('Jane Doe', { exact: true })).toBeVisible();
  await expect(
    page.getByText('jane+invited@example.invalid', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('John Tom', { exact: true })).toBeVisible();
  await expect(page.getByText('admin', { exact: true })).toBeVisible();
  await expect
    .poll(() => new URL(page.url()).searchParams.has('token'))
    .toBe(false);
  await page.getByRole('button', { name: 'Proceed', exact: true }).click();
  await page
    .getByLabel('Create Password', { exact: true })
    .fill('StrongPassword1!');
  await page.getByLabel('Confirm Password', { exact: true }).fill('different');
  await expect(page.getByText('Passwords do not match.')).toBeVisible();
  await page
    .getByLabel('Confirm Password', { exact: true })
    .fill('StrongPassword1!');
  await page
    .getByRole('button', { name: 'Create Password', exact: true })
    .click();
  await expect(
    page.getByRole('img', { name: 'Scan to set up your authenticator' }),
  ).toBeVisible();
  expect(passwordPayload).toEqual({
    password: 'StrongPassword1!',
    confirmPassword: 'StrongPassword1!',
  });
  await expect(page.getByLabel('Create Password', { exact: true })).toHaveCount(
    0,
  );
  // Empty code boxes must be discoverable before validation adds error borders.
  const codeGroup = page.getByRole('group', {
    name: 'Enter Verification Code',
    exact: true,
  });
  await codeGroup.scrollIntoViewIfNeeded();
  await expect(codeGroup.getByRole('alert')).toHaveCount(0);
  const codeInputs = codeGroup.getByRole('textbox');
  await expect(codeInputs).toHaveCount(6);
  for (const input of await codeInputs.all()) {
    await expect(input).toHaveValue('');
    await expect(input).toBeInViewport();
    const appearance = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        borderColor: style.borderTopColor,
        borderWidth: style.borderTopWidth,
        backgroundColor: style.backgroundColor,
      };
    });
    expect(parseFloat(appearance.borderWidth)).toBeGreaterThan(0);
    expect(appearance.borderColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(appearance.borderColor).not.toBe(appearance.backgroundColor);
  }
  await page.getByLabel('Verification digit 1', { exact: true }).fill('012345');
  await page
    .getByRole('button', { name: 'Activate Account & Sign In', exact: true })
    .click();
  await expect(page).toHaveURL('/dashboard');
  expect(activationPayload).toEqual({ code: '012345' });
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
});

test('refresh resumes setup using the private invitation cookie', async ({
  page,
  context,
}) => {
  let inspectedByCookie = false;
  let setupResumed = false;
  await page.route('**/api/admin-auth/invitation', (route) => {
    inspectedByCookie ||= route.request().method() === 'GET';
    return route.fulfill({
      json: invitationFixture('authenticator'),
      headers:
        route.request().method() === 'POST'
          ? {
              'Set-Cookie':
                'emilist_admin_invitation=synthetic-invitation; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600',
            }
          : {},
    });
  });
  await page.route('**/api/admin-auth/invitation/setup', (route) => {
    setupResumed = true;
    expect(route.request().postDataJSON()).toEqual({});
    return route.fulfill({ json: INVITATION_SETUP_FIXTURE });
  });
  await page.goto(link);
  await expect(
    page.getByRole('button', { name: 'Proceed', exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => new URL(page.url()).searchParams.has('token'))
    .toBe(false);
  expect(
    (await context.cookies()).find(
      (cookie) => cookie.name === 'emilist_admin_invitation',
    )?.httpOnly,
  ).toBe(true);
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    'synthetic-invitation',
  );
  await page.reload();
  await page.getByRole('button', { name: 'Proceed', exact: true }).click();
  await expect(
    page.getByRole('img', { name: 'Scan to set up your authenticator' }),
  ).toBeVisible();
  expect(inspectedByCookie).toBe(true);
  expect(setupResumed).toBe(true);
  await expect(page.getByLabel('Create Password', { exact: true })).toHaveCount(
    0,
  );
});

test('expired invitations cannot proceed even with plausible URL display values', async ({
  page,
}) => {
  await page.route('**/api/admin-auth/invitation', (route) =>
    route.fulfill({
      status: 410,
      json: { code: 'invitation_expired' },
    }),
  );
  await page.goto(link);
  await expect(
    page.getByRole('alert').filter({ hasText: 'invitation has expired' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Proceed', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel('Create Password', { exact: true })).toHaveCount(
    0,
  );
});
