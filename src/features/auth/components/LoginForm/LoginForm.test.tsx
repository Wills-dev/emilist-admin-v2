import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import { AppProviders } from '@/providers/AppProviders/AppProviders';
import { AdminLoginFlow } from '@/features/auth/components/AdminLoginFlow/AdminLoginFlow';
import { ADMIN_LOGIN_ENROLLMENT_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';

beforeEach(() => {
  vi.spyOn(toast, 'error').mockReturnValue('login-error');
  vi.spyOn(toast, 'info').mockReturnValue('login-info');
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderLogin() {
  return render(
    <AppProviders>
      <AdminLoginFlow />
    </AppProviders>,
  );
}

async function enterCredentials() {
  const user = userEvent.setup();
  await user.type(
    screen.getByLabelText('Enter Work Email'),
    'admin@example.com',
  );
  await user.type(screen.getByLabelText('Enter Password'), 'Password123!');
  return user;
}

it('validates before sending credentials and keeps password visibility usable', async () => {
  const post = vi.spyOn(apiClient, 'post');
  try {
    renderLogin();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Enter Work Email'), 'invalid');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(
      await screen.findByText('Enter a valid work email address.'),
    ).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
    expect(post).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.info).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', {
        name: 'Show enter password',
      }),
    );
    expect(screen.getByLabelText('Enter Password')).toHaveAttribute(
      'type',
      'text',
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  } finally {
    post.mockRestore();
  }
});

it('submits the exact payload once and waits without inventing a session', async () => {
  let complete: (value: { data: unknown }) => void = () => {};
  const response = new Promise<{ data: unknown }>((resolve) => {
    complete = resolve;
  });
  const post = vi.spyOn(apiClient, 'post').mockReturnValueOnce(response);
  try {
    renderLogin();
    const user = await enterCredentials();
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    const pending = screen.getByRole('button', { name: 'Signing In' });
    expect(pending).toBeDisabled();
    await user.click(pending);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      '/api/admin-auth/login',
      {
        email: 'admin@example.com',
        password: 'Password123!',
      },
      { signal: expect.any(AbortSignal) },
    );
    complete({ data: ADMIN_LOGIN_ENROLLMENT_FIXTURE });
    expect(
      await screen.findByRole('heading', {
        name: 'Set up your authenticator',
      }),
    ).toBeVisible();
    expect(toast.info).toHaveBeenCalledWith('Set up your authenticator');
    expect(screen.getByText('admin@example.invalid')).toBeVisible();
    expect(
      screen.getByText(
        ADMIN_LOGIN_ENROLLMENT_FIXTURE.data.authenticator.secret,
      ),
    ).toBeVisible();
    expect(screen.queryByLabelText('Enter Password')).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Confirm Enrollment' }),
    ).toBeEnabled();
    expect(screen.queryByText('synthetic-enrollment-token')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Back to Sign In' }));
    expect(screen.getByLabelText('Enter Password')).toHaveValue('');
    expect(screen.queryByText('admin@example.invalid')).toBeNull();
    expect(localStorage.length).toBe(0);
  } finally {
    post.mockRestore();
  }
});

it('shows safe login errors and allows retry without automatic replay', async () => {
  const post = vi
    .spyOn(apiClient, 'post')
    .mockRejectedValueOnce(
      new ApiError('Private backend details', 'unauthorized', 401),
    );
  try {
    renderLogin();
    const user = await enterCredentials();
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Sign-in was rejected. Check your email and password.',
    );
    expect(toast.error).toHaveBeenCalledExactlyOnceWith(
      'Sign-in was rejected. Check your email and password.',
    );
    expect(screen.queryByText('Private backend details')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled();
    expect(post).toHaveBeenCalledTimes(1);
  } finally {
    post.mockRestore();
  }
});

it('does not show a toast for cancelled requests', async () => {
  vi.spyOn(apiClient, 'post').mockRejectedValueOnce(
    new ApiError('Request cancelled.', 'cancelled'),
  );
  renderLogin();
  const user = await enterCredentials();
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled();
  expect(toast.error).not.toHaveBeenCalled();
  expect(toast.info).not.toHaveBeenCalled();
});
