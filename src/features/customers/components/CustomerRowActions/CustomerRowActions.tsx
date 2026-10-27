'use client';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';
import { CUSTOMER_ROUTES } from '@/constants/routes';
export function CustomerRowActions({
  customerId,
  name,
}: {
  customerId: string;
  name: string;
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
        className="flex size-8 cursor-pointer list-none items-center justify-center rounded-md text-slate-500 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden"
      >
        <EllipsisVertical className="size-4" />
      </summary>
      <div className="absolute top-0 right-9 z-10 w-48 rounded-lg border border-slate-100 bg-white p-2 shadow-lg">
        <Link
          href={CUSTOMER_ROUTES.details(customerId)}
          className="block rounded px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          View customer
        </Link>
        <button
          type="button"
          disabled
          className="block w-full px-3 py-2 text-left text-xs text-slate-400"
        >
          Edit — unavailable
        </button>
        <button
          type="button"
          disabled
          className="block w-full px-3 py-2 text-left text-xs text-rose-300"
        >
          Suspend — unavailable
        </button>
      </div>
    </details>
  );
}
