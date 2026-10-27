'use client';
import Link from 'next/link';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { RecordActions } from '@/components/molecules/RecordActions/RecordActions';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { formatNaira } from '@/lib/format/formatNaira';
import type { Job } from '@/features/jobs/types/jobTypes';
const linkClass =
  'underline underline-offset-2 transition-colors hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
export const jobColumns: readonly DataTableColumn<Job>[] = [
  {
    id: 'date',
    header: 'Date Created',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Job ID',
    className: 'w-20',
    cell: (row) => (
      <span title={row.id} className="block truncate">
        #{row.id}
      </span>
    ),
  },
  {
    id: 'title',
    header: 'Job Title',
    className: 'w-44',
    cell: (row) => (
      <span className="block truncate text-slate-950" title={row.title}>
        {row.title}
      </span>
    ),
  },
  {
    id: 'poster',
    header: 'Posted By',
    className: 'w-28',
    cell: (row) => (
      <Link
        className={linkClass}
        href={CUSTOMER_ROUTES.details(row.customerId)}
      >
        {row.postedBy}
      </Link>
    ),
  },
  {
    id: 'duration',
    header: 'Job Duration',
    className: 'w-24',
    cell: (row) => row.duration,
  },
  {
    id: 'budget',
    header: 'Job Budget',
    className: 'w-28',
    cell: (row) => (
      <span className="whitespace-nowrap text-[#26332a]">
        {formatNaira(row.budget)}
      </span>
    ),
  },
  {
    id: 'applicants',
    header: 'Applicants',
    className: 'w-20 text-center',
    cell: (row) => row.applicants.toLocaleString('en-NG'),
  },
  {
    id: 'expert',
    header: 'Expert ID',
    className: 'w-28',
    cell: (row) =>
      row.expert ? (
        <Link
          className={linkClass}
          href={CUSTOMER_ROUTES.details(row.customerId)}
        >
          {row.expert}
        </Link>
      ) : (
        '–––'
      ),
  },
  {
    id: 'status',
    header: 'Job Status',
    className: 'w-24',
    cell: (row) => <RecordStatus status={row.status} />,
  },
  {
    id: 'actions',
    header: '',
    className: 'w-24',
    cell: (row) => (
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          disabled
          title="Job details await a supplied design and backend integration"
          className="text-xs text-indigo-500 disabled:cursor-not-allowed"
        >
          View
        </button>
        <RecordActions
          name={`${row.title} ${row.id}`}
          actions={['View job', 'Edit job', 'Pause job']}
        />
      </div>
    ),
  },
];
