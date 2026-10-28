import { describe, expect, it } from 'vitest';
import { CUSTOMERS } from '@/features/customers/fixtures/customerFixtures';
import { filterFixtureRows, fixturePage } from './customerHelpers';
import { customerQuerySchema } from '@/features/customers/schemas/customerQuerySchema';
describe('customer fixture controls', () => {
  it('combines case-insensitive search and status without changing the source records', () => {
    const rows = filterFixtureRows(
      CUSTOMERS,
      '  THREE  ',
      'Inactive',
      (row) => row.fullName,
      (row) => row.status,
    );
    expect(rows.map((row) => row.id)).toEqual(['demo-user-003']);
    expect(CUSTOMERS).toHaveLength(12);
    expect(
      filterFixtureRows(
        CUSTOMERS,
        'not-a-customer',
        'all',
        (row) => row.fullName,
        (row) => row.status,
      ),
    ).toEqual([]);
  });
  it('clamps invalid or stale pagination and handles empty results', () => {
    const result = fixturePage(CUSTOMERS, 900, 9);
    expect(result.page).toBe(2);
    expect(result.rows).toHaveLength(3);
    expect(fixturePage([], 9, 6)).toEqual({
      rows: [],
      page: 1,
      pages: 1,
      count: 0,
    });
  });
  it('preserves spaces while typing and validates hostile URL state', () => {
    expect(
      customerQuerySchema.parse({
        search: 'Demo ',
        status: 'all',
        page: '2',
      }).search,
    ).toBe('Demo ');
    expect(
      customerQuerySchema.parse({ search: 'all', status: 'all', page: '-3' })
        .page,
    ).toBe(1);
    expect(
      customerQuerySchema.parse({
        search: 'a'.repeat(201),
        status: 'all',
        page: 'not-a-page',
      }),
    ).toEqual({ search: '', status: 'all', page: 1 });
  });
});
