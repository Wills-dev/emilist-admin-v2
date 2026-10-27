import { SettingsSection } from '@/features/settings/components/SettingsSection/SettingsSection';
import { SubscriptionPlans } from '@/components/organisms/SubscriptionPlans/SubscriptionPlans';
import { SETTINGS_PLANS } from '@/features/settings/fixtures/settingsFixtures';
export function SubscriptionSettings() {
  return (
    <SettingsSection
      title="Subscription Settings"
      description="Update subscription plan prices, add and remove tiers"
      action={
        <button
          type="button"
          disabled
          aria-label="Edit subscription settings"
          title="Subscription updates require backend integration"
          className="rounded-lg bg-[#20c46b] px-3 py-2 text-xs text-white disabled:cursor-not-allowed"
        >
          Edit
        </button>
      }
    >
      <SubscriptionPlans plans={SETTINGS_PLANS} />
    </SettingsSection>
  );
}
