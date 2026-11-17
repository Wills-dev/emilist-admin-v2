'use client';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input/Input';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';
import { PasswordField } from '@/features/auth/components/PasswordField/PasswordField';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { emailSchema } from '@/features/auth/schemas/authSchemas';
import type { useAdminLogin } from '@/features/auth/hooks/useAdminLogin/useAdminLogin';
import { ApiError } from '@/lib/api/apiError';
import type { AdminLoginPayload } from '@/features/auth/api/loginAdmin';

export function LoginForm({
  login,
}: {
  login: ReturnType<typeof useAdminLogin>;
}) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginPayload>({
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(payload: AdminLoginPayload) {
    if (login.isPending) return;
    clearErrors('root');
    try {
      const response = await login.mutateAsync(payload);
      resetField('password');
      const enrollment =
        'mfaEnrollmentRequired' in response.data &&
        response.data.mfaEnrollmentRequired;
      toast.info(
        enrollment
          ? 'Set up your authenticator'
          : 'Enter your authenticator code',
      );
    } catch (error: unknown) {
      if (error instanceof ApiError && error.code === 'cancelled') return;
      const message =
        error instanceof ApiError && error.code === 'unauthorized'
          ? 'Sign-in was rejected. Check your email and password.'
          : 'Unable to sign in. Please try again.';
      setError('root', { message });
      toast.error(message);
    } finally {
      login.reset();
    }
  }

  return (
    <form
      method="post"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={isSubmitting}
      className="space-y-6"
    >
      <AuthField
        id="login-email"
        label="Enter Work Email"
        error={errors.email?.message}
      >
        <Input
          id="login-email"
          type="email"
          autoComplete="username"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          {...register('email', {
            validate: (value) =>
              emailSchema.safeParse(value).success ||
              'Enter a valid work email address.',
          })}
        />
      </AuthField>
      <div>
        <PasswordField
          id="login-password"
          label="Enter Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          registration={register('password', {
            required: 'Enter your password.',
          })}
          error={errors.password?.message}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-neutral-700">
            <input
              type="checkbox"
              disabled
              className="size-4 rounded accent-emerald-600"
            />
            Keep me signed in (unavailable)
          </label>
          <Link
            href={ROUTES.forgotPassword}
            className="font-medium text-emerald-700 underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      {errors.root?.message && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.message}
        </p>
      )}
      <AuthActions
        submitLabel={isSubmitting ? 'Signing In' : 'Sign In'}
        disabled={isSubmitting || login.isPending}
      />
    </form>
  );
}
