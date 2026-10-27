import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  ImageOff,
  MoreVertical,
  Download,
  Printer,
} from 'lucide-react';
import { CUSTOMER_ROUTES } from '@/constants/routes';
import type { DataTableColumn } from '@/components/organisms/DataTable/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { CustomerRowActions } from '@/features/customers/components/CustomerRowActions/CustomerRowActions';
import { formatNaira, customerName, statusTone } from './customerHelpers';
import type {
  Customer,
  JobRecord,
  ListingRecord,
  OrderRecord,
  SaleRecord,
  TransactionRecord,
  SubscriptionRecord,
} from '@/features/customers/types/customerTypes';

function text(value: string | undefined) {
  return (
    <span className="block truncate" title={value || 'Not provided'}>
      {value || '—'}
    </span>
  );
}
function badge(status: string) {
  return <StatusBadge tone={statusTone(status)}>{status}</StatusBadge>;
}
function product(value: string) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span
        title="Product image unavailable"
        className="flex size-7 shrink-0 items-center justify-center rounded bg-neutral-100 text-neutral-400"
      >
        <ImageOff aria-hidden="true" className="size-3.5" />
      </span>
      {text(value)}
    </span>
  );
}
function unavailable(label: string) {
  return (
    <button
      type="button"
      disabled
      title="Requires backend integration"
      className="cursor-not-allowed text-[11px] whitespace-nowrap text-slate-500"
    >
      {label}
    </button>
  );
}
function rowOptions(id: string) {
  return (
    <button
      type="button"
      disabled
      aria-label={`Actions unavailable for ${id}`}
      className="text-slate-400"
    >
      <MoreVertical className="size-4" />
    </button>
  );
}
export const customerColumns: DataTableColumn<Customer>[] = [
  {
    id: 'date',
    header: 'Date Joined',
    className: 'w-24',
    cell: (row) => row.joined,
  },
  {
    id: 'name',
    header: 'Full Name',
    className: 'w-32',
    cell: (row) => <span className="text-slate-950">{text(row.listName)}</span>,
  },
  {
    id: 'username',
    header: 'Username',
    className: 'w-28',
    cell: (row) => text(row.username),
  },
  {
    id: 'email',
    header: 'Email Address',
    className: 'w-36',
    cell: (row) => <span className="text-slate-950">{text(row.email)}</span>,
  },
  {
    id: 'phone',
    header: 'Phone No',
    className: 'w-28',
    cell: (row) => text(row.phone),
  },
  {
    id: 'address',
    header: 'Home Address',
    className: 'w-44',
    cell: (row) => <span className="text-slate-950">{text(row.address)}</span>,
  },
  {
    id: 'profile',
    header: 'User Profile',
    className: 'w-24',
    cell: (row) => (
      <span className="text-[10px]">
        {row.complete ? 'Complete' : 'Incomplete'}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    className: 'w-24',
    cell: (row) => badge(row.status),
  },
  {
    id: 'view',
    header: 'Details',
    className: 'w-16',
    cell: (row) => (
      <Link
        href={CUSTOMER_ROUTES.details(row.id)}
        aria-label={`View ${customerName(row)}`}
        className="rounded text-indigo-500 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        View
      </Link>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    className: 'w-14',
    cell: (row) => (
      <CustomerRowActions customerId={row.id} name={customerName(row)} />
    ),
  },
];
export const jobColumns: DataTableColumn<JobRecord>[] = [
  {
    id: 'date',
    header: 'Date Created',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Job ID',
    className: 'w-24',
    cell: (row) => text(row.id),
  },
  {
    id: 'title',
    header: 'Job Title',
    className: 'w-52',
    cell: (row) => <span className="text-slate-950">{text(row.title)}</span>,
  },
  { id: 'role', header: 'Job Role', cell: (row) => row.role },
  { id: 'duration', header: 'Job Duration', cell: (row) => row.duration },
  {
    id: 'budget',
    header: 'Job Budget',
    className: 'w-32',
    cell: (row) => (
      <span className="font-medium text-[#343b36]">
        {formatNaira(row.budget)}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Job Status',
    className: 'w-24',
    cell: (row) => badge(row.status),
  },
  {
    id: 'view',
    header: 'Details',
    className: 'w-24',
    cell: () => unavailable('View Job'),
  },
  {
    id: 'actions',
    header: 'Actions',
    className: 'w-12',
    cell: (row) => rowOptions(row.id),
  },
];
export const listingColumns: DataTableColumn<ListingRecord>[] = [
  {
    id: 'date',
    header: 'Date Listed',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Listing ID',
    className: 'w-24',
    cell: (row) => text(row.id),
  },
  {
    id: 'product',
    header: 'Product Name',
    className: 'w-44',
    cell: (row) => product(row.product),
  },
  {
    id: 'category',
    header: 'Item Category',
    className: 'w-32',
    cell: (row) => text(row.category),
  },
  {
    id: 'price',
    header: 'Unit Price',
    className: 'w-28',
    cell: (row) => (
      <span className="text-slate-950">{formatNaira(row.price)}</span>
    ),
  },
  {
    id: 'stock',
    header: 'Stock',
    className: 'w-28',
    cell: (row) => text(row.stock),
  },
  {
    id: 'sold',
    header: 'Quantity Sold',
    cell: (row) => row.sold.toLocaleString('en-US'),
  },
  {
    id: 'status',
    header: 'Status',
    className: 'w-28',
    cell: (row) => badge(row.status),
  },
  {
    id: 'view',
    header: 'Details',
    className: 'w-24',
    cell: () => unavailable('View Listing'),
  },
  {
    id: 'actions',
    header: 'Actions',
    className: 'w-12',
    cell: (row) => rowOptions(row.id),
  },
];
export const orderColumns: DataTableColumn<OrderRecord>[] = [
  {
    id: 'date',
    header: 'Order Date',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Order ID',
    className: 'w-24',
    cell: (row) => text(row.id),
  },
  {
    id: 'product',
    header: 'Product Name',
    className: 'w-44',
    cell: (row) => product(row.product),
  },
  {
    id: 'category',
    header: 'Item Category',
    className: 'w-32',
    cell: (row) => text(row.category),
  },
  {
    id: 'price',
    header: 'Unit Price',
    className: 'w-28',
    cell: (row) => (
      <span className="text-slate-950">{formatNaira(row.price)}</span>
    ),
  },
  {
    id: 'quantity',
    header: 'Order Quantity',
    cell: (row) => row.quantity.toLocaleString('en-US'),
  },
  { id: 'payment', header: 'Payment Status', cell: (row) => row.payment },
  {
    id: 'status',
    header: 'Order Status',
    className: 'w-28',
    cell: (row) => badge(row.status),
  },
  {
    id: 'view',
    header: 'Details',
    className: 'w-24',
    cell: () => unavailable('View Order'),
  },
  {
    id: 'actions',
    header: 'Actions',
    className: 'w-12',
    cell: (row) => rowOptions(row.id),
  },
];
export const saleColumns: DataTableColumn<SaleRecord>[] = [
  {
    id: 'date',
    header: 'Sale Date',
    className: 'w-24',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Sale ID',
    className: 'w-24',
    cell: (row) => text(row.id),
  },
  {
    id: 'buyer',
    header: 'Buyer Name',
    className: 'w-36',
    cell: (row) => text(row.buyer),
  },
  {
    id: 'product',
    header: 'Product Name',
    className: 'w-40',
    cell: (row) => product(row.product),
  },
  {
    id: 'quantity',
    header: 'Quantity',
    cell: (row) => row.quantity.toLocaleString('en-US'),
  },
  {
    id: 'price',
    header: 'Sale Price',
    className: 'w-28',
    cell: (row) => formatNaira(row.price),
  },
  {
    id: 'address',
    header: 'Delivery Address',
    className: 'w-44',
    cell: (row) => text(row.address),
  },
  {
    id: 'status',
    header: 'Delivery Status',
    className: 'w-28',
    cell: (row) => badge(row.status),
  },
  {
    id: 'view',
    header: 'Details',
    className: 'w-16',
    cell: () => unavailable('View'),
  },
  {
    id: 'actions',
    header: 'Actions',
    className: 'w-12',
    cell: (row) => rowOptions(row.id),
  },
];
export const transactionColumns: DataTableColumn<TransactionRecord>[] = [
  {
    id: 'date',
    header: 'Transaction Date',
    className: 'w-28',
    cell: (row) => row.date,
  },
  {
    id: 'id',
    header: 'Transaction ID',
    className: 'w-28',
    cell: (row) => text(`#${row.id}`),
  },
  {
    id: 'counterparty',
    header: 'Counterparty',
    className: 'w-40',
    cell: (row) => (
      <span className="text-slate-950">{text(row.counterparty)}</span>
    ),
  },
  {
    id: 'type',
    header: 'Transaction Type',
    className: 'w-32',
    cell: (row) => (
      <span className="flex items-center gap-2">
        {row.type === 'Inflow' ? (
          <ArrowDownRight className="size-6 rounded bg-emerald-100 p-1 text-emerald-500" />
        ) : (
          <ArrowUpRight className="size-6 rounded bg-rose-100 p-1 text-rose-400" />
        )}
        {row.type}
      </span>
    ),
  },
  {
    id: 'amount',
    header: 'Amount',
    className: 'w-28',
    cell: (row) => (
      <strong className="text-[#535c55]">{formatNaira(row.amount)}</strong>
    ),
  },
  {
    id: 'method',
    header: 'Payment Method',
    className: 'w-32',
    cell: (row) => row.method,
  },
  {
    id: 'status',
    header: 'Payment Status',
    className: 'w-28',
    cell: (row) => badge(row.status),
  },
  {
    id: 'view',
    header: 'Details',
    className: 'w-16',
    cell: () => unavailable('View'),
  },
  {
    id: 'receipt',
    header: 'Receipt',
    className: 'w-14',
    cell: () => (
      <button
        type="button"
        disabled
        aria-label="Receipt unavailable"
        className="text-rose-200"
      >
        <FileText className="size-4" />
      </button>
    ),
  },
  {
    id: 'download',
    header: 'Download',
    className: 'w-16',
    cell: () => (
      <button
        type="button"
        disabled
        aria-label="Download unavailable"
        className="text-neutral-300"
      >
        <Download className="size-4" />
      </button>
    ),
  },
];
export const subscriptionColumns: DataTableColumn<SubscriptionRecord>[] = [
  { id: 'date', header: 'Subscription Date', cell: (row) => row.date },
  { id: 'amount', header: 'Amount', cell: (row) => formatNaira(row.amount) },
  {
    id: 'description',
    header: 'Description',
    className: 'w-48',
    cell: (row) => <span className="text-slate-950">{row.description}</span>,
  },
  {
    id: 'receipt',
    header: 'Receipt ↓',
    className: 'w-44',
    cell: (row) => (
      <button
        type="button"
        disabled
        title="No receipt document is connected"
        className="flex items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-1 text-[11px] whitespace-nowrap text-neutral-500"
      >
        <FileText className="size-3 text-rose-400" />
        {row.receipt}
      </button>
    ),
  },
  { id: 'status', header: 'Status', cell: (row) => badge(row.status) },
  { id: 'paid', header: 'Date Paid', cell: (row) => row.paid },
  {
    id: 'print',
    header: 'Print',
    className: 'w-14',
    cell: () => (
      <button
        type="button"
        disabled
        aria-label="Print receipt unavailable"
        className="text-slate-400"
      >
        <Printer className="size-4" />
      </button>
    ),
  },
];
