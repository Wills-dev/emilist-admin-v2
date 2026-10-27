import { AxiosError, AxiosHeaders, CanceledError } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiError, normalizeApiError } from './apiError';
describe('API error normalization', () => {
  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [500, 'server'],
    [422, 'request'],
  ])('normalizes %s without leaking backend details', (status, code) => {
    const error = new AxiosError('secret backend detail');
    error.response = {
      status: Number(status),
      data: { secret: 'private' },
      headers: {},
      statusText: '',
      config: { headers: new AxiosHeaders() },
    };
    expect(normalizeApiError(error).code).toBe(code);
    expect(normalizeApiError(error).message).not.toContain('secret');
  });
  it('distinguishes cancellation, timeout, network and unknown errors', () => {
    expect(normalizeApiError(new CanceledError()).code).toBe('cancelled');
    expect(normalizeApiError(new AxiosError('', 'ECONNABORTED')).code).toBe(
      'timeout',
    );
    expect(normalizeApiError(new AxiosError()).code).toBe('network');
    expect(normalizeApiError(new Error('secret')).message).not.toContain(
      'secret',
    );
    const configError = new ApiError('Not configured.', 'configuration');
    expect(normalizeApiError(configError)).toBe(configError);
  });
});
