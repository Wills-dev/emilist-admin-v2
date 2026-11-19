import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { NextRequest } from 'next/server';
import { handleCurrentUser } from './currentUserHandler';
import { AUTHENTICATED_ADMIN_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';

const upstream = vi.fn<typeof fetch>();
function request(token?: string) {
  return new NextRequest(
    'https://admin.example.invalid/api/admin-auth/current-user',
    {
      headers: {
        ...(token ? { cookie: `emilist_admin_token=${token}` } : {}),
        authorization: 'Bearer untrusted-browser-header',
      },
    },
  );
}
beforeEach(() => {
  vi.stubGlobal('fetch', upstream);
  vi.stubEnv('EMILIST_API_URL', 'https://backend.example.invalid/api/v1');
  vi.stubEnv('NODE_ENV', 'production');
  upstream.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it.each([
  AUTHENTICATED_ADMIN_FIXTURE,
  { admin: AUTHENTICATED_ADMIN_FIXTURE, token: 'unexpected-backend-token' },
])(
  'validates the server cookie upstream and returns only a safe user object',
  async (data) => {
    upstream.mockResolvedValueOnce(Response.json({ message: 'success', data }));
    const response = await handleCurrentUser(
      request('synthetic-session-token'),
    );
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toEqual({
      message: 'success',
      data: { admin: AUTHENTICATED_ADMIN_FIXTURE },
    });
    expect(JSON.stringify(result)).not.toContain('token');
    expect(upstream).toHaveBeenCalledWith(
      'https://backend.example.invalid/api/v1/admin/current-user',
      expect.objectContaining({
        method: 'GET',
        body: undefined,
        cache: 'no-store',
        redirect: 'error',
        headers: expect.objectContaining({
          Authorization: 'Bearer synthetic-session-token',
        }),
      }),
    );
    expect(response.headers.get('authorization')).toBeNull();
    expect(response.headers.get('cache-control')).toContain('no-store');
  },
);

it('rejects a missing session without contacting the backend', async () => {
  const response = await handleCurrentUser(request());
  expect(response.status).toBe(401);
  expect(upstream).not.toHaveBeenCalled();
});

it('clears an expired cookie only after authoritative session rejection', async () => {
  upstream.mockResolvedValueOnce(
    Response.json({ message: 'Kindly login' }, { status: 401 }),
  );
  const response = await handleCurrentUser(request('expired-session'));
  expect(response.status).toBe(401);
  expect(await response.json()).toMatchObject({ code: 'unauthorized' });
  expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  expect(response.headers.get('set-cookie')).toContain('HttpOnly');
});

it('fails closed for an unknown current-user contract without clearing a valid cookie', async () => {
  upstream.mockResolvedValueOnce(
    Response.json({ message: 'success', data: { fullName: 'Unknown' } }),
  );
  const response = await handleCurrentUser(request('synthetic-session-token'));
  expect(response.status).toBe(502);
  expect(response.headers.get('set-cookie')).toBeNull();
});
