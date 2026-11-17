'use client';

import { useEffect, useRef } from 'react';
import { ApiError } from '@/lib/api/apiError';
import { toast } from 'sonner';
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { AdminLoginResponse } from '@/features/auth/schemas/adminLoginResponseSchema';
import {
  loginAdmin,
  type AdminLoginPayload,
} from '@/features/auth/api/loginAdmin';

const FLOW_KEY = queryKeys.detail('auth', 'mfa-flow');

// Internal cache adapter; expiry is a UI limit, never a grant of authorization.
interface LoginFlow {
  response: AdminLoginResponse;
  expiresAt: number;
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  const flow = useQuery<LoginFlow | null>({
    queryKey: FLOW_KEY,
    queryFn: skipToken,
    gcTime: 0,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (!flow.data) return;
    const timer = setTimeout(
      () => {
        queryClient.setQueryData(FLOW_KEY, null);
        toast.error('Your sign-in challenge expired. Please sign in again.');
      },
      Math.max(0, flow.data.expiresAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [flow.data, queryClient]);

  const mutation = useMutation({
    mutationFn: async (payload: AdminLoginPayload) => {
      const controller = new AbortController();
      pending.current = controller;
      const response = await loginAdmin(payload, controller.signal);
      if (controller.signal.aborted)
        throw new ApiError('Request cancelled.', 'cancelled');
      return response;
    },
    retry: false,
    gcTime: 0,
    onSuccess: (response) => {
      const enrollment =
        'mfaEnrollmentRequired' in response.data &&
        response.data.mfaEnrollmentRequired;
      queryClient.setQueryData<LoginFlow>(FLOW_KEY, {
        response,
        expiresAt: Date.now() + (enrollment ? 15 : 5) * 60_000,
      });
    },
  });
  return {
    ...mutation,
    flow: flow.data?.response.data,
    clearFlow: () => queryClient.setQueryData(FLOW_KEY, null),
  };
}
