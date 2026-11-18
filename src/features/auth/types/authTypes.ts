export type AuthVariant = 'login' | 'signup' | 'forgotPassword';

// Internal display model. Invitation URL hints never establish permissions.
export interface AuthAccount {
  fullName?: string;
  email?: string;
  role?: string;
  invitedBy?: string;
}
