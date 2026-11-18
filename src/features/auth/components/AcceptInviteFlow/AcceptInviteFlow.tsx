'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { AuthAccountSummary } from '@/features/auth/components/AuthAccountSummary/AuthAccountSummary';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { AuthFormHeader } from '@/features/auth/components/AuthFormHeader/AuthFormHeader';
import { AuthSteps } from '@/features/auth/components/AuthSteps/AuthSteps';
import { AuthenticatorSetup } from '@/features/auth/components/AuthenticatorSetup/AuthenticatorSetup';
import { NewPasswordForm } from '@/features/auth/components/NewPasswordForm/NewPasswordForm';
import { useInvitation } from '@/features/auth/hooks/useInvitation/useInvitation';
import type { InvitationLink } from '@/features/auth/lib/parseInvitationLink';
import type { InvitationPasswordPayload } from '@/features/auth/schemas/invitationSchemas';
import { ApiError } from '@/lib/api/apiError';

export function AcceptInviteFlow({ link }: { link: InvitationLink }) {
  const flow = useInvitation(link.token, link.invalidToken);
  const [stage, setStage] = useState<'details' | 'password' | 'authenticator'>(
    'details',
  );
  const { invitation } = flow;
  const changedAccount =
    !link.token &&
    !!link.account.email &&
    !!invitation.data &&
    link.account.email !== invitation.data.data.admin.email;
  const failed =
    changedAccount ||
    !!flow.blocked ||
    link.invalidToken ||
    flow.expired ||
    invitation.isError;
  const account = {
    ...link.account,
    email: invitation.data?.data.admin.email ?? link.account.email,
  };
  const step = stage === 'details' ? 1 : stage === 'password' ? 2 : 3;

  async function proceed() {
    if (!invitation.data || failed || flow.resume.isPending) return;
    if (invitation.data.data.nextStep === 'password') {
      setStage('password');
      return;
    }
    try {
      await flow.resume.mutateAsync();
      setStage('authenticator');
    } catch (error: unknown) {
      if (!(error instanceof ApiError && error.code === 'cancelled')) {
        toast.error(
          error instanceof ApiError
            ? error.message
            : 'Unable to load authenticator setup.',
        );
      }
    } finally {
      flow.resume.reset();
    }
  }
  async function createPassword(payload: InvitationPasswordPayload) {
    try {
      await flow.password.mutateAsync(payload);
      toast.success('Password created. Set up your authenticator.');
      setStage('authenticator');
    } finally {
      flow.password.reset();
    }
  }
  function restart() {
    flow.clearSetup();
    setStage('details');
    void invitation.refetch();
  }

  return (
    <>
      <AuthFormHeader
        title={
          stage === 'password'
            ? 'Create New Password'
            : stage === 'authenticator'
              ? 'Secure Account'
              : 'Admin Account Setup'
        }
        description={
          stage === 'authenticator'
            ? 'Add this account to your authenticator, then enter its current code.'
            : 'Confirm your invitation details to get started.'
        }
        step={step}
      />
      <AuthSteps current={step} staticSteps />
      {failed ? (
        <div className="space-y-4">
          <AuthAccountSummary account={link.account} detailed />
          <p role="alert" className="text-sm text-red-700">
            {changedAccount
              ? 'A different invitation is open in this browser. Reopen your original invitation link.'
              : flow.blocked
                ? flow.blocked
                : link.invalidToken
                  ? 'This invitation link is invalid.'
                  : flow.expired
                    ? 'This invitation has expired. Ask your inviter for a new link.'
                    : invitation.error instanceof ApiError
                      ? invitation.error.message
                      : 'Unable to verify this invitation. Please try again.'}
          </p>
          {!flow.expired &&
            !link.invalidToken &&
            !flow.blocked &&
            !changedAccount && (
              <Button
                type="button"
                variant="outline"
                disabled={invitation.isFetching}
                onClick={() => void invitation.refetch()}
              >
                {invitation.isFetching ? 'Checking Invitation' : 'Retry'}
              </Button>
            )}
        </div>
      ) : invitation.isPending ? (
        <div
          aria-busy="true"
          aria-label="Verifying invitation"
          className="space-y-3"
        >
          {Object.values(link.account).some(Boolean) ? (
            <AuthAccountSummary account={link.account} detailed />
          ) : (
            Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))
          )}
          <p role="status" className="text-sm text-neutral-500">
            Verifying invitation
          </p>
        </div>
      ) : stage === 'password' ? (
        <NewPasswordForm
          account={account}
          submitPassword={createPassword}
          onBack={() => setStage('details')}
        />
      ) : stage === 'authenticator' && flow.setup ? (
        <AuthenticatorSetup
          invitation={flow.setup}
          invitationId={invitation.data?.data.flowId}
          onRestart={restart}
          onAuthenticated={flow.clearSetup}
        />
      ) : (
        <form
          method="post"
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void proceed();
          }}
        >
          <AuthAccountSummary account={account} detailed />
          <p className="text-xs text-neutral-500">
            Confirm these details before continuing. Contact your inviter if
            anything looks wrong.
          </p>
          <AuthActions
            submitLabel={
              flow.resume.isPending ? 'Loading Authenticator' : 'Proceed'
            }
            disabled={flow.resume.isPending || !invitation.data}
          />
        </form>
      )}
    </>
  );
}
