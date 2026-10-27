'use client';
import Link from 'next/link';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { RecordActions } from '@/components/molecules/RecordActions/RecordActions';
import { RecordStatus } from '@/components/molecules/RecordStatus/RecordStatus';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import { formatNaira } from '@/lib/format/formatNaira';
import { MaterialProductName } from '@/features/materials/components/MaterialProductName/MaterialProductName';
import type {
  MaterialProduct,
  MaterialOrder,
} from '@/features/materials/types/materialTypes';
const linkClass =
  'underline underline-offset-2 transition-colors hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none';
function person(name: string, id: string) {
  return (
    <Link href={CUSTOMER_ROUTES.details(id)} className={linkClass}>
      {name}
    </Link>
  );
}
function actions(name: string) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled
        title="Record details require backend integration and supplied detail designs"
        className="text-xs text-indigo-500 disabled:cursor-not-allowed"
      >
        View
      </button>
      <RecordActions
        name={name}
        actions={['View record', 'Edit record', 'Cancel record']}
      />
    </div>
  );
}
export const catalogColumns: readonly DataTableColumn<MaterialProduct>[] = [
  {
    id: 'date',
    header: 'Date Listed',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Listing ID',
    className: 'w-20',
    cell: (row) => (
      <span className="block truncate" title={row.id}>
        #{row.id}
      </span>
    ),
  },
  {
    id: 'product',
    header: 'Product Name',
    className: 'w-40',
    cell: (row) => <MaterialProductName name={row.name} />,
  },
  {
    id: 'merchant',
    header: 'Merchant',
    className: 'w-28',
    cell: (row) => person(row.merchant, row.customerId),
  },
  {
    id: 'category',
    header: 'Item Category',
    className: 'w-28',
    cell: (row) => (
      <span className="block truncate" title={row.category}>
        {row.category}
      </span>
    ),
  },
  {
    id: 'price',
    header: 'Unit Price',
    className: 'w-24',
    cell: (row) => (
      <span className="whitespace-nowrap text-slate-950">
        {formatNaira(row.price)}
      </span>
    ),
  },
  { id: 'stock', header: 'Stock', className: 'w-24', cell: (row) => row.stock },
  {
    id: 'sold',
    header: 'Quantity Sold',
    className: 'w-24 text-center',
    cell: (row) => row.sold.toLocaleString('en-NG'),
  },
  {
    id: 'status',
    header: 'Status',
    className: 'w-24',
    cell: (row) => <RecordStatus status={row.status} />,
  },
  {
    id: 'actions',
    header: '',
    className: 'w-24',
    cell: (row) => actions(`${row.name} ${row.id}`),
  },
];
export const orderColumns: readonly DataTableColumn<MaterialOrder>[] = [
  {
    id: 'date',
    header: 'Order Date',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Order ID',
    className: 'w-20',
    cell: (row) => (
      <span className="block truncate" title={row.id}>
        #{row.id}
      </span>
    ),
  },
  {
    id: 'buyer',
    header: 'Buyer',
    className: 'w-28',
    cell: (row) => person(row.buyer, row.buyerId),
  },
  {
    id: 'product',
    header: 'Product Name',
    className: 'w-40',
    cell: (row) => <MaterialProductName name={row.product.name} />,
  },
  {
    id: 'merchant',
    header: 'Merchant',
    className: 'w-28',
    cell: (row) => person(row.product.merchant, row.product.customerId),
  },
  {
    id: 'quantity',
    header: 'Quantity Sold',
    className: 'w-24 text-center',
    cell: (row) => row.quantity.toLocaleString('en-NG'),
  },
  {
    id: 'price',
    header: 'Sale Price',
    className: 'w-24',
    cell: (row) => (
      <span className="whitespace-nowrap text-slate-950">
        {formatNaira(row.price)}
      </span>
    ),
  },
  {
    id: 'payment',
    header: 'Payment Status',
    className: 'w-24',
    cell: (row) => row.payment,
  },
  {
    id: 'delivery',
    header: 'Delivery Status',
    className: 'w-24',
    cell: (row) => <RecordStatus status={row.delivery} />,
  },
  {
    id: 'actions',
    header: '',
    className: 'w-24',
    cell: (row) => actions(`${row.product.name} ${row.id}`),
  },
];
