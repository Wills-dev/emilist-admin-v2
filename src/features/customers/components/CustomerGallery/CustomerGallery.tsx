'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
export function CustomerGallery({
  label,
  items,
}: {
  label: string;
  items: readonly string[];
}) {
  const [index, setIndex] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  function select(next: number, focus = false) {
    const value = Math.max(0, Math.min(next, items.length - 1));
    setIndex(value);
    refs.current[value]?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
    if (focus) refs.current[value]?.focus({ preventScroll: true });
  }
  return (
    <section aria-label={label} className="min-w-0 rounded-xl bg-white p-3">
      <p className="mb-3 text-[10px] text-slate-400">
        {label} · Image assets not supplied
      </p>
      <div
        role="group"
        aria-label={`${label} thumbnails`}
        className="flex min-w-0 gap-3 overflow-x-auto py-1"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            select(index + 1, true);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            select(index - 1, true);
          }
        }}
      >
        {items.map((item, position) => (
          <button
            key={item}
            type="button"
            ref={(node) => {
              refs.current[position] = node;
            }}
            onClick={() => select(position)}
            aria-label={`${label}: ${item}, image unavailable`}
            aria-pressed={index === position}
            className={cn(
              'flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-2 rounded border border-dashed border-neutral-300 bg-neutral-50 px-1 text-[9px] text-neutral-400 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none',
              index === position && 'border-emerald-400 bg-emerald-50/30',
            )}
          >
            <ImagePlus aria-hidden="true" className="size-5" />
            <span>{item}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            aria-label={`Previous ${label.toLowerCase()}`}
            disabled={index === 0}
            onClick={() => select(index - 1)}
            className="rounded p-1 text-neutral-500 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-30"
          >
            <ArrowLeft className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Next ${label.toLowerCase()}`}
            disabled={index === items.length - 1}
            onClick={() => select(index + 1)}
            className="rounded p-1 text-neutral-500 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-30"
          >
            <ArrowRight className="size-3.5" />
          </button>
        </div>
        <span role="status" className="text-[10px] text-neutral-500">
          {index + 1} of {items.length}
        </span>
      </div>
    </section>
  );
}
