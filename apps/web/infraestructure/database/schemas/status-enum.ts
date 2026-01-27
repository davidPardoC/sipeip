import * as t from "drizzle-orm/pg-core";

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export const StatusEnum = t.pgEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
]);

export const PlanStatusEnum = t.pgEnum("plan_status", [
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
  "DRAFT",
  "UNDER_REVIEW",
  "APPROVED",
]);

export const ProjectStatusEnum = t.pgEnum("project_status", [
  "ACTIVE",
  "SEND_FOR_APPROVAL",
  "INACTIVE",
  "COMPLETED",
  "CANCELLED",
  "ON_HOLD",
  "REJECTED",
  "APPROVED",
  "REQUEST_CHANGES",
]);

export const ActivityStatusEnum = t.pgEnum("activity_status", [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "ON_HOLD",
]);

export const ActivityReportedStatusEnum = t.pgEnum("activity_reported_status", [
  "NO_INICIADA",
  "EN_RIESGO",
  "COMPLETADA",
]);

export const FulfillmentRuleEnum = t.pgEnum("fulfillment_rule", [
  "AND",
  "OR",
]);

export const FulfillmentStatusEnum = t.pgEnum("fulfillment_status", [
  "CUMPLIDO",
  "EN_PROGRESO",
  "NO_CUMPLIDO",
]);
