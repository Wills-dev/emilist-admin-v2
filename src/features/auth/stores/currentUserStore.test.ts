import { expect, it } from 'vitest';
import { createCurrentUserStore } from './currentUserStore';
import { authenticatedAdminSchema } from '@/features/auth/schemas/adminSessionSchema';
import { AUTHENTICATED_ADMIN_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';

it('isolates identity snapshots between providers and query-cache objects', () => {
  const first = createCurrentUserStore();
  const second = createCurrentUserStore();
  const user = authenticatedAdminSchema.parse(AUTHENTICATED_ADMIN_FIXTURE);
  first.getState().setUser(user);
  user.fullName = 'Changed in query cache';
  expect(first.getState().user?.fullName).toBe('Sample Admin');
  expect(second.getState().user).toBeNull();
  expect(localStorage.length + sessionStorage.length).toBe(0);
  first.getState().clearUser();
  expect(first.getState().user).toBeNull();
});
