import Link from 'next/link';
import {
  NotebookPen,
  MessageSquareWarning,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { TicketElapsed } from '@/features/support/components/TicketElapsed/TicketElapsed';
import { TicketAttachments } from '@/features/support/components/TicketAttachments/TicketAttachments';
import type { TicketDetail } from '@/features/support/types/ticketDetailTypes';
export function TicketSummary({ detail }: { detail: TicketDetail }) {
  const { ticket } = detail;
  const heading =
    'mb-4 flex items-center gap-2 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500';
  return (
    <aside aria-label="Ticket summary" className="min-w-0 space-y-4">
      <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-white p-3 font-mono text-xs text-[#788096]">
        <span>{ticket.updated}</span>
        <span>{detail.openedTime}</span>
      </div>
      <section className="rounded-2xl bg-white p-4">
        <h2 className={heading}>
          <MessageSquareWarning className="size-3.5" />
          Ticket Details
        </h2>
        <div className="space-y-3 border-t border-neutral-100 pt-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {ticket.subject}
            </h3>
            <span className="max-w-full text-[10px] break-all text-neutral-500">
              #{ticket.id}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {detail.customerId ? (
              <Link
                href={CUSTOMER_ROUTES.details(detail.customerId)}
                className="text-emerald-600 underline focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                {ticket.customer}
              </Link>
            ) : (
              <span className="text-emerald-600">{ticket.customer}</span>
            )}
            <span className="flex items-center gap-1 text-[#788096]">
              Priority:{' '}
              <StatusBadge
                tone={ticket.priority === 'Critical' ? 'danger' : 'warning'}
              >
                {ticket.priority}
              </StatusBadge>
            </span>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-neutral-100 pt-3 text-[10px]">
            <span className="rounded-full bg-neutral-50 px-2 text-neutral-500">
              {ticket.category}
            </span>
            <span className="text-[#788096]">
              Assigned to: {ticket.assignee}
            </span>
          </div>
        </div>
      </section>
      <section className="rounded-2xl bg-white p-4">
        <h2 className={heading}>
          <SquareArrowOutUpRight className="size-3.5" />
          Resolution Details
        </h2>
        <div className="space-y-3 border-t border-neutral-100 pt-4">
          <p className="text-xs text-[#788096]">
            Time in Queue · Static sample
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TicketElapsed seconds={ticket.elapsedSeconds} />
            <StatusBadge
              tone={
                ticket.status === 'Resolved'
                  ? 'success'
                  : ticket.status === 'Overdue'
                    ? 'danger'
                    : 'warning'
              }
            >
              {ticket.status}
            </StatusBadge>
          </div>
          <dl className="space-y-2 border-t border-neutral-100 pt-3 text-[10px] text-[#788096]">
            <div className="flex flex-wrap justify-between gap-2">
              <dt>Escalated to:</dt>
              <dd className="text-emerald-600">{detail.team}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt>Assigned staff:</dt>
              <dd>{ticket.assignee}</dd>
            </div>
          </dl>
        </div>
      </section>
      <TicketAttachments items={detail.attachments} />
      <section className="rounded-xl bg-neutral-100 p-3">
        <h2 className="mb-4 flex items-center gap-2 rounded-lg bg-white p-3 text-xs text-neutral-500">
          <NotebookPen className="size-3.5" />
          Admin Notes
        </h2>
        <p className="text-xs leading-6 text-neutral-600">{detail.notes}</p>
      </section>
    </aside>
  );
}
