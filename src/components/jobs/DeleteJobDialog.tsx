"use client";

import { useCallback } from "react";
import { CrudDialog } from "@/components/shared/crud-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDeleteJob } from "@/services/jobs";
import { toast } from "sonner";

interface DeleteJobDialogProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteJobDialog({
  jobId,
  jobTitle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteJobDialogProps) {
  const { trigger: deleteJob, isMutating: isDeleting } = useDeleteJob(jobId);

  const handleDelete = useCallback(async () => {
    try {
      await deleteJob(undefined);
      toast.success("Job deleted", {
        description: `"${jobTitle}" has been removed.`,
      });
      onOpenChange(false);
      onDeleted();
    } catch {
      toast.error("Failed to delete job", {
        description: "Please try again or contact support.",
      });
    }
  }, [deleteJob, jobTitle, onOpenChange, onDeleted]);

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Job"
      description={`Are you sure you want to delete "${jobTitle}"? This action cannot be undone. All applications for this job will also be removed.`}
    >
      <div className="mt-4 -mx-6 -mb-4 px-6 py-4 bg-muted/30 border-t flex items-center justify-end gap-2 sticky bottom-0">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            "Delete Job"
          )}
        </Button>
      </div>
    </CrudDialog>
  );
}
