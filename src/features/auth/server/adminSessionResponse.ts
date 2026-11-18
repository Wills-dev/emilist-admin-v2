import 'server-only';
import { backendAdminSessionSchema } from '@/features/auth/schemas/adminSessionSchema';
import { authJson, AuthServerError } from './authServerError';

export const SESSION_COOKIE = 'emilist_admin_token';
export const INVITATION_COOKIE = 'emilist_admin_invitation';
export const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
});

export function createAdminSessionResponse(body: unknown) {
  const session = backendAdminSessionSchema.safeParse(body);
  if (!session.success)
    throw new AuthServerError('Invalid verification response.', 502, 'server');
  const response = authJson({
    message: 'success',
    data: { admin: session.data.data.admin },
  });
  response.cookies.set(SESSION_COOKIE, session.data.data.token, {
    ...authCookieOptions(),
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
