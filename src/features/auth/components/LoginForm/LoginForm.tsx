'use client';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input/Input';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';
import { PasswordField } from '@/features/auth/components/PasswordField/PasswordField';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { emailSchema } from '@/features/auth/schemas/authSchemas';

export function LoginForm({
  previewEnabled = false,
}: {
  previewEnabled?: boolean;
}) {
  const router = useRouter();
  const {
    register,
    formState: { errors },
  } = useForm<{ email: string; password: string; remember: boolean }>({
    mode: 'onChange',
    defaultValues: { email: '', password: '', remember: false },
  });
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (previewEnabled) router.push(ROUTES.dashboard);
      }}
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
              {...register('remember')}
              className="size-4 rounded accent-emerald-600"
            />
            Keep me signed in for 12 hours
          </label>
          <Link
            href={ROUTES.forgotPassword}
            className="font-medium text-emerald-700 underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      <AuthActions
        submitLabel={previewEnabled ? 'Sign In' : 'Proceed'}
        disabled={!previewEnabled}
        unavailable={
          previewEnabled
            ? 'UI preview only — static sample data. No authentication or backend actions.'
            : 'Sign-in is unavailable until the authentication service is connected.'
        }
      />
    </form>
  );
}
