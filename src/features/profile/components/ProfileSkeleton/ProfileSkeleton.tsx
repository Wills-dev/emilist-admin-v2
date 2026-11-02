import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function ProfileSkeleton() {
  return (
    <div role="status" aria-label="Loading profile" className="space-y-4">
      <span className="sr-only">Loading profile</span>
      <Skeleton className="h-12" />
      <Skeleton className="h-24" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-160" />
        <Skeleton className="h-160" />
      </div>
    </div>
  );
}
