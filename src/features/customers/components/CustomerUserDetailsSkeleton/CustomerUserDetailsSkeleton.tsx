import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export function CustomerUserDetailsSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading customer details"
      className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-6"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className={
            index > 9 ? 'space-y-2 sm:col-span-3' : 'space-y-2 sm:col-span-2'
          }
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-32 max-w-full" />
        </div>
      ))}
    </section>
  );
}
