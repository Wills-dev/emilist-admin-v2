import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function TicketDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading ticket details"
      className="space-y-4"
    >
      <span className="sr-only">Loading ticket details</span>
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-16" />
      <div className="grid gap-4 min-[75rem]:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-160" />
      </div>
    </div>
  );
}
