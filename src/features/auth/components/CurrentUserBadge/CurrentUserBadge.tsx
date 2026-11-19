'use client';

import { useCurrentUserStore } from '@/features/auth/hooks/useCurrentUserStore/useCurrentUserStore';
import { useCurrentUserView } from '@/features/auth/hooks/useCurrentUserView/useCurrentUserView';

export function CurrentUserBadge() {
  const user = useCurrentUserStore((state) => state.user);
  const view = useCurrentUserView();
  const verified = !!user && !view.pending && !view.error;
  return (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] whitespace-nowrap text-emerald-800">
      {verified ? 'Admin' : 'Account'}
    </span>
  );
}
