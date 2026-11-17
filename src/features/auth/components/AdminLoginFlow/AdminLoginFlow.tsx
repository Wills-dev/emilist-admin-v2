'use client';

import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader/AuthFormHeader';
import { AuthenticatorSetup } from '@/features/auth/components/AuthenticatorSetup/AuthenticatorSetup';
import { AdminMfaForm } from '@/features/auth/components/AdminMfaForm/AdminMfaForm';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { useAdminLogin } from '@/features/auth/hooks/useAdminLogin/useAdminLogin';

export function AdminLoginFlow() {
  const login = useAdminLogin();
  const flow = login.flow;
  const enrollment = flow && 'enrollmentToken' in flow ? flow : undefined;
  const challenge = flow && 'challengeToken' in flow ? flow : undefined;

  return (
    <>
      <AuthFormHeader
        title={
          enrollment
            ? 'Set up your authenticator'
            : challenge
              ? 'Two-Factor Verification'
              : 'Sign In'
        }
        description={
          enrollment
            ? 'Add this account to your authenticator app to continue.'
            : challenge
              ? 'Enter the current six-digit authenticator code.'
              : 'Use your work computer and email to sign in to the Admin portal'
        }
        step={flow ? 2 : 1}
      />
      {enrollment ? (
        <AuthenticatorSetup
          enrollment={enrollment}
          onRestart={login.clearFlow}
        />
      ) : challenge ? (
        <AdminMfaForm
          mode="challenge"
          token={challenge.challengeToken}
          onRestart={login.clearFlow}
        />
      ) : (
        <LoginForm login={login} />
      )}
    </>
  );
}
