import axios from 'axios';
import { publicEnv } from '@/config/env';
import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { ApiError, normalizeApiError } from './apiError';

// Only confirmed authentication POSTs are enabled; dashboard transport stays blocked.
export const apiClient = axios.create({
  timeout: publicEnv.apiTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
apiClient.interceptors.request.use((config) => {
  const loginRequest =
    !config.baseURL &&
    Object.values(ADMIN_AUTH_ROUTES).some((path) => path === config.url) &&
    (config.method === 'post' ||
      (config.method === 'get' && config.url === ADMIN_AUTH_ROUTES.invitation));
  if (loginRequest) return config;

  throw new ApiError(
    'Administrative network requests are disabled in this fixture preview.',
    'configuration',
  );
});
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
