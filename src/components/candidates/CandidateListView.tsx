import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, UserSearch, Edit, Trash2 } from "lucide-react";
import type { CandidateViewModel, ApplicationStage, Application } from "@/types";
import { ApplicationCrudDialog } from "@/components/applications/application-crud-dialog";
import { CrudDialog } from "@/components/shared/crud-dialog";
import { deleteApplication } from "@/services/applications";
import { toast } from "sonner";

const stageColorMap: Record<ApplicationStage, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 border-blue-200",
  SCREENING: "bg-amber-500/10 text-amber-600 border-amber-200",
  INTERVIEW: "bg-purple-500/10 text-purple-600 border-purple-200",
  OFFER: "bg-teal-500/10 text-teal-600 border-teal-200",
  HIRED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  REJECTED: "bg-rose-500/10 text-rose-600 border-rose-200",
};

interface CandidateListItemProps {
  candidate: CandidateViewModel;
  index: number;
}

const CandidateListItem = React.memo(function CandidateListItem({
  candidate,
  index,
}: CandidateListItemProps) {
  return (
    <Link
      href={`/dashboard/candidates/${candidate._applicationId}`}
      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group animate-fade-in w-full"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
        {candidate.fullName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
          {candidate.fullName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {candidate.appliedPosition}
        </p>
      </div>
      <Badge
        variant="outline"
        className={`text-[10px] px-2 py-0.5 ${candidate.stage ? stageColorMap[candidate.stage] : ""}`}
      >
        {candidate.stage}
      </Badge>
        {candidate.aiScore ? (
          <div className="flex items-center gap-1.5 min-w-[60px]">
            <div
              className={`h-2 w-2 rounded-full ${
                candidate.aiScore >= 85
                  ? "bg-emerald-500"
                  : candidate.aiScore >= 70
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-medium tabular-nums">
              {candidate.aiScore}%
            </span>
          </div>
        ) : null}
      </Link>
  );
});

interface CandidateListViewProps {
  candidates: CandidateViewModel[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function CandidateListView({
  candidates,
  hasActiveFilters,
  onClearFilters,
}: CandidateListViewProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateViewModel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (e: React.MouseEvent, candidate: CandidateViewModel) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCandidate(candidate);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, candidate: CandidateViewModel) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCandidate(candidate);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCandidate?._applicationId) return;

    setIsDeleting(true);
    try {
      await deleteApplication(selectedCandidate._applicationId);
      toast.success("Application deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCandidate(null);
      // Ideally we would trigger a re-fetch here, but for now just show success toast
      // We can reload the page to refresh the data since mutate isn't passed down
      window.location.reload();
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    // Reload page to get fresh data
    window.location.reload();
  };

  return (
    <Card className="shadow-soft-sm">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            All Candidates ({candidates.length})
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sort by:</span>
            <select className="bg-transparent border-none text-xs font-medium text-foreground focus:outline-none cursor-pointer">
              <option>AI Score</option>
              <option>Name</option>
              <option>Applied Date</option>
              <option>Stage</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <UserSearch className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No candidates found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria to find candidates."
                : "Start by uploading CVs to build your candidate pipeline."}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="gap-2"
              >
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            ) : (
              <Link href="/dashboard/upload">
                <Button size="sm" className="gap-2">
                  <Upload className="h-3.5 w-3.5" />
                  Upload CV
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="flex group items-center pr-4 relative">
                <div className="flex-1">
                  <CandidateListItem
                    candidate={candidate}
                    index={index}
                  />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEditClick(e, candidate)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    title="Edit Candidate"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteClick(e, candidate)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Delete Candidate"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {selectedCandidate && (
        <ApplicationCrudDialog
          application={
            {
              id: selectedCandidate._applicationId,
              jobId: "unknown",
              stage: selectedCandidate.stage || "APPLIED",
              status: "ACTIVE",
              coverLetter: "",
              notes: "",
              candidateId: selectedCandidate.id,
            } as Application
          }
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      <CrudDialog
        title="Delete Application"
        description={`Are you sure you want to delete the application for ${selectedCandidate?.fullName}? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <div className="py-4 text-sm text-muted-foreground">
          This will permanently delete this application from the system.
        </div>
        <div className="mt-4 -mx-6 -mb-4 px-6 py-4 bg-muted/30 border-t flex justify-end gap-2 sticky bottom-0">
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CrudDialog>
    </Card>
  );
}
