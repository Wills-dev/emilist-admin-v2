import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function ReportsSkeleton() {
  return (
    <div role="status" aria-label="Loading reports" className="space-y-4">
      <span className="sr-only">Loading reports</span>
      <Skeleton className="h-24" />
      <div className="grid gap-4 md:grid-cols-2 min-[72rem]:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-4 rounded-lg bg-white p-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-52" />
            <Skeleton className="h-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
