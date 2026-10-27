export type AuthVariant = 'login' | 'signup' | 'forgotPassword';

// Internal display model. Populate only from a validated backend invitation/session.
export interface AuthAccount {
  fullName?: string;
  email?: string;
  role?: string;
  invitedBy?: string;
}
