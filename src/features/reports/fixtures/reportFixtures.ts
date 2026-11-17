export const REPORT_PERIODS = [
  {
    value: '30',
    label: 'Last 30 days',
    caption: 'Oct 1 – Oct 31, 2026',
    from: '2026-10-01',
    to: '2026-10-31',
  },
  {
    value: '7',
    label: 'Last 7 days',
    caption: 'Oct 25 – Oct 31, 2026',
    from: '2026-10-25',
    to: '2026-10-31',
  },
  {
    value: '90',
    label: 'Last 90 days',
    caption: 'Aug 3 – Oct 31, 2026',
    from: '2026-08-03',
    to: '2026-10-31',
  },
] as const;

// Independent synthetic design metrics. Date controls do not fetch live data.
export const REPORT_OPTIONS = [
  { id: 'churn', title: 'Platform Daily Churn Rates' },
  { id: 'acquisition', title: 'New User Acquisition Rates' },
  { id: 'job-success', title: 'Job Success Rates by Timeframe' },
  { id: 'active-users', title: 'Daily Active Users' },
  { id: 'materials', title: 'Material Sales Rate by Category' },
  { id: 'subscriptions', title: 'Subscription Plan Performance' },
] as const;
export const REPORT_TRENDS = [
  {
    day: '1',
    churn: 1.3,
    acquisition: 40,
    cohort: 0,
    active: 3800,
    returning: 900,
  },
  {
    day: '6',
    churn: 2.9,
    acquisition: 85,
    cohort: 23,
    active: 8500,
    returning: 3000,
  },
  {
    day: '11',
    churn: 1.9,
    acquisition: 50,
    cohort: 10,
    active: 5000,
    returning: 1600,
  },
  {
    day: '17',
    churn: 2.8,
    acquisition: 38,
    cohort: 22,
    active: 3700,
    returning: 3200,
  },
  {
    day: '24',
    churn: 2,
    acquisition: 52,
    cohort: 12,
    active: 5300,
    returning: 1800,
  },
  {
    day: '31',
    churn: 2.2,
    acquisition: 55,
    cohort: 15,
    active: 5500,
    returning: 2200,
  },
];
export const REPORT_SUCCESS = [
  { name: 'Completed', value: 82, color: '#00ae5b' },
  { name: 'Pending', value: 9, color: '#ff9900' },
  { name: 'Overdue', value: 6, color: '#ff4147' },
  { name: 'Cancelled', value: 3, color: '#94a3b8' },
];
// Average rate is a separate design metric from the completed share in the donut.
export const REPORT_AVERAGE_SUCCESS = 79;
export const REPORT_MATERIALS = [
  { name: 'Building Materials', value: 99000, color: '#b2fa88' },
  { name: 'Home Fittings', value: 54000, color: '#fde4f7' },
  { name: 'Cleaning Materials', value: 27000, color: '#d6d6d6' },
];
export const REPORT_PLANS = [
  { plan: 'Basic', October: 100, September: 40 },
  { plan: 'Silver', October: 165, September: 110 },
  { plan: 'Gold', October: 125, September: 65 },
  { plan: 'Platinum', October: 40, September: 105 },
];
