'use client';

import { createContext, type ReactNode } from 'react';
import { useGetCurrentUser } from '@/features/auth/hooks/useGetCurrentUser/useGetCurrentUser';

interface CurrentUserView {
  pending: boolean;
  refreshing: boolean;
  error: boolean;
  retry: () => void;
}
export const CurrentUserViewContext = createContext<CurrentUserView | null>(
  null,
);

export function CurrentUserBoundary({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const query = useGetCurrentUser(enabled);
  return (
    <CurrentUserViewContext.Provider
      value={{
        pending: query.isPending,
        refreshing: query.isFetching && !query.isPending,
        error: query.isError,
        retry: () => {
          void query.refetch();
        },
      }}
    >
      {children}
    </CurrentUserViewContext.Provider>
  );
}
