import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function OverviewSkeleton() {
  return (
    <div role="status" aria-label="Loading overview" className="space-y-4">
      <Skeleton className="h-28" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-72" />
        ))}
      </div>
    </div>
  );
}
