/**
 * API Client
 *
 * High-performance fetch wrapper following Vercel best practices:
 * - `async-parallel`: Parallel requests via Promise.all
 * - `async-defer-await`: Late await pattern
 * - `server-cache-react`: Compatible with React.cache()
 * - `client-swr-dedup`: SWR-compatible response shape
 * - HttpOnly Cookie Auth: `credentials: 'include'`
 * - Automatic token refresh (triggered by 401)
 * - Type-safe generics
 */

import { apiConfig } from "./config";
import {
  ApiError,
  createNetworkError,
  createTimeoutError,
  parseApiError,
} from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retry?: number;
  skipAuth?: boolean;
}

/** Build URL with query params */
function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const base =
    typeof window === "undefined" ? apiConfig.internalUrl : apiConfig.baseUrl;
  const fullPath = path.startsWith("/") ? `${base}${path}` : path;

  // For relative paths (e.g. "/api/v1/auth/login"), use window.location.origin as the base
  // so `new URL` can parse them. On the server side, `base` is always absolute.
  const isAbsolute = /^https?:\/\//.test(fullPath);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = isAbsolute ? new URL(fullPath) : new URL(fullPath, origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/** Token refresh lock */
let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const base = apiConfig.baseUrl;
      const response = await fetch(`${base}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Essential for HttpOnly refresh cookie
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/** Core fetch with timeout, retry, and cookies */
async function fetchWithConfig<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const {
    params,
    timeout = apiConfig.timeout,
    retry = method === "GET" ? apiConfig.retryAttempts : 0,
    skipAuth = false,
    headers: extraHeaders,
    ...fetchOptions
  } = options;

  const url = buildUrl(path, params);

  const headers: Record<string, string> = {
    ...((extraHeaders as Record<string, string>) || {}),
  };

  // Skip Content-Type for FormData (browser sets it automatically with boundary)
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const init: RequestInit = {
    method,
    headers,
    signal: controller.signal,
    credentials: "include", // Always include cookies
    ...fetchOptions,
  };

  if (body) {
    init.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const response = await fetch(url, init);

      // Handle 401 with automatic token refresh (once per request)
      if (response.status === 401 && !skipAuth && attempt === 0) {
        const refreshed = await attemptTokenRefresh();
        if (refreshed) {
          // Retry the original request (cookies are now updated in the browser)
          const retryResponse = await fetch(url, init);
          clearTimeout(timeoutId);

          if (!retryResponse.ok) {
            throw await parseApiError(retryResponse);
          }

          if (retryResponse.status === 204) return undefined as T;
          return (await retryResponse.json()) as T;
        }

        // Refresh failed or no refresh token — could redirect to login here
        // But we prefer let the calling code handle auth state via auth store
        throw await parseApiError(response);
      }

      if (!response.ok) {
        throw await parseApiError(response);
      }

      clearTimeout(timeoutId);

      if (response.status === 204) return undefined as T;
      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        lastError = error;
        // Only retry on server errors (5xx)
        if (error.isServerError && attempt < retry) {
          await new Promise((r) =>
            setTimeout(r, apiConfig.retryDelay * (attempt + 1)),
          );
          continue;
        }
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw createTimeoutError();
      }

      if (attempt < retry) {
        await new Promise((r) =>
          setTimeout(r, apiConfig.retryDelay * (attempt + 1)),
        );
        continue;
      }

      throw createNetworkError(error);
    }
  }

  throw lastError || createNetworkError();
}

/**
 * API Client — primary interface for all API calls.
 */
export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    fetchWithConfig<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    fetchWithConfig<T>("POST", path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    fetchWithConfig<T>("PUT", path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    fetchWithConfig<T>("PATCH", path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    fetchWithConfig<T>("DELETE", path, undefined, options),

  /** Specialist method for file uploads or multipart data */
  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    fetchWithConfig<T>("POST", path, formData, options),
} as const;

/**
 * tokenManager is now empty because browser handles HttpOnly cookies.
 * Kept as empty object to avoid breaking imports that might still look for it.
 */
export const tokenManager = {} as const;
