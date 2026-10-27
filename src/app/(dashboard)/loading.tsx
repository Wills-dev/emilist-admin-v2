import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export default function Loading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <span className="sr-only">Loading dashboard</span>
    </div>
  );
}
