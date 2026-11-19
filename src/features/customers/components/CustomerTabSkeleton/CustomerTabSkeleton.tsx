'use client';

import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ManagementSkeleton } from '@/components/organisms/ManagementSkeleton/ManagementSkeleton';

export function CustomerTabSkeleton({ tab }: { tab?: string }) {
  const pathname = usePathname();
  const activeTab = tab ?? pathname.split('/').at(-1);
  if (activeTab === 'services')
    return (
      <div
        role="status"
        aria-label="Loading customer services"
        className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)]"
      >
        <div className="space-y-4 rounded-2xl bg-white p-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-8 w-20" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
          <Skeleton className="h-52 w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-52 w-full" />
          ))}
        </div>
      </div>
    );
  return (
    <div
      role="status"
      aria-label="Loading customer activity"
      className="space-y-4"
    >
      {activeTab === 'subscriptions' && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      )}
      <ManagementSkeleton includeMetrics={false} />
    </div>
  );
}
