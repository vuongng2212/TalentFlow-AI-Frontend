"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockKanbanColumns } from "@/lib/mock-data";
import type { Candidate, ApplicationStage, KanbanColumn } from "@/types";
import { Mail, Phone, FileText, Star } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function CandidatesPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>(mockKanbanColumns);

  // For demo purposes, we'll keep drag-drop simple without DnD Kit
  // In production, you'd use @dnd-kit/core for proper drag-drop

  const handleMoveCandidate = (
    candidate: Candidate,
    fromStage: ApplicationStage,
    toStage: ApplicationStage,
  ) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === fromStage) {
          return {
            ...col,
            candidates: col.candidates.filter((c) => c.id !== candidate.id),
            count: col.count - 1,
          };
        }
        if (col.id === toStage) {
          return {
            ...col,
            candidates: [...col.candidates, { ...candidate, stage: toStage }],
            count: col.count + 1,
          };
        }
        return col;
      }),
    );
  };

  const getStageColor = (stage: ApplicationStage): string => {
    const colors = {
      APPLIED: "bg-blue-500/10 border-blue-500/20",
      SCREENING: "bg-yellow-500/10 border-yellow-500/20",
      INTERVIEW: "bg-purple-500/10 border-purple-500/20",
      OFFER: "bg-green-500/10 border-green-500/20",
      HIRED: "bg-emerald-500/10 border-emerald-500/20",
      REJECTED: "bg-red-500/10 border-red-500/20",
    };
    return colors[stage];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Candidates Pipeline</h1>
        <p className="text-muted-foreground mt-1">
          Track candidates through your recruitment process
        </p>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <Card className={`h-full ${getStageColor(column.id)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    {column.title}
                  </CardTitle>
                  <Badge variant="secondary">{column.count}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {column.candidates.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No candidates
                  </div>
                ) : (
                  column.candidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="p-4 hover:shadow-md transition-smooth cursor-grab active:cursor-grabbing group"
                    >
                      {/* Candidate Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar
                          src={candidate.avatar}
                          alt={candidate.fullName}
                          fallback={candidate.fullName.charAt(0)}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate group-hover:text-primary transition-smooth">
                            {candidate.fullName}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {candidate.appliedPosition}
                          </p>
                        </div>
                        {candidate.aiScore && (
                          <div className="flex items-center gap-1 text-xs font-medium">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{candidate.aiScore}%</span>
                          </div>
                        )}
                      </div>

                      {/* Candidate Info */}
                      <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                        {candidate.email && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                        )}
                        {candidate.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 flex-shrink-0" />
                          <span>
                            Applied {formatRelativeTime(candidate.appliedDate)}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {candidate.skills.slice(0, 2).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs flex-1"
                        >
                          View
                        </Button>
                        {column.id !== "HIRED" && column.id !== "REJECTED" && (
                          <select
                            className="h-7 text-xs border rounded px-2 bg-background"
                            onChange={(e) => {
                              const newStage = e.target
                                .value as ApplicationStage;
                              if (newStage !== column.id) {
                                handleMoveCandidate(
                                  candidate,
                                  column.id,
                                  newStage,
                                );
                              }
                              e.target.value = column.id; // Reset select
                            }}
                            defaultValue={column.id}
                          >
                            <option value={column.id}>Move to...</option>
                            {columns
                              .filter((c) => c.id !== column.id)
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="text-center">
                <div className="text-2xl font-bold">{column.count}</div>
                <div className="text-xs text-muted-foreground">
                  {column.title}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
