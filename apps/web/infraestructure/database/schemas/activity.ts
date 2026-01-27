import * as t from "drizzle-orm/pg-core";
import { project } from "./project.ts";
import { ActivityStatusEnum, ActivityReportedStatusEnum } from "./status-enum.ts";

export const activity = t.pgTable("activity", {
  id: t.serial("id").primaryKey(),
  activityCode: t.text("activity_code").notNull(),
  name: t.text("name").notNull(),
  description: t.text("description"),
  responsiblePerson: t.text("responsible_person").notNull(),
  startDate: t.date("start_date").notNull(),
  endDate: t.date("end_date").notNull(),
  actualStartDate: t.date("actual_start_date"),
  actualEndDate: t.date("actual_end_date"),
  plannedDuration: t.integer("planned_duration"),
  progressPercent: t.decimal("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
  plannedProgress: t.decimal("planned_progress", { precision: 5, scale: 2 }).default("0.00"),
  actualProgress: t.decimal("actual_progress", { precision: 5, scale: 2 }).default("0.00"),
  executedBudget: t.decimal("executed_budget", { precision: 15, scale: 2 }).default("0.00"),
  priority: t.integer("priority").notNull().default(3),
  status: ActivityStatusEnum().default("PLANNED"),
  reportedStatus: ActivityReportedStatusEnum("reported_status").default("NO_INICIADA"),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  projectId: t
    .integer("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
});

