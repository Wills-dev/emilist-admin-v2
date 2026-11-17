'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutAdmin } from '@/features/auth/api/logoutAdmin';

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutAdmin,
    retry: false,
    gcTime: 0,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
    },
  });
}
