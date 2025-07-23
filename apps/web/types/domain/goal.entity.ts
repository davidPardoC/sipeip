export interface Goal {
  id: number;
  year: number;
  targetValue: string;
  actualValue?: string | null;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
  indicatorId: number;
  // Audit fields
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface CreateGoalData {
  year: number;
  targetValue: string;
  actualValue?: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  indicatorId: number;
  createdBy?: string;
}

export interface UpdateGoalData {
  year?: number;
  targetValue?: string;
  actualValue?: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  updatedBy?: string;
}
