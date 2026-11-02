import { JOBS } from '@/features/jobs/fixtures/jobFixtures';
import type {
  JobDetail,
  JobApplicant,
  JobMilestone,
  JobInvoice,
  JobPayment,
} from '@/features/jobs/types/jobDetailTypes';
// Historical synthetic scenario for the featured job. Other IDs never borrow its activity.
export const FEATURED_JOB_ID = 'demo-record-50-001';
export const JOB_APPLICANTS: readonly JobApplicant[] = [
  {
    id: 'demo-applicant-001',
    name: 'Demo Woodworks Studio',
    username: 'demo-expert-001',
    initials: 'DW',
    budget: 450000,
    location: '1 Fictional Avenue, Demo District',
    level: 'Senior',
    experience: 5,
    completed: 55,
    rating: '4.8',
    reviews: 51,
    verified: true,
    description:
      'Synthetic workshop profile for reviewing carpentry experience and project examples. This profile is not a real service provider.',
  },
  {
    id: 'demo-applicant-002',
    name: 'Demo Cedar Workshop',
    username: 'demo-expert-002',
    initials: 'DC',
    budget: 400000,
    location: '2 Fictional Avenue, Demo District',
    level: 'Intermediate',
    experience: 3,
    completed: 200,
    rating: '4.4',
    reviews: 51,
    verified: true,
    description:
      'Synthetic workshop profile for reviewing carpentry experience and project examples. This profile is not a real service provider.',
  },
  {
    id: 'demo-applicant-003',
    name: 'Demo Furniture Lab',
    username: 'demo-expert-003',
    initials: 'DF',
    budget: 450000,
    location: '3 Fictional Avenue, Demo District',
    level: 'Intermediate',
    experience: 3,
    completed: 60,
    rating: '4.4',
    reviews: 521,
    verified: true,
    description:
      'Synthetic workshop profile for reviewing carpentry experience and project examples. This profile is not a real service provider.',
  },
  {
    id: 'demo-applicant-004',
    name: 'Demo Craft Workshop',
    username: 'demo-expert-004',
    initials: 'DC',
    budget: 350000,
    location: '4 Fictional Avenue, Demo District',
    level: 'Intermediate',
    experience: 3,
    completed: 18,
    rating: '4.3',
    reviews: 15,
    verified: true,
    description:
      'Synthetic workshop profile for reviewing carpentry experience and project examples. This profile is not a real service provider.',
  },
  {
    id: 'demo-applicant-005',
    name: 'Demo Handworks Studio',
    username: 'demo-expert-005',
    initials: 'DH',
    budget: 350000,
    location: '5 Fictional Avenue, Demo District',
    level: 'Intermediate',
    experience: 3,
    completed: 60,
    rating: '4.4',
    reviews: 521,
    verified: true,
    description:
      'Synthetic workshop profile for reviewing carpentry experience and project examples. This profile is not a real service provider.',
  },
  {
    id: 'demo-applicant-006',
    name: 'Demo Oak Studio',
    username: 'demo-expert-006',
    initials: 'DO',
    budget: 550000,
    location: '6 Fictional Avenue, Demo District',
    level: 'Intermediate',
    experience: 3,
    completed: 18,
    rating: '4.2',
    reviews: 15,
    verified: true,
    description:
      'Synthetic workshop profile for reviewing carpentry experience and project examples. This profile is not a real service provider.',
  },
];
export const JOB_MILESTONES: readonly JobMilestone[] = [
  {
    id: 'demo-milestone-001',
    title: 'Complete cabinet and chair repairs',
    duration: '1 week',
    amount: 150000,
    status: 'Approved',
    tasks: [
      'Complete the chair upgrades and repairs',
      'Complete the kitchen cabinet repairs and fixes',
    ],
  },
  {
    id: 'demo-milestone-002',
    title: 'Rebuild bed frame for the master bedroom',
    duration: '1 week',
    amount: 150000,
    status: 'Paused',
    tasks: ['Fix the bedframe hinges', 'Spray the bedframe with oil paint'],
  },
  {
    id: 'demo-milestone-003',
    title: 'Complete main door repairs',
    duration: '1 week',
    amount: 150000,
    status: 'Pending',
    tasks: ['Fix the door lock system', 'Spray the door with oil paint'],
  },
];
export const JOB_INVOICES: readonly JobInvoice[] = [
  {
    id: 'demo-invoice-001',
    number: 'DEMO-2026-001',
    billedTo: 'Demo Customer One',
    label: 'Milestone 1',
    milestoneId: 'demo-milestone-001',
    issued: '2026-04-03',
    due: '2026-04-04',
    paidOn: '2026-04-04',
    status: 'Paid',
    amount: 150000,
  },
  {
    id: 'demo-invoice-002',
    number: 'DEMO-2026-002',
    billedTo: 'Demo Customer One',
    label: 'Milestone 2',
    milestoneId: 'demo-milestone-002',
    issued: '2026-04-12',
    due: '2026-04-14',
    status: 'Unpaid',
    amount: 150000,
  },
  {
    id: 'demo-invoice-003',
    number: 'DEMO-2026-003',
    billedTo: 'Demo Customer One',
    label: 'Milestone 3',
    milestoneId: 'demo-milestone-003',
    issued: '2026-04-21',
    due: '2026-04-24',
    status: 'Unpaid',
    amount: 150000,
  },
  {
    id: 'demo-invoice-004',
    number: 'DEMO-2026-004',
    billedTo: 'Demo Customer One',
    label: 'Additional Payment',
    issued: '2026-04-12',
    due: '2026-04-14',
    status: 'Unpaid',
    amount: 150000,
  },
];
export const JOB_PAYMENTS: readonly JobPayment[] = [
  {
    id: 'demo-job-payment-001',
    reference: 'DEMO-3066',
    recipient: 'Demo Woodworks Studio',
    tag: 'Milestone 1',
    date: '2026-04-04',
    status: 'Paid',
    amount: 150000,
  },
  {
    id: 'demo-job-payment-002',
    reference: 'DEMO-3065',
    recipient: 'Demo Woodworks Studio',
    tag: 'Milestone 2',
    date: '2026-04-14',
    status: 'Pending',
    amount: 150000,
  },
  {
    id: 'demo-job-payment-003',
    reference: 'DEMO-3064',
    recipient: 'Demo Woodworks Studio',
    tag: 'Milestone 3',
    date: '2026-04-24',
    status: 'Upcoming',
    amount: 150000,
  },
];
export function getJobDetail(jobId: string): JobDetail | undefined {
  const job = JOBS.find((item) => item.id === jobId);
  if (!job) return undefined;
  const featured = jobId === FEATURED_JOB_ID;
  return {
    job,
    location: 'Demo District, Fictional Avenue',
    level: 'Intermediate',
    description: featured
      ? [
          'Remake old chairs, cabinets, beds and doors for a fictional residential family building in Demo District.',
          'This synthetic project illustrates furniture upgrades, milestone planning and expert profiles. We appreciate experienced furniture makers who craft lasting pieces and meet deadlines.',
        ]
      : [
          'Synthetic job listing. Additional project description, activity and media have not been supplied for this sample.',
        ],
    milestones: featured ? JOB_MILESTONES : [],
    applicants: featured ? JOB_APPLICANTS : [],
    invoices: featured ? JOB_INVOICES : [],
    payments: featured ? JOB_PAYMENTS : [],
    ...(featured
      ? { hiredApplicantId: JOB_APPLICANTS[0]!.id, hiredOn: '2026-04-03' }
      : {}),
  };
}
