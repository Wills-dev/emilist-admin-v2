'use client';

import { createContext, useState, type ReactNode } from 'react';
import { createCurrentUserStore } from '@/features/auth/stores/currentUserStore';

export const CurrentUserStoreContext = createContext<ReturnType<
  typeof createCurrentUserStore
> | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createCurrentUserStore);
  return (
    <CurrentUserStoreContext.Provider value={store}>
      {children}
    </CurrentUserStoreContext.Provider>
  );
}
