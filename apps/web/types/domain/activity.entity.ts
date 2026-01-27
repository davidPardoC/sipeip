export interface Activity {
  id: number;
  activityCode: string;
  name: string;
  description?: string | null;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  plannedDuration?: number | null;
  progressPercent: string;
  plannedProgress?: string | null;
  actualProgress?: string | null;
  executedBudget: string;
  priority?: number;
  status: ActivityStatus;
  reportedStatus?: ActivityReportedStatus;
  projectId: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export type ActivityStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";

export type ActivityReportedStatus = "NO_INICIADA" | "EN_RIESGO" | "COMPLETADA";

export interface ActivityCreate {
  activityCode: string;
  name: string;
  description?: string;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  plannedDuration?: number;
  progressPercent?: string;
  plannedProgress?: string;
  actualProgress?: string;
  executedBudget?: string;
  priority?: number;
  status?: ActivityStatus;
  reportedStatus?: ActivityReportedStatus;
  projectId: number;
  createdBy?: string;
  objectiveIds?: number[];
}

export interface ActivityUpdate {
  activityCode?: string;
  name?: string;
  description?: string;
  responsiblePerson?: string;
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  plannedDuration?: number;
  progressPercent?: string;
  plannedProgress?: string;
  actualProgress?: string;
  executedBudget?: string;
  priority?: number;
  status?: ActivityStatus;
  reportedStatus?: ActivityReportedStatus;
  updatedBy?: string;
  updatedAt?: string;
  objectiveIds?: number[];
}

// Indicator calculation results
export interface ActivityIndicators {
  activityId: number;
  indicator1_activityProgress: {
    value: number | null;
    unit: "%";
    target: 100;
    status: "ON_TARGET" | "BELOW_TARGET" | "NOT_STARTED";
    formula: "actualProgress / plannedProgress * 100";
  };
  indicator2_timeVariance: {
    value: number | null;
    unit: "days";
    target: 0;
    status: "ON_TIME" | "DELAYED" | "NOT_COMPLETED";
    formula: "actualEndDate - endDate";
  };
  indicator3_deadlineCompliance: {
    value: ActivityReportedStatus;
    status: "COMPLIANT" | "AT_RISK" | "NOT_STARTED";
  };
}
