'use client';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { PasswordField } from '@/features/auth/components/PasswordField/PasswordField';
import { PasswordRequirements } from '@/features/auth/components/PasswordRequirements/PasswordRequirements';
import { changePasswordSchema } from '@/features/auth/schemas/changePasswordSchema';
export function ChangePasswordForm() {
  const form = useForm<{
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const values = useWatch({ control: form.control });
  const result = changePasswordSchema.safeParse(values);
  const issues =
    form.formState.isDirty && !result.success ? result.error.issues : [];
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link
        href={ROUTES.profile}
        className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs text-neutral-500 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        <ChevronLeft className="size-4" />
        Back to Profile
      </Link>
      <section className="rounded-xl bg-white p-6">
        <h1 className="text-xl font-semibold text-[#26332a]">
          Change Password
        </h1>
        <p className="mt-3 text-xs leading-5 text-[#788096]">
          Password changes are unavailable until authentication is integrated.
          Fields below are local validation drafts.
        </p>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="mt-6 space-y-5"
        >
          {[
            { key: 'currentPassword', label: 'Current password' },
            { key: 'password', label: 'New password' },
            { key: 'confirmPassword', label: 'Confirm new password' },
          ].map((field) => (
            <div key={field.key}>
              <PasswordField
                id={`change-${field.key}`}
                label={field.label}
                registration={form.register(
                  field.key as
                    'currentPassword' | 'password' | 'confirmPassword',
                )}
                error={
                  issues.find((issue) => issue.path[0] === field.key)?.message
                }
                autoComplete={
                  field.key === 'currentPassword'
                    ? 'current-password'
                    : 'new-password'
                }
              />
              {field.key === 'password' && (
                <div className="mt-3">
                  <PasswordRequirements password={values.password || ''} />
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled
            title="Backend authentication integration required"
            className="w-full rounded-lg bg-[#20c46b] px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Update Password
          </button>
        </form>
      </section>
    </div>
  );
}
