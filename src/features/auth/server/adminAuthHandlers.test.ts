import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import {
  handleAdminLogin,
  handleAdminVerification,
  handleAdminLogout,
} from './adminAuthHandlers';
import {
  ADMIN_LOGIN_CHALLENGE_FIXTURE,
  ADMIN_LOGIN_ENROLLMENT_FIXTURE,
  ADMIN_BACKEND_SESSION_FIXTURE,
} from '@/features/auth/test/adminLoginResponseFixture';

const upstream = vi.fn<typeof fetch>();
const origin = 'https://admin.example.invalid';
function request(path: string, body: unknown, from = origin) {
  return new Request(`${origin}/api/admin-auth/${path}`, {
    method: 'POST',
    headers: { origin: from, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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

it.each([ADMIN_LOGIN_CHALLENGE_FIXTURE, ADMIN_LOGIN_ENROLLMENT_FIXTURE])(
  'returns a validated intermediate login response without setting a session',
  async (fixture) => {
    upstream.mockResolvedValueOnce(Response.json(fixture));
    const response = await handleAdminLogin(
      request('login', {
        email: 'admin@example.invalid',
        password: 'test-password',
      }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(fixture);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(upstream).toHaveBeenCalledWith(
      'https://backend.example.invalid/api/v1/admin/login',
      expect.objectContaining({ cache: 'no-store', redirect: 'error' }),
    );
  },
);

it.each([
  ['login', '/admin/login/mfa', 'challengeToken'],
  ['enroll', '/admin/login/mfa/enroll', 'enrollmentToken'],
] as const)(
  'sets a private seven-day cookie after valid %s verification',
  async (mode, path, key) => {
    upstream.mockResolvedValueOnce(
      Response.json(ADMIN_BACKEND_SESSION_FIXTURE),
    );
    const response = await handleAdminVerification(
      request('verify', {
        mode,
        flowToken: 'synthetic-flow-token',
        code: '012345',
      }),
    );
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toEqual({
      message: 'success',
      data: {
        admin: ADMIN_BACKEND_SESSION_FIXTURE.data.admin,
      },
    });
    expect(JSON.stringify(result)).not.toContain('synthetic-access-token');
    const cookie = response.headers.get('set-cookie');
    expect(cookie).toContain('emilist_admin_token=synthetic-access-token');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('Max-Age=604800');
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(upstream).toHaveBeenCalledWith(
      `https://backend.example.invalid/api/v1${path}`,
      expect.objectContaining({
        body: JSON.stringify({ [key]: 'synthetic-flow-token', code: '012345' }),
      }),
    );
  },
);

it('rejects cross-origin requests and invalid flow payloads before transport', async () => {
  const crossOrigin = await handleAdminVerification(
    request('verify', {}, 'https://other.invalid'),
  );
  expect(crossOrigin.status).toBe(403);
  for (const body of [
    { mode: 'unknown', flowToken: 'test', code: '123456' },
    { mode: 'login', flowToken: 'test', code: '12345' },
    { mode: 'login', flowToken: 'test', code: 123456 },
    { mode: 'login', challengeToken: 'test', code: '123456' },
  ]) {
    expect(
      (await handleAdminVerification(request('verify', body))).status,
    ).toBe(400);
  }
  expect(upstream).not.toHaveBeenCalled();
});

it('rejects oversized and non-JSON requests before transport', async () => {
  const response = await handleAdminLogin(
    request('login', { email: 'a'.repeat(9000) }),
  );
  expect(response.status).toBe(413);
  const badType = new Request(`${origin}/api/admin-auth/login`, {
    method: 'POST',
    headers: { origin, 'Content-Type': 'text/plain' },
    body: '{}',
  });
  expect((await handleAdminLogin(badType)).status).toBe(415);
  expect(upstream).not.toHaveBeenCalled();
});

it.each([
  { message: 'success', data: {} },
  {
    ...ADMIN_BACKEND_SESSION_FIXTURE,
    data: {
      ...ADMIN_BACKEND_SESSION_FIXTURE.data,
      admin: {
        ...ADMIN_BACKEND_SESSION_FIXTURE.data.admin,
        mfaEnabled: false,
      },
    },
  },
])(
  'never sets a cookie for an incomplete or invalid session response',
  async (body) => {
    upstream.mockResolvedValueOnce(Response.json(body));
    const response = await handleAdminVerification(
      request('verify', {
        mode: 'login',
        flowToken: 'test',
        code: '123456',
      }),
    );
    expect(response.status).toBe(502);
    expect(response.headers.get('set-cookie')).toBeNull();
  },
);

it.each([
  [{ message: 'Challenge expired, please sign in again' }, 'flow_expired'],
  [{ message: 'Invalid authenticator code' }, 'invalid_code'],
  [
    { code: 400, status: 'fail', message: 'Invalid sign-in challenge' },
    'flow_expired',
  ],
  [{ errors: ['sensitive code value and secret'] }, 'request'],
  [{ message: 'Kindly login' }, 'request'],
])(
  'normalizes the supplied backend error formats without leaking values',
  async (body, code) => {
    upstream.mockResolvedValueOnce(Response.json(body, { status: 400 }));
    const response = await handleAdminVerification(
      request('verify', {
        mode: 'login',
        flowToken: 'test',
        code: '123456',
      }),
    );
    const result = await response.json();
    expect(result.code).toBe(code);
    expect(JSON.stringify(result)).not.toContain('sensitive');
    expect(response.headers.get('set-cookie')).toBeNull();
  },
);

it('fails closed when the private backend configuration is missing', async () => {
  vi.stubEnv('EMILIST_API_URL', '');
  const response = await handleAdminLogin(
    request('login', {
      email: 'admin@example.invalid',
      password: 'test-password',
    }),
  );
  expect(response.status).toBe(503);
  expect(upstream).not.toHaveBeenCalled();
});

it('clears the host-only session cookie on local logout without upstream requests', async () => {
  const response = await handleAdminLogout(request('logout', {}));
  expect(response.status).toBe(200);
  expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  expect(upstream).not.toHaveBeenCalled();
});

it('accepts the browser Host when Next normalizes the internal request URL', async () => {
  const response = await handleAdminLogout(
    new Request('http://localhost:4317/api/admin-auth/logout', {
      method: 'POST',
      body: '{}',
      headers: {
        host: '127.0.0.1:4317',
        origin: 'http://127.0.0.1:4317',
        'Content-Type': 'application/json',
      },
    }),
  );
  expect(response.status).toBe(200);
  expect(upstream).not.toHaveBeenCalled();
});
