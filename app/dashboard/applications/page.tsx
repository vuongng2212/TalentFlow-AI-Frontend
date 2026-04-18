"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { ApplicationCrudDialog } from "@/components/applications/application-crud-dialog";
import { canPerformAction } from "@/lib/rbac/permissions";
import { formatDate } from "@/lib/utils";
import { deleteApplication, useApplications } from "@/services/applications";
import { useAuthStore } from "@/store/auth-store";
import type { Application } from "@/types";

export default function ApplicationsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  const {
    data: applications = [],
    pagination,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useApplications({ page, limit: 20 });

  const role = useAuthStore((state) => state.user?.role);
  const canEditApplications = canPerformAction(role, "applications:update");
  const canDeleteApplications = canPerformAction(role, "applications:delete");

  const filteredApplications = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (normalizedQuery.length === 0) {
      return applications;
    }

    return applications.filter((application) => {
      const candidateName = application.candidate?.fullName?.toLowerCase() ?? "";
      const candidateEmail = application.candidate?.email?.toLowerCase() ?? "";
      const jobTitle = application.job?.title?.toLowerCase() ?? "";

      return (
        candidateName.includes(normalizedQuery) ||
        candidateEmail.includes(normalizedQuery) ||
        jobTitle.includes(normalizedQuery)
      );
    });
  }, [applications, searchQuery]);

  const handleEdit = useCallback(
    (application: Application) => {
      if (!canEditApplications) return;
      setSelectedApplication(application);
      setEditOpen(true);
    },
    [canEditApplications],
  );

  const handleDelete = useCallback(
    async (applicationId: string) => {
      if (!canDeleteApplications || deletingIds[applicationId]) return;
      if (!window.confirm("Are you sure you want to delete this application?")) {
        return;
      }

      setDeletingIds((current) => ({ ...current, [applicationId]: true }));

      try {
        await deleteApplication(applicationId);
      } catch {
        toast.error("Failed to delete application", {
          description: "Please try again.",
        });
        setDeletingIds((current) => {
          const next = { ...current };
          delete next[applicationId];
          return next;
        });
        return;
      }

      toast.success("Application deleted.");
      try {
        await mutate();
      } catch {
        toast.error("Application deleted but refresh failed.", {
          description: "Please reload the page to see the latest data.",
        });
      } finally {
        setDeletingIds((current) => {
          const next = { ...current };
          delete next[applicationId];
          return next;
        });
      }
    },
    [canDeleteApplications, deletingIds, mutate],
  );

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setEditOpen(open);
    if (!open) {
      setSelectedApplication(null);
    }
  }, []);

  const handleDialogSuccess = useCallback(() => {
    setEditOpen(false);
    setSelectedApplication(null);
    mutate().catch(() => {
      toast.error("Application updated but refresh failed.", {
        description: "Please reload the page to see the latest data.",
      });
    });
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 rotate-45 text-destructive" />
        <h3 className="text-xl font-semibold">Failed to load applications</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review and update candidate applications.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
              placeholder="Search by candidate or job"
            />
          </div>
        </CardContent>
      </Card>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
            No applications found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold truncate">
                      {application.candidate?.fullName ?? "Unknown candidate"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.candidate?.email ?? "No email"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.job?.title ?? "Unknown job"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied on {formatDate(application.appliedAt)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{application.stage}</Badge>
                      <Badge variant="outline">{application.status}</Badge>
                    </div>

                    {canEditApplications || canDeleteApplications ? (
                      <div className="flex gap-2">
                        {canEditApplications ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(application)}
                          >
                            Edit
                          </Button>
                        ) : null}
                        {canDeleteApplications ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(application.id)}
                            disabled={Boolean(deletingIds[application.id])}
                          >
                            {deletingIds[application.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length} on this
            page ({pagination.total} total)
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            disabled={isValidating}
          />
        </div>
      ) : null}

      {selectedApplication ? (
        <ApplicationCrudDialog
          application={selectedApplication}
          open={editOpen}
          onOpenChange={handleDialogOpenChange}
          onSuccess={handleDialogSuccess}
        />
      ) : null}
    </div>
  );
}
