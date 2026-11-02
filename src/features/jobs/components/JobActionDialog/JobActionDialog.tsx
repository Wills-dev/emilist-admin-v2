'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ImageOff } from 'lucide-react';
import {
  JOB_ACTIONS,
  type JobAction,
} from '@/features/jobs/constants/jobActions';
import { JobReasonForm } from '@/features/jobs/components/JobReasonForm/JobReasonForm';
import { RecurringJobForm } from '@/features/jobs/components/RecurringJobForm/RecurringJobForm';
import { compactJobBudget } from '@/features/jobs/helpers/jobDetailHelpers';
import type { Job } from '@/features/jobs/types/jobTypes';
export function JobActionDialog({
  action,
  job,
  restoreFocus,
}: {
  action: JobAction;
  job: Job;
  restoreFocus: () => void;
}) {
  const definition = JOB_ACTIONS[action];
  const review = action === 'approve' || action === 'reject';
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="drawer-backdrop fixed inset-0 z-40 bg-black/25" />
      <Dialog.Content
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          restoreFocus();
        }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100dvh_-_2rem)] max-w-lg -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl outline-none motion-safe:animate-[overview-enter_200ms_ease-out]"
      >
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
          <Dialog.Title className="text-xl font-semibold tracking-tight text-[#4c554e]">
            {definition.title}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close job dialog"
              className="shrink-0 rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
            >
              <X className="size-5" />
            </button>
          </Dialog.Close>
        </header>
        {review && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-slate-200 bg-neutral-50 p-2">
            <span className="flex min-w-0 items-center gap-2 text-xs text-slate-950">
              <ImageOff className="size-7 shrink-0 rounded bg-neutral-100 p-1 text-neutral-400" />
              <span className="min-w-0 break-words">
                {job.title}
                <span className="mt-1 block text-[10px] text-emerald-600">
                  {job.postedBy}
                </span>
              </span>
            </span>
            <span className="text-xs text-emerald-600">
              starts from <strong>{compactJobBudget(job.budget)}</strong>
            </span>
          </div>
        )}
        <Dialog.Description className="mb-5 text-sm leading-6 text-[#788096]">
          {definition.description}
        </Dialog.Description>
        {action === 'recurring' ? (
          <RecurringJobForm />
        ) : (
          <JobReasonForm
            placeholder={
              action === 'pause'
                ? 'Include your reason for suspension here'
                : 'Please tell us why'
            }
          />
        )}
        <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row">
          {review ? (
            <button
              type="button"
              disabled
              title="Backend integration required"
              className="flex-1 rounded-lg border border-rose-400 px-4 py-3 text-sm text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject Job Listing
            </button>
          ) : (
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-600 shadow-xs transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
              >
                Cancel
              </button>
            </Dialog.Close>
          )}
          <button
            type="submit"
            form="job-action-form"
            disabled
            title="Backend integration required; no job state will change"
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${review || definition.tone === 'success' ? 'bg-[#20c46b]' : definition.tone === 'warning' ? 'bg-orange-400' : 'bg-[#ff527c]'}`}
          >
            {definition.confirm}
          </button>
        </div>
        <p role="note" className="mt-3 text-center text-[10px] text-slate-500">
          Preview only. Backend confirmation is unavailable; no job state will
          change.
        </p>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
