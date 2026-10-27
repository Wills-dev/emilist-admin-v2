import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  emptyMessage = 'No records match your search or filters.',
}: {
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  rowKey: (row: T) => string;
  caption: string;
  emptyMessage?: string;
}) {
  return (
    <div
      role="region"
      aria-label={`${caption} table scroll area`}
      tabIndex={0}
      className="min-w-0 overflow-x-auto bg-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset"
    >
      <table className="w-full min-w-240 table-fixed text-left text-xs">
        <caption className="sr-only">
          {caption} — static presentation fixtures
        </caption>
        <thead className="bg-white text-[10px] font-normal text-[#6d7892]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn('px-3 py-4 font-normal', column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={rowKey(row)} className="h-16 odd:bg-[#f8f9fa]">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn('px-3 py-4 text-[#535c70]', column.className)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-14 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
