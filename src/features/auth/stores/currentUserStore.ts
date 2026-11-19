import { createStore } from 'zustand/vanilla';
import type { CurrentUser } from '@/features/auth/schemas/currentUserSchema';

export interface CurrentUserState {
  user: CurrentUser | null;
  setUser: (user: CurrentUser) => void;
  clearUser: () => void;
}

// A provider-scoped, in-memory snapshot, explicitly requested for identity UI.
// TanStack Query still owns requests, freshness, retries, and cancellation.
export function createCurrentUserStore() {
  return createStore<CurrentUserState>((set) => ({
    user: null,
    setUser: (user) => set({ user: structuredClone(user) }),
    clearUser: () => set({ user: null }),
  }));
}
