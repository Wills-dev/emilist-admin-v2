import 'server-only';
import { ADMIN_AUTH_ENDPOINTS } from '@/config/adminAuth';
import { adminLoginResponseSchema } from '@/features/auth/schemas/adminLoginResponseSchema';
import { backendAdminSessionSchema } from '@/features/auth/schemas/adminSessionSchema';
import {
  adminLoginRequestSchema,
  adminVerificationRequestSchema,
} from '@/features/auth/schemas/adminAuthRequestSchema';
import { readAuthRequest } from './readAuthRequest';
import { postAdminAuth } from './adminAuthTransport';
import {
  authJson,
  authErrorResponse,
  AuthServerError,
} from './authServerError';

const SESSION_COOKIE = 'emilist_admin_token';
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
});

export async function handleAdminLogin(request: Request) {
  try {
    const input = adminLoginRequestSchema.safeParse(
      await readAuthRequest(request),
    );
    if (!input.success)
      throw new AuthServerError(
        'Enter a valid email and password.',
        400,
        'request',
      );
    const body = await postAdminAuth(
      ADMIN_AUTH_ENDPOINTS.login,
      input.data,
      request.signal,
    );
    const result = adminLoginResponseSchema.safeParse(body);
    if (!result.success)
      throw new AuthServerError('Invalid sign-in response.', 502, 'server');
    return authJson(result.data);
  } catch (error: unknown) {
    return authErrorResponse(error);
  }
}

export async function handleAdminVerification(request: Request) {
  try {
    const input = adminVerificationRequestSchema.safeParse(
      await readAuthRequest(request),
    );
    if (!input.success)
      throw new AuthServerError(
        'Enter a valid six-digit code and challenge.',
        400,
        'request',
      );
    const { mode, flowToken, code } = input.data;
    const enrollment = mode === 'enroll';
    const body = await postAdminAuth(
      enrollment
        ? ADMIN_AUTH_ENDPOINTS.enrollMfa
        : ADMIN_AUTH_ENDPOINTS.verifyMfa,
      enrollment
        ? { enrollmentToken: flowToken, code }
        : { challengeToken: flowToken, code },
      request.signal,
    );
    const session = backendAdminSessionSchema.safeParse(body);
    if (!session.success)
      throw new AuthServerError(
        'Invalid verification response.',
        502,
        'server',
      );
    const response = authJson({
      message: 'success',
      data: { admin: session.data.data.admin },
    });
    response.cookies.set(SESSION_COOKIE, session.data.data.token, {
      ...cookieOptions(),
      maxAge: SEVEN_DAYS_SECONDS,
    });
    return response;
  } catch (error: unknown) {
    return authErrorResponse(error);
  }
}

export async function handleAdminLogout(request: Request) {
  try {
    await readAuthRequest(request);
    const response = authJson({ message: 'success' });
    response.cookies.set(SESSION_COOKIE, '', { ...cookieOptions(), maxAge: 0 });
    return response;
  } catch (error: unknown) {
    return authErrorResponse(error);
  }
}
