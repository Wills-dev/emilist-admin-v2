import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import { AppProviders } from '@/providers/AppProviders/AppProviders';
import { AdminMfaForm } from './AdminMfaForm';
import { ADMIN_MFA_RESPONSE_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';
const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

beforeEach(() => {
  vi.spyOn(toast, 'error').mockReturnValue('mfa-error');
  vi.spyOn(toast, 'info').mockReturnValue('mfa-info');
  vi.spyOn(toast, 'success').mockReturnValue('mfa-success');
});
afterEach(() => vi.restoreAllMocks());

it('validates six digits before sending a code', async () => {
  const post = vi.spyOn(apiClient, 'post');
  render(
    <AppProviders>
      <AdminMfaForm mode="enrollment" token="test-token" />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Verification digit 1'), '12345');
  await user.click(screen.getByRole('button', { name: 'Confirm Enrollment' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Enter all six digits.',
  );
  expect(post).not.toHaveBeenCalled();
  expect(toast.error).not.toHaveBeenCalled();
});

it.each([
  ['enrollment', '/api/admin-auth/verify', 'enroll', 'Confirm Enrollment'],
  ['challenge', '/api/admin-auth/verify', 'login', 'Verify Code'],
] as const)(
  'submits %s once and navigates only after a validated session response',
  async (mode, path, key, label) => {
    let complete: (value: { data: unknown }) => void = () => {};
    const response = new Promise<{ data: unknown }>((resolve) => {
      complete = resolve;
    });
    const post = vi.spyOn(apiClient, 'post').mockReturnValueOnce(response);
    const restart = vi.fn();
    render(
      <AppProviders>
        <AdminMfaForm mode={mode} token="test-token" onRestart={restart} />
      </AppProviders>,
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Verification digit 1'), '012345');
    await user.click(screen.getByRole('button', { name: label }));
    const pending = screen.getByRole('button', { name: 'Verifying' });
    expect(pending).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Back to Sign In' }),
    ).toBeDisabled();
    await user.click(pending);
    expect(post).toHaveBeenCalledExactlyOnceWith(
      path,
      {
        mode: key,
        flowToken: 'test-token',
        code: '012345',
      },
      { signal: expect.any(AbortSignal) },
    );
    complete({ data: ADMIN_MFA_RESPONSE_FIXTURE });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Sign-in complete.',
    );
    expect(toast.success).toHaveBeenCalledExactlyOnceWith(
      'Signed in successfully',
    );
    expect(router.replace).toHaveBeenCalledExactlyOnceWith('/dashboard');
    expect(router.refresh).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Verification digit 1')).toHaveValue('');
    expect(screen.getByRole('button', { name: label })).toBeDisabled();
    expect(localStorage.length + sessionStorage.length).toBe(0);
    expect(restart).toHaveBeenCalledOnce();
  },
);

it('shows a safe rejection, permits correction, and never retries automatically', async () => {
  const post = vi
    .spyOn(apiClient, 'post')
    .mockRejectedValueOnce(
      new ApiError('Private backend details', 'unauthorized', 401),
    );
  render(
    <AppProviders>
      <AdminMfaForm mode="challenge" token="test-token" />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Verification digit 1'), '123456');
  await user.click(screen.getByRole('button', { name: 'Verify Code' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Verification was rejected.',
  );
  expect(toast.error).toHaveBeenCalledExactlyOnceWith(
    'Verification was rejected. Check your code or sign in again.',
  );
  expect(screen.getByRole('button', { name: 'Verify Code' })).toBeEnabled();
  expect(screen.getByLabelText('Verification digit 1')).toBeEnabled();
  expect(screen.queryByText('Private backend details')).toBeNull();
  expect(post).toHaveBeenCalledTimes(1);
});

it('keeps cancelled verification requests quiet', async () => {
  vi.spyOn(apiClient, 'post').mockRejectedValueOnce(
    new ApiError('Cancelled', 'cancelled'),
  );
  render(
    <AppProviders>
      <AdminMfaForm mode="challenge" token="test-token" />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Verification digit 1'), '123456');
  await user.click(screen.getByRole('button', { name: 'Verify Code' }));
  expect(screen.getByRole('button', { name: 'Verify Code' })).toBeEnabled();
  expect(toast.error).not.toHaveBeenCalled();
});

it('returns expired challenges to credentials without navigation', async () => {
  const restart = vi.fn();
  vi.spyOn(apiClient, 'post').mockRejectedValueOnce(
    new ApiError(
      'Your sign-in challenge expired. Please sign in again.',
      'flow_expired',
    ),
  );
  render(
    <AppProviders>
      <AdminMfaForm mode="challenge" token="test-token" onRestart={restart} />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Verification digit 1'), '123456');
  await user.click(screen.getByRole('button', { name: 'Verify Code' }));
  expect(restart).toHaveBeenCalledOnce();
  expect(router.replace).not.toHaveBeenCalled();
  expect(toast.error).toHaveBeenCalledWith(
    'Your sign-in challenge expired. Please sign in again.',
  );
});

it('explains device clock settings after repeated invalid codes', async () => {
  vi.spyOn(apiClient, 'post').mockRejectedValue(
    new ApiError(
      'Invalid authenticator code. Please try the current code.',
      'invalid_code',
    ),
  );
  render(
    <AppProviders>
      <AdminMfaForm mode="challenge" token="test-token" />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Verification digit 1'), '123456');
  await user.click(screen.getByRole('button', { name: 'Verify Code' }));
  expect(screen.queryByRole('note')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Verify Code' }));
  expect(await screen.findByRole('note')).toHaveTextContent(
    'automatic date and time',
  );
});

it('aborts verification when the form is unmounted', async () => {
  let signal: AbortSignal | undefined;
  vi.spyOn(apiClient, 'post').mockImplementationOnce((_url, _body, config) => {
    signal = config?.signal as AbortSignal;
    return new Promise((_resolve, reject) => {
      signal?.addEventListener('abort', () =>
        reject(new ApiError('Cancelled', 'cancelled')),
      );
    });
  });
  const view = render(
    <AppProviders>
      <AdminMfaForm mode="challenge" token="test-token" />
    </AppProviders>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Verification digit 1'), '123456');
  await user.click(screen.getByRole('button', { name: 'Verify Code' }));
  view.unmount();
  expect(signal?.aborted).toBe(true);
  expect(router.replace).not.toHaveBeenCalled();
  expect(toast.error).not.toHaveBeenCalled();
});
