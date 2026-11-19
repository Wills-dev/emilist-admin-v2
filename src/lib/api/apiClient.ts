import axios from 'axios';
import { publicEnv } from '@/config/env';
import { ADMIN_AUTH_ROUTES } from '@/config/adminAuth';
import { ApiError, normalizeApiError } from './apiError';

// Only explicit same-origin authentication and identity handlers are enabled.
export const apiClient = axios.create({
  timeout: publicEnv.apiTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
apiClient.interceptors.request.use((config) => {
  const loginRequest =
    !config.baseURL &&
    Object.values(ADMIN_AUTH_ROUTES).some((path) => path === config.url) &&
    ((config.method === 'post' &&
      config.url !== ADMIN_AUTH_ROUTES.currentUser) ||
      (config.method === 'get' &&
        [ADMIN_AUTH_ROUTES.invitation, ADMIN_AUTH_ROUTES.currentUser].some(
          (path) => path === config.url,
        )));
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
