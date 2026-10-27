import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/apiError';
import { createQueryClient } from './queryClient';

describe('query retry policy', () => {
  it('does not retry authorization failures or mutations', () => {
    const options = createQueryClient().getDefaultOptions();
    const retry = options.queries?.retry;
    expect(typeof retry).toBe('function');
    if (typeof retry !== 'function') throw new Error('Expected retry policy');
    expect(retry(0, new ApiError('Expired', 'unauthorized', 401))).toBe(false);
    expect(retry(0, new ApiError('Forbidden', 'forbidden', 403))).toBe(false);
    expect(retry(0, new ApiError('Cancelled', 'cancelled'))).toBe(false);
    expect(retry(0, new ApiError('Offline', 'network'))).toBe(true);
    expect(retry(2, new ApiError('Offline', 'network'))).toBe(false);
    expect(options.mutations?.retry).toBe(false);
  });
  it('isolates query caches between provider instances', () => {
    const first = createQueryClient();
    const second = createQueryClient();
    first.setQueryData(['private'], { userId: 'one' });
    expect(second.getQueryData(['private'])).toBeUndefined();
    first.clear();
    second.clear();
  });
});
