'use client';
import { useId, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CalendarDays, X } from 'lucide-react';
import { useDialogEscape } from '@/hooks/useDialogEscape/useDialogEscape';
import { Calendar } from '@/components/ui/Calendar/Calendar';
export function DatePicker({
  label,
  value,
  onChange,
  onBlur,
  name,
  invalid,
  describedBy,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  useDialogEscape(open, setOpen);
  const id = useId();
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex min-w-0 items-center rounded-xl bg-[#eeeeee]">
        <label className="sr-only" htmlFor={id}>
          {label}
        </label>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`Choose ${label.toLowerCase()}`}
            className="ml-2 shrink-0 rounded-md bg-white p-2 text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
          >
            <CalendarDays className="size-4" />
          </button>
        </Dialog.Trigger>
        <input
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          type="text"
          inputMode="numeric"
          maxLength={10}
          placeholder={label}
          title="Enter YYYY-MM-DD or choose a date from the calendar"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="h-11 w-full min-w-0 rounded-xl border-0 bg-transparent px-3 text-sm text-neutral-600 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-emerald-600"
        />
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-[60] bg-black/20" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="fixed inset-x-4 top-1/2 z-[70] mx-auto max-h-[calc(100dvh_-_2rem)] max-w-xs -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-3 shadow-xl outline-none"
        >
          <Dialog.Title className="sr-only">
            Choose {label.toLowerCase()}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Select a date using the month and year selectors or calendar
            keyboard navigation.
          </Dialog.Description>
          <div className="mb-1 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close calendar"
                className="rounded p-1 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex justify-center">
            <Calendar
              key={open ? 'open' : 'closed'}
              value={value}
              onSelect={(selected) => {
                onChange(selected);
                setOpen(false);
              }}
              initialFocus
            />
          </div>
          <button
            type="button"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="mt-2 rounded px-3 py-2 text-xs text-neutral-500 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            Clear date
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
