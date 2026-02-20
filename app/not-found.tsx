import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Please
          check the URL or navigate back to the dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/jobs">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/dashboard" className="text-primary hover:underline">
              Dashboard
            </Link>
            <Link
              href="/dashboard/jobs"
              className="text-primary hover:underline"
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/candidates"
              className="text-primary hover:underline"
            >
              Candidates
            </Link>
            <Link
              href="/dashboard/interviews"
              className="text-primary hover:underline"
            >
              Interviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
