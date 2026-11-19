import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { cn } from '@/lib/utils/cn';

export function CurrentUserSkeleton({
  placement,
}: {
  placement: 'header' | 'sidebar';
}) {
  return (
    <div
      role="status"
      aria-label={`Loading ${placement} profile`}
      className={cn(
        'flex items-center gap-3',
        placement === 'sidebar' && 'border-t border-neutral-100 pt-5',
      )}
    >
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div
        className={cn('space-y-2', placement === 'header' && 'hidden lg:block')}
      >
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-16" />
        {placement === 'sidebar' && <Skeleton className="h-2 w-28" />}
      </div>
    </div>
  );
}
