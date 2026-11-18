import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/apiClient';
import { AppProviders } from '@/providers/AppProviders/AppProviders';
import { AcceptInviteFlow } from './AcceptInviteFlow';
import {
  invitationFixture,
  INVITATION_SETUP_FIXTURE,
} from '@/features/auth/test/adminInvitationFixtures';
import { ADMIN_MFA_RESPONSE_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));
const link = {
  token: 'synthetic-invitation',
  invalidToken: false,
  account: {
    fullName: 'Jane Doe',
    email: 'hint@example.invalid',
    role: 'admin',
    invitedBy: 'John Tom',
  },
};
beforeEach(() => {
  window.history.replaceState(
    {},
    '',
    '/accept-invite?token=synthetic-invitation&fullName=Jane+Doe',
  );
  vi.spyOn(toast, 'success').mockReturnValue('success');
  vi.spyOn(toast, 'error').mockReturnValue('error');
});
afterEach(() => vi.restoreAllMocks());

it('populates URL details, verifies the account, creates the password, and activates with a string code', async () => {
  const post = vi.spyOn(apiClient, 'post').mockImplementation(async (url) => {
    if (url === '/api/admin-auth/invitation')
      return { data: invitationFixture() };
    if (url === '/api/admin-auth/invitation/password')
      return { data: INVITATION_SETUP_FIXTURE };
    if (url === '/api/admin-auth/invitation/activate')
      return { data: ADMIN_MFA_RESPONSE_FIXTURE };
    throw new Error('Unexpected endpoint');
  });
  vi.spyOn(apiClient, 'get').mockResolvedValue({
    data: invitationFixture('authenticator'),
  });
  render(
    <AppProviders>
      <AcceptInviteFlow link={link} />
    </AppProviders>,
  );
  expect(screen.getByText('Jane Doe')).toBeVisible();
  expect(screen.getByText('John Tom')).toBeVisible();
  expect(await screen.findByText('jane+invited@example.invalid')).toBeVisible();
  expect(screen.queryByText('hint@example.invalid')).toBeNull();
  await waitFor(() => expect(window.location.search).not.toContain('token='));
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Proceed' }));
  await user.type(screen.getByLabelText('Create Password'), 'StrongPassword1!');
  await user.type(
    screen.getByLabelText('Confirm Password'),
    'StrongPassword1!',
  );
  await user.click(screen.getByRole('button', { name: 'Create Password' }));
  expect(
    await screen.findByRole('img', {
      name: 'Scan to set up your authenticator',
    }),
  ).toBeVisible();
  expect(post).toHaveBeenCalledWith(
    '/api/admin-auth/invitation/password',
    {
      password: 'StrongPassword1!',
      confirmPassword: 'StrongPassword1!',
    },
    {
      signal: expect.any(AbortSignal),
      headers: { 'X-Invitation-Flow': 'a'.repeat(64) },
    },
  );
  await user.type(screen.getByLabelText('Verification digit 1'), '012345');
  await user.click(
    screen.getByRole('button', { name: 'Activate Account & Sign In' }),
  );
  await waitFor(() =>
    expect(router.replace).toHaveBeenCalledWith('/dashboard'),
  );
  expect(post).toHaveBeenCalledWith(
    '/api/admin-auth/invitation/activate',
    { code: '012345' },
    {
      signal: expect.any(AbortSignal),
      headers: { 'X-Invitation-Flow': 'a'.repeat(64) },
    },
  );
  expect(localStorage.length + sessionStorage.length).toBe(0);
});

it('recovers setup using the private invitation cookie after refresh', async () => {
  vi.spyOn(apiClient, 'get').mockResolvedValue({
    data: invitationFixture('authenticator'),
  });
  const post = vi
    .spyOn(apiClient, 'post')
    .mockResolvedValue({ data: INVITATION_SETUP_FIXTURE });
  render(
    <AppProviders>
      <AcceptInviteFlow
        link={{
          account: { ...link.account, email: 'jane+invited@example.invalid' },
          invalidToken: false,
        }}
      />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: 'Proceed' }));
  expect(
    await screen.findByRole('img', {
      name: 'Scan to set up your authenticator',
    }),
  ).toBeVisible();
  expect(post).toHaveBeenCalledWith(
    '/api/admin-auth/invitation/setup',
    {},
    {
      signal: expect.any(AbortSignal),
      headers: { 'X-Invitation-Flow': 'a'.repeat(64) },
    },
  );
  expect(screen.queryByLabelText('Create Password')).toBeNull();
});

it('never enables onboarding for an ambiguous token', () => {
  const post = vi.spyOn(apiClient, 'post');
  const get = vi.spyOn(apiClient, 'get');
  render(
    <AppProviders>
      <AcceptInviteFlow link={{ ...link, invalidToken: true }} />
    </AppProviders>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent(
    'invitation link is invalid',
  );
  expect(screen.queryByRole('button', { name: 'Proceed' })).toBeNull();
  expect(post).not.toHaveBeenCalled();
  expect(get).not.toHaveBeenCalled();
});
