import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { JobEmploymentTypeFilter, JobStatusFilter } from "./types";

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: JobStatusFilter;
  onStatusChange: (status: JobStatusFilter) => void;
  employmentTypeFilter: JobEmploymentTypeFilter;
  onEmploymentTypeChange: (employmentType: JobEmploymentTypeFilter) => void;
  statusCounts: Record<JobStatusFilter, number>;
}

const statuses: JobStatusFilter[] = ["ALL", "OPEN", "DRAFT", "CLOSED"];
const employmentTypes: JobEmploymentTypeFilter[] = [
  "ALL",
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
];

const employmentTypeLabels: Record<JobEmploymentTypeFilter, string> = {
  ALL: "All Types",
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export function JobFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  employmentTypeFilter,
  onEmploymentTypeChange,
  statusCounts,
}: JobFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select
              value={employmentTypeFilter}
              onValueChange={(value) =>
                onEmploymentTypeChange(value as JobEmploymentTypeFilter)
              }
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {employmentTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(status)}
              >
                {status} ({statusCounts[status]})
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
