import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function SettingsSkeleton() {
  return (
    <div role="status" aria-label="Loading settings" className="space-y-4">
      <Skeleton className="h-14" />
      <Skeleton className="h-40" />
      <Skeleton className="h-56" />
      <Skeleton className="h-64" />
    </div>
  );
}
