'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { useCurrentUserStore } from '@/features/auth/hooks/useCurrentUserStore/useCurrentUserStore';
import { CURRENT_USER_QUERY_KEY } from '@/features/auth/lib/authQueryKeys';
import type { CurrentUser } from '@/features/auth/schemas/currentUserSchema';
import { ApiError } from '@/lib/api/apiError';
import { ROUTES } from '@/constants/routes';

export function useGetCurrentUser(enabled: boolean) {
  const router = useRouter();
  const client = useQueryClient();
  const setUser = useCurrentUserStore((state) => state.setUser);
  const clearUser = useCurrentUserStore((state) => state.clearUser);
  const expired = useRef(false);
  const query = useQuery<CurrentUser | null>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: ({ signal }) => getCurrentUser(signal),
    enabled,
    gcTime: 0,
    staleTime: 60_000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    meta: { private: true },
  });

  useEffect(() => () => clearUser(), [clearUser]);
  useEffect(() => {
    if (!enabled) {
      clearUser();
      return;
    }
    if (
      query.error instanceof ApiError &&
      query.error.code === 'unauthorized'
    ) {
      if (expired.current) return;
      expired.current = true;
      clearUser();
      const otherPrivate = (item: {
        queryKey: readonly unknown[];
        meta?: Record<string, unknown>;
      }) =>
        item.meta?.private === true &&
        (item.queryKey.length !== CURRENT_USER_QUERY_KEY.length ||
          item.queryKey.some(
            (value, index) => value !== CURRENT_USER_QUERY_KEY[index],
          ));
      void client.cancelQueries({ predicate: otherPrivate });
      client.removeQueries({ predicate: otherPrivate });
      client.setQueryData(CURRENT_USER_QUERY_KEY, null);
      toast.error('Your session has expired. Please sign in again.');
      router.replace(ROUTES.login);
      router.refresh();
      return;
    }
    if (query.error instanceof ApiError && query.error.code === 'forbidden') {
      clearUser();
      return;
    }
    if (query.isSuccess && query.data) setUser(query.data);
  }, [
    enabled,
    query.data,
    query.error,
    query.isSuccess,
    setUser,
    clearUser,
    client,
    router,
  ]);

  return query;
}
