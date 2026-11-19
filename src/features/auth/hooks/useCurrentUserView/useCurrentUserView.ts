'use client';

import { useContext } from 'react';
import { CurrentUserViewContext } from '@/features/auth/components/CurrentUserBoundary/CurrentUserBoundary';

export function useCurrentUserView() {
  const view = useContext(CurrentUserViewContext);
  if (!view) throw new Error('CurrentUserBoundary is required.');
  return view;
}
