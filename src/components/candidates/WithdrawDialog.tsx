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
import { useDeleteApplication } from "@/services/applications";
import { toast } from "sonner";

interface WithdrawDialogProps {
  applicationId: string;
  candidateName: string;
  jobTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWithdrawn: () => void;
}

export function WithdrawDialog({
  applicationId,
  candidateName,
  jobTitle,
  open,
  onOpenChange,
  onWithdrawn,
}: WithdrawDialogProps) {
  const { trigger: withdrawApplication, isMutating: isWithdrawing } =
    useDeleteApplication(applicationId);

  const handleWithdraw = useCallback(async () => {
    try {
      await withdrawApplication(undefined);
      toast.success("Application withdrawn", {
        description: jobTitle
          ? `${candidateName}'s application for "${jobTitle}" has been withdrawn.`
          : `${candidateName}'s application has been withdrawn.`,
      });
      onOpenChange(false);
      onWithdrawn();
    } catch {
      toast.error("Failed to withdraw application", {
        description: "Please try again or contact support.",
      });
    }
  }, [withdrawApplication, candidateName, jobTitle, onOpenChange, onWithdrawn]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-500/10 p-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <DialogTitle>Withdraw Application</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to withdraw{" "}
            <span className="font-semibold text-foreground">{candidateName}</span>
            {jobTitle ? (
              <>
                &apos;s application for{" "}
                <span className="font-semibold text-foreground">&quot;{jobTitle}&quot;</span>
              </>
            ) : (
              "&apos;s application"
            )}
            ? This will mark the application as withdrawn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isWithdrawing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Withdrawing...
              </>
            ) : (
              "Withdraw Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
