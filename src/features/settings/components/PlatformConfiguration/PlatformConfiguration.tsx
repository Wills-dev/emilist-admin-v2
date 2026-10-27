import { PlatformSettings } from '@/features/settings/components/PlatformSettings/PlatformSettings';
import { SubscriptionSettings } from '@/features/settings/components/SubscriptionSettings/SubscriptionSettings';
import { SpotlightSettings } from '@/features/settings/components/SpotlightSettings/SpotlightSettings';
export function PlatformConfiguration() {
  return (
    <div className="space-y-4">
      <h2 className="sr-only">Platform Configuration</h2>
      <p role="note" className="text-[10px] text-slate-500">
        Static settings fixtures. Edits and selections are local only; no
        platform configuration or subscriptions can be saved.
      </p>
      <PlatformSettings />
      <SubscriptionSettings />
      <SpotlightSettings />
    </div>
  );
}
