import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function JobDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading job details"
      className="grid min-w-0 gap-4 min-[80rem]:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)]"
    >
      <div className="space-y-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-16" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
