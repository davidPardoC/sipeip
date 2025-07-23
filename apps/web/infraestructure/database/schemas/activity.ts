import * as t from "drizzle-orm/pg-core";
import { project } from "./project.ts";
import { ActivityStatusEnum } from "./status-enum.ts";

export const activity = t.pgTable("activity", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  description: t.text("description"),
  responsiblePerson: t.text("responsible_person").notNull(),
  startDate: t.date("start_date").notNull(),
  endDate: t.date("end_date").notNull(),
  progressPercent: t.decimal("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
  executedBudget: t.decimal("executed_budget", { precision: 15, scale: 2 }).default("0.00"),
  status: ActivityStatusEnum().default("PLANNED"),
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

