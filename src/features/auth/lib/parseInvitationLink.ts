import { z } from 'zod';
import { invitationTokenSchema } from '@/features/auth/schemas/invitationSchemas';
import type { AuthAccount } from '@/features/auth/types/authTypes';

export interface InvitationLink {
  token?: string;
  invalidToken: boolean;
  account: AuthAccount;
}

// Next.js has already decoded query parameters; never decode a second time.
// These are display hints only, not backend roles or authorization claims.
export function parseInvitationLink(
  params: Record<string, string | string[] | undefined>,
): InvitationLink {
  const token = params.token ?? params.invite;
  const parsed = invitationTokenSchema.safeParse(token);
  const conflicting =
    !!params.token && !!params.invite && params.token !== params.invite;
  const text = z.string().trim().min(1).max(200);
  const display = (value: unknown) => {
    const result = text.safeParse(value);
    return result.success ? result.data : undefined;
  };
  const email = z.email().max(254).safeParse(params.email);
  return {
    token: parsed.success && !conflicting ? parsed.data : undefined,
    invalidToken: token !== undefined && (!parsed.success || conflicting),
    account: {
      fullName: display(params.fullName),
      email: email.success ? email.data : undefined,
      role: display(params.role),
      invitedBy: display(params.invitedBy),
    },
  };
}
