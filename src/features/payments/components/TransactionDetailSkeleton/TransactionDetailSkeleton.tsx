import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
export function TransactionDetailSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading transaction details"
      className="flex h-dvh max-h-dvh flex-col items-center overflow-y-auto bg-[#e5e9e7] p-4"
    >
      <span className="sr-only">Loading transaction details</span>
      <div className="my-auto w-full max-w-lg space-y-3 py-4">
        <Skeleton className="h-8 w-20" />
        <div className="space-y-5 rounded-2xl bg-white p-4">
          <Skeleton className="mx-auto size-12" />
          <Skeleton className="mx-auto h-12 w-40" />
          <Skeleton className="h-16" />
          <Skeleton className="h-64" />
          <Skeleton className="h-8" />
        </div>
      </div>
    </main>
  );
}
