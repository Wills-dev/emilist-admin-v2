'use client';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CalendarDays, X } from 'lucide-react';
import { useDialogEscape } from '@/hooks/useDialogEscape/useDialogEscape';
import { Calendar } from '@/components/ui/Calendar/Calendar';
import {
  validDateRange,
  dateName,
  type DateRange,
} from '@/lib/date/calendarDates';
export function DateRangePicker({
  value,
  onChange,
  caption,
  label = 'Select dates',
}: {
  value: DateRange;
  onChange: (value: DateRange) => void;
  caption: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  useDialogEscape(open, setOpen);
  const [draft, setDraft] = useState(value);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(value);
        setOpen(next);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="flex items-center gap-2 rounded bg-neutral-50 p-2 text-xs text-slate-600 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          <CalendarDays className="size-4" />
          {caption}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-[60] bg-black/20" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="fixed inset-x-4 top-1/2 z-[70] mx-auto max-h-[calc(100dvh_-_2rem)] max-w-xs -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-3 shadow-xl outline-none"
        >
          <header className="flex items-center justify-between gap-3 px-2">
            <Dialog.Title className="text-sm font-semibold text-neutral-700">
              Select date range
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close calendar"
                className="rounded p-1 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </header>
          <Dialog.Description className="mt-2 px-2 text-xs text-neutral-500">
            Choose the start date, then the end date.
          </Dialog.Description>
          <div className="mt-2 flex justify-center">
            <Calendar
              mode="range"
              value={draft}
              onSelect={setDraft}
              initialFocus
            />
          </div>
          <p aria-live="polite" className="px-2 text-[10px] text-neutral-500">
            {draft.from ? dateName(draft.from) : 'Choose start'} —{' '}
            {draft.to ? dateName(draft.to) : 'Choose end'}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-xs text-slate-600 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={!validDateRange(draft)}
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
              className="rounded-lg bg-[#20c46b] p-2 text-xs text-white hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply dates
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
