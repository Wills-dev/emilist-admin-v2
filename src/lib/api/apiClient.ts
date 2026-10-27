import axios from 'axios';
import { publicEnv } from '@/config/env';
import { ApiError, normalizeApiError } from './apiError';

// Browser-facing client only. Server code must use the confirmed session adapter.
export const apiClient = axios.create({
  baseURL: publicEnv.apiBaseUrl,
  timeout: publicEnv.apiTimeoutMs,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (process.env.EMILIST_BUILD_TARGET === 'demo')
    throw new ApiError(
      'Administrative network requests are disabled in demo mode.',
      'configuration',
    );
  if (!publicEnv.apiBaseUrl)
    throw new ApiError(
      'API integration has not been configured.',
      'configuration',
    );
  // Reject absolute URLs so cookie-bearing requests stay on the configured API origin.
  if (
    !config.url ||
    !config.url.startsWith('/') ||
    config.url.startsWith('//') ||
    config.url.includes('\\') ||
    config.baseURL !== publicEnv.apiBaseUrl
  ) {
    throw new ApiError(
      'API requests must use a relative endpoint path.',
      'configuration',
    );
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
