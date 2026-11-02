import type { Job } from '@/features/jobs/types/jobTypes';
// Synthetic presentation contracts, not API payloads or operational records.
export interface JobApplicant {
  id: string;
  name: string;
  username: string;
  initials: string;
  budget: number;
  location: string;
  level: 'Senior' | 'Intermediate';
  experience: number;
  completed: number;
  rating: string;
  reviews: number;
  verified: boolean;
  description: string;
}
export interface JobMilestone {
  id: string;
  title: string;
  duration: string;
  amount: number;
  status: 'Approved' | 'Paused' | 'Pending';
  tasks: readonly string[];
}
export interface JobInvoice {
  id: string;
  number: string;
  billedTo: string;
  label: string;
  milestoneId?: string;
  issued: string;
  due: string;
  paidOn?: string;
  status: 'Paid' | 'Unpaid';
  amount: number;
}
export interface JobPayment {
  id: string;
  reference: string;
  recipient: string;
  tag: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Upcoming';
  amount: number;
}
export interface JobDetail {
  job: Job;
  location: string;
  level: string;
  description: readonly string[];
  milestones: readonly JobMilestone[];
  applicants: readonly JobApplicant[];
  invoices: readonly JobInvoice[];
  payments: readonly JobPayment[];
  hiredApplicantId?: string;
  hiredOn?: string;
}
