'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CurrentUserProvider } from '@/features/auth/components/CurrentUserProvider/CurrentUserProvider';
import { createQueryClient } from '@/lib/query/queryClient';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        {children}
        <Toaster richColors closeButton />
      </CurrentUserProvider>
    </QueryClientProvider>
  );
}
