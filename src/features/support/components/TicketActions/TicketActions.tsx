'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { TicketActionForms } from '@/features/support/components/TicketActionForms/TicketActionForms';
import type { SupportTicket } from '@/features/support/types/supportTypes';
export function TicketActions({ ticket }: { ticket: SupportTicket }) {
  const [action, setAction] = useState<'escalate' | 'resolve'>('escalate');
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const title =
    action === 'escalate' ? 'Escalate/Re-assign Ticket' : 'Resolve Ticket';
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={ROUTES.support}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          <ChevronLeft className="size-4" />
          Back to Support
        </Link>
        <div className="flex flex-wrap gap-3">
          {(['escalate', 'resolve'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              disabled={kind === 'resolve' && ticket.status === 'Resolved'}
              title={
                kind === 'resolve' && ticket.status === 'Resolved'
                  ? 'This synthetic ticket is already resolved'
                  : undefined
              }
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setAction(kind);
                setOpen(true);
              }}
              className={`rounded-xl px-5 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${kind === 'resolve' ? 'bg-[#20c46b] text-white hover:bg-emerald-600' : 'bg-white text-slate-950 hover:bg-emerald-50'}`}
            >
              {kind === 'escalate'
                ? 'Escalate/Re-assign Ticket'
                : 'Resolve Ticket'}
            </button>
          ))}
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-40 bg-black/25" />
        <Dialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
          className={`fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100dvh_-_2rem)] -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl outline-none motion-safe:animate-[overview-enter_200ms_ease-out] ${action === 'escalate' ? 'max-w-xl' : 'max-w-md'}`}
        >
          <header className="mb-5 flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
            <Dialog.Title className="text-xl font-semibold tracking-tight text-[#4c554e]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close ticket dialog"
                className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </header>
          {action === 'escalate' && (
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="min-w-0 rounded-lg bg-neutral-50 p-3 break-all">
                #{ticket.id}
              </span>
              <span className="rounded-lg bg-neutral-50 p-3">
                {ticket.subject}
              </span>
              <span className="flex items-center gap-2 rounded-lg bg-neutral-50 p-3">
                Priority:{' '}
                <StatusBadge
                  tone={ticket.priority === 'Critical' ? 'danger' : 'warning'}
                >
                  {ticket.priority}
                </StatusBadge>
              </span>
            </div>
          )}
          <Dialog.Description
            className={
              action === 'escalate'
                ? 'sr-only'
                : 'mb-6 text-sm leading-6 text-[#788096]'
            }
          >
            {action === 'escalate'
              ? 'Choose a sample team and priority for this ticket draft. No assignment will be saved.'
              : 'Has the user’s issue been resolved successfully?'}
          </Dialog.Description>
          <TicketActionForms action={action} ticket={ticket} />
          <div className="mt-6 flex gap-3 border-t border-neutral-100 pt-6">
            {action === 'resolve' && (
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
                >
                  Cancel
                </button>
              </Dialog.Close>
            )}
            <button
              type="submit"
              form="ticket-action-form"
              disabled
              title="Backend integration required; no ticket changes will be saved"
              className="flex-1 rounded-lg bg-[#20c46b] px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {action === 'escalate' ? 'Submit' : 'Resolve Ticket'}
            </button>
          </div>
          <p
            role="note"
            className="mt-3 text-center text-[10px] text-slate-500"
          >
            Preview only. Ticket changes require backend integration.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
