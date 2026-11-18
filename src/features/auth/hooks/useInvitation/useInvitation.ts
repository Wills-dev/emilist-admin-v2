'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query/queryKeys';
import { ApiError } from '@/lib/api/apiError';
import {
  inspectInvitation,
  createInvitationPassword,
  resumeInvitationSetup,
} from '@/features/auth/api/adminInvitation';
import type {
  InvitationPasswordPayload,
  InvitationSetupResponse,
} from '@/features/auth/schemas/invitationSchemas';

export function useInvitation(initialToken?: string, invalidToken = false) {
  const token = useRef(initialToken);
  const [expired, setExpired] = useState(false);
  const [blocked, setBlocked] = useState<string>();
  const id = useId();
  const client = useQueryClient();
  const invitationKey = queryKeys.detail('auth', `invitation-${id}`);
  const setupKey = queryKeys.detail('auth', `invitation-setup-${id}`);
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);

  const invitation = useQuery({
    queryKey: invitationKey,
    queryFn: ({ signal }) => inspectInvitation(token.current, signal),
    enabled: !invalidToken && !expired,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const setup = useQuery<InvitationSetupResponse | null>({
    queryKey: setupKey,
    queryFn: skipToken,
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!invitation.isSuccess || !token.current) return;
    // The verified token is now in an HttpOnly cookie. Keep display hints only.
    const params = new URLSearchParams(window.location.search);
    params.delete('token');
    params.delete('invite');
    if (invitation.data) params.set('email', invitation.data.data.admin.email);
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}`,
    );
    token.current = undefined;
  }, [invitation.isSuccess, invitation.data]);

  const expiresAt = invitation.data?.data.invitationExpiresAt;
  useEffect(() => {
    if (!expiresAt) return;
    const timer = setTimeout(
      () => {
        setExpired(true);
        client.setQueryData(
          queryKeys.detail('auth', `invitation-setup-${id}`),
          null,
        );
        toast.error(
          'This invitation has expired. Ask your inviter for a new link.',
        );
      },
      Math.max(0, Date.parse(expiresAt) - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [expiresAt, client, id]);

  function onError(error: unknown) {
    if (
      error instanceof ApiError &&
      (error.code === 'invitation_expired' ||
        error.code === 'invitation_changed')
    ) {
      setBlocked(error.message);
      client.setQueryData(setupKey, null);
    }
  }
  function onSuccess(response: InvitationSetupResponse) {
    client.setQueryData(setupKey, response);
    void client.invalidateQueries({ queryKey: invitationKey });
  }
  const password = useMutation({
    mutationFn: async (payload: InvitationPasswordPayload) => {
      const controller = new AbortController();
      pending.current = controller;
      const response = await createInvitationPassword(
        payload,
        invitation.data?.data.flowId ?? '',
        controller.signal,
      );
      if (controller.signal.aborted)
        throw new ApiError('Request cancelled.', 'cancelled');
      return response;
    },
    retry: false,
    gcTime: 0,
    onSuccess,
    onError,
  });
  const resume = useMutation({
    mutationFn: async () => {
      const controller = new AbortController();
      pending.current = controller;
      const response = await resumeInvitationSetup(
        invitation.data?.data.flowId ?? '',
        controller.signal,
      );
      if (controller.signal.aborted)
        throw new ApiError('Request cancelled.', 'cancelled');
      return response;
    },
    retry: false,
    gcTime: 0,
    onSuccess,
    onError,
  });
  return {
    invitation,
    setup: setup.data?.data.authenticator,
    password,
    resume,
    expired,
    blocked,
    clearSetup: () => client.setQueryData(setupKey, null),
  };
}
