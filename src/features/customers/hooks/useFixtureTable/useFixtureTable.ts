'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { customerQuerySchema } from '@/features/customers/schemas/customerQuerySchema';
import {
  filterFixtureRows,
  fixturePage,
} from '@/features/customers/helpers/customerHelpers';

// Local presentation state only. No API calls or server pagination claims.
export function useFixtureTable<T>({
  rows,
  pageSize,
  searchText,
  rowStatus,
}: {
  rows: readonly T[];
  pageSize: number;
  searchText: (row: T) => string;
  rowStatus: (row: T) => string;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const query = customerQuerySchema.parse({
    search: params.get('search') || '',
    status: params.get('status') || 'all',
    page: params.get('page') || '1',
  });
  const filtered = filterFixtureRows(
    rows,
    query.search,
    query.status,
    searchText,
    rowStatus,
  );
  const result = fixturePage(filtered, query.page, pageSize);
  function update(values: { search?: string; status?: string; page?: number }) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(values)) {
      if (
        value === '' ||
        (key === 'status' && value === 'all') ||
        (key === 'page' && value === 1)
      )
        next.delete(key);
      else next.set(key, String(value));
    }
    const suffix = next.toString();
    window.history.replaceState(
      null,
      '',
      `${pathname}${suffix ? `?${suffix}` : ''}`,
    );
  }
  return {
    ...result,
    search: query.search,
    status: query.status,
    setSearch: (search: string) => update({ search, page: 1 }),
    setStatus: (status: string) => update({ status, page: 1 }),
    setPage: (page: number) => update({ page }),
  };
}
