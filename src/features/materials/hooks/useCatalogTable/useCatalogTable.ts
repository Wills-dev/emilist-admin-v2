'use client';
import { useFixtureTable } from '@/hooks/useFixtureTable/useFixtureTable';
import { MATERIAL_PRODUCTS } from '@/features/materials/fixtures/materialFixtures';
export function useCatalogTable() {
  return useFixtureTable({
    rows: MATERIAL_PRODUCTS,
    pageSize: 9,
    searchText: (row) =>
      `${row.id} ${row.name} ${row.merchant} ${row.category}`,
    rowStatus: (row) => row.status,
  });
}
