import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Định nghĩa base response của BE
export interface ApiResponse<T = any> {
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

// Interceptor cho Request
apiClient.interceptors.request.use(
  (config) => {
    // Nếu có logic đính kèm token vào header thì thêm ở đây
    // Ví dụ: const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
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
  (error: AxiosError<ApiResponse>) => {
    // Xử lý lỗi chung toàn cục
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Xử lý logic khi hết hạn session (Logout user, redirect về login)
          // window.location.href = '/login'; // Ví dụ
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
    apiClient.get<any, ApiResponse<T>>(url, { params }).then(res => res.data),

  post: <T>(url: string, data?: object) =>
    apiClient.post<any, ApiResponse<T>>(url, data).then(res => res.data),

  put: <T>(url: string, data?: object) =>
    apiClient.put<any, ApiResponse<T>>(url, data).then(res => res.data),

  patch: <T>(url: string, data?: object) =>
    apiClient.patch<any, ApiResponse<T>>(url, data).then(res => res.data),

  delete: <T>(url: string) =>
    apiClient.delete<any, ApiResponse<T>>(url).then(res => res.data),
};
