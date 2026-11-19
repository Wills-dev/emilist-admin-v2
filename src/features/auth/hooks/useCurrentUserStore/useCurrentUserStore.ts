'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { CurrentUserStoreContext } from '@/features/auth/components/CurrentUserProvider/CurrentUserProvider';
import type { CurrentUserState } from '@/features/auth/stores/currentUserStore';

export function useCurrentUserStore<T>(
  selector: (state: CurrentUserState) => T,
): T {
  const store = useContext(CurrentUserStoreContext);
  if (!store) throw new Error('CurrentUserProvider is required.');
  return useStore(store, selector);
}
