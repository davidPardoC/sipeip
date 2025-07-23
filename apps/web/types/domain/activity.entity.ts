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
  progressPercent?: string;
  executedBudget?: string;
  status?: ActivityStatus;
  projectId: number;
  createdBy?: string;
}

export interface ActivityUpdate {
  name?: string;
  description?: string;
  responsiblePerson?: string;
  startDate?: string;
  endDate?: string;
  progressPercent?: string;
  executedBudget?: string;
  status?: ActivityStatus;
  updatedBy?: string;
  updatedAt?: string;
}
