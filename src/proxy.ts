import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, JOB_TAB_PATHS } from '@/constants/routes';

export function proxy(request: NextRequest) {
  // Demo builds have no mutation transport, API routes, server actions or downloads.
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
    Object.values(ROUTES).some((route) => path === route) ||
    /^\/customers\/[^/]+(?:\/(?:services|jobs|listed-items|orders|sales|transactions|subscriptions))?$/.test(
      path,
    );
  const asset =
    path.startsWith('/_next/') ||
    path.startsWith('/images/') ||
    path === '/favicon.ico';
  const response =
    !['GET', 'HEAD'].includes(request.method) || (!page && !asset)
      ? NextResponse.json(
          { error: 'Unavailable in Demo Mode.' },
          { status: 403 },
        )
      : NextResponse.next();
  if (process.env.NODE_ENV === 'production')
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; object-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'self'",
    );
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
