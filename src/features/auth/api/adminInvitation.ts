import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';
import {
  invitationResponseSchema,
  invitationSetupResponseSchema,
  type InvitationPasswordPayload,
} from '@/features/auth/schemas/invitationSchemas';
import { adminVerificationResponseSchema } from '@/features/auth/schemas/adminSessionSchema';

export async function inspectInvitation(token?: string, signal?: AbortSignal) {
  const response = token
    ? await apiClient.post<unknown>(
        ADMIN_AUTH_ROUTES.invitation,
        { token },
        { signal },
      )
    : await apiClient.get<unknown>(ADMIN_AUTH_ROUTES.invitation, { signal });
  const result = invitationResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiError('Unable to verify this invitation.', 'server');
  return result.data;
}

export async function createInvitationPassword(
  payload: InvitationPasswordPayload,
  flowId: string,
  signal?: AbortSignal,
) {
  const response = await apiClient.post<unknown>(
    ADMIN_AUTH_ROUTES.invitationPassword,
    { password: payload.password, confirmPassword: payload.confirmPassword },
    { signal, headers: { 'X-Invitation-Flow': flowId } },
  );
  const result = invitationSetupResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiError('Unable to load authenticator setup.', 'server');
  return result.data;
}

export async function resumeInvitationSetup(
  flowId: string,
  signal?: AbortSignal,
) {
  const response = await apiClient.post<unknown>(
    ADMIN_AUTH_ROUTES.invitationSetup,
    {},
    { signal, headers: { 'X-Invitation-Flow': flowId } },
  );
  const result = invitationSetupResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiError('Unable to load authenticator setup.', 'server');
  return result.data;
}

export async function activateInvitation(
  code: string,
  flowId: string,
  signal?: AbortSignal,
) {
  const response = await apiClient.post<unknown>(
    ADMIN_AUTH_ROUTES.invitationActivate,
    { code },
    { signal, headers: { 'X-Invitation-Flow': flowId } },
  );
  const result = adminVerificationResponseSchema.safeParse(response.data);
  if (!result.success)
    throw new ApiError('Invalid activation response.', 'server');
  return result.data;
}
