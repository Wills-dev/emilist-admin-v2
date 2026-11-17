// Synthetic, non-functional credentials used only by automated tests.
export const ADMIN_LOGIN_ENROLLMENT_FIXTURE = {
  message: 'success',
  data: {
    mfaEnrollmentRequired: true,
    enrollmentToken: 'synthetic-enrollment-token',
    authenticator: {
      secret: 'JBSWY3DPEHPK3PXP',
      otpauthUri:
        'otpauth://totp/Example:admin@example.invalid?secret=JBSWY3DPEHPK3PXP',
      issuer: 'Example',
      accountName: 'admin@example.invalid',
    },
  },
} as const;

export const ADMIN_LOGIN_CHALLENGE_FIXTURE = {
  message: 'success',
  data: { mfaRequired: true, challengeToken: 'synthetic-challenge-token' },
} as const;

export const AUTHENTICATED_ADMIN_FIXTURE = {
  id: 'synthetic-admin',
  fullName: 'Sample Admin',
  email: 'admin@example.invalid',
  mobile: null,
  profileImage: null,
  department: 'Operations',
  jobTitle: 'Manager',
  permissions: [],
  role: 'admin',
  status: 'Active',
  onboardingStatus: 'active',
  mfaEnabled: true,
} as const;

export const ADMIN_MFA_RESPONSE_FIXTURE = {
  message: 'success',
  data: { admin: AUTHENTICATED_ADMIN_FIXTURE },
} as const;

export const ADMIN_BACKEND_SESSION_FIXTURE = {
  message: 'success',
  data: {
    token: 'synthetic-access-token',
    admin: AUTHENTICATED_ADMIN_FIXTURE,
  },
} as const;
