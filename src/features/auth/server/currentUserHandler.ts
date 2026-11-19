import 'server-only';
import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { backendCurrentUserSchema } from '@/features/auth/schemas/currentUserSchema';
import { getAdminCurrentUser } from './adminAuthTransport';
import {
  authJson,
  authErrorResponse,
  AuthServerError,
} from './authServerError';
import { SESSION_COOKIE, authCookieOptions } from './adminSessionResponse';

export async function handleCurrentUser(request: NextRequest) {
  try {
    const token = z
      .string()
      .min(1)
      .max(3500)
      .regex(/^\S+$/)
      .safeParse(request.cookies.get(SESSION_COOKIE)?.value);
    if (!token.success)
      throw new AuthServerError(
        'Sign in to load your profile.',
        401,
        'unauthorized',
      );
    const body = await getAdminCurrentUser(token.data, request.signal);
    const user = backendCurrentUserSchema.safeParse(body);
    if (!user.success)
      throw new AuthServerError('Invalid profile response.', 502, 'server');
    return authJson({ message: 'success', data: { admin: user.data } });
  } catch (error: unknown) {
    if (error instanceof AuthServerError && error.status === 401) {
      const response = authJson(
        {
          message: 'Your session has expired. Please sign in again.',
          code: 'unauthorized',
        },
        401,
      );
      response.cookies.set(SESSION_COOKIE, '', {
        ...authCookieOptions(),
        maxAge: 0,
      });
      return response;
    }
    return authErrorResponse(error);
  }
}
