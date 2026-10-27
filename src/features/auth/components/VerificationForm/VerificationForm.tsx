'use client';
import { Controller, useForm } from 'react-hook-form';
import { OtpInput } from '@/features/auth/components/OtpInput/OtpInput';
import { AuthAccountSummary } from '@/features/auth/components/AuthAccountSummary/AuthAccountSummary';
import { AuthActions } from '@/features/auth/components/AuthActions/AuthActions';
import { otpSchema } from '@/features/auth/schemas/authSchemas';

export function VerificationForm({
  reset = false,
  enrollment = false,
}: {
  reset?: boolean;
  enrollment?: boolean;
}) {
  const { control } = useForm<{ code: string }>({
    mode: 'onChange',
    defaultValues: { code: '' },
  });
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <div className="rounded-2xl border border-dashed border-neutral-100 bg-neutral-50/80 px-3 py-6 sm:px-6">
        {!enrollment && <AuthAccountSummary />}
        <Controller
          control={control}
          name="code"
          rules={{
            validate: (value) =>
              otpSchema.safeParse(value).success || 'Enter all six digits.',
          }}
          render={({ field, fieldState }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
        <p className="mt-4 text-center text-xs text-slate-500">
          Enter the code from your authenticator app.
        </p>
      </div>
      <AuthActions
        backHref="/login"
        backLabel={
          reset || enrollment ? 'Back to Sign In' : 'Back to Password Sign In'
        }
        submitLabel={
          enrollment
            ? 'Activate Account & Sign In'
            : reset
              ? 'Verify Code'
              : 'Complete Sign In'
        }
        unavailable="Code verification is unavailable until the authentication service is connected."
      />
      <p className="mt-6 border-t border-neutral-100 pt-5 text-center text-[11px] leading-5 text-slate-500">
        Lost access to your authenticator? Contact your administrator for help.
      </p>
    </form>
  );
}
