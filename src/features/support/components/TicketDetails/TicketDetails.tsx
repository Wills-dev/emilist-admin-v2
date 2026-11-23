'use client';
import { useQuery } from '@tanstack/react-query';
import { getSupportAssignees } from '@/features/support/api/supportRequests';
import { TicketActions } from '@/features/support/components/TicketActions/TicketActions';
import { TicketSummary } from '@/features/support/components/TicketSummary/TicketSummary';
import { TicketConversation } from '@/features/support/components/TicketConversation/TicketConversation';
import type { TicketDetail } from '@/features/support/types/ticketDetailTypes';
import { useSupportTicket } from '@/features/support/hooks/useSupportTicket/useSupportTicket';
import { TicketDetailSkeleton } from '@/features/support/components/TicketDetailSkeleton/TicketDetailSkeleton';
import { normalizeAssignees } from '@/features/support/helpers/supportApiMappers';
import { supportQueryKeys } from '@/features/support/lib/supportQueryKeys';
export function TicketDetails({
  detail: initialDetail,
  ticketId,
}: {
  detail?: TicketDetail;
  ticketId?: string;
}) {
  const live = useSupportTicket(ticketId || initialDetail?.ticket.id || '');
  const assignees = useQuery({
    queryKey: supportQueryKeys.assignees(),
    queryFn: ({ signal }) =>
      getSupportAssignees(signal).then(normalizeAssignees),
  });
  const detail = ticketId ? live.detail.data : initialDetail;
  if (!detail) {
    return live.detail.isError ? (
      <p role="alert" className="rounded-xl bg-white p-6 text-sm text-rose-600">
        Unable to load this support ticket.
      </p>
    ) : (
      <TicketDetailSkeleton />
    );
  }
  return (
    <div className="min-w-0 space-y-4">
      <h1 className="sr-only">{detail.ticket.subject} — Ticket Details</h1>
      <TicketActions
        ticket={detail.ticket}
        teams={assignees.data?.teams || []}
        onAssign={
          ticketId ? (body) => live.assign.mutateAsync(body) : undefined
        }
        onResolve={
          ticketId ? (body) => live.resolve.mutateAsync(body) : undefined
        }
        pending={
          ticketId ? live.assign.isPending || live.resolve.isPending : false
        }
      />
      <div className="grid min-w-0 items-stretch gap-4 min-[75rem]:h-[calc(100dvh-14rem)] min-[75rem]:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
        <div className="order-2 min-w-0 min-[75rem]:order-1 min-[75rem]:overflow-y-auto">
          <TicketSummary detail={detail} />
        </div>
        <div className="order-1 h-full min-w-0 min-[75rem]:order-2">
          <TicketConversation
            detail={detail}
            messages={detail.messages}
            onReply={
              ticketId
                ? (body) => live.reply.mutateAsync(body)
                : undefined
            }
            replyPending={ticketId ? live.reply.isPending : false}
          />
        </div>
      </div>
    </div>
  );
}
