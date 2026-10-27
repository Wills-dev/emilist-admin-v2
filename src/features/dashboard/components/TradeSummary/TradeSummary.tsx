import {
  Store,
  ArrowLeftRight,
  PackagePlus,
  Truck,
  CircleX,
  RotateCcw,
  PackageCheck,
} from 'lucide-react';
import { OverviewCard } from '@/features/dashboard/components/OverviewCard/OverviewCard';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
const icons = [
  Store,
  ArrowLeftRight,
  PackagePlus,
  Truck,
  CircleX,
  RotateCcw,
  PackageCheck,
];
export function TradeSummary() {
  return (
    <OverviewCard
      title="Trade Summary"
      description="An overview of orders and sales"
      icon={Store}
    >
      <dl className="mt-3 space-y-1 border-y border-slate-100 py-3">
        {OVERVIEW_FIXTURES.trade.map(([label, value], index) => {
          const Icon = icons[index] || Store;
          return (
            <div
              key={label}
              className="flex items-center justify-between gap-2 text-[10px] leading-3.5 text-[#606762]"
            >
              <dt className="flex items-center gap-2">
                <Icon className="size-3.5 text-[#969e98]" strokeWidth={1.5} />
                {label}
              </dt>
              <dd className="tabular-nums">{value}</dd>
            </div>
          );
        })}
      </dl>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#788096]">
        <span>Gross sales volume:</span>
        <strong className="text-lg font-bold text-[#4b514d]">
          {OVERVIEW_FIXTURES.grossSales}
        </strong>
      </div>
    </OverviewCard>
  );
}
