import { Printer } from 'lucide-react';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { formatNaira } from '@/lib/format/formatNaira';
import { formatJobDate } from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobPayment } from '@/features/jobs/types/jobDetailTypes';
export const jobPaymentColumns: readonly DataTableColumn<JobPayment>[] = [
  {
    id: 'reference',
    header: 'Reference',
    className: 'w-24',
    cell: (row) => (
      <span className="break-all text-slate-950">#{row.reference}</span>
    ),
  },
  {
    id: 'amount',
    header: 'Amount',
    className: 'w-24',
    cell: (row) => (
      <span
        className={
          row.status === 'Paid'
            ? 'text-emerald-600'
            : row.status === 'Pending'
              ? 'text-orange-600'
              : 'text-slate-900'
        }
      >
        {formatNaira(row.amount)}
      </span>
    ),
  },
  {
    id: 'recipient',
    header: 'Recipient',
    className: 'w-40',
    cell: (row) => <span className="text-slate-950">{row.recipient}</span>,
  },
  { id: 'tag', header: 'Tag', className: 'w-24', cell: (row) => row.tag },
  {
    id: 'date',
    header: 'Date',
    className: 'w-28',
    cell: (row) => formatJobDate(row.date),
  },
  {
    id: 'status',
    header: 'Status',
    className: 'w-24',
    cell: (row) => (
      <StatusBadge
        tone={
          row.status === 'Paid'
            ? 'success'
            : row.status === 'Pending'
              ? 'warning'
              : 'neutral'
        }
      >
        {row.status}
      </StatusBadge>
    ),
  },
  {
    id: 'print',
    header: '',
    className: 'w-12',
    cell: (row) => (
      <button
        type="button"
        disabled
        aria-label={`Print payment ${row.reference}`}
        title="Printing requires a verified backend record"
        className="rounded p-2 text-slate-500 disabled:cursor-not-allowed"
      >
        <Printer className="size-4" />
      </button>
    ),
  },
];
