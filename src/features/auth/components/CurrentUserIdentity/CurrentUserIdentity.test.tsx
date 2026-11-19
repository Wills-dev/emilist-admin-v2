import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CurrentUserProvider } from '@/features/auth/components/CurrentUserProvider/CurrentUserProvider';
import { CurrentUserBoundary } from '@/features/auth/components/CurrentUserBoundary/CurrentUserBoundary';
import { useCurrentUserStore } from '@/features/auth/hooks/useCurrentUserStore/useCurrentUserStore';
import { CURRENT_USER_QUERY_KEY } from '@/features/auth/lib/authQueryKeys';
import {
  ADMIN_MFA_RESPONSE_FIXTURE,
  AUTHENTICATED_ADMIN_FIXTURE,
} from '@/features/auth/test/adminLoginResponseFixture';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import { CurrentUserIdentity } from './CurrentUserIdentity';
import { CurrentUserBadge } from '@/features/auth/components/CurrentUserBadge/CurrentUserBadge';

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));
beforeEach(() => {
  vi.spyOn(toast, 'error').mockReturnValue('profile-error');
});
afterEach(() => vi.restoreAllMocks());

function StoreProbe() {
  const user = useCurrentUserStore((state) => state.user);
  return (
    <output aria-label="Stored current user">
      {user?.fullName ?? 'empty'}
    </output>
  );
}
function renderIdentity(
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) {
  render(
    <QueryClientProvider client={client}>
      <CurrentUserProvider>
        <CurrentUserBoundary enabled>
          <header>
            <CurrentUserBadge />
            <CurrentUserIdentity placement="header" />
          </header>
          <aside>
            <CurrentUserIdentity placement="sidebar" />
          </aside>
          <StoreProbe />
        </CurrentUserBoundary>
      </CurrentUserProvider>
    </QueryClientProvider>,
  );
  return client;
}

it('loads both identity regions once, synchronizes Zustand, and preserves identity during refetch', async () => {
  let complete: (value: { data: unknown }) => void = () => {};
  const first = new Promise<{ data: unknown }>((resolve) => {
    complete = resolve;
  });
  const get = vi.spyOn(apiClient, 'get').mockReturnValueOnce(first);
  const client = renderIdentity();
  expect(
    screen.getByRole('status', { name: 'Loading header profile' }),
  ).toBeVisible();
  expect(
    screen.getByRole('status', { name: 'Loading sidebar profile' }),
  ).toBeVisible();
  expect(screen.queryByText('Demo Operator')).toBeNull();
  await act(async () => complete({ data: ADMIN_MFA_RESPONSE_FIXTURE }));
  await waitFor(() =>
    expect(screen.getByLabelText('Stored current user')).toHaveTextContent(
      'Sample Admin',
    ),
  );
  const header = within(screen.getByRole('banner'));
  expect(header.getByLabelText('Open profile menu')).toHaveTextContent(
    'Sample Admin',
  );
  expect(header.getByText('Admin', { exact: true })).toBeVisible();
  expect(header.queryByText('Demo Mode')).toBeNull();
  expect(get).toHaveBeenCalledExactlyOnceWith('/api/admin-auth/current-user', {
    signal: expect.any(AbortSignal),
  });

  const refetch = new Promise<{ data: unknown }>((resolve) => {
    complete = resolve;
  });
  get.mockReturnValueOnce(refetch);
  act(() => {
    void client.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
  });
  await waitFor(() =>
    expect(
      header.getByRole('status', { name: 'Refreshing profile' }),
    ).toBeVisible(),
  );
  expect(header.getByLabelText('Open profile menu')).toHaveTextContent(
    'Sample Admin',
  );
  expect(
    header.queryByRole('status', { name: 'Loading header profile' }),
  ).toBeNull();
  await act(async () =>
    complete({
      data: {
        message: 'success',
        data: {
          admin: { ...AUTHENTICATED_ADMIN_FIXTURE, fullName: 'Updated Admin' },
        },
      },
    }),
  );
  await waitFor(() =>
    expect(header.getByLabelText('Open profile menu')).toHaveTextContent(
      'Updated Admin',
    ),
  );
  expect(screen.getByLabelText('Stored current user')).toHaveTextContent(
    'Updated Admin',
  );
});

it('shows a localized recoverable error without fabricating a profile or redirecting', async () => {
  const get = vi
    .spyOn(apiClient, 'get')
    .mockRejectedValueOnce(
      new ApiError('Private backend details', 'server', 503),
    )
    .mockResolvedValueOnce({ data: ADMIN_MFA_RESPONSE_FIXTURE });
  renderIdentity();
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Unable to load your profile.',
  );
  expect(screen.queryByText('Private backend details')).toBeNull();
  expect(router.replace).not.toHaveBeenCalled();
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Try again' }));
  await waitFor(() =>
    expect(screen.getByLabelText('Stored current user')).toHaveTextContent(
      'Sample Admin',
    ),
  );
  expect(get).toHaveBeenCalledTimes(2);
});

it('clears the identity and private caches only after confirmed session rejection', async () => {
  const get = vi
    .spyOn(apiClient, 'get')
    .mockResolvedValueOnce({ data: ADMIN_MFA_RESPONSE_FIXTURE });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryDefaults(['private-record'], { meta: { private: true } });
  client.setQueryData(['private-record'], { value: 'synthetic-private-data' });
  client.setQueryData(['public-preview'], { value: 'synthetic-preview' });
  renderIdentity(client);
  await waitFor(() =>
    expect(screen.getByLabelText('Stored current user')).toHaveTextContent(
      'Sample Admin',
    ),
  );
  get.mockRejectedValueOnce(
    new ApiError('Session expired', 'unauthorized', 401),
  );
  act(() => {
    void client.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
  });
  await waitFor(() =>
    expect(router.replace).toHaveBeenCalledExactlyOnceWith('/login'),
  );
  expect(screen.getByLabelText('Stored current user')).toHaveTextContent(
    'empty',
  );
  expect(client.getQueryData(['private-record'])).toBeUndefined();
  expect(client.getQueryData(CURRENT_USER_QUERY_KEY)).toBeNull();
  expect(client.getQueryData(['public-preview'])).toEqual({
    value: 'synthetic-preview',
  });
  expect(toast.error).toHaveBeenCalledExactlyOnceWith(
    'Your session has expired. Please sign in again.',
  );
});
