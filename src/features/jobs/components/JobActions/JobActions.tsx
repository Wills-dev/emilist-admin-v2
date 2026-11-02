'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { ROUTES } from '@/constants/routes';
import {
  JOB_ACTIONS,
  JOB_STATUS_ACTIONS,
  type JobAction,
} from '@/features/jobs/constants/jobActions';
import { JobActionDialog } from '@/features/jobs/components/JobActionDialog/JobActionDialog';
import type { Job } from '@/features/jobs/types/jobTypes';
export function JobActions({ job }: { job: Job }) {
  const [action, setAction] = useState<JobAction>('remove');
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={ROUTES.jobs}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs text-neutral-500 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
        <div className="flex flex-wrap justify-end gap-2">
          {JOB_STATUS_ACTIONS[job.status].map((kind, index, actions) => (
            <button
              key={kind}
              type="button"
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setAction(kind);
                setOpen(true);
              }}
              className={`rounded-xl border px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none ${index === actions.length - 1 ? 'border-transparent bg-[#20c46b] text-white hover:bg-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100'}`}
            >
              {JOB_ACTIONS[kind].label}
            </button>
          ))}
        </div>
      </div>
      <JobActionDialog
        action={action}
        job={job}
        restoreFocus={() => trigger.current?.focus()}
      />
    </Dialog.Root>
  );
}
