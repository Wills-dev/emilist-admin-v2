import { AuthLayout } from '@/features/auth/components/AuthLayout/AuthLayout';
import { AuthTabs } from '@/features/auth/components/AuthTabs/AuthTabs';
import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader/AuthFormHeader';
import { AuthSteps } from '@/features/auth/components/AuthSteps/AuthSteps';
import { AuthAccountSummary } from '@/features/auth/components/AuthAccountSummary/AuthAccountSummary';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { NewPasswordForm } from '@/features/auth/components/NewPasswordForm/NewPasswordForm';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm/ForgotPasswordForm';
import { VerificationForm } from '@/features/auth/components/VerificationForm/VerificationForm';
import { AuthenticatorSetup } from '@/features/auth/components/AuthenticatorSetup/AuthenticatorSetup';
import type { AuthVariant } from '@/features/auth/types/authTypes';

const screens = {
  login: {
    title: 'Sign In',
    description:
      'Use your work computer and email to sign in to the Admin portal',
    variant: 'login',
    step: 1,
  },
  loginVerify: {
    title: 'Two-Factor Verification',
    description: 'Enter the 6-digit code from your authenticator app',
    variant: 'login',
    step: 2,
  },
  invite: {
    title: 'Admin Account Setup',
    description: 'Confirm your invitation details to get started.',
    variant: 'signup',
    step: 1,
  },
  invitePassword: {
    title: 'Create New Password',
    description: 'Create a new password. You can’t re-use a recent one.',
    variant: 'signup',
    step: 2,
  },
  authenticator: {
    title: 'Secure Account',
    description:
      'To protect consumer data, multi-factor authentication is required',
    variant: 'signup',
    step: 3,
  },
  forgotPassword: {
    title: 'Reset Password',
    description:
      'Enter your work email. A secure reset link will also require your authenticator code.',
    variant: 'forgotPassword',
    step: 1,
  },
  resetSent: {
    title: 'Reset Link Status',
    description:
      'No reset link has been sent. Email delivery is not connected.',
    variant: 'forgotPassword',
    step: 2,
  },
  resetVerify: {
    title: 'Two-Factor Verification',
    description: 'Enter the 6-digit code from your authenticator app',
    variant: 'forgotPassword',
    step: 3,
  },
  resetPassword: {
    title: 'Create New Password',
    description: 'Create a new password. You can’t re-use a recent one.',
    variant: 'forgotPassword',
    step: 4,
  },
} satisfies Record<
  string,
  { title: string; description: string; variant: AuthVariant; step: number }
>;
export type AuthScreenName = keyof typeof screens;

export function AuthScreen({ screen }: { screen: AuthScreenName }) {
  const config = screens[screen];
  const invitation = config.variant === 'signup';
  return (
    <AuthLayout variant={config.variant}>
      <AuthTabs invitation={invitation} />
      <AuthFormHeader
        title={config.title}
        description={config.description}
        step={config.step}
        total={config.variant === 'forgotPassword' ? 4 : 3}
      />
      {invitation && <AuthSteps current={config.step} />}
      {(screen === 'resetVerify' || screen === 'resetPassword') && (
        <AuthSteps reset current={screen === 'resetVerify' ? 1 : 2} />
      )}
      {screen === 'login' && <LoginForm />}
      {screen === 'loginVerify' && <VerificationForm />}
      {screen === 'invite' && (
        <>
          <AuthAccountSummary detailed />
          <AuthActions
            submitLabel="Proceed"
            unavailable="Invitation details are unavailable until a valid invitation can be verified."
          />
          <p className="mt-5 text-center text-xs text-slate-500">
            Not you? Ask your line manager to resend the invite.
          </p>
        </>
      )}
      {screen === 'invitePassword' && <NewPasswordForm />}
      {screen === 'authenticator' && <AuthenticatorSetup />}
      {screen === 'forgotPassword' && <ForgotPasswordForm />}
      {screen === 'resetSent' && (
        <>
          <div className="mx-auto rounded-2xl border border-neutral-100 bg-neutral-50 p-5 sm:w-fit">
            <AuthAccountSummary />
            <p className="text-center text-xs text-slate-500">
              Didn’t get the reset link?{' '}
              <button
                type="button"
                disabled
                className="text-emerald-700 opacity-50"
              >
                Resend
              </button>
            </p>
          </div>
          <AuthActions
            backHref="/login"
            unavailable="Sending and resending reset links are unavailable."
          />
        </>
      )}
      {screen === 'resetVerify' && <VerificationForm reset />}
      {screen === 'resetPassword' && <NewPasswordForm reset />}
    </AuthLayout>
  );
}
