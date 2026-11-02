'use client';
import { useForm } from 'react-hook-form';
import { suspensionDraftSchema } from '@/features/customers/schemas/suspensionSchema';
export function SuspensionForm() {
  const {
    register,
    formState: { errors },
  } = useForm<{
    type: 'Temporary' | 'Permanent';
    reason: string;
    context: string;
  }>({
    defaultValues: { type: 'Temporary', reason: '', context: '' },
    mode: 'onChange',
  });
  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
      <fieldset className="border-y border-neutral-100 py-4">
        <legend className="text-[10px] text-neutral-500">
          Suspension Type
        </legend>
        <div className="flex flex-wrap gap-4">
          {(['Temporary', 'Permanent'] as const).map((value) => (
            <label
              key={value}
              className="flex items-center gap-1 text-xs text-neutral-600"
            >
              <input
                type="radio"
                value={value}
                {...register('type')}
                className="size-4 accent-emerald-500"
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-xs text-neutral-500">
        Select Reason
        <select
          aria-invalid={!!errors.reason}
          {...register('reason', {
            validate: (value) =>
              suspensionDraftSchema.shape.reason.safeParse(value).success ||
              'Select a reason.',
          })}
          className="mt-2 h-10 w-full rounded-lg border-0 bg-[#eeeeee] px-3 text-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <option value="">Please select</option>
          {['Policy review', 'Customer request', 'Account review'].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </select>
      </label>
      {errors.reason && (
        <p role="alert" className="text-[10px] text-rose-600">
          {errors.reason.message}
        </p>
      )}
      <label className="sr-only" htmlFor="suspension-context">
        Additional context
      </label>
      <textarea
        id="suspension-context"
        placeholder="Add extra context (if any)"
        maxLength={1000}
        {...register('context')}
        className="h-36 w-full resize-y rounded-lg border-0 bg-[#eeeeee] p-3 text-xs text-neutral-600 focus-visible:outline-2 focus-visible:outline-emerald-600"
      />
    </form>
  );
}
