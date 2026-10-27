import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Star,
  Wallet,
} from 'lucide-react';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
import { QuickSearch } from '@/features/dashboard/components/QuickSearch/QuickSearch';
const icons = [ShieldCheck, Wallet, BriefcaseBusiness, Star];
export function OverviewMetrics() {
  return (
    <div className="overview-stagger grid gap-3 sm:grid-cols-2 min-[70rem]:grid-cols-[1.25fr_repeat(4,minmax(0,1fr))]">
      <QuickSearch />
      {OVERVIEW_FIXTURES.metrics.map((metric, index) => {
        const Icon = icons[index] || Wallet;
        return (
          <section
            key={metric.title}
            aria-label={metric.title}
            className="overview-card min-w-0 rounded-lg bg-white p-2.5 xl:p-3"
          >
            <h2 className="flex items-center gap-2 text-xs font-medium text-[#343b36]">
              <Icon className="size-3.5 shrink-0" strokeWidth={1.5} />
              {metric.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 xl:mt-4">
              <strong className="text-lg leading-tight font-bold tracking-tight text-[#343b36] xl:leading-7">
                {metric.value}
              </strong>
              <span className="rounded bg-neutral-50 px-1 text-[10px] text-[#717773]">
                {metric.note}
              </span>
            </div>
            <button
              type="button"
              disabled
              title="Requires backend integration"
              className="mt-3 flex items-center gap-2 text-xs text-[#009b4f] underline underline-offset-2 disabled:cursor-not-allowed xl:mt-4"
            >
              {metric.action}
              <ArrowRight className="size-3.5" />
            </button>
          </section>
        );
      })}
    </div>
  );
}
