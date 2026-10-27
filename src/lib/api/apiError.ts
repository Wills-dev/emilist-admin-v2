import axios from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'unauthorized'
      | 'forbidden'
      | 'network'
      | 'timeout'
      | 'cancelled'
      | 'server'
      | 'request'
      | 'configuration',
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isCancel(error))
    return new ApiError('Request cancelled.', 'cancelled');
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401)
      return new ApiError(
        'Your session is unavailable or has expired.',
        'unauthorized',
        status,
      );
    if (status === 403)
      return new ApiError(
        'You do not have permission to perform this action.',
        'forbidden',
        status,
      );
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')
      return new ApiError('The request timed out. Please retry.', 'timeout');
    if (!error.response)
      return new ApiError(
        'Unable to connect. Please check your connection.',
        'network',
      );
    return new ApiError(
      status && status >= 500
        ? 'The service is temporarily unavailable.'
        : 'The request could not be completed.',
      status && status >= 500 ? 'server' : 'request',
      status,
    );
  }
  return new ApiError('An unexpected error occurred.', 'request');
}
