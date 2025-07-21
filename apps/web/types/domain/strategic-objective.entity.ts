import { InstitutionalPlan } from "./institutional-plan.entity";

export type StatusType = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export class StrategicObjective {
  id: number;
  code: string;
  name: string;
  description: string;
  status: StatusType | null;
  startTime: string;
  endTime: string;
  institutionalPlanId: number;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    code: string,
    name: string,
    description: string,
    status: StatusType | null,
    startTime: string,
    endTime: string,
    institutionalPlanId: number,
    createdBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
    this.institutionalPlanId = institutionalPlanId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

export interface StrategicObjectiveWithPlan extends StrategicObjective {
  institutionalPlan?: InstitutionalPlan;
}
