import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import {
  adminLoginResponseSchema,
  type AdminLoginResponse,
} from '@/features/auth/schemas/adminLoginResponseSchema';

export interface AdminLoginPayload {
  email: string;
  password: string;
}

// Both confirmed MFA branches are validated before changing the screen.
export async function loginAdmin(
  payload: AdminLoginPayload,
  signal?: AbortSignal,
): Promise<AdminLoginResponse> {
  const response = await apiClient.post<unknown>(
    ADMIN_AUTH_ROUTES.login,
    { email: payload.email, password: payload.password },
    { signal },
  );

  const result = adminLoginResponseSchema.safeParse(response.data);
  if (!result.success) {
    throw new ApiError('Unsupported sign-in response.', 'request');
  }
  return result.data;
}
