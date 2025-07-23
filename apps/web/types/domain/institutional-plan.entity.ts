import { PublicEntity } from "./public-entity.entity";

export type StatusType = "ACTIVE" | "INACTIVE" | "ARCHIVED" | "DRAFT";

export class InstitutionalPlan {
  id: number;
  name: string;
  version: string;
  periodStart: string;
  periodEnd: string;
  status: StatusType | null;
  publicEntityId: number;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;

  constructor(
    id: number,
    name: string,
    version: string,
    periodStart: string,
    periodEnd: string,
    status: StatusType | null,
    publicEntityId: number,
    createdBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.periodStart = periodStart;
    this.periodEnd = periodEnd;
    this.status = status;
    this.publicEntityId = publicEntityId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

export interface InstitutionalPlanWithEntity extends InstitutionalPlan {
  publicEntity?: PublicEntity;
}
