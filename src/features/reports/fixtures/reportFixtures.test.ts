import { expect, it } from 'vitest';
import {
  REPORT_OPTIONS,
  REPORT_SUCCESS,
  REPORT_MATERIALS,
  REPORT_TRENDS,
  REPORT_PLANS,
} from './reportFixtures';
import { exportReportSchema } from '@/features/reports/schemas/exportReportSchema';
it('preserves sample chart proportions and category totals', () => {
  expect(REPORT_OPTIONS).toHaveLength(6);
  expect(REPORT_SUCCESS.reduce((sum, row) => sum + row.value, 0)).toBe(100);
  expect(REPORT_MATERIALS.reduce((sum, row) => sum + row.value, 0)).toBe(
    180000,
  );
  expect(
    REPORT_TRENDS.every(
      (row) => row.acquisition >= row.cohort && row.active >= row.returning,
    ),
  ).toBe(true);
  expect(REPORT_PLANS.map((row) => row.plan)).toEqual([
    'Basic',
    'Silver',
    'Gold',
    'Platinum',
  ]);
});
it('validates report dates and download selections only', () => {
  const draft = {
    report: 'job-success',
    from: '2036-10-18',
    to: '2036-10-26',
    format: 'PDF',
  };
  expect(exportReportSchema.safeParse(draft).success).toBe(true);
  expect(
    exportReportSchema.safeParse({ ...draft, to: '2036-10-01' }).success,
  ).toBe(false);
  expect(
    exportReportSchema.safeParse({ ...draft, format: 'EXE' }).success,
  ).toBe(false);
});
