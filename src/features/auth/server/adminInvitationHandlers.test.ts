import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';
import {
  handleInvitation,
  handleInvitationPassword,
  handleInvitationSetup,
  handleInvitationActivation,
} from './adminInvitationHandlers';
import { ADMIN_BACKEND_SESSION_FIXTURE } from '@/features/auth/test/adminLoginResponseFixture';
import {
  invitationFixture,
  INVITATION_SETUP_FIXTURE,
} from '@/features/auth/test/adminInvitationFixtures';

const upstream = vi.fn<typeof fetch>();
const origin = 'https://admin.example.invalid';
function request(path = '', body?: unknown, token = 'synthetic-invitation') {
  return new NextRequest(`${origin}/api/admin-auth/invitation${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      origin,
      'Content-Type': 'application/json',
      'X-Invitation-Flow': createHash('sha256').update(token).digest('hex'),
      ...(token ? { cookie: `emilist_admin_invitation=${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
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

it('inspects the token through GET upstream and exchanges it for a bounded private cookie', async () => {
  const fixture = invitationFixture();
  upstream.mockResolvedValueOnce(Response.json(fixture));
  const response = await handleInvitation(
    request('', { token: 'synthetic-invitation' }, ''),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    ...fixture,
    data: {
      ...fixture.data,
      flowId: createHash('sha256').update('synthetic-invitation').digest('hex'),
    },
  });
  expect(upstream).toHaveBeenCalledWith(
    'https://backend.example.invalid/api/v1/admin/onboarding/invitation/synthetic-invitation',
    expect.objectContaining({
      method: 'GET',
      cache: 'no-store',
      body: undefined,
    }),
  );
  const cookie = response.headers.get('set-cookie');
  expect(cookie).toContain('emilist_admin_invitation=synthetic-invitation');
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toContain('Secure');
  expect(cookie).toContain('SameSite=lax');
  expect(cookie).not.toContain('emilist_admin_token=');
  expect(response.headers.get('cache-control')).toContain('no-store');
});

it('resumes invitation inspection from the cookie with no token in the URL', async () => {
  upstream.mockResolvedValueOnce(
    Response.json(invitationFixture('authenticator')),
  );
  expect((await handleInvitation(request())).status).toBe(200);
  expect(upstream).toHaveBeenCalledWith(
    expect.stringContaining('/invitation/synthetic-invitation'),
    expect.anything(),
  );
});

it('rejects missing or expired invitations without granting a session', async () => {
  expect((await handleInvitation(request('', undefined, ''))).status).toBe(400);
  expect(upstream).not.toHaveBeenCalled();
  const expired = invitationFixture();
  expired.data.invitationExpiresAt = new Date(Date.now() - 1000).toISOString();
  upstream.mockResolvedValueOnce(Response.json(expired));
  const response = await handleInvitation(request());
  expect(response.status).toBe(410);
  expect(await response.json()).toMatchObject({ code: 'invitation_expired' });
  expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
});

it('uses only the private invitation token when creating the password', async () => {
  upstream.mockResolvedValueOnce(Response.json(INVITATION_SETUP_FIXTURE));
  const payload = {
    password: 'StrongPassword1!',
    confirmPassword: 'StrongPassword1!',
  };
  const response = await handleInvitationPassword(
    request('/password', payload),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(INVITATION_SETUP_FIXTURE);
  expect(upstream).toHaveBeenCalledWith(
    'https://backend.example.invalid/api/v1/admin/onboarding/password',
    expect.objectContaining({
      body: JSON.stringify({ token: 'synthetic-invitation', ...payload }),
    }),
  );
  expect(response.headers.get('set-cookie')).toBeNull();
});

it('rejects weak, mismatched, or identity-overriding password requests', async () => {
  for (const payload of [
    { password: 'short', confirmPassword: 'short' },
    { password: 'StrongPassword1!', confirmPassword: 'different' },
    {
      password: 'StrongPassword1!',
      confirmPassword: 'StrongPassword1!',
      role: 'super_admin',
    },
  ]) {
    expect(
      (await handleInvitationPassword(request('/password', payload))).status,
    ).toBe(400);
  }
  expect(upstream).not.toHaveBeenCalled();
});

it('resumes authenticator setup through the confirmed endpoint', async () => {
  upstream.mockResolvedValueOnce(Response.json(INVITATION_SETUP_FIXTURE));
  expect((await handleInvitationSetup(request('/setup', {}))).status).toBe(200);
  expect(upstream).toHaveBeenCalledWith(
    'https://backend.example.invalid/api/v1/admin/onboarding/authenticator/setup',
    expect.objectContaining({
      body: JSON.stringify({ token: 'synthetic-invitation' }),
    }),
  );
});

it('activates with the correct token purpose, sets the final cookie, and consumes the invitation cookie', async () => {
  upstream.mockResolvedValueOnce(Response.json(ADMIN_BACKEND_SESSION_FIXTURE));
  const response = await handleInvitationActivation(
    request('/activate', { code: '012345' }),
  );
  expect(response.status).toBe(200);
  const result = await response.json();
  expect(JSON.stringify(result)).not.toContain('synthetic-access-token');
  expect(upstream).toHaveBeenCalledWith(
    'https://backend.example.invalid/api/v1/admin/onboarding/authenticator/activate',
    expect.objectContaining({
      body: JSON.stringify({ token: 'synthetic-invitation', code: '012345' }),
    }),
  );
  const cookie = response.headers.get('set-cookie');
  expect(cookie).toContain('emilist_admin_token=synthetic-access-token');
  expect(cookie).toContain('Max-Age=604800');
  expect(cookie).toContain('emilist_admin_invitation=;');
  expect(cookie).toContain('Max-Age=0');
  expect(cookie).toContain('HttpOnly');
});

it('never sets a final token for failed or malformed activation responses', async () => {
  upstream.mockResolvedValueOnce(
    Response.json({ message: 'Invalid authenticator code' }, { status: 400 }),
  );
  const rejected = await handleInvitationActivation(
    request('/activate', { code: '123456' }),
  );
  expect(await rejected.json()).toMatchObject({ code: 'invalid_code' });
  expect(rejected.headers.get('set-cookie')).toBeNull();
  upstream.mockResolvedValueOnce(
    Response.json({ message: 'success', data: {} }),
  );
  const malformed = await handleInvitationActivation(
    request('/activate', { code: '123456' }),
  );
  expect(malformed.status).toBe(502);
  expect(malformed.headers.get('set-cookie')).toBeNull();
});

it('rejects a stale tab when another invitation replaces the browser cookie', async () => {
  const input = request(
    '/password',
    {
      password: 'StrongPassword1!',
      confirmPassword: 'StrongPassword1!',
    },
    'different-invitation',
  );
  input.headers.set(
    'x-invitation-flow',
    createHash('sha256').update('original-invitation').digest('hex'),
  );
  const response = await handleInvitationPassword(input);
  expect(response.status).toBe(409);
  expect(await response.json()).toMatchObject({ code: 'invitation_changed' });
  expect(upstream).not.toHaveBeenCalled();
});
