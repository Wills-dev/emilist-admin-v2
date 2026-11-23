import { queryKeys } from '@/lib/query/queryKeys';

export const supportQueryKeys = {
  summary: () => [...queryKeys.domain('support'), 'summary'] as const,
  assignees: () => [...queryKeys.domain('support'), 'assignees'] as const,
  list: (filters: Record<string, string | number>) =>
    queryKeys.list('support', filters),
  detail: (requestId: string) => queryKeys.detail('support', requestId),
};
