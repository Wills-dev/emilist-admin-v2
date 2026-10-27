export const REPORT_PERIODS = [
  { value: '30', label: 'Last 30 days', caption: 'Oct 1 – Oct 31, 2026' },
  { value: '7', label: 'Last 7 days', caption: 'Oct 25 – Oct 31, 2026' },
  { value: '90', label: 'Last 90 days', caption: 'Aug 3 – Oct 31, 2026' },
] as const;

// Reports reference total matches the sum of the reused job chart segments.
export const REPORT_JOB_TOTAL = 65_162;
