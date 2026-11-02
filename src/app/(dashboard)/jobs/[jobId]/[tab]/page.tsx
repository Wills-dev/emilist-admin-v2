import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { JOB_TAB_PATHS } from '@/constants/routes';
import { getJobDetail } from '@/features/jobs/fixtures/jobDetailFixtures';
import { JobApplicants } from '@/features/jobs/components/JobApplicants/JobApplicants';
import { JobInvoices } from '@/features/jobs/components/JobInvoices/JobInvoices';
import { JobPayments } from '@/features/jobs/components/JobPayments/JobPayments';
import { JobDetailSkeleton } from '@/features/jobs/components/JobDetailSkeleton/JobDetailSkeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string; tab: string }>;
}) {
  const { jobId, tab } = await params;
  const detail = getJobDetail(jobId);
  if (
    !detail ||
    !Object.values(JOB_TAB_PATHS).includes(
      tab as (typeof JOB_TAB_PATHS)[keyof typeof JOB_TAB_PATHS],
    ) ||
    !tab
  )
    notFound();
  return (
    <Suspense fallback={<JobDetailSkeleton />}>
      {tab === 'applicants' ? (
        <JobApplicants detail={detail} />
      ) : tab === 'invoices' ? (
        <JobInvoices detail={detail} />
      ) : (
        <JobPayments detail={detail} />
      )}
    </Suspense>
  );
}
