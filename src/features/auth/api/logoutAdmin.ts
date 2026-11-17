import { z } from 'zod';
import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';

export async function logoutAdmin(): Promise<void> {
  const response = await apiClient.post<unknown>(ADMIN_AUTH_ROUTES.logout, {});
  if (
    !z.object({ message: z.literal('success') }).safeParse(response.data)
      .success
  ) {
    throw new ApiError('Unable to sign out. Please retry.', 'server');
  }
}
