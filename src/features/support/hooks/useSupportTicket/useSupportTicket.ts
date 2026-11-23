'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSupportTicket,
  assignSupportTicket,
  replyToSupportTicket,
  addSupportTicketNote,
  updateSupportTicket,
  resolveSupportTicket,
} from '@/features/support/api/supportRequests';
import { normalizeTicketDetail } from '@/features/support/helpers/supportApiMappers';
import { supportQueryKeys } from '@/features/support/lib/supportQueryKeys';

export function useSupportTicket(requestId: string) {
  const client = useQueryClient();
  const detail = useQuery({
    queryKey: supportQueryKeys.detail(requestId),
    queryFn: ({ signal }) =>
      getSupportTicket(requestId, signal).then(normalizeTicketDetail),
  });
  const refresh = async () => {
    await client.invalidateQueries({
      queryKey: supportQueryKeys.detail(requestId),
    });
    await client.invalidateQueries({ queryKey: ['support', 'summary'] });
    await client.invalidateQueries({ queryKey: ['support', 'list'] });
  };
  return {
    detail,
    assign: useMutation({
      mutationFn: (body: unknown) => assignSupportTicket(requestId, body),
      onSuccess: refresh,
    }),
    reply: useMutation({
      mutationFn: (body: FormData) => replyToSupportTicket(requestId, body),
      onSuccess: refresh,
    }),
    addNote: useMutation({
      mutationFn: (body: unknown) => addSupportTicketNote(requestId, body),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: (body: unknown) => updateSupportTicket(requestId, body),
      onSuccess: refresh,
    }),
    resolve: useMutation({
      mutationFn: (body: unknown) => resolveSupportTicket(requestId, body),
      onSuccess: refresh,
    }),
  };
}
