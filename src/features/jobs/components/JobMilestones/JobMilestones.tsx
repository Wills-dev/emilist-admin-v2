'use client';
import { useSearchParams } from 'next/navigation';
import { ChevronUp, Pause, Play } from 'lucide-react';
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { compactJobBudget } from '@/features/jobs/helpers/jobDetailHelpers';
import type { JobDetail } from '@/features/jobs/types/jobDetailTypes';
export function JobMilestones({ detail }: { detail: JobDetail }) {
  const params = useSearchParams();
  if (!detail.milestones.length)
    return (
      <EmptyState
        title="No milestone samples"
        description="No milestone presentation records have been supplied for this job."
      />
    );
  return (
    <section
      aria-label="Job milestones"
      className="rounded-xl border border-neutral-200 bg-[#f8f9f8] p-4"
    >
      {detail.milestones.map((milestone, index) => (
        <details
          key={milestone.id}
          open
          className={`group border-b border-neutral-200 py-3 first:pt-0 ${params.get('milestone') === milestone.id ? 'rounded-lg ring-2 ring-emerald-500' : ''}`}
        >
          <summary className="cursor-pointer list-none rounded p-1 focus-visible:outline-2 focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden">
            <span
              className={`flex items-center justify-between text-xs ${milestone.status === 'Approved' ? 'text-emerald-600' : 'text-neutral-500'}`}
            >
              <span>• &nbsp; MILESTONE {index + 1}</span>
              {milestone.status === 'Paused' ? (
                <Pause className="size-3.5" />
              ) : milestone.status === 'Pending' ? (
                <Play className="size-3.5" />
              ) : (
                <ChevronUp className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
              )}
            </span>
            <span className="mt-3 block text-xs font-medium text-[#343b36]">
              {milestone.title}
            </span>
          </summary>
          <div className="mt-4 space-y-4">
            <dl className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-[10px]">
              <div className="flex gap-1">
                <dt className="text-neutral-500">• Duration:</dt>
                <dd>{milestone.duration}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-neutral-500">
                  • {milestone.status === 'Approved' ? 'Paid' : 'Payment'}:
                </dt>
                <dd>{compactJobBudget(milestone.amount)}</dd>
              </div>
            </dl>
            <div className="space-y-3 rounded-lg bg-white p-3 text-xs leading-5 text-neutral-500">
              <h3 className="font-medium">Details</h3>
              {milestone.tasks.map((task) => (
                <p key={task}>{task}</p>
              ))}
            </div>
            <p
              className={`pb-5 text-[10px] ${milestone.status === 'Approved' ? 'text-emerald-600' : milestone.status === 'Paused' ? 'text-amber-600' : 'text-neutral-500'}`}
            >
              {milestone.status}
            </p>
          </div>
        </details>
      ))}
      <Pagination
        page={1}
        pages={1}
        count={detail.milestones.length}
        onPageChange={() => {}}
      />
    </section>
  );
}
