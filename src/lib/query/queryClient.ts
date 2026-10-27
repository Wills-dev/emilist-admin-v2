import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/apiError';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (count, error) =>
          count < 2 &&
          error instanceof ApiError &&
          ['network', 'timeout', 'server'].includes(error.code),
      },
      mutations: { retry: false },
    },
  });
}
