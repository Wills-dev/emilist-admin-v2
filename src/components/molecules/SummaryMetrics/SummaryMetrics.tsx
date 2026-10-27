import type { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
export function SummaryMetrics({
  metrics,
}: {
  metrics: readonly { label: string; value: string; icon: LucideIcon }[];
}) {
  return (
    <div className="overview-stagger grid gap-3 sm:grid-cols-2 min-[70rem]:grid-cols-5">
      {metrics.map(({ label, value, icon: Icon }) => (
        <section
          key={label}
          aria-label={label}
          className="overview-card min-w-0 rounded-lg bg-white p-3"
        >
          <h2 className="flex items-center gap-2 text-xs text-[#4c554e]">
            <Icon aria-hidden="true" className="size-3.5" />
            {label}
          </h2>
          <div className="mt-5 flex items-center justify-between gap-2">
            <strong className="text-lg font-bold tracking-tight">
              {value}
            </strong>
            <span className="flex items-center rounded-full bg-emerald-50 px-1 text-[9px] text-emerald-600">
              <TrendingUp aria-hidden="true" className="mr-1 size-2.5" />
              +4.2%
            </span>
          </div>
        </section>
      ))}
    </div>
  );
}
