'use client';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { RecordActions } from '@/components/molecules/RecordActions/RecordActions';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { TicketElapsed } from '@/features/support/components/TicketElapsed/TicketElapsed';
import type {
  SupportTicket,
  TicketPriority,
} from '@/features/support/types/supportTypes';
const priorityClass: Record<TicketPriority, string> = {
  Critical: 'text-rose-600',
  High: 'text-pink-600',
  Medium: 'text-orange-700',
  Low: 'text-slate-950',
};
export const supportColumns: readonly DataTableColumn<SupportTicket>[] = [
  {
    id: 'updated',
    header: 'Last Updated',
    className: 'w-24',
    cell: (row) => row.updated,
  },
  {
    id: 'id',
    header: 'Ticket ID',
    className: 'w-26',
    cell: (row) => (
      <span className="block truncate" title={row.id}>
        #{row.id}
      </span>
    ),
  },
  {
    id: 'customer',
    header: 'Customer',
    className: 'w-32',
    cell: (row) => (
      <span className="block truncate text-slate-950" title={row.customer}>
        {row.customer}
      </span>
    ),
  },
  {
    id: 'subject',
    header: 'Subject',
    className: 'w-32',
    cell: (row) => (
      <span className="block truncate text-slate-950" title={row.subject}>
        {row.subject}
      </span>
    ),
  },
  {
    id: 'category',
    header: 'Category',
    className: 'w-24',
    cell: (row) => row.category,
  },
  {
    id: 'priority',
    header: 'Priority',
    className: 'w-20',
    cell: (row) => (
      <span className={priorityClass[row.priority]}>{row.priority}</span>
    ),
  },
  {
    id: 'assignee',
    header: 'Assignee',
    className: 'w-20',
    cell: (row) => row.assignee,
  },
  {
    id: 'time',
    header: 'Time (HH-MM-SS)',
    className: 'w-32',
    cell: (row) => <TicketElapsed seconds={row.elapsedSeconds} />,
  },
  {
    id: 'status',
    header: 'Status',
    className: 'w-24',
    cell: (row) => <RecordStatus status={row.status} />,
  },
  {
    id: 'actions',
    header: '',
    className: 'w-24',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <button
          disabled
          type="button"
          title="Ticket details require backend integration"
          className="text-indigo-500 disabled:cursor-not-allowed"
        >
          View
        </button>
        <RecordActions
          name={`ticket ${row.id}`}
          actions={[
            'Assign ticket',
            'Resolve ticket',
            'Escalate',
            'Send message',
          ]}
        />
      </div>
    ),
  },
];
