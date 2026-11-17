'use client';
import { ActionDialog } from '@/components/molecules/ActionDialog/ActionDialog';
import { SuspensionForm } from '@/features/customers/components/SuspensionForm/SuspensionForm';
import type { Customer } from '@/features/customers/types/customerTypes';

export function SuspendAccountDialog({ customer }: { customer: Customer }) {
  return (
    <ActionDialog
      title="Suspend Account"
      width="sm"
      tone="danger"
      trigger={
        <button
          type="button"
          disabled={customer.status === 'Suspended'}
          title={
            customer.status === 'Suspended'
              ? 'Already suspended in sample data'
              : undefined
          }
          className="rounded-xl bg-rose-50 px-4 py-2 text-[11px] text-rose-500 transition-colors hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
        >
          Suspend Account
        </button>
      }
      confirmLabel="Suspend User"
    >
      <div className="mb-5 flex flex-wrap justify-between gap-2 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-3 text-[10px]">
        <span>
          {customer.fullName || customer.listName || customer.username}
        </span>
        <span className="break-all text-neutral-500">
          User ID: @{customer.username}
        </span>
      </div>
      <SuspensionForm />
    </ActionDialog>
  );
}
