"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Job</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{jobTitle}&quot;
            </span>
            ? This action cannot be undone. All applications for this job will
            also be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
