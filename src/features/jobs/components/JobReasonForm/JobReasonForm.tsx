'use client';
import { useForm } from 'react-hook-form';
import { jobReasonSchema } from '@/features/jobs/schemas/jobActionSchemas';
export function JobReasonForm({
  placeholder = 'Please tell us why',
}: {
  placeholder?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useForm<{ reason: string }>({
    defaultValues: { reason: '' },
    mode: 'onChange',
  });
  return (
    <form id="job-action-form" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="job-action-reason" className="sr-only">
        Reason
      </label>
      <textarea
        id="job-action-reason"
        placeholder={placeholder}
        maxLength={1000}
        aria-invalid={!!errors.reason}
        aria-describedby={errors.reason ? 'job-action-reason-error' : undefined}
        {...register('reason', {
          validate: (value) => {
            const parsed = jobReasonSchema.safeParse({ reason: value });
            return (
              parsed.success ||
              parsed.error.issues[0]?.message ||
              'Enter a reason.'
            );
          },
        })}
        className="h-40 w-full resize-y rounded-xl border-0 bg-[#eeeeee] p-4 text-sm text-neutral-700 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-emerald-600"
      />
      {errors.reason && (
        <p
          id="job-action-reason-error"
          role="alert"
          className="mt-2 text-xs text-rose-600"
        >
          {errors.reason.message}
        </p>
      )}
    </form>
  );
}
