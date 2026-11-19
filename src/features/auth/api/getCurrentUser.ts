import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import { adminVerificationResponseSchema } from '@/features/auth/schemas/adminSessionSchema';
import type { CurrentUser } from '@/features/auth/schemas/currentUserSchema';

export async function getCurrentUser(
  signal?: AbortSignal,
): Promise<CurrentUser> {
  const response = await apiClient.get<unknown>(ADMIN_AUTH_ROUTES.currentUser, {
    signal,
  });
  const result = adminVerificationResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiError('Unable to read your profile.', 'server');
  return result.data.data.admin;
}
