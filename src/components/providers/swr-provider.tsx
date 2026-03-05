/**
 * SWR Provider
 *
 * Global SWR configuration for the entire app.
 * Provides deduplication, error handling, and cache management.
 */

"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/errors";

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 5_000,
        errorRetryCount: 2,
        onError: (error: unknown) => {
          if (error instanceof ApiError) {
            if (error.isUnauthorized) {
              // Auth errors handled by client interceptor
              return;
            }

            if (error.isServerError) {
              toast.error("Server Error", {
                description: "Something went wrong. Please try again later.",
              });
              return;
            }
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
