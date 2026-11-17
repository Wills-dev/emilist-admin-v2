'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button/Button';
import { OtpInput } from '@/features/auth/components/OtpInput/OtpInput';
import { otpSchema } from '@/features/auth/schemas/authSchemas';
import {
  useAdminMfa,
  type AdminMfaMode,
} from '@/features/auth/hooks/useAdminMfa/useAdminMfa';
import { ApiError } from '@/lib/api/apiError';

export function AdminMfaForm({
  mode,
  token,
  onRestart,
}: {
  mode: AdminMfaMode;
  token: string;
  onRestart?: () => void;
}) {
  const router = useRouter();
  const verification = useAdminMfa(mode);
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const [responseReceived, setResponseReceived] = useState(false);
  const {
    control,
    handleSubmit,
    resetField,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<{ code: string }>({
    mode: 'onChange',
    defaultValues: { code: '' },
  });
  const pending = isSubmitting || verification.isPending;

  async function onSubmit({ code }: { code: string }) {
    if (verification.isPending || responseReceived || !token) return;
    clearErrors('root');
    try {
      await verification.mutateAsync({ token, code });
      resetField('code');
      setResponseReceived(true);
      toast.success('Signed in successfully');
      onRestart?.();
      router.replace(ROUTES.dashboard);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.code === 'cancelled') return;
      if (error instanceof ApiError && error.code === 'flow_expired') {
        resetField('code');
        onRestart?.();
        toast.error(error.message);
        return;
      }
      if (error instanceof ApiError && error.code === 'invalid_code') {
        setInvalidAttempts((count) => count + 1);
      }
      const message =
        error instanceof ApiError && error.code === 'invalid_code'
          ? error.message
          : error instanceof ApiError && error.code === 'unauthorized'
            ? 'Verification was rejected. Check your code or sign in again.'
            : 'Unable to verify your code. Please try again.';
      setError('root', { message });
      toast.error(message);
    } finally {
      verification.reset();
    }
  }

  return (
    <form
      method="post"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={pending}
      className="space-y-5"
    >
      <fieldset disabled={pending || responseReceived} className="min-w-0">
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
      </fieldset>
      {errors.root?.message && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.message}
        </p>
      )}
      {invalidAttempts >= 2 && (
        <p role="note" className="text-sm text-neutral-600">
          If current codes keep failing, enable automatic date and time on your
          device.
        </p>
      )}
      {responseReceived && (
        <p role="status" className="text-sm text-neutral-700">
          Sign-in complete. Opening the dashboard.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || responseReceived || !token}>
          {pending
            ? 'Verifying'
            : mode === 'enrollment'
              ? 'Confirm Enrollment'
              : 'Verify Code'}
        </Button>
        {onRestart && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onRestart}
          >
            Back to Sign In
          </Button>
        )}
      </div>
    </form>
  );
}
