'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { JOB_ROUTES } from '@/constants/routes';
import { JobActions } from '@/features/jobs/components/JobActions/JobActions';
import { JobTabs } from '@/features/jobs/components/JobTabs/JobTabs';
import { JobMilestones } from '@/features/jobs/components/JobMilestones/JobMilestones';
import { JobApplicantInspector } from '@/features/jobs/components/JobApplicantInspector/JobApplicantInspector';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobWorkspace({
  detail,
  children,
}: {
  detail: JobDetail;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const financial =
    pathname === JOB_ROUTES.tab(detail.job.id, 'invoices') ||
    pathname === JOB_ROUTES.tab(detail.job.id, 'payments');
  const applicants = pathname === JOB_ROUTES.tab(detail.job.id, 'applicants');
  return (
    <div className="min-w-0">
      <h1 className="sr-only">
        {detail.job.title} —{' '}
        {financial
          ? 'Job financial records'
          : applicants
            ? 'Applicants'
            : 'Job Details'}
      </h1>
      {financial ? (
        <div className="space-y-3">
          <JobActions job={detail.job} />
          {children}
        </div>
      ) : (
        <div className="grid min-w-0 items-start gap-4 min-[80rem]:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)]">
          <div className="min-w-0 space-y-3">
            <JobActions job={detail.job} />
            {!applicants && (
              <div className="rounded-xl bg-white p-3">
                <JobTabs jobId={detail.job.id} />
              </div>
            )}
            {children}
          </div>
          {applicants ? (
            <JobApplicantInspector detail={detail} />
          ) : (
            <JobMilestones detail={detail} />
          )}
        </div>
      )}
    </div>
  );
}
