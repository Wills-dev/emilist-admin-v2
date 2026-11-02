'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import type { TicketMessage } from '@/features/support/types/ticketDetailTypes';
export function useTicketConversation(messages: readonly TicketMessage[]) {
  return useFixtureTable({
    rows: messages,
    pageSize: 20,
    searchText: (row) => `${row.author} ${row.text}`,
    rowStatus: (row) => row.sender,
  });
}
