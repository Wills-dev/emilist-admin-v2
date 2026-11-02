import type { ReactNode } from 'react';
import {
  ChartNoAxesCombined,
  ChevronRight,
  UsersRound,
  BriefcaseBusiness,
} from 'lucide-react';
export function ReportsChartCard({
  title,
  description,
  children,
  jobs = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  jobs?: boolean;
}) {
  const Icon = jobs ? BriefcaseBusiness : UsersRound;
  return (
    <section
      aria-label={title}
      className="overview-card flex min-w-0 flex-col rounded-lg bg-white p-4"
    >
      <header>
        <div className="flex items-start justify-between gap-2">
          <h2 className="flex items-start gap-2 text-sm font-medium text-[#343b36]">
            <Icon className="mt-0.5 size-3.5 shrink-0" />
            {title}
          </h2>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-[#788096]"
          />
        </div>
        <p className="mt-2 min-h-8 text-xs text-[#788096]">{description}</p>
      </header>
      <div className="my-3 min-w-0 flex-1">{children}</div>
      <div className="mt-3 flex items-center gap-2 rounded bg-neutral-50 px-3 py-2.5 text-[10px] text-neutral-500">
        <ChartNoAxesCombined className="size-3" />
        Chart
      </div>
    </section>
  );
}
