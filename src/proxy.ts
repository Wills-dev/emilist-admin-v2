import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from '@/constants/routes';
import { SESSION_COOKIE } from '@/features/auth/server/adminSessionResponse';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPages: string[] = [
    ROUTES.login,
    ROUTES.loginVerify,
    ROUTES.acceptInvite,
    ROUTES.invitePassword,
    ROUTES.inviteAuthenticator,
    ROUTES.forgotPassword,
    ROUTES.resetLinkStatus,
    ROUTES.resetVerify,
    ROUTES.resetPassword,
  ];
  const pageRequest =
    request.method === 'GET' &&
    !path.startsWith('/api/') &&
    !path.startsWith('/_next/') &&
    !path.startsWith('/images/') &&
    path !== '/favicon.ico';
  let response: NextResponse;
  if (
    !pageRequest ||
    publicPages.includes(path) ||
    path.startsWith('/api/admin-auth/')
  ) {
    response = NextResponse.next();
  } else if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const login = request.nextUrl.clone();
    login.pathname = ROUTES.login;
    login.search = `?returnTo=${encodeURIComponent(path)}`;
    response = NextResponse.redirect(login);
  } else {
    response = NextResponse.next();
  }
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "connect-src 'self'",
        "img-src 'self' data:",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "worker-src 'none'",
        "form-action 'none'",
        "base-uri 'self'",
      ].join('; '),
    );
  }
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
