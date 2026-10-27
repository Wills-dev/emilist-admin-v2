'use client';
import { MaterialsTabs } from '@/features/materials/components/MaterialsTabs/MaterialsTabs';
import { DataTable } from '@/components/organisms/DataTable/DataTable';
import { TableToolbar } from '@/components/organisms/TableToolbar/TableToolbar';
import { Pagination } from '@/components/molecules/Pagination/Pagination';
import { useCatalogTable } from '@/features/materials/hooks/useCatalogTable/useCatalogTable';
import { catalogColumns } from '@/features/materials/helpers/materialColumns';
export function ProductCatalog() {
  const table = useCatalogTable();
  return (
    <div className="space-y-4">
      <h2 className="sr-only">Product Catalog</h2>
      <TableToolbar
        leading={<MaterialsTabs />}
        label="Catalog samples"
        count={table.count}
        search={table.search}
        status={table.status}
        statuses={['Listed', 'Low Stock', 'Out of Stock']}
        onSearch={table.setSearch}
        onStatus={table.setStatus}
      />
      <DataTable
        rows={table.rows}
        columns={catalogColumns}
        rowKey={(row) => row.id}
        caption="Product Catalog"
      />
      <Pagination
        page={table.page}
        pages={table.pages}
        count={table.count}
        onPageChange={table.setPage}
      />
    </div>
  );
}
