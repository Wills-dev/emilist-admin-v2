import { Suspense, type ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getJobDetail } from '@/features/jobs/fixtures/jobDetailFixtures';
import { JobWorkspace } from '@/features/jobs/components/JobWorkspace/JobWorkspace';
import { JobDetailSkeleton } from '@/features/jobs/components/JobDetailSkeleton/JobDetailSkeleton';
export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const detail = getJobDetail(jobId);
  if (!detail) notFound();
  return (
    <Suspense fallback={<JobDetailSkeleton />}>
      <JobWorkspace key={jobId} detail={detail}>
        {children}
      </JobWorkspace>
    </Suspense>
  );
}
