import 'server-only';
import { cookies } from 'next/headers';
import { getAuthServerEnv } from '@/config/authServerEnv';
import { SESSION_COOKIE } from '@/features/auth/server/adminSessionResponse';

async function forward(request: Request, path: string[] = []) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token)
    return Response.json(
      { message: 'Authentication required.' },
      { status: 401 },
    );

  let settings: ReturnType<typeof getAuthServerEnv>;
  try {
    settings = getAuthServerEnv();
  } catch {
    return Response.json(
      { message: 'Support API is not configured.' },
      { status: 503 },
    );
  }

  const incoming = new URL(request.url);
  const upstream = new URL(
    `${settings.apiUrl.replace(/\/$/, '')}/admin/support-requests/${path.map(encodeURIComponent).join('/')}`,
  );
  upstream.search = incoming.search;

  const headers = new Headers({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const multipart = request.headers
    .get('content-type')
    ?.startsWith('multipart/form-data');
  const forwardBody = !hasBody
    ? undefined
    : multipart
      ? await request.formData()
      : await request.text();
  if (hasBody && !multipart) headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: forwardBody,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.any([
        request.signal,
        AbortSignal.timeout(settings.timeoutMs),
      ]),
    });
    const contentType =
      response.headers.get('content-type') || 'application/json';
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: { 'Content-Type': contentType },
    });
  } catch {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    return Response.json(
      { message: 'Unable to reach the support service.' },
      { status: 502 },
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  return forward(request, (await context.params).path);
}
export async function POST(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  return forward(request, (await context.params).path);
}
export async function PATCH(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  return forward(request, (await context.params).path);
}
