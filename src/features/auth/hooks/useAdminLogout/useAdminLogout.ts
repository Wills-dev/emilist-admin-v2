'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUserStore } from '@/features/auth/hooks/useCurrentUserStore/useCurrentUserStore';
import { logoutAdmin } from '@/features/auth/api/logoutAdmin';

export function useAdminLogout() {
  const queryClient = useQueryClient();
  const clearUser = useCurrentUserStore((state) => state.clearUser);
  return useMutation({
    mutationFn: logoutAdmin,
    retry: false,
    gcTime: 0,
    onSuccess: async () => {
      clearUser();
      await queryClient.cancelQueries();
      queryClient.clear();
    },
  });
}
