import { notFound } from 'next/navigation';
import { getJobDetail } from '@/features/jobs/fixtures/jobDetailFixtures';
import { JobOverview } from '@/features/jobs/components/JobOverview/JobOverview';
export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const detail = getJobDetail(jobId);
  if (!detail) notFound();
  return <JobOverview detail={detail} />;
}
