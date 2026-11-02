import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function MaterialOrderSkeleton({
  label = 'Loading order details',
}: {
  label?: string;
}) {
  return (
    <div role="status" aria-label={label} className="space-y-4">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-10 w-40" />
      <div className="grid gap-4 min-[75rem]:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4 rounded-xl bg-white p-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-20 w-64 max-w-full" />
          <Skeleton className="aspect-[2.6/1] min-h-40" />
          <Skeleton className="h-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-24" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}
