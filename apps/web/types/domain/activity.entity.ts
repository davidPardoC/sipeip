export interface Activity {
  id: number;
  name: string;
  description?: string | null;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  progressPercent: string;
  executedBudget: string;
  status: ActivityStatus;
  isActive: boolean;
  priority: number;
  plannedDuration?: number;
  realStartDate?: string;
  realEndDate?: string;
  code: string;
  reportedStatus?: string;
  objectiveIds?: number[];
  projectId: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export type ActivityStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";

export interface ActivityCreate {
  name: string;
  description?: string;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  priority?: number;
  plannedDuration?: number;
  progressPercent?: string;
  executedBudget?: string;
  status?: ActivityStatus;
  isActive?: boolean;
  code?: string; // Optional if auto-generated
  objectiveIds?: number[];
  projectId: number;
  createdBy?: string;
}

export interface ActivityUpdate {
  name?: string;
  description?: string;
  responsiblePerson?: string;
  startDate?: string;
  endDate?: string;
  priority?: number;
  plannedDuration?: number;
  realStartDate?: string;
  realEndDate?: string;
  progressPercent?: string;
  executedBudget?: string;
  status?: ActivityStatus;
  isActive?: boolean;
  reportedStatus?: string;
  objectiveIds?: number[];
  updatedBy?: string;
  updatedAt?: string;
}
