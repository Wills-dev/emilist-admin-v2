'use client';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { DatePicker } from '@/components/molecules/DatePicker/DatePicker';
import { REPORT_OPTIONS } from '@/features/reports/fixtures/reportFixtures';
import { exportReportSchema } from '@/features/reports/schemas/exportReportSchema';
import type { DateRange } from '@/lib/date/calendarDates';
export function ExportReportForm({ dates }: { dates: DateRange }) {
  const form = useForm<{
    report: string;
    from: string;
    to: string;
    format: string;
  }>({
    defaultValues: {
      report: 'job-success',
      from: dates.from,
      to: dates.to,
      format: 'PDF',
    },
    mode: 'onChange',
  });
  const values = useWatch({ control: form.control });
  const result = exportReportSchema.safeParse(values);
  const issues =
    form.formState.isDirty && !result.success ? result.error.issues : [];
  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
      <label className="block text-xs text-neutral-600">
        Select Report
        <select
          {...form.register('report')}
          className="mt-2 h-10 w-full rounded-lg border-0 bg-[#eeeeee] px-3 text-xs text-neutral-500 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {REPORT_OPTIONS.map((report) => (
            <option key={report.id} value={report.id}>
              {report.title}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs text-neutral-600">Select Date</legend>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {(['from', 'to'] as const).map((field) => (
            <Controller
              key={field}
              name={field}
              control={form.control}
              render={({ field: value }) => (
                <DatePicker
                  label={
                    field === 'from' ? 'Export start date' : 'Export end date'
                  }
                  value={value.value}
                  onChange={value.onChange}
                  onBlur={value.onBlur}
                  invalid={issues.some((issue) => issue.path[0] === field)}
                />
              )}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="border-t border-neutral-100 pt-4">
        <legend className="text-xs text-neutral-600">
          Select download format
        </legend>
        <div className="mt-3 flex flex-wrap gap-5">
          {['PDF', 'CSV', 'MD'].map((format) => (
            <label
              key={format}
              className="flex items-center gap-1 text-xs text-neutral-600"
            >
              <input
                type="radio"
                value={format}
                {...form.register('format')}
                className="size-4 accent-emerald-500"
              />
              {format === 'MD' ? '.MD' : format}
            </label>
          ))}
        </div>
      </fieldset>
      {issues.map((issue) => (
        <p
          role="alert"
          key={String(issue.path[0])}
          className="text-[10px] text-rose-600"
        >
          {issue.message}
        </p>
      ))}
    </form>
  );
}
