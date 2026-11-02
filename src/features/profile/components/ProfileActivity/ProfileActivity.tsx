'use client';
import { DateRangePicker } from '@/components/molecules/DateRangePicker/DateRangePicker';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { useProfileActivity } from '@/features/profile/hooks/useProfileActivity/useProfileActivity';
export function ProfileActivity() {
  const table = useProfileActivity();
  return (
    <section
      aria-label="Admin activity log"
      className="min-w-0 rounded-xl bg-white p-4"
    >
      <header className="mb-4 flex flex-wrap justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Admin Activity Log
          </h2>
          <p className="mt-2 text-[10px] text-[#788096]">
            {table.rows.length} sample events
          </p>
        </div>
        <DateRangePicker
          label="Select activity dates"
          value={table.dates}
          onChange={table.setDates}
          caption="Activity dates"
        />
      </header>
      <div
        role="region"
        aria-label="Activity log scroll area"
        tabIndex={0}
        className="max-h-[44rem] min-w-0 space-y-1 overflow-y-auto overscroll-contain rounded focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        {table.rows.length ? (
          <ol>
            {table.rows.map((row) => (
              <li
                key={row.id}
                className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.7fr)] items-center gap-3 border-b border-slate-100 py-3 text-[10px] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.7fr)_auto]"
              >
                <div className="space-y-1 font-mono text-[#788096]">
                  <p>
                    {row.date}, {row.time}
                  </p>
                  <p>{row.ip}</p>
                </div>
                <p className="min-w-0 leading-5 break-words text-slate-800">
                  {row.description}
                </p>
                <span className="hidden sm:block">
                  <StatusBadge tone="success">{row.status}</StatusBadge>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            title="No sample activity"
            description="No synthetic activity records fall within this date range."
          />
        )}
      </div>
    </section>
  );
}
