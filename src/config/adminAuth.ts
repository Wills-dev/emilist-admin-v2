// Confirmed public authentication endpoints; administrative APIs stay blocked.
export const ADMIN_AUTH_ENDPOINTS = {
  login: '/admin/login',
  enrollMfa: '/admin/login/mfa/enroll',
  verifyMfa: '/admin/login/mfa',
  invitation: '/admin/onboarding/invitation',
  invitationPassword: '/admin/onboarding/password',
  invitationSetup: '/admin/onboarding/authenticator/setup',
  invitationActivate: '/admin/onboarding/authenticator/activate',
} as const;

// Browser-facing handlers; final bearer tokens never cross this boundary.
export const ADMIN_AUTH_ROUTES = {
  login: '/api/admin-auth/login',
  verify: '/api/admin-auth/verify',
  logout: '/api/admin-auth/logout',
  invitation: '/api/admin-auth/invitation',
  invitationPassword: '/api/admin-auth/invitation/password',
  invitationSetup: '/api/admin-auth/invitation/setup',
  invitationActivate: '/api/admin-auth/invitation/activate',
} as const;
