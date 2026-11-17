'use client';

import { useEffect, useRef } from 'react';
import { ApiError } from '@/lib/api/apiError';
import { useMutation } from '@tanstack/react-query';
import { enrollAdminMfa, verifyAdminMfa } from '@/features/auth/api/adminMfa';

export type AdminMfaMode = 'enrollment' | 'challenge';

// Internal form adapter; each service maps to the confirmed backend payload.
interface AdminMfaSubmission {
  token: string;
  code: string;
}

export function useAdminMfa(mode: AdminMfaMode) {
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  return useMutation({
    mutationFn: async ({ token, code }: AdminMfaSubmission) => {
      const controller = new AbortController();
      pending.current = controller;
      const response = await (mode === 'enrollment'
        ? enrollAdminMfa({ enrollmentToken: token, code }, controller.signal)
        : verifyAdminMfa({ challengeToken: token, code }, controller.signal));
      if (controller.signal.aborted)
        throw new ApiError('Request cancelled.', 'cancelled');
      return response;
    },
    retry: false,
    gcTime: 0,
  });
}
