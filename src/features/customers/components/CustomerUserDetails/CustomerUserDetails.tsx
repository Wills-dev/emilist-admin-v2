import { DetailField } from '@/components/molecules/DetailField/DetailField';
import type { Customer } from '@/features/customers/types/customerTypes';
export function CustomerUserDetails({ customer }: { customer: Customer }) {
  const d = customer.details;
  return (
    <section aria-label="User Details" className="rounded-2xl bg-white p-4">
      <h2 className="sr-only">User Details</h2>
      <dl className="grid gap-3 sm:grid-cols-6">
        <DetailField label="Registered On" className="sm:col-span-2">
          {d?.registered || customer.joined}
        </DetailField>
        <DetailField label="Gender" className="sm:col-span-2">
          {d?.gender}
        </DetailField>
        <DetailField label="Language" className="sm:col-span-2">
          {d?.language}
        </DetailField>
        <DetailField label="First Name" className="sm:col-span-2">
          {d?.firstName || customer.fullName.split(' ')[0]}
        </DetailField>
        <DetailField label="Middle Name" className="sm:col-span-2">
          {d?.middleName}
        </DetailField>
        <DetailField label="Last Name" className="sm:col-span-2">
          {d?.lastName}
        </DetailField>
        <DetailField label="House address" className="sm:col-span-3">
          {customer.address}
        </DetailField>
        <DetailField label="City" className="sm:col-span-3">
          {d?.city}
        </DetailField>
        <DetailField label="State" className="sm:col-span-3">
          {d?.state}
        </DetailField>
        <DetailField label="Country" className="sm:col-span-3">
          {d?.country}
        </DetailField>
        <DetailField label="Mobile Number" className="sm:col-span-2">
          {d?.mobilePhone || customer.phone}
        </DetailField>
        <DetailField label="Business Number" className="sm:col-span-2">
          {d?.businessPhone}
        </DetailField>
        <DetailField label="Whatsapp Number" className="sm:col-span-2">
          {d?.whatsapp || '—'}
        </DetailField>
        <DetailField
          label="Profile Completion Status"
          className="sm:col-span-3"
        >
          {customer.complete ? 'Complete' : 'Incomplete'}
        </DetailField>
        <DetailField label="Status" className="sm:col-span-3">
          {customer.status}
        </DetailField>
      </dl>
    </section>
  );
}
