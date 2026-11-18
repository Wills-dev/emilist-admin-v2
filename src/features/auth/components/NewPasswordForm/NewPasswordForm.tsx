'use client';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/apiError';
import type { AuthAccount } from '@/features/auth/types/authTypes';
import type { InvitationPasswordPayload } from '@/features/auth/schemas/invitationSchemas';
import { useForm, useWatch } from 'react-hook-form';
import { PasswordField } from '@/features/auth/components/PasswordField/PasswordField';
import { PasswordRequirements } from '@/features/auth/components/PasswordRequirements/PasswordRequirements';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { AuthAccountSummary } from '@/features/auth/components/AuthAccountSummary/AuthAccountSummary';
import {
  passwordSchema,
  newPasswordSchema,
} from '@/features/auth/schemas/authSchemas';

export function NewPasswordForm({
  reset = false,
  account,
  submitPassword,
  onBack,
}: {
  reset?: boolean;
  account?: AuthAccount;
  submitPassword?: (values: InvitationPasswordPayload) => Promise<void>;
  onBack?: () => void;
}) {
  const {
    register,
    control,
    getValues,
    handleSubmit,
    resetField,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<{ password: string; confirmPassword: string }>({
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });
  const password = useWatch({ control, name: 'password' });
  async function onSubmit(values: InvitationPasswordPayload) {
    if (!submitPassword || isSubmitting) return;
    clearErrors('root');
    try {
      await submitPassword(values);
      resetField('password');
      resetField('confirmPassword');
    } catch (error: unknown) {
      if (error instanceof ApiError && error.code === 'cancelled') return;
      const message =
        error instanceof ApiError
          ? error.message
          : 'Unable to create your password. Please try again.';
      setError('root', { message });
      toast.error(message);
    }
  }
  return (
    <form
      method="post"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={isSubmitting}
    >
      <div className="rounded-2xl border border-dashed border-neutral-100 bg-neutral-50/80 p-4 sm:mx-8">
        <div className="mb-6 border-b border-neutral-100">
          <AuthAccountSummary account={account} />
        </div>
        <div className="space-y-4">
          <PasswordField
            id="new-password"
            className="bg-white"
            label="Create Password"
            registration={register('password', {
              validate: (value) =>
                passwordSchema.safeParse(value).success ||
                'Meet all four password requirements.',
              deps: ['confirmPassword'],
            })}
            error={errors.password?.message}
          />
          <PasswordRequirements password={password} />
          <PasswordField
            id="confirm-password"
            className="bg-white"
            label="Confirm Password"
            placeholder="Re-enter password"
            registration={register('confirmPassword', {
              validate: (value) =>
                newPasswordSchema.safeParse({
                  password: getValues('password'),
                  confirmPassword: value,
                }).success ||
                (value !== getValues('password')
                  ? 'Passwords do not match.'
                  : 'Meet all password requirements.'),
            })}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>
      {errors.root?.message && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {errors.root.message}
        </p>
      )}
      <AuthActions
        onBack={isSubmitting ? undefined : onBack}
        backHref={
          onBack ? undefined : reset ? ROUTES.login : ROUTES.acceptInvite
        }
        backLabel={reset ? 'Back to Sign In' : 'Back to Account Setup'}
        submitLabel={
          isSubmitting
            ? 'Creating Password'
            : reset
              ? 'Update Password'
              : 'Create Password'
        }
        disabled={!submitPassword || isSubmitting}
        unavailable={
          submitPassword
            ? undefined
            : 'Password changes are unavailable until account verification and the password service are connected.'
        }
      />
    </form>
  );
}
