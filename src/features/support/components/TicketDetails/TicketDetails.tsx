'use client';
import { LifeBuoy } from 'lucide-react';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { TicketActions } from '@/features/support/components/TicketActions/TicketActions';
import { TicketSummary } from '@/features/support/components/TicketSummary/TicketSummary';
import { TicketConversation } from '@/features/support/components/TicketConversation/TicketConversation';
import { useTicketConversation } from '@/features/support/hooks/useTicketConversation/useTicketConversation';
import type { TicketDetail } from '@/features/support/types/ticketDetailTypes';
export function TicketDetails({ detail }: { detail: TicketDetail }) {
  const table = useTicketConversation(detail.messages);
  return (
    <div className="min-w-0 space-y-4">
      <h1 className="sr-only">{detail.ticket.subject} — Ticket Details</h1>
      <TicketActions ticket={detail.ticket} />
      <TableToolbar
        leading={
          <p className="flex min-w-0 items-center gap-2 text-[10px] tracking-widest text-emerald-600">
            <LifeBuoy className="size-4 shrink-0" />
            <span className="break-all">#{detail.ticket.id}</span>
          </p>
        }
        label="Ticket conversation"
        count={table.count}
        search={table.search}
        status={table.status}
        statuses={['Customer', 'Staff']}
        filterLabel="Sender"
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <div className="grid min-w-0 items-stretch gap-4 min-[75rem]:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
        <div className="order-2 min-w-0 min-[75rem]:order-1">
          <TicketSummary detail={detail} />
        </div>
        <div className="order-1 h-full min-w-0 min-[75rem]:order-2">
          <TicketConversation detail={detail} messages={table.rows} />
        </div>
      </div>
    </div>
  );
}
