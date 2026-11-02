import type { JobStatus } from '@/features/jobs/types/jobTypes';
export type JobAction =
  'remove' | 'approve' | 'reject' | 'pause' | 'resume' | 'cancel' | 'recurring';
export const JOB_STATUS_ACTIONS: Record<JobStatus, readonly JobAction[]> = {
  Draft: ['remove'],
  Listed: ['reject', 'approve'],
  'In-review': ['remove'],
  Active: ['cancel', 'pause'],
  Paused: ['resume'],
  Overdue: ['cancel'],
  Completed: ['recurring'],
};
export const JOB_ACTIONS = {
  remove: {
    label: 'Remove Listing',
    title: 'Remove Job Listing',
    description: 'Do you want to remove this job from the marketplace?',
    confirm: 'Yes, Remove',
    tone: 'danger',
  },
  approve: {
    label: 'Approve Listing',
    title: 'Approve Job Listing',
    description:
      'Approve or reject the job listing before it is added to the marketplace.',
    confirm: 'Accept Job Listing',
    tone: 'success',
  },
  reject: {
    label: 'Reject Listing',
    title: 'Approve Job Listing',
    description:
      'Approve or reject the job listing before it is added to the marketplace.',
    confirm: 'Accept Job Listing',
    tone: 'danger',
  },
  pause: {
    label: 'Pause Job',
    title: 'Pause Job',
    description: 'Do you want to suspend this job temporarily?',
    confirm: 'Yes, Confirm',
    tone: 'warning',
  },
  resume: {
    label: 'Resume Job',
    title: 'Resume Job',
    description: 'Do you want to continue working on this job?',
    confirm: 'Confirm',
    tone: 'success',
  },
  cancel: {
    label: 'Cancel Job',
    title: 'Cancel Job',
    description: 'Are you sure you want to cancel this job?',
    confirm: 'Yes, Cancel',
    tone: 'danger',
  },
  recurring: {
    label: 'Convert to Recurring Job',
    title: 'Convert to Recurring Job',
    description:
      'Convert this active project into a frequent job executed at a time of your choosing.',
    confirm: 'Confirm',
    tone: 'success',
  },
} as const;
