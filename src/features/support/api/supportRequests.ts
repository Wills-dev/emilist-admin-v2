import { z } from 'zod';
import { apiClient } from '@/lib/api/apiClient';
import { ApiError } from '@/lib/api/apiError';

const envelopeSchema = z
  .object({
    message: z.string().optional(),
    data: z.unknown().optional(),
  })
  .passthrough();

async function request<T>(
  path: string,
  init?: {
    method?: 'GET' | 'POST' | 'PATCH';
    body?: unknown;
    signal?: AbortSignal;
  },
): Promise<T> {
  const response = await apiClient.request<unknown>({
    url: `/api/admin/support-requests${path}`,
    method: init?.method || 'GET',
    data: init?.body,
    signal: init?.signal,
  });
  const parsed = envelopeSchema.safeParse(response.data);
  if (!parsed.success)
    throw new ApiError('Invalid support response.', 'server');
  return (parsed.data.data ?? parsed.data) as T;
}

export interface SupportSummary {
  [key: string]: unknown;
}
export interface SupportAssignees {
  [key: string]: unknown;
}
export interface SupportTicketRecord {
  [key: string]: unknown;
}
export interface SupportTicketDetail {
  [key: string]: unknown;
}
export interface SupportListResult {
  [key: string]: unknown;
}

export function getSupportSummary(signal?: AbortSignal) {
  return request<SupportSummary>('', { signal });
}
export function getSupportAssignees(signal?: AbortSignal) {
  return request<SupportAssignees>('/assignees', { signal });
}
export function getSupportTickets(query: string, signal?: AbortSignal) {
  return request<SupportListResult>(query ? `?${query}` : '', { signal });
}
export function getSupportTicket(requestId: string, signal?: AbortSignal) {
  return request<SupportTicketDetail>(`/${encodeURIComponent(requestId)}`, {
    signal,
  });
}
export function assignSupportTicket(
  requestId: string,
  body: unknown,
  signal?: AbortSignal,
) {
  return request<SupportTicketDetail>(
    `/${encodeURIComponent(requestId)}/assignment`,
    { method: 'PATCH', body, signal },
  );
}
export function replyToSupportTicket(
  requestId: string,
  body: FormData,
  signal?: AbortSignal,
) {
  return request<SupportTicketDetail>(
    `/${encodeURIComponent(requestId)}/replies`,
    { method: 'POST', body, signal },
  );
}
export function addSupportTicketNote(
  requestId: string,
  body: unknown,
  signal?: AbortSignal,
) {
  return request<SupportTicketDetail>(
    `/${encodeURIComponent(requestId)}/notes`,
    { method: 'POST', body, signal },
  );
}
export function updateSupportTicket(
  requestId: string,
  body: unknown,
  signal?: AbortSignal,
) {
  return request<SupportTicketDetail>(`/${encodeURIComponent(requestId)}`, {
    method: 'PATCH',
    body,
    signal,
  });
}
export function resolveSupportTicket(
  requestId: string,
  body: unknown,
  signal?: AbortSignal,
) {
  return request<SupportTicketDetail>(
    `/${encodeURIComponent(requestId)}/resolve`,
    { method: 'POST', body, signal },
  );
}
