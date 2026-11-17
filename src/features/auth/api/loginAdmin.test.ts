import { expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/apiClient';
import { loginAdmin } from './loginAdmin';
import { ADMIN_LOGIN_ENROLLMENT_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';

it('uses the supplied login payload and passes cancellation to Axios', async () => {
  const post = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
    data: ADMIN_LOGIN_ENROLLMENT_FIXTURE,
  });
  const controller = new AbortController();
  const payload = {
    email: 'admin@example.com',
    password: 'Password123!',
  };

  try {
    await expect(loginAdmin(payload, controller.signal)).resolves.toEqual(
      ADMIN_LOGIN_ENROLLMENT_FIXTURE,
    );
    expect(post).toHaveBeenCalledWith('/api/admin-auth/login', payload, {
      signal: controller.signal,
    });
  } finally {
    post.mockRestore();
  }
});

it('rejects unsupported or malformed successful responses safely', async () => {
  const post = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
    data: { message: 'success', data: { mfaEnrollmentRequired: false } },
  });
  try {
    await expect(
      loginAdmin({ email: 'admin@example.invalid', password: 'test' }),
    ).rejects.toMatchObject({ message: 'Unsupported sign-in response.' });
  } finally {
    post.mockRestore();
  }
});
