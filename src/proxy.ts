import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from '@/constants/routes';

export function proxy(request: NextRequest) {
  if (process.env.EMILIST_BUILD_TARGET !== 'demo') return NextResponse.next();
  // Demo builds have no mutation transport, API routes, server actions or downloads.
  const path = request.nextUrl.pathname;
  const page =
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
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; object-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'self'",
  );
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
