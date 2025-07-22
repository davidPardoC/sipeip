import * as t from "drizzle-orm/pg-core";

export const StatusEnum = t.pgEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
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
  "REQUEST_CHANGES"
]);
