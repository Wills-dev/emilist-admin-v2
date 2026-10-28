import axios from 'axios';
import { ApiError, normalizeApiError } from './apiError';

// This application exposes synthetic fixtures only. No administrative transport is enabled.
export const apiClient = axios.create({
  timeout: 15000,
  withCredentials: false,
});
apiClient.interceptors.request.use(() => {
  throw new ApiError(
    'Administrative network requests are disabled in this fixture preview.',
    'configuration',
  );
});
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
