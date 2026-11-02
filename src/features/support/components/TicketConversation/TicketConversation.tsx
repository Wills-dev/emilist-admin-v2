'use client';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { TicketReplyDraft } from '@/features/support/components/TicketReplyDraft/TicketReplyDraft';
import type {
  TicketDetail,
  TicketMessage,
} from '@/features/support/types/ticketDetailTypes';
export function TicketConversation({
  detail,
  messages,
}: {
  detail: TicketDetail;
  messages: readonly TicketMessage[];
}) {
  const { ticket } = detail;
  return (
    <section
      aria-label="Ticket conversation"
      className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div className="min-w-0">
          <p className="text-xs break-all text-[#788096]">{ticket.id}</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            {ticket.subject}
          </h2>
          <p className="mt-2 text-xs text-[#788096]">
            Last Updated: {ticket.updated} · Synthetic conversation
          </p>
        </div>
        <StatusBadge
          tone={
            ticket.status === 'Resolved'
              ? 'success'
              : ticket.status === 'Overdue'
                ? 'danger'
                : 'warning'
          }
        >
          {ticket.status === 'Pending' ? 'Pending Resolution' : ticket.status}
        </StatusBadge>
      </header>
      {messages.length ? (
        <ol
          aria-label="Conversation messages"
          className="flex flex-1 flex-col justify-between gap-7 p-4 sm:p-5"
        >
          {messages.map((message) => (
            <li
              key={message.id}
              className={`flex items-start gap-3 ${message.sender === 'Staff' ? 'flex-row-reverse' : ''}`}
            >
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-600"
              >
                {message.initials}
              </span>
              <div className="max-w-[90%] min-w-0 space-y-2 rounded-2xl bg-[#f8f9fa] p-4 sm:max-w-[85%]">
                <p className="text-[10px] font-semibold text-[#788096]">
                  {message.author} · {message.time}
                </p>
                <p className="text-xs leading-5 break-words whitespace-pre-wrap text-slate-900">
                  {message.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex-1 p-5">
          <EmptyState
            title="No messages match"
            description="No sample conversation messages match the selected search or sender."
          />
        </div>
      )}
      <TicketReplyDraft
        key={ticket.id}
        resolved={ticket.status === 'Resolved'}
      />
    </section>
  );
}
