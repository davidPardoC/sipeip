import * as t from "drizzle-orm/pg-core";
import { project } from "./project.ts";
import { ActivityStatusEnum } from "./status-enum.ts";

export const activity = t.pgTable("activity", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(), // Unique per project validation will be in business logic or unique index if possible, but schema definition keeps it text
  name: t.text("name").notNull(),
  description: t.text("description"),
  responsiblePerson: t.text("responsible_person").notNull(),
  status: ActivityStatusEnum().default("PLANNED"),
  isActive: t.boolean("is_active").default(true),

  // Planning
  priority: t.integer("priority").default(1),
  startDate: t.date("start_date").notNull(),
  endDate: t.date("end_date").notNull(),
  plannedDuration: t.integer("planned_duration_days"), // Storing calculated days

  // Execution
  realStartDate: t.date("real_start_date"),
  realEndDate: t.date("real_end_date"),
  progressPercent: t.decimal("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
  executedBudget: t.decimal("executed_budget", { precision: 15, scale: 2 }).default("0.00"),
  reportedStatus: t.text("reported_status"), // EN_RIESGO, COMPLETADA, NO_INICIADA

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

