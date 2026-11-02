'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, ImageOff, Paperclip } from 'lucide-react';
export function TicketAttachments({ items }: { items: readonly string[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / 4));
  const button =
    'rounded p-1 text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none';
  return (
    <section aria-label="Chat attachments" className="rounded-2xl bg-white p-4">
      <header className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 p-3">
        <h2 className="flex items-center gap-2 text-xs text-neutral-500">
          <Paperclip className="size-3.5" />
          Chat Attachments
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous attachments"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={button}
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next attachments"
            disabled={page >= pages - 1}
            onClick={() => setPage(page + 1)}
            className={button}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </header>
      {items.length ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {items.slice(page * 4, page * 4 + 4).map((item) => (
              <div
                key={item}
                role="img"
                aria-label={`${item} — attachment not supplied`}
                className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded border border-dashed border-neutral-300 bg-neutral-50 p-1 text-center text-[8px] text-neutral-400"
              >
                <ImageOff className="size-5" />
                {item}
              </div>
            ))}
          </div>
          <p
            aria-live="polite"
            className="mt-2 text-right text-[9px] text-neutral-400"
          >
            {page + 1} of {pages} · Files unavailable
          </p>
        </>
      ) : (
        <p className="mt-4 text-xs text-neutral-500">
          No attachment samples supplied.
        </p>
      )}
    </section>
  );
}
