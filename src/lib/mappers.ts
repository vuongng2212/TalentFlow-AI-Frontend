import { APPLICATION_STAGES } from "@/lib/constants";
import type {
  Application,
  ApplicationStage,
  CandidateViewModel,
  KanbanColumn,
} from "@/types";

const STAGE_ORDER: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

export function mapApplicationToViewModel(
  app: Application,
): CandidateViewModel {
  return {
    id: app.candidate?.id ?? app.candidateId,
    email: app.candidate?.email ?? "",
    fullName: app.candidate?.fullName ?? "Unknown",
    stage: app.stage,
    appliedPosition: app.job?.title ?? "",
    appliedDate: app.appliedAt,
    _applicationId: app.id,
  };
}

export function groupApplicationsByStage(
  applications: Application[],
): KanbanColumn[] {
  const grouped = new Map<ApplicationStage, CandidateViewModel[]>();
  for (const stage of STAGE_ORDER) grouped.set(stage, []);

  for (const app of applications) {
    const vm = mapApplicationToViewModel(app);
    grouped.get(app.stage)?.push(vm);
  }

  return STAGE_ORDER.map((stage) => ({
    id: stage,
    title: APPLICATION_STAGES[stage],
    candidates: grouped.get(stage) ?? [],
    count: grouped.get(stage)?.length ?? 0,
  }));
}
