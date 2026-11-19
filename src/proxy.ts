import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, JOB_TAB_PATHS } from '@/constants/routes';
import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';

export function proxy(request: NextRequest) {
  // Only explicit authentication handlers accept POSTs; fixture mutations stay blocked.
  const path = request.nextUrl.pathname;
  const jobSegments = path.startsWith(`${ROUTES.jobs}/`)
    ? path.slice(ROUTES.jobs.length + 1).split('/')
    : [];
  const jobPage =
    !!jobSegments[0] &&
    (jobSegments.length === 1 ||
      (jobSegments.length === 2 &&
        Object.values(JOB_TAB_PATHS).some(
          (tab) => tab && tab === jobSegments[1],
        )));
  const page =
    jobPage ||
    /^\/support\/[^/]+$/.test(path) ||
    /^\/payments\/[^/]+$/.test(path) ||
    /^\/materials\/(?:orders|listings)\/[^/]+$/.test(path) ||
    Object.values(ROUTES).some((route) => path === route) ||
    /^\/customers\/[^/]+(?:\/(?:services|jobs|listed-items|orders|sales|transactions|subscriptions))?$/.test(
      path,
    );
  const asset =
    path.startsWith('/_next/') ||
    path.startsWith('/images/') ||
    path === '/favicon.ico';
  const authPost =
    request.method === 'POST' &&
    path !== ADMIN_AUTH_ROUTES.currentUser &&
    Object.values(ADMIN_AUTH_ROUTES).some((route) => route === path);
  const invitationGet =
    request.method === 'GET' &&
    [ADMIN_AUTH_ROUTES.invitation, ADMIN_AUTH_ROUTES.currentUser].some(
      (route) => route === path,
    );
  const response =
    !authPost &&
    !invitationGet &&
    (!['GET', 'HEAD'].includes(request.method) || (!page && !asset))
      ? NextResponse.json(
          { error: 'Unavailable in Demo Mode.' },
          { status: 403 },
        )
      : NextResponse.next();
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
