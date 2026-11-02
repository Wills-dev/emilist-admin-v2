'use client';
import { Search, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { materialReviewSummary } from '@/features/materials/helpers/materialOrderDetailHelpers';
import { useOrderPresentation } from '@/features/materials/hooks/useOrderPresentation/useOrderPresentation';
import type { MaterialOrderDetail } from '@/features/materials/types/materialOrderDetailTypes';
export function OrderReviews({
  detail,
}: {
  detail: Pick<MaterialOrderDetail, 'comments' | 'reviewCounts'>;
}) {
  const { total, average } = materialReviewSummary(detail.reviewCounts);
  const table = useOrderPresentation(detail.comments);
  return (
    <aside aria-label="Product reviews" className="min-w-0 space-y-3">
      <section className="rounded-2xl bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Star className="size-5 fill-orange-400 text-orange-400" />
          {total} Reviews
        </h2>
        <dl className="mt-6 space-y-5">
          {detail.reviewCounts.map((count, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <dt className="w-11 shrink-0 text-neutral-500">
                {5 - index} Stars
              </dt>
              <dd className="flex min-w-0 flex-1 items-center gap-2">
                <progress
                  aria-label={`${5 - index} star reviews`}
                  value={count}
                  max={total || 1}
                  className="h-2 min-w-0 flex-1 overflow-hidden rounded-full [&::-moz-progress-bar]:bg-orange-400 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-neutral-100 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-orange-400"
                />
                <span className="w-7 text-right text-neutral-600">
                  ({count})
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-2xl bg-white p-4">
        <h2 className="text-[10px] text-neutral-500">MERCHANT RATING</h2>
        <div
          aria-label={`Merchant rating: ${average.toFixed(1)} out of 5`}
          className="mt-4 flex flex-wrap justify-between gap-2"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              className={`flex items-center gap-1 rounded-full px-1 text-[10px] ${Math.round(average) === rating ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-500'}`}
            >
              <Star className="size-3 fill-orange-400 text-orange-400" />
              {rating.toFixed(1)}
            </span>
          ))}
        </div>
      </section>
      <section className="rounded-2xl bg-white p-4">
        <h2 className="text-[10px] text-neutral-500">
          {detail.comments.length} SAMPLE COMMENTS
        </h2>
        <div className="relative mt-4">
          <Search className="absolute top-2 left-3 size-4 text-neutral-500" />
          <input
            aria-label="Search comments"
            maxLength={200}
            value={table.search}
            onChange={(event) => table.setSearch(event.target.value)}
            placeholder="Search Comments"
            className="h-8 w-full rounded-full border-0 bg-neutral-100 pr-3 pl-9 text-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
          />
        </div>
        {table.comments.length ? (
          table.comments.map((comment) => (
            <article
              key={comment.id}
              className="mt-5 space-y-4 border-t border-neutral-200 pt-5"
            >
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-xs text-neutral-500"
              >
                {comment.initials}
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{comment.name}</h3>
                <span
                  aria-label={`${comment.rating} out of 5 stars`}
                  className="flex text-orange-400"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      aria-hidden="true"
                      className={`size-4 ${value <= comment.rating ? 'fill-current' : 'text-neutral-300'}`}
                    />
                  ))}
                </span>
              </div>
              <p className="text-xs leading-5 text-neutral-600">
                {comment.text}
              </p>
              <p className="text-[10px] text-neutral-400 italic">
                Published {comment.date}
              </p>
              <div className="flex flex-wrap justify-end gap-4">
                {[
                  {
                    label: 'Helpful',
                    icon: ThumbsUp,
                    color: 'text-emerald-500',
                  },
                  {
                    label: 'Not Helpful',
                    icon: ThumbsDown,
                    color: 'text-rose-500',
                  },
                ].map(({ label, icon: Icon, color }) => (
                  <button
                    key={label}
                    type="button"
                    disabled
                    title="Review voting requires backend integration"
                    className={`flex items-center gap-1 text-[10px] disabled:cursor-not-allowed ${color}`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            title="No comments match"
            description="No sample comments match your search."
          />
        )}
      </section>
    </aside>
  );
}
