import type { DonutSummary } from '@/features/dashboard/types/overviewTypes';

// Static presentation fixtures transcribed from the visual reference. Never live API data.
export const OVERVIEW_FIXTURES = {
  date: 'Sunday, 27 September, 2027',
  displayName: 'Demo Operator',
  initials: 'DM',
  role: 'Demo persona',
  adminId: 'demo-admin-001',
  metrics: [
    {
      title: 'Pending KYC',
      value: '1250',
      note: 'New Customers',
      action: 'Review KYC',
    },
    {
      title: 'Pending Transactions',
      value: '440',
      note: 'Escrowed Payments',
      action: 'Release Funds',
    },
    {
      title: 'Milestones',
      value: '38',
      note: 'Disputed Milestones',
      action: 'Resolve Milestones',
    },
    {
      title: 'Reviews',
      value: '1032',
      note: 'New Comments',
      action: 'Moderate Comments',
    },
  ],
  transactions: {
    title: 'Transaction Summary',
    description: 'All user transactions on Emilist',
    label: 'Transactions',
    total: 21870,
    segments: [
      { key: 'successful', label: 'Successful', value: 15309, fill: '#00ad59' },
      { key: 'pending', label: 'Pending', value: 4374, fill: '#ff9e00' },
      { key: 'failed', label: 'Failed', value: 1312, fill: '#ff4048' },
      { key: 'cancelled', label: 'Cancelled', value: 875, fill: '#94a3b8' },
    ],
    footerLabel: 'Total value:',
    footerValue: '₦486,200,000',
  },
  jobs: {
    title: 'Job Summary',
    description: 'Jobs moving through the marketplace',
    label: 'Jobs',
    total: 65152,
    segments: [
      { key: 'listed', label: 'Listed', value: 31278, fill: '#00ad59' },
      { key: 'completed', label: 'Completed', value: 19549, fill: '#51ca82' },
      { key: 'pending', label: 'Pending', value: 9774, fill: '#ff9e00' },
      { key: 'overdue', label: 'Overdue', value: 3258, fill: '#ff4048' },
      { key: 'cancelled', label: 'Cancelled', value: 1303, fill: '#94a3b8' },
    ],
    footerLabel: 'Applications received:',
    footerValue: '128,400',
  },
  customers: {
    title: 'Customer Summary',
    description: 'An overview of all Emilist customers',
    label: 'Customers',
    total: 165162,
    segments: [
      { key: 'active', label: 'Active', value: 152130, fill: '#00ad59' },
      { key: 'pending', label: 'Pending KYC', value: 9774, fill: '#ff9e00' },
      { key: 'inactive', label: 'Inactive', value: 3258, fill: '#ff4048' },
    ],
    others: [
      { label: 'Others' },
      { label: 'Experts', value: 19549 },
      { label: 'Merchants', value: 1303 },
    ],
    footerLabel: 'User growth (%):',
    footerValue: '65%',
  },
  // Intermediate points are presentation-only: the reference provides a trend, not an API timeseries.
  revenue: [
    { period: '1–5', value: 110 },
    { period: '6–10', value: 145 },
    { period: '11–15', value: 175 },
    { period: '16–20', value: 202 },
    { period: '21–25', value: 230 },
    { period: '26–30', value: 265 },
  ],
  revenueTotal: '₦4,860,000',
  lifetimeRevenue: '₦56,200,000',
  quickActions: [
    {
      title: 'Overdue jobs',
      description: 'Oldest 2 days',
      count: 6,
      tone: 'red',
    },
    {
      title: 'Paused jobs',
      description: 'Review pause reasons',
      count: 5,
      tone: 'amber',
    },
    {
      title: 'Failed transactions',
      description: 'Retry / reconcile records',
      count: 2,
      tone: 'red',
    },
    {
      title: 'Customer support',
      description: '8 tickets to resolve',
      count: 14,
      tone: 'slate',
    },
  ],
  trade: [
    ['Verified merchants', 680],
    ['Product categories', 95],
    ['New orders', 28],
    ['Deliveries in progress', 13],
    ['Cancelled orders', 4],
    ['Returned orders', 9],
    ['Completed Orders', 30],
  ] as const,
  grossSales: '₦128,400,000',
} satisfies {
  transactions: DonutSummary;
  jobs: DonutSummary;
  customers: DonutSummary;
  [key: string]: unknown;
};
