'use client';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';
export function RecordActions({
  name,
  actions,
  viewHref,
  viewLabel,
}: {
  name: string;
  actions: readonly string[];
  viewHref?: string;
  viewLabel?: string;
}) {
  return (
    <details
      className="group relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.currentTarget.open = false;
          event.currentTarget.querySelector('summary')?.focus();
        }
      }}
    >
      <summary
        aria-label={`Actions for ${name}`}
        className="flex size-8 cursor-pointer list-none items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none [&::-webkit-details-marker]:hidden"
      >
        <EllipsisVertical className="size-4" />
      </summary>
      <div className="absolute top-0 right-9 z-10 w-48 rounded-lg border border-slate-100 bg-white p-2 shadow-lg motion-safe:animate-[overview-enter_200ms_ease-out]">
        <p className="px-2 py-1 text-[10px] text-slate-500">
          Requires backend integration
        </p>
        {viewHref && (
          <Link
            href={viewHref}
            className="block rounded px-2 py-2 text-xs text-slate-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
          >
            {viewLabel || 'View'}
          </Link>
        )}
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            disabled
            className="block w-full px-2 py-2 text-left text-xs text-slate-400"
          >
            {action} — unavailable
          </button>
        ))}
      </div>
    </details>
  );
}
