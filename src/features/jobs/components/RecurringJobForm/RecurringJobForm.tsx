'use client';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { DatePicker } from '@/components/molecules/DatePicker/DatePicker';
import { recurringJobSchema } from '@/features/jobs/schemas/jobActionSchemas';
export function RecurringJobForm() {
  const form = useForm<{
    frequency: 'Weekly' | 'Monthly';
    period: 'Weekly' | 'Monthly';
    startDate: string;
    endDate: string;
    amount: string;
  }>({
    defaultValues: {
      frequency: 'Weekly',
      period: 'Weekly',
      startDate: '',
      endDate: '',
      amount: '',
    },
    mode: 'onChange',
  });
  const values = useWatch({ control: form.control });
  const result = recurringJobSchema.safeParse(values);
  const issues =
    form.formState.isDirty && !result.success ? result.error.issues : [];
  const control =
    'h-11 min-w-0 w-full rounded-xl border-0 bg-[#eeeeee] px-4 text-sm text-neutral-600 focus-visible:outline-2 focus-visible:outline-emerald-600';
  return (
    <form
      id="job-action-form"
      onSubmit={(event) => event.preventDefault()}
      className="space-y-6 border-t border-neutral-100 pt-6"
    >
      <label className="block text-sm text-neutral-600">
        Job frequency
        <select {...form.register('frequency')} className={`${control} mt-4`}>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </label>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {(['startDate', 'endDate'] as const).map((field) => (
          <Controller
            key={field}
            control={form.control}
            name={field}
            render={({ field: dateField }) => (
              <DatePicker
                label={field === 'startDate' ? 'Start date' : 'End date'}
                value={dateField.value}
                name={dateField.name}
                onChange={dateField.onChange}
                onBlur={dateField.onBlur}
                invalid={issues.some((issue) => issue.path[0] === field)}
                describedBy={
                  issues.some((issue) => issue.path[0] === field)
                    ? `recurring-${field}-error`
                    : undefined
                }
              />
            )}
          />
        ))}
      </div>
      <fieldset className="min-w-0">
        <legend className="mb-4 text-sm text-neutral-600">
          Set recurring budget
        </legend>
        <div className="grid min-w-0 grid-cols-[5rem_1fr] gap-2 sm:grid-cols-[5rem_1fr_7rem]">
          <label className="sr-only" htmlFor="recurring-currency">
            Currency
          </label>
          <select id="recurring-currency" disabled className={control}>
            <option>NGN</option>
          </select>
          <label className="sr-only" htmlFor="recurring-budget">
            Recurring amount
          </label>
          <input
            id="recurring-budget"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter Amount"
            {...form.register('amount')}
            aria-invalid={issues.some((issue) => issue.path[0] === 'amount')}
            aria-describedby={
              issues.some((issue) => issue.path[0] === 'amount')
                ? 'recurring-amount-error'
                : undefined
            }
            className={control}
          />
          <label className="sr-only" htmlFor="recurring-period">
            Budget period
          </label>
          <select
            id="recurring-period"
            {...form.register('period')}
            className={control}
          >
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </fieldset>
      {issues.map((issue) => (
        <p
          key={String(issue.path[0])}
          id={`recurring-${String(issue.path[0])}-error`}
          role="alert"
          className="text-xs text-rose-600"
        >
          {issue.message}
        </p>
      ))}
    </form>
  );
}
