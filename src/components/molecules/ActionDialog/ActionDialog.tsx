'use client';
import { useState, type ReactElement, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useDialogEscape } from '@/hooks/useDialogEscape/useDialogEscape';
export function ActionDialog({
  title,
  description,
  trigger,
  children,
  confirmLabel,
  confirmDisabled = true,
  onConfirm,
  onOpenChange,
  note = 'Preview only. Backend integration is required to submit changes.',
  width = 'md',
  tone = 'success',
}: {
  title: string;
  description?: string;
  trigger: ReactElement;
  children?: ReactNode;
  confirmLabel: string;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
  note?: string;
  width?: 'sm' | 'md' | 'lg';
  tone?: 'success' | 'danger';
}) {
  const [open, setOpen] = useState(false);
  function update(value: boolean) {
    setOpen(value);
    onOpenChange?.(value);
  }
  useDialogEscape(open, setOpen);
  return (
    <Dialog.Root open={open} onOpenChange={update}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-50 bg-black/25" />
        <Dialog.Content
          onCloseAutoFocus={() => onOpenChange?.(false)}
          className={`fixed inset-x-4 top-1/2 z-[55] mx-auto max-h-[calc(100dvh_-_2rem)] -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-5 shadow-2xl outline-none motion-safe:animate-[overview-enter_200ms_ease-out] ${width === 'sm' ? 'max-w-sm' : width === 'lg' ? 'max-w-xl' : 'max-w-md'}`}
        >
          <header className="mb-5 flex items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <Dialog.Title className="text-lg font-semibold text-[#4c554e]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={`Close ${title.toLowerCase()}`}
                className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </header>
          <Dialog.Description
            className={
              description ? 'mb-5 text-xs leading-5 text-[#788096]' : 'sr-only'
            }
          >
            {description || `Review the ${title.toLowerCase()} draft.`}
          </Dialog.Description>
          {children}
          <footer className="mt-5 flex gap-3 border-t border-neutral-100 pt-4">
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-xs text-slate-600 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={confirmDisabled}
              onClick={() => {
                if (confirmDisabled) return;
                update(false);
                onConfirm?.();
              }}
              className={`flex-1 rounded-lg px-3 py-2.5 text-xs text-white transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${tone === 'danger' ? 'bg-[#ff527c] hover:bg-rose-600' : 'bg-[#20c46b] hover:bg-emerald-600'}`}
            >
              {confirmLabel}
            </button>
          </footer>
          {note && (
            <p
              role="note"
              className="mt-3 text-center text-[10px] text-slate-400"
            >
              {note}
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
