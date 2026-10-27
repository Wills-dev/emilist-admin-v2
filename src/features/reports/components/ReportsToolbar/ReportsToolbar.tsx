'use client';
import { ChartPie, CalendarClock } from 'lucide-react';
import { REPORT_PERIODS } from '@/features/reports/fixtures/reportFixtures';
import { useReportRange } from '@/features/reports/hooks/useReportRange/useReportRange';
export function ReportsToolbar() {
  const { period, setRange } = useReportRange();
  return (
    <section className="overview-enter flex flex-wrap items-center justify-between gap-4 bg-white p-4">
      <div>
        <h1 className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-emerald-600">
          <ChartPie className="size-3" />
          REPORTS
        </h1>
        <p className="mt-3 text-xs text-[#788096]">
          Take a look at other important numbers and metrics
        </p>
        <p role="note" className="mt-1 text-[10px] text-slate-500">
          Static presentation data. Date selection does not retrieve or change
          analytics.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 rounded bg-neutral-50 p-2 text-xs text-slate-600">
          <CalendarClock className="size-4" />
          {period.caption}
        </span>
        <label className="text-xs text-slate-600">
          <span className="sr-only">Report date range</span>
          <select
            value={period.value}
            onChange={(event) => setRange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-neutral-50 p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {REPORT_PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
