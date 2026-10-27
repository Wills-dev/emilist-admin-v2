import { ChevronRight, Wallet } from 'lucide-react';
import { OverviewCard } from '@/features/dashboard/components/OverviewCard/OverviewCard';
import { OVERVIEW_FIXTURES } from '@/features/dashboard/fixtures/overviewFixtures';
import { cn } from '@/lib/utils/cn';
export function QuickActions() {
  return (
    <OverviewCard
      title="Quick Actions"
      description="Open a ticket to inspect records and take action fast"
      icon={Wallet}
      className="[&>p]:text-[10px]"
    >
      <ul className="mt-3 divide-y divide-slate-100">
        {OVERVIEW_FIXTURES.quickActions.map((action) => (
          <li key={action.title}>
            <button
              disabled
              title="Requires backend integration"
              className="flex w-full cursor-not-allowed items-center gap-2 py-1.5 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] leading-4 text-[#545c56]">
                  {action.title}
                </span>
                <span className="block text-[9px] leading-3 text-[#788096]">
                  {action.description}
                </span>
              </span>
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full text-[10px]',
                  action.tone === 'red'
                    ? 'bg-red-50 text-red-400'
                    : action.tone === 'amber'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-100 text-slate-500',
                )}
              >
                {action.count}
              </span>
              <ChevronRight className="size-3 text-slate-500" />
            </button>
          </li>
        ))}
      </ul>
    </OverviewCard>
  );
}
