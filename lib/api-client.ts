import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Định nghĩa base response của BE
export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

// Định nghĩa format pagination của BE
export interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Lấy base url từ env, fallback về localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Bật withCredentials để tự động đính kèm cookie (session) trong mỗi request
  withCredentials: true,
});

// Module-level workspace ID store — set by AuthContext after login/switch.
// Using a closure avoids circular imports with RoleContext.
let _activeWorkspaceId: string | null = null;
let _isRefreshing = false;
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}
let _failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  _failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  _failedQueue = [];
};

export function setActiveWorkspaceId(id: string | null) {
  _activeWorkspaceId = id;
}

export function getActiveWorkspaceId(): string | null {
  return _activeWorkspaceId;
}

// Interceptor cho Request
apiClient.interceptors.request.use(
  (config) => {
    if (_activeWorkspaceId) {
      config.headers['x-workspace-id'] = _activeWorkspaceId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Tự động extract phần `data` từ response chuẩn của BE
    // Component chỉ cần quan tâm tới dữ liệu thực tế
    return response.data as any;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any;

    // Xử lý lỗi chung toàn cục
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
        if (_isRefreshing) {
          return new Promise(function (resolve, reject) {
            _failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        _isRefreshing = true;

        try {
          // Import động để tránh circular dependency
          const { authService } = await import('@/services/api/auth.service');
          await authService.refreshToken();

          _isRefreshing = false;
          processQueue(null);

          return apiClient(originalRequest);
        } catch (refreshError) {
          _isRefreshing = false;
          processQueue(refreshError);

          // Redirect về login nếu refresh thất bại
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup') {
              window.location.href = '/login';
            }
          }

          return Promise.reject(refreshError);
        }
      }

      switch (status) {
        case 401:
          console.error('Unauthorized: Please login again');
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Not Found:', data?.message);
          break;
        case 500:
          console.error('Server Error:', data?.message);
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }

      // Trả về error response data để component tự xử lý chi tiết nếu cần
      return Promise.reject(data || error);
    }

    // Lỗi không có response (Network error, timeout...)
    return Promise.reject(error);
  }
);

/**
 * Các helper methods tiện ích bọc lại apiClient
 */
export const api = {
  get: <T>(url: string, params?: object) =>
    apiClient.get<unknown, ApiResponse<T>>(url, { params }).then(res => res.data),

  post: <T>(url: string, data?: object) =>
    apiClient.post<unknown, ApiResponse<T>>(url, data).then(res => res.data),

  put: <T>(url: string, data?: object) =>
    apiClient.put<unknown, ApiResponse<T>>(url, data).then(res => res.data),

  patch: <T>(url: string, data?: object) =>
    apiClient.patch<unknown, ApiResponse<T>>(url, data).then(res => res.data),

  delete: <T>(url: string) =>
    apiClient.delete<unknown, ApiResponse<T>>(url).then(res => res.data),
};
