'use client';
import {
  BriefcaseBusiness,
  FileUser,
  Files,
  CirclePause,
  FileCheck,
} from 'lucide-react';
import { SummaryMetrics } from '@/components/molecules/SummaryMetrics/SummaryMetrics';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { useJobsTable } from '@/features/jobs/hooks/useJobsTable/useJobsTable';
import { jobColumns } from '@/features/jobs/helpers/jobColumns';
import { JOB_TOTAL } from '@/features/jobs/fixtures/jobFixtures';
const metrics = [
  { label: 'Total Active Jobs', value: '152,130', icon: BriefcaseBusiness },
  { label: 'Total Applicants', value: '9,774', icon: FileUser },
  { label: 'Overdue Jobs', value: '3,258', icon: Files },
  { label: 'Paused Jobs', value: '19,549', icon: CirclePause },
  { label: 'Completed Jobs', value: '1,303', icon: FileCheck },
];
export function JobsPage() {
  const table = useJobsTable();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Jobs</h1>
      <SummaryMetrics metrics={metrics} />
      <p role="note" className="text-[10px] text-slate-500">
        Static job presentation data · 10 sample records · Counts are design
        fixtures. Backend actions unavailable.
      </p>
      <TableToolbar
        label="Job count"
        icon={BriefcaseBusiness}
        count={JOB_TOTAL}
        search={table.search}
        status={table.status}
        statuses={[
          'Draft',
          'Listed',
          'In-review',
          'Active',
          'Overdue',
          'Paused',
          'Completed',
        ]}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <DataTable
        rows={table.rows}
        columns={jobColumns}
        rowKey={(row) => row.id}
        caption="Jobs"
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
