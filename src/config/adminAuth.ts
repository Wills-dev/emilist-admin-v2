// Confirmed public authentication endpoints; administrative APIs stay blocked.
export const ADMIN_AUTH_ENDPOINTS = {
  login: '/admin/login',
  enrollMfa: '/admin/login/mfa/enroll',
  verifyMfa: '/admin/login/mfa',
} as const;

// Browser-facing handlers; final bearer tokens never cross this boundary.
export const ADMIN_AUTH_ROUTES = {
  login: '/api/admin-auth/login',
  verify: '/api/admin-auth/verify',
  logout: '/api/admin-auth/logout',
} as const;
