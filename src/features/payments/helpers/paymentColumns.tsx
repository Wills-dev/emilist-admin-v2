'use client';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { RecordActions } from '@/components/molecules/RecordActions/RecordActions';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { formatNaira } from '@/lib/format/formatNaira';
import type { Payment } from '@/features/payments/types/paymentTypes';
export const paymentColumns: readonly DataTableColumn<Payment>[] = [
  {
    id: 'date',
    header: 'Txn Date',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'time',
    header: 'Txn Time',
    className: 'w-22',
    cell: (row) => row.time,
  },
  {
    id: 'id',
    header: 'Transaction ID',
    className: 'w-26',
    cell: (row) => (
      <span className="block truncate" title={row.id}>
        #{row.id}
      </span>
    ),
  },
  {
    id: 'counterparty',
    header: 'Counterparty',
    className: 'w-32',
    cell: (row) => (
      <span className="block truncate text-slate-950" title={row.counterparty}>
        {row.counterparty}
      </span>
    ),
  },
  {
    id: 'direction',
    header: 'Transaction Type',
    className: 'w-28',
    cell: (row) => (
      <span className="flex items-center gap-2">
        {row.direction === 'Inflow' ? (
          <ArrowDownRight className="size-5 rounded bg-emerald-100 p-1 text-emerald-600" />
        ) : (
          <ArrowUpRight className="size-5 rounded bg-rose-100 p-1 text-rose-500" />
        )}
        {row.direction}
      </span>
    ),
  },
  {
    id: 'description',
    header: 'Description',
    className: 'w-28',
    cell: (row) => row.description,
  },
  {
    id: 'amount',
    header: 'Txn Amount',
    className: 'w-28',
    cell: (row) => (
      <span className="whitespace-nowrap text-slate-950">
        {formatNaira(row.amount)}
      </span>
    ),
  },
  {
    id: 'method',
    header: 'Payment Method',
    className: 'w-28',
    cell: (row) => row.method,
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
          title="Payment details require backend integration"
          className="text-indigo-500 disabled:cursor-not-allowed"
        >
          View
        </button>
        <RecordActions
          name={`transaction ${row.id}`}
          actions={['View transaction', 'Refund', 'Release escrow']}
        />
      </div>
    ),
  },
];
