import { ActionDialog } from '@/components/molecules/ActionDialog/ActionDialog';
import { SubscriptionPriceForm } from '@/features/settings/components/SubscriptionPriceForm/SubscriptionPriceForm';
export function SubscriptionPriceDialog() {
  return (
    <ActionDialog
      title="Change Subscription Amount"
      description="Enter the new prices for the Emilist subscription plans."
      trigger={
        <button
          type="button"
          aria-label="Edit subscription settings"
          className="rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none"
        >
          Edit
        </button>
      }
      confirmLabel="Save Changes"
    >
      <SubscriptionPriceForm />
    </ActionDialog>
  );
}
