import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

// 1. Request Interceptor: Attach Access Token from Zustand
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor with Promise Locking to prevent duplicate refresh calls
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop if the refresh endpoint itself fails with 401
    if (originalRequest.url?.includes('/authentication/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh isn't already in progress, start one and cache the promise
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/authentication/refresh`,
                {},
                { withCredentials: true }
              );

              const newAccessToken = response.data.accessToken || response.data.access_token;
              if (!newAccessToken) {
                throw new Error("No access token returned from refresh endpoint");
              }

              // Save new access token in Zustand memory
              useAuthStore.setState({ accessToken: newAccessToken });
              return newAccessToken;
            } finally {
              // Clear the lock once finished (success or fail)
              refreshPromise = null;
            }
          })();
        }

        // All concurrent 401 requests will wait for this single promise to resolve
        const token = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If the shared refresh call fails, clear auth and redirect
        useAuthStore.getState().clearAuth?.();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);