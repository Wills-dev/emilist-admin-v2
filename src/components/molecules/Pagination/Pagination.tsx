import { ArrowLeft, ArrowRight } from 'lucide-react';
export function Pagination({
  page,
  pages,
  onPageChange,
  count,
}: {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  count: number;
}) {
  const visible = Array.from(new Set([1, page - 1, page, page + 1, pages]))
    .filter((value) => value >= 1 && value <= pages)
    .sort((a, b) => a - b);
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white p-3"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-40 motion-reduce:transition-none"
      >
        <ArrowLeft className="size-3.5" />
        Previous
      </button>
      <div className="flex items-center gap-2">
        {visible.map((value, index) => (
          <span key={value} className="flex items-center gap-2">
            {index > 0 && value - (visible[index - 1] || 0) > 1 && (
              <span aria-hidden="true">…</span>
            )}
            <button
              type="button"
              aria-label={`Page ${value}`}
              aria-current={page === value ? 'page' : undefined}
              onClick={() => onPageChange(value)}
              className={`size-8 rounded-lg text-xs focus-visible:outline-2 focus-visible:outline-emerald-600 ${page === value ? 'bg-emerald-50 text-emerald-900' : 'text-slate-500 hover:bg-neutral-50'}`}
            >
              {value}
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-40 motion-reduce:transition-none"
      >
        Next
        <ArrowRight className="size-3.5" />
      </button>
      <span className="sr-only">
        {count} matching sample records. Page {page} of {pages}.
      </span>
    </nav>
  );
}
