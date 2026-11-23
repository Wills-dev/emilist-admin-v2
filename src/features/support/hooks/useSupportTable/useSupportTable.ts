'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSupportTickets } from '@/features/support/api/supportRequests';
import { normalizeTicketList } from '@/features/support/helpers/supportApiMappers';
import { supportQueryKeys } from '@/features/support/lib/supportQueryKeys';

type SupportTableData = ReturnType<typeof normalizeTicketList>;

export function useSupportTable() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = Math.max(1, Number(params.get('page') || 1));
  const limit = Math.max(1, Number(params.get('limit') || 10));
  const [searchInput, setSearchInput] = useState(params.get('search') || '');
  const search = searchInput;
  const status = params.get('status') || 'all';
  const rawPriority = params.get('priority')?.toLowerCase() || 'all';
  const priority = [
    'critical',
    'high',
    'medium',
    'low',
    'normal',
    'urgent',
  ].includes(rawPriority)
    ? rawPriority
    : 'all';
  const category = params.get('category') || 'all';
  const assignedAdminId = params.get('assignedAdminId') || 'all';
  const team = params.get('team') || 'all';

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) queryParams.set('search', search);
  if (status !== 'all') queryParams.set('status', status);
  if (priority !== 'all') queryParams.set('priority', priority);
  if (category !== 'all') queryParams.set('category', category);
  if (assignedAdminId !== 'all')
    queryParams.set('assignedAdminId', assignedAdminId);
  if (team !== 'all') queryParams.set('team', team);

  const query = useQuery<SupportTableData>({
    queryKey: supportQueryKeys.list({
      page,
      limit,
      search,
      status,
      priority,
      category,
      assignedAdminId,
      team,
    }),
    queryFn: ({ signal }) =>
      getSupportTickets(queryParams.toString(), signal).then(
        normalizeTicketList,
      ),
    placeholderData: keepPreviousData,
  });

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    next.delete('page');
    const suffix = next.toString();
    router.replace(`${pathname}${suffix ? `?${suffix}` : ''}`, {
      scroll: false,
    });
  };
  return {
    rows: query.data?.rows || [],
    count: query.data?.count ?? query.data?.rows.length ?? 0,
    pages: query.data?.pages || 1,
    summary: query.data?.summary || {},
    page,
    limit,
    search,
    status,
    priority,
    category,
    assignedAdminId,
    team,
    setSearch: (value: string) => setSearchInput(value),
    setStatus: (value: string) => update('status', value),
    setPriority: (value: string) => update('priority', value),
    setCategory: (value: string) => update('category', value),
    setAssignedAdminId: (value: string) => update('assignedAdminId', value),
    setTeam: (value: string) => update('team', value),
    setPage: (value: number) => update('page', String(value)),
    isLoading: query.isPending,
    isError: query.isError,
  };
}
