import 'server-only';
import { getAuthServerEnv } from '@/config/authServerEnv';
import { ADMIN_AUTH_ENDPOINTS } from '@/config/adminAuth';
import { AuthServerError, backendAuthError } from './authServerError';

type FixedAuthEndpoint =
  (typeof ADMIN_AUTH_ENDPOINTS)[keyof typeof ADMIN_AUTH_ENDPOINTS];

type AuthEndpoint =
  FixedAuthEndpoint | `${typeof ADMIN_AUTH_ENDPOINTS.invitation}/${string}`;

export function postAdminAuth(
  endpoint: FixedAuthEndpoint,
  payload: unknown,
  signal: AbortSignal,
) {
  return requestAdminAuth(endpoint, 'POST', payload, signal);
}

export function getAdminInvitation(token: string, signal: AbortSignal) {
  return requestAdminAuth(
    `${ADMIN_AUTH_ENDPOINTS.invitation}/${encodeURIComponent(token)}`,
    'GET',
    undefined,
    signal,
  );
}

export function getAdminCurrentUser(token: string, signal: AbortSignal) {
  return requestAdminAuth(
    ADMIN_AUTH_ENDPOINTS.currentUser,
    'GET',
    undefined,
    signal,
    token,
  );
}

async function requestAdminAuth(
  endpoint: AuthEndpoint,
  method: 'GET' | 'POST',
  payload: unknown,
  signal: AbortSignal,
  bearerToken?: string,
): Promise<unknown> {
  let settings: ReturnType<typeof getAuthServerEnv>;
  try {
    settings = getAuthServerEnv();
  } catch {
    throw new AuthServerError(
      'Authentication is not configured.',
      503,
      'configuration',
    );
  }
  const upstreamSignal = AbortSignal.any([
    signal,
    AbortSignal.timeout(settings.timeoutMs),
  ]);
  let response: Response;
  try {
    response = await fetch(`${settings.apiUrl.replace(/\/$/, '')}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      },
      body: method === 'POST' ? JSON.stringify(payload) : undefined,
      cache: 'no-store',
      redirect: 'error',
      signal: upstreamSignal,
    });
  } catch {
    if (signal.aborted)
      throw new AuthServerError('Request cancelled.', 499, 'cancelled');
    if (upstreamSignal.aborted)
      throw new AuthServerError(
        'Authentication timed out. Please retry.',
        504,
        'timeout',
      );
    throw new AuthServerError(
      'Unable to reach authentication. Please retry.',
      502,
      'network',
    );
  }
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new AuthServerError(
      'Invalid authentication response.',
      502,
      'server',
    );
  }
  const failed =
    body &&
    typeof body === 'object' &&
    'status' in body &&
    body.status === 'fail';
  if (!response.ok || failed) throw backendAuthError(body, response.status);
  return body;
}
