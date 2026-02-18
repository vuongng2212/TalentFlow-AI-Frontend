"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockCandidates, mockJobs } from "@/lib/mock-data";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Mock interview data
const mockInterviews = [
  {
    id: "1",
    candidate: mockCandidates[2],
    position: "Frontend Developer",
    date: new Date(2026, 1, 3, 10, 0),
    duration: 60,
    type: "VIDEO" as const,
    interviewer: "Jane Recruiter",
    status: "SCHEDULED" as const,
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    candidate: mockCandidates[3],
    position: "Backend Engineer",
    date: new Date(2026, 1, 3, 14, 30),
    duration: 45,
    type: "VIDEO" as const,
    interviewer: "John Interviewer",
    status: "SCHEDULED" as const,
    meetingLink: "https://zoom.us/j/123456789",
  },
  {
    id: "3",
    candidate: mockCandidates[1],
    position: "Full-Stack Developer",
    date: new Date(2026, 1, 4, 11, 0),
    duration: 60,
    type: "ONSITE" as const,
    interviewer: "Jane Recruiter",
    status: "SCHEDULED" as const,
    location: "Office - Conference Room A",
  },
  {
    id: "4",
    candidate: mockCandidates[0],
    position: "Senior Full-Stack Developer",
    date: new Date(2026, 1, 5, 9, 30),
    duration: 90,
    type: "VIDEO" as const,
    interviewer: "John Interviewer",
    status: "SCHEDULED" as const,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
  },
];

export default function InterviewsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<"ALL" | "TODAY" | "UPCOMING">(
    "UPCOMING",
  );
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateId: "",
    jobId: "",
    date: "",
    time: "",
    duration: "60",
    type: "VIDEO" as "VIDEO" | "ONSITE",
    interviewer: "",
    location: "",
    meetingLink: "",
    notes: "",
  });

  // Filter interviews
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const filteredInterviews = mockInterviews
    .filter((interview) => {
      if (filter === "TODAY") {
        return interview.date >= today && interview.date < todayEnd;
      }
      if (filter === "UPCOMING") {
        return interview.date >= now;
      }
      return true;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const todayCount = mockInterviews.filter(
    (i) => i.date >= today && i.date < todayEnd,
  ).length;
  const upcomingCount = mockInterviews.filter((i) => i.date >= now).length;

  const handleScheduleInterview = () => {
    // TODO: Connect to backend API
    const selectedCandidate = mockCandidates.find(
      (c) => c.id === newInterview.candidateId,
    );
    toast.success("Interview scheduled!", {
      description: `Interview with ${selectedCandidate?.fullName || "candidate"} on ${newInterview.date} at ${newInterview.time}.`,
    });
    setScheduleOpen(false);
    setNewInterview({
      candidateId: "",
      jobId: "",
      date: "",
      time: "",
      duration: "60",
      type: "VIDEO",
      interviewer: "",
      location: "",
      meetingLink: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Manage and schedule candidate interviews
          </p>
        </div>
        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription>
                Set up a new interview with a candidate. Fill in all required
                details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Candidate Selection */}
              <div className="grid gap-2">
                <Label htmlFor="candidate">Candidate *</Label>
                <select
                  id="candidate"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={newInterview.candidateId}
                  onChange={(e) =>
                    setNewInterview({
                      ...newInterview,
                      candidateId: e.target.value,
                    })
                  }
                >
                  <option value="">Select a candidate...</option>
                  {mockCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.fullName} - {candidate.appliedPosition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Position */}
              <div className="grid gap-2">
                <Label htmlFor="job">Job Position *</Label>
                <select
                  id="job"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={newInterview.jobId}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, jobId: e.target.value })
                  }
                >
                  <option value="">Select a job...</option>
                  {mockJobs
                    .filter((job) => job.status === "OPEN")
                    .map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newInterview.date}
                    onChange={(e) =>
                      setNewInterview({ ...newInterview, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newInterview.time}
                    onChange={(e) =>
                      setNewInterview({ ...newInterview, time: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Duration & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <select
                    id="duration"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={newInterview.duration}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        duration: e.target.value,
                      })
                    }
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Interview Type *</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={newInterview.type}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        type: e.target.value as "VIDEO" | "ONSITE",
                      })
                    }
                  >
                    <option value="VIDEO">Video Call</option>
                    <option value="ONSITE">On-site</option>
                  </select>
                </div>
              </div>

              {/* Interviewer */}
              <div className="grid gap-2">
                <Label htmlFor="interviewer">Interviewer *</Label>
                <Input
                  id="interviewer"
                  placeholder="e.g. Jane Recruiter"
                  value={newInterview.interviewer}
                  onChange={(e) =>
                    setNewInterview({
                      ...newInterview,
                      interviewer: e.target.value,
                    })
                  }
                />
              </div>

              {/* Conditional: Video Link or Location */}
              {newInterview.type === "VIDEO" ? (
                <div className="grid gap-2">
                  <Label htmlFor="meetingLink">
                    <Video className="h-4 w-4 inline mr-1" />
                    Meeting Link
                  </Label>
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={newInterview.meetingLink}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        meetingLink: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="location">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Office - Conference Room A"
                    value={newInterview.location}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or instructions..."
                  rows={3}
                  value={newInterview.notes}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleScheduleInterview}
                disabled={
                  !newInterview.candidateId ||
                  !newInterview.jobId ||
                  !newInterview.date ||
                  !newInterview.time ||
                  !newInterview.interviewer ||
                  (newInterview.type === "ONSITE" && !newInterview.location)
                }
              >
                Schedule Interview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today
            </CardTitle>
            <CalendarIcon className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Interviews scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <Clock className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <Video className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("ALL")}
            >
              All ({mockInterviews.length})
            </Button>
            <Button
              variant={filter === "TODAY" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("TODAY")}
            >
              Today ({todayCount})
            </Button>
            <Button
              variant={filter === "UPCOMING" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("UPCOMING")}
            >
              Upcoming ({upcomingCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interview List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredInterviews.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                No interviews scheduled
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Schedule your first interview to get started
              </p>
              <Button onClick={() => setScheduleOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredInterviews.map((interview) => {
            const isToday =
              interview.date >= today && interview.date < todayEnd;
            const isPast = interview.date < now;

            return (
              <Card
                key={interview.id}
                className={`hover-lift ${isToday ? "border-primary" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar
                        src={interview.candidate.avatar}
                        alt={interview.candidate.fullName}
                        fallback={interview.candidate.fullName.charAt(0)}
                        size="lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {interview.candidate.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.position}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        isPast ? "outline" : isToday ? "default" : "secondary"
                      }
                    >
                      {interview.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {interview.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {interview.date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-muted-foreground">
                      ({interview.duration} min)
                    </span>
                  </div>

                  {/* Location/Link */}
                  <div className="flex items-center gap-2 text-sm">
                    {interview.type === "VIDEO" ? (
                      <>
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Video Call
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {interview.location}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Interviewer */}
                  <div className="text-sm text-muted-foreground">
                    Interviewer:{" "}
                    <span className="font-medium text-foreground">
                      {interview.interviewer}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {interview.type === "VIDEO" && interview.meetingLink && (
                      <Button size="sm" className="flex-1">
                        <Video className="h-4 w-4 mr-2" />
                        Join Call
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="ghost">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
