import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import {
  adminVerificationResponseSchema,
  type AdminVerificationResponse,
} from '@/features/auth/schemas/adminSessionSchema';

export interface AdminMfaEnrollmentPayload {
  enrollmentToken: string;
  code: string;
}
export interface AdminMfaChallengePayload {
  challengeToken: string;
  code: string;
}

async function submitVerification(
  mode: 'login' | 'enroll',
  flowToken: string,
  code: string,
  signal?: AbortSignal,
): Promise<AdminVerificationResponse> {
  const response = await apiClient.post<unknown>(
    ADMIN_AUTH_ROUTES.verify,
    { mode, flowToken, code },
    { signal },
  );
  const result = adminVerificationResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiError('Invalid verification response.', 'server');
  return result.data;
}

export function enrollAdminMfa(
  payload: AdminMfaEnrollmentPayload,
  signal?: AbortSignal,
) {
  return submitVerification(
    'enroll',
    payload.enrollmentToken,
    payload.code,
    signal,
  );
}

export function verifyAdminMfa(
  payload: AdminMfaChallengePayload,
  signal?: AbortSignal,
) {
  return submitVerification(
    'login',
    payload.challengeToken,
    payload.code,
    signal,
  );
}
