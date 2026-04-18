/**
 * API Error Handling
 *
 * Centralized error classes and utilities.
 * Aligned with backend HttpExceptionFilter response format:
 * { status, error, message, details?, timestamp, requestId? }
 */

import type { ApiErrorResponse } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: string[];
  readonly requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: string[],
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }

  /** Check specific error scenarios */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }

  get isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR";
  }

  get isTimeout(): boolean {
    return this.code === "TIMEOUT";
  }

  /**
   * Get validation error messages as a flat list.
   * Backend sends `details: string[]` for class-validator errors.
   */
  get validationErrors(): string[] {
    return this.details ?? [];
  }
}

/**
 * Parse raw Response into ApiError.
 *
 * Backend HttpExceptionFilter returns:
 * {
 *   status: 400,
 *   error: "Bad Request",
 *   message: "Validation failed" | "Email already exists" | ...,
 *   details: ["email must be an email", "password must be ..."], // optional
 *   timestamp: "...",
 *   requestId: "..." // optional
 * }
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ApiErrorResponse;

    // Backend uses `error` as the error type (e.g. "Bad Request", "Unauthorized")
    const code = body.error || `HTTP_${response.status}`;

    // `message` is the human-readable error message
    const message =
      typeof body.message === "string"
        ? body.message
        : response.statusText || "An unexpected error occurred";

    return new ApiError(
      body.status || response.status,
      code,
      message,
      body.details,
      body.requestId,
    );
  } catch {
    return new ApiError(
      response.status,
      `HTTP_${response.status}`,
      response.statusText || "An unexpected error occurred",
    );
  }
}

/** Create network-level errors */
export function createNetworkError(cause?: unknown): ApiError {
  return new ApiError(
    0,
    "NETWORK_ERROR",
    "Unable to connect to the server. Please check your internet connection.",
    cause instanceof Error ? [cause.message] : undefined,
  );
}

export function createTimeoutError(): ApiError {
  return new ApiError(0, "TIMEOUT", "The request timed out. Please try again.");
}

type ErrorContext = "default" | "auth-login" | "auth-signup";

/** User-friendly error message for display */
export function getErrorMessage(
  error: unknown,
  context: ErrorContext = "default",
): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError)
      return "Connection lost. Please check your internet.";
    if (error.isTimeout) return "Request timed out. Please try again.";
    if (error.isUnauthorized) {
      if (context === "auth-login") {
        return error.message || "Invalid email or password.";
      }
      if (context === "auth-signup") {
        return error.message || "Sign up failed. Please try again.";
      }
      return "Session expired. Please log in again.";
    }
    if (error.isForbidden) return "You don't have permission for this action.";
    if (error.isServerError)
      return "Something went wrong on our end. Please try again later.";
    return error.message;
  }

  if (error instanceof Error) return error.message;

  return "An unexpected error occurred.";
}
