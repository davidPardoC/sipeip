import { InstitutionalPlan } from "./institutional-plan.entity";

export type StatusType = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type FulfillmentRule = "AND" | "OR";

export type FulfillmentStatus = "CUMPLIDO" | "EN_PROGRESO" | "NO_CUMPLIDO";

export class StrategicObjective {
  id: number;
  code: string;
  name: string;
  description: string;
  status: StatusType | null;
  startTime: string;
  endTime: string;
  fulfillmentRule?: FulfillmentRule | null;
  fulfillmentStatus?: FulfillmentStatus | null;
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
    fulfillmentRule: FulfillmentRule | null,
    fulfillmentStatus: FulfillmentStatus | null,
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
    this.fulfillmentRule = fulfillmentRule;
    this.fulfillmentStatus = fulfillmentStatus;
    this.institutionalPlanId = institutionalPlanId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

export interface StrategicObjectiveWithPlan extends StrategicObjective {
  institutionalPlan?: InstitutionalPlan;
  fulfillmentRule?: FulfillmentRule | null;
  fulfillmentStatus?: FulfillmentStatus | null;
}
