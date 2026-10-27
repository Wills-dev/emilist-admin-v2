import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function CustomerSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading customer content"
      className="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-16" />
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-16" />
        ))}
      </div>
    </div>
  );
}
