import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export function ChangePasswordSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading change password"
      className="mx-auto max-w-xl space-y-4"
    >
      <Skeleton className="h-8 w-32" />
      <div className="space-y-6 rounded-xl bg-white p-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-full" />
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-12 w-full" />
            {index === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((rule) => (
                  <Skeleton key={rule} className="h-3 w-full" />
                ))}
              </div>
            )}
          </div>
        ))}
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
