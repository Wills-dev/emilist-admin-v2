import { expect, it } from 'vitest';
import { JOBS } from './jobFixtures';
import { CUSTOMERS } from '@/features/customers/fixtures/customerFixtures';
import { filterFixtureRows, fixturePage } from '@/lib/table/fixtureRows';
it('retains distinct job identities and links only to existing local customers', () => {
  expect(new Set(JOBS.map((row) => row.id)).size).toBe(JOBS.length);
  for (const job of JOBS)
    expect(CUSTOMERS.some((customer) => customer.id === job.customerId)).toBe(
      true,
    );
  const overdue = filterFixtureRows(
    JOBS,
    'cleaning',
    'Overdue',
    (row) => row.title,
    (row) => row.status,
  );
  expect(overdue.map((row) => row.title)).toEqual(['Post-Site Cleaning']);
  expect(fixturePage(JOBS, 2, 9).rows[0]?.title).toBe('Sample Maintenance Job');
});
