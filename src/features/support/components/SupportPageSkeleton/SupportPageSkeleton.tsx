import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export function SupportPageSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading support" role="status">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <div className="space-y-2 rounded-xl border border-slate-100 p-4">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
