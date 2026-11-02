'use client';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { JobTabs } from '@/features/jobs/components/JobTabs/JobTabs';
import { JobApplicantCard } from '@/features/jobs/components/JobApplicantCard/JobApplicantCard';
import { useJobApplicants } from '@/features/jobs/hooks/useJobApplicants/useJobApplicants';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobApplicants({ detail }: { detail: JobDetail }) {
  const table = useJobApplicants(detail);
  return (
    <section aria-label="Job applicants" className="min-w-0 space-y-3">
      <TableToolbar
        leading={<JobTabs jobId={detail.job.id} />}
        label="Job applicants"
        count={table.count}
        search={table.search}
        status={table.status}
        statuses={['Senior', 'Intermediate']}
        filterLabel="Experience level"
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <div className="rounded-xl bg-white p-2">
        {table.rows.length ? (
          <div className="overview-stagger grid min-w-0 gap-4 sm:grid-cols-2">
            {table.rows.map((applicant) => (
              <JobApplicantCard
                key={applicant.id}
                applicant={applicant}
                selected={table.selected?.id === applicant.id}
                onSelect={() => table.select(applicant.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No applicants match"
            description="No applicant samples match your search or experience filter."
          />
        )}
        <Pagination
          page={table.page}
          pages={table.pages}
          count={table.count}
          onPageChange={table.setPage}
        />
      </div>
    </section>
  );
}
