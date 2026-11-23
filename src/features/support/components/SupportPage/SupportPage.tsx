'use client';
import { useQuery } from '@tanstack/react-query';
import {
  CircleDashed,
  MessageCircleWarning,
  Files,
  CirclePause,
  Clock,
  LifeBuoy,
} from 'lucide-react';
import { SummaryMetrics } from '@/components/molecules/SummaryMetrics/SummaryMetrics';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { supportColumns } from '@/features/support/helpers/supportColumns';
import { useSupportTable } from '@/features/support/hooks/useSupportTable/useSupportTable';
import { getSupportAssignees } from '@/features/support/api/supportRequests';
import { normalizeAssignees } from '@/features/support/helpers/supportApiMappers';
import { supportQueryKeys } from '@/features/support/lib/supportQueryKeys';
import { SupportPageSkeleton } from '@/features/support/components/SupportPageSkeleton/SupportPageSkeleton';
const icons = [CircleDashed, MessageCircleWarning, Files, CirclePause, Clock];
const card = (cards: Record<string, unknown>, key: string) => {
  const value = cards[key];
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};
const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;
const number = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;
export function SupportPage() {
  const table = useSupportTable();
  const assigneesQuery = useQuery({
    queryKey: supportQueryKeys.assignees(),
    queryFn: ({ signal }) =>
      getSupportAssignees(signal).then(normalizeAssignees),
  });
  const summary = table.summary;
  const cards =
    summary.cards && typeof summary.cards === 'object'
      ? (summary.cards as Record<string, unknown>)
      : {};
  const metrics = [
    {
      label: 'Total Tickets',
      key: 'totalTickets',
      fallback: number(summary.totalTickets ?? summary.total),
    },
    {
      label: 'Unassigned Tickets',
      key: 'unassignedTickets',
      fallback: number(summary.unassignedTickets ?? summary.unassigned),
    },
    {
      label: 'High Priority Tickets',
      key: 'highPriorityTickets',
      fallback: number(summary.highPriorityTickets ?? summary.highPriority),
    },
    {
      label: 'Overdue Tickets',
      key: 'overdueTickets',
      fallback: number(summary.overdueTickets ?? summary.overdue),
    },
    {
      label: 'Awaiting Customer Response',
      key: 'awaitingCustomerResponse',
      fallback: number(
        summary.awaitingCustomerResponse ?? summary.pendingCustomer,
      ),
    },
    {
      label: 'Average Resolution Time',
      key: 'averageResolutionTime',
      fallback: '—',
    },
  ];
  const assignees = assigneesQuery.data;
  if (table.isLoading || assigneesQuery.isLoading)
    return <SupportPageSkeleton />;
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Support</h1>
      <SummaryMetrics
        metrics={metrics.map((metric, index) => {
          const current = card(cards, metric.key);
          const trend = card(current, 'trend');
          const percentage = number(trend.signedPercentage);
          return {
            label: text(current.title, metric.label),
            value: text(current.displayValue, String(metric.fallback)),
            note: text(current.description),
            change:
              trend.signedPercentage === undefined
                ? undefined
                : `${percentage > 0 ? '+' : ''}${percentage}%`,
            direction: text(trend.direction) as 'up' | 'down' | 'flat',
            improvement:
              typeof trend.isImprovement === 'boolean'
                ? trend.isImprovement
                : null,
            icon: icons[index] || Clock,
          };
        })}
      />
      {table.isError && (
        <p role="alert" className="text-xs text-rose-600">
          Unable to load support tickets. Please refresh and try again.
        </p>
      )}
      <TableToolbar
        label="Ticket count"
        icon={LifeBuoy}
        count={String(table.count)}
        search={table.search}
        status={
          table.status === 'all'
            ? 'All'
            : table.status
                .split('_')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ')
        }
        statuses={[
          'All',
          'Open',
          'In Progress',
          'Pending Customer',
          'Pending Resolution',
          'Resolved',
          'Overdue',
        ]}
        onSearch={table.setSearch}
        onStatus={(value) =>
          table.setStatus(
            value === 'All' ? 'all' : value.toLowerCase().replaceAll(' ', '_'),
          )
        }
        filterControls={
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <label className="flex items-center gap-2">
              Priority
              <select
                aria-label="Filter by priority"
                value={table.priority}
                onChange={(event) => table.setPriority(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <option value="all">All</option>
                {['critical', 'high', 'medium', 'low', 'normal', 'urgent'].map(
                  (value) => (
                    <option key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="flex items-center gap-2">
              Category
              <select
                aria-label="Filter by category"
                value={table.category}
                onChange={(event) => table.setCategory(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <option value="all">All</option>
                {[
                  'account',
                  'job',
                  'payment',
                  'financial',
                  'dispute',
                  'technical',
                  'moderation',
                  'operations',
                  'marketplace',
                  'report',
                  'other',
                ].map((value) => (
                  <option key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              Team
              <select
                aria-label="Filter by team"
                value={table.team}
                onChange={(event) => table.setTeam(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-2 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <option value="all">All teams</option>
                {(assignees?.teams || []).map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>
          </div>
        }
      />
      <DataTable
        caption="Support tickets"
        rows={table.rows}
        columns={supportColumns}
        rowKey={(row) => row.id}
      />
      <Pagination
        page={table.page}
        pages={table.pages}
        count={table.count}
        onPageChange={table.setPage}
      />
    </div>
  );
}
