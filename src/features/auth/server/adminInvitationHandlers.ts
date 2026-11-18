import 'server-only';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { ADMIN_AUTH_ENDPOINTS } from '@/config/adminAuth';
import {
  invitationTokenSchema,
  backendInvitationResponseSchema,
  invitationPasswordSchema,
  invitationSetupResponseSchema,
} from '@/features/auth/schemas/invitationSchemas';
import { otpSchema } from '@/features/auth/schemas/authSchemas';
import { readAuthRequest } from './readAuthRequest';
import { getAdminInvitation, postAdminAuth } from './adminAuthTransport';
import {
  authJson,
  authErrorResponse,
  AuthServerError,
} from './authServerError';
import {
  INVITATION_COOKIE,
  authCookieOptions,
  createAdminSessionResponse,
} from './adminSessionResponse';

function flowId(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function invitationToken(request: NextRequest, requireBinding = true) {
  const token = invitationTokenSchema.safeParse(
    request.cookies.get(INVITATION_COOKIE)?.value,
  );
  if (!token.success)
    throw new AuthServerError(
      'Open the invitation link sent by your administrator to continue.',
      400,
      'invitation_missing',
    );
  if (
    requireBinding &&
    request.headers.get('x-invitation-flow') !== flowId(token.data)
  ) {
    throw new AuthServerError(
      'A different invitation is open in this browser. Reopen your original invitation link.',
      409,
      'invitation_changed',
    );
  }
  return token.data;
}

function invitationError(error: unknown) {
  const response = authErrorResponse(error);
  if (error instanceof AuthServerError && error.code === 'invitation_expired') {
    response.cookies.set(INVITATION_COOKIE, '', {
      ...authCookieOptions(),
      maxAge: 0,
    });
  }
  return response;
}

export async function handleInvitation(request: NextRequest) {
  try {
    const initial = request.method === 'POST';
    let token: string;
    if (initial) {
      const input = z
        .object({ token: invitationTokenSchema })
        .strict()
        .safeParse(await readAuthRequest(request));
      if (!input.success)
        throw new AuthServerError('Invalid invitation link.', 400, 'request');
      token = input.data.token;
    } else token = invitationToken(request, false);
    const body = await getAdminInvitation(token, request.signal);
    const result = backendInvitationResponseSchema.safeParse(body);
    if (!result.success)
      throw new AuthServerError('Invalid invitation response.', 502, 'server');
    const remaining = Math.min(
      48 * 60 * 60,
      Math.floor(
        (Date.parse(result.data.data.invitationExpiresAt) - Date.now()) / 1000,
      ),
    );
    if (remaining <= 0)
      throw new AuthServerError(
        'This invitation has expired. Ask your inviter for a new link.',
        410,
        'invitation_expired',
      );
    const response = authJson({
      ...result.data,
      data: { ...result.data.data, flowId: flowId(token) },
    });
    if (initial)
      response.cookies.set(INVITATION_COOKIE, token, {
        ...authCookieOptions(),
        maxAge: remaining,
      });
    return response;
  } catch (error: unknown) {
    return invitationError(error);
  }
}

export async function handleInvitationPassword(request: NextRequest) {
  try {
    const input = invitationPasswordSchema.safeParse(
      await readAuthRequest(request),
    );
    if (!input.success)
      throw new AuthServerError(
        'Check the password requirements and confirmation.',
        400,
        'request',
      );
    const token = invitationToken(request);
    const body = await postAdminAuth(
      ADMIN_AUTH_ENDPOINTS.invitationPassword,
      { token, ...input.data },
      request.signal,
    );
    const result = invitationSetupResponseSchema.safeParse(body);
    if (!result.success)
      throw new AuthServerError(
        'Invalid authenticator setup response.',
        502,
        'server',
      );
    return authJson(result.data);
  } catch (error: unknown) {
    return invitationError(error);
  }
}

export async function handleInvitationSetup(request: NextRequest) {
  try {
    const input = z
      .object({})
      .strict()
      .safeParse(await readAuthRequest(request));
    if (!input.success)
      throw new AuthServerError('Invalid setup request.', 400, 'request');
    const body = await postAdminAuth(
      ADMIN_AUTH_ENDPOINTS.invitationSetup,
      { token: invitationToken(request) },
      request.signal,
    );
    const result = invitationSetupResponseSchema.safeParse(body);
    if (!result.success)
      throw new AuthServerError(
        'Invalid authenticator setup response.',
        502,
        'server',
      );
    return authJson(result.data);
  } catch (error: unknown) {
    return invitationError(error);
  }
}

export async function handleInvitationActivation(request: NextRequest) {
  try {
    const input = z
      .object({ code: otpSchema })
      .strict()
      .safeParse(await readAuthRequest(request));
    if (!input.success)
      throw new AuthServerError('Enter all six digits.', 400, 'request');
    const body = await postAdminAuth(
      ADMIN_AUTH_ENDPOINTS.invitationActivate,
      { token: invitationToken(request), code: input.data.code },
      request.signal,
    );
    const response = createAdminSessionResponse(body);
    response.cookies.set(INVITATION_COOKIE, '', {
      ...authCookieOptions(),
      maxAge: 0,
    });
    return response;
  } catch (error: unknown) {
    return invitationError(error);
  }
}
