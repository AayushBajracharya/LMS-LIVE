import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { TokenService } from './TokenService';
import { isTokenExpired } from '../Utils/tokenUtils';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  failedQueue = [];
};

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = TokenService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config!;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = TokenService.getRefreshToken();
      const accessToken = TokenService.getAccessToken();

      // Check if refresh token exists and is not expired
      if (!refreshToken || isTokenExpired(refreshToken)) {
        TokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post<{ accessToken: string; refreshToken: string; userId: number }>(
          `${API_BASE_URL}/Auth/refresh`,
          { refreshToken, accessToken }
        );

        TokenService.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken});
        apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);

        originalRequest.headers!.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr: any) {
        // Check if the refresh error is due to an expired refresh token
        if (refreshErr.response?.status === 401 || refreshErr.response?.status === 403) {
          TokenService.clearTokens();
          window.location.href = '/login';
        }
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;