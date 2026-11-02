import { SubscriptionPriceDialog } from '@/features/settings/components/SubscriptionPriceDialog/SubscriptionPriceDialog';
import { SettingsSection } from '@/features/settings/components/SettingsSection/SettingsSection';
import { SubscriptionPlans } from '@/components/organisms/SubscriptionPlans/SubscriptionPlans';
import { SETTINGS_PLANS } from '@/features/settings/fixtures/settingsFixtures';
export function SubscriptionSettings() {
  return (
    <SettingsSection
      title="Subscription Settings"
      description="Update subscription plan prices, add and remove tiers"
      action={<SubscriptionPriceDialog />}
    >
      <SubscriptionPlans plans={SETTINGS_PLANS} />
    </SettingsSection>
  );
}
