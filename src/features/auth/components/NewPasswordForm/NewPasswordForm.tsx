'use client';
import { useForm, useWatch } from 'react-hook-form';
import { PasswordField } from '@/features/auth/components/PasswordField/PasswordField';
import { PasswordRequirements } from '@/features/auth/components/PasswordRequirements/PasswordRequirements';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { AuthAccountSummary } from '@/features/auth/components/AuthAccountSummary/AuthAccountSummary';
import {
  passwordSchema,
  newPasswordSchema,
} from '@/features/auth/schemas/authSchemas';

export function NewPasswordForm({ reset = false }: { reset?: boolean }) {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });
  const password = useWatch({ control, name: 'password' });
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <div className="rounded-2xl border border-dashed border-neutral-100 bg-neutral-50/80 p-4 sm:mx-8">
        <div className="mb-6 border-b border-neutral-100">
          <AuthAccountSummary />
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
      <AuthActions
        backHref={reset ? '/login' : '/accept-invite'}
        backLabel={reset ? 'Back to Sign In' : 'Back to Account Setup'}
        submitLabel={reset ? 'Update Password' : 'Create Password'}
        unavailable="Password changes are unavailable until account verification and the password service are connected."
      />
    </form>
  );
}
