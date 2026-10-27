import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function ManagementSkeleton({
  includeMetrics = true,
}: {
  includeMetrics?: boolean;
}) {
  return (
    <div
      role="status"
      aria-label="Loading management content"
      className="space-y-4"
    >
      {includeMetrics && (
        <div className="grid gap-3 sm:grid-cols-2 min-[70rem]:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}
      <Skeleton className="h-16" />
      {Array.from({ length: 9 }, (_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
