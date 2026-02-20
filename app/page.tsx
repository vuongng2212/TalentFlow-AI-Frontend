"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/lib/constants";
import LandingPage from "./(marketing)/landing/page";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status and redirect if authenticated
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    } else {
      // Defer state update to avoid synchronous state update warning during render phase
      // This is safe because we're just updating loading state
      const timer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
