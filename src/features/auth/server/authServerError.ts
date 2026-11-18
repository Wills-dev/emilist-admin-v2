import 'server-only';
import { NextResponse } from 'next/server';

export class AuthServerError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
  }
}

export function authJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthServerError) {
    return authJson({ message: error.message, code: error.code }, error.status);
  }
  return authJson(
    { message: 'Sign-in is temporarily unavailable.', code: 'server' },
    502,
  );
}

export function backendAuthError(body: unknown, status: number) {
  const record = body && typeof body === 'object' ? body : {};
  const message =
    'message' in record && typeof record.message === 'string'
      ? record.message.toLowerCase()
      : '';
  if (
    message === 'invitation has expired. ask a super admin to send a new one' ||
    status === 410
  ) {
    return new AuthServerError(
      'This invitation has expired. Ask your inviter for a new link.',
      410,
      'invitation_expired',
    );
  }
  if (
    [
      'challenge expired, please sign in again',
      'invalid challenge token',
      'invalid sign-in challenge',
      'invalid authenticator enrollment challenge',
    ].includes(message)
  ) {
    return new AuthServerError(
      'Your sign-in challenge expired. Please sign in again.',
      401,
      'flow_expired',
    );
  }
  if (message === 'invalid authenticator code') {
    return new AuthServerError(
      'Invalid authenticator code. Please try the current code.',
      422,
      'invalid_code',
    );
  }
  if (status === 401 || message === 'invalid credentials') {
    return new AuthServerError(
      'Sign-in was rejected. Check your credentials.',
      401,
      'unauthorized',
    );
  }
  if (
    status === 403 ||
    [
      'account onboarding is incomplete',
      'admin account is not active',
    ].includes(message)
  ) {
    return new AuthServerError(
      'This account is not available for admin sign-in.',
      403,
      'forbidden',
    );
  }
  return new AuthServerError(
    'The authentication request could not be completed.',
    status >= 500 ? 502 : 400,
    status >= 500 ? 'server' : 'request',
  );
}
