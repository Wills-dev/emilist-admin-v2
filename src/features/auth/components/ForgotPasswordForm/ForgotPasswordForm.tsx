'use client';
import { ROUTES } from '@/constants/routes';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input/Input';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { emailSchema } from '@/features/auth/schemas/authSchemas';

export function ForgotPasswordForm() {
  const {
    register,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: 'onChange',
    defaultValues: { email: '' },
  });
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <AuthField
        id="recovery-email"
        label="Enter Work Email"
        error={errors.email?.message}
      >
        <Input
          id="recovery-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'recovery-email-error' : undefined}
          {...register('email', {
            validate: (value) =>
              emailSchema.safeParse(value).success ||
              'Enter a valid work email address.',
          })}
        />
      </AuthField>
      <AuthActions
        backHref={ROUTES.login}
        submitLabel="Send Reset Link"
        unavailable="Reset email delivery is unavailable until the recovery service is connected."
      />
    </form>
  );
}
