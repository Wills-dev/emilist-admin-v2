import { ADMIN_LOGIN_ENROLLMENT_FIXTURE } from './adminLoginResponseFixture';

// Synthetic fixtures; real invitation links and setup credentials never belong here.
export function invitationFixture(
  nextStep: 'password' | 'authenticator' = 'password',
) {
  return {
    message: 'success',
    data: {
      flowId: 'a'.repeat(64),
      admin: {
        email: 'jane+invited@example.invalid',
        onboardingStatus: 'invited',
        mfaEnabled: false,
      },
      nextStep,
      invitationExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  };
}
export const INVITATION_SETUP_FIXTURE = {
  message: 'success',
  data: {
    admin: {},
    authenticator: ADMIN_LOGIN_ENROLLMENT_FIXTURE.data.authenticator,
  },
};
