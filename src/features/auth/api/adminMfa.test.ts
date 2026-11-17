import { expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/api/apiClient';
import { enrollAdminMfa, verifyAdminMfa } from './adminMfa';
import { ADMIN_MFA_RESPONSE_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';

it('sends the confirmed MFA payloads and cancellation signals', async () => {
  const post = vi
    .spyOn(apiClient, 'post')
    .mockResolvedValue({ data: ADMIN_MFA_RESPONSE_FIXTURE });
  const { signal } = new AbortController();
  try {
    await enrollAdminMfa(
      { enrollmentToken: 'test-enrollment', code: '012345' },
      signal,
    );
    await verifyAdminMfa(
      { challengeToken: 'test-challenge', code: '012345' },
      signal,
    );
    expect(post).toHaveBeenNthCalledWith(
      1,
      '/api/admin-auth/verify',
      {
        mode: 'enroll',
        flowToken: 'test-enrollment',
        code: '012345',
      },
      { signal },
    );
    expect(post).toHaveBeenNthCalledWith(
      2,
      '/api/admin-auth/verify',
      {
        mode: 'login',
        flowToken: 'test-challenge',
        code: '012345',
      },
      { signal },
    );
  } finally {
    post.mockRestore();
  }
});
