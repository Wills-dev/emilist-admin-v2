// Provisional static UI model, not a backend response contract.
export type JobStatus =
  | 'Draft'
  | 'Listed'
  | 'In-review'
  | 'Active'
  | 'Overdue'
  | 'Paused'
  | 'Completed';
export interface Job {
  id: string;
  date: string;
  title: string;
  postedBy: string;
  customerId: string;
  duration: string;
  budget: number;
  applicants: number;
  expert?: string;
  status: JobStatus;
}
