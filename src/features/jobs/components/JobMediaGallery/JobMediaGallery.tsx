'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ImageOff,
  FileText,
  FileVideo,
} from 'lucide-react';
export function JobMediaGallery({
  variant = 'job',
}: {
  variant?: 'job' | 'expert';
}) {
  const [index, setIndex] = useState(0);
  const items =
    variant === 'job'
      ? ['Room overview', 'Cabinet repairs', 'Door repairs']
      : ['Workshop overview', 'Project example', 'Tools and materials'];
  return (
    <section
      aria-label={variant === 'job' ? 'Job media' : 'Expert media'}
      className="min-w-0"
    >
      <div
        role="img"
        aria-label={`${items[index]} — image not supplied`}
        className={`flex min-h-40 items-center justify-center rounded-xl border-8 border-neutral-100 bg-stone-50 p-4 ${variant === 'job' ? 'aspect-[2.6/1]' : 'aspect-[4/3]'}`}
      >
        <div className="text-center text-stone-400">
          <ImageOff className="mx-auto mb-2 size-8" />
          <p className="text-xs">{items[index]}</p>
          <p className="mt-1 text-[10px]">Image not supplied</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 py-3">
        <button
          type="button"
          aria-label={`Previous ${variant} image`}
          onClick={() => setIndex((index + 2) % 3)}
          className="rounded p-2 text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          <ArrowLeft className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Next ${variant} image`}
          onClick={() => setIndex((index + 1) % 3)}
          className="rounded p-2 text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          <ArrowRight className="size-3.5" />
        </button>
        <div className="flex flex-wrap gap-2">
          {['demo-work.mp4', 'demo-table.docx', 'demo-notes.pdf'].map(
            (file, i) => (
              <button
                key={file}
                type="button"
                disabled
                title="Attachment not supplied; downloads unavailable"
                className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-1 text-[10px] text-neutral-500 disabled:cursor-not-allowed"
              >
                {i === 0 ? (
                  <FileVideo className="size-3" />
                ) : (
                  <FileText
                    className={`size-3 ${i === 1 ? 'text-blue-600' : 'text-rose-500'}`}
                  />
                )}
                <span className="break-all">{file}</span>
              </button>
            ),
          )}
        </div>
        <span
          aria-live="polite"
          className="ml-auto text-[9px] text-neutral-500"
        >
          {index + 1} of {items.length}
        </span>
      </div>
    </section>
  );
}
