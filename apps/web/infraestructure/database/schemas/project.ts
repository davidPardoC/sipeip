import * as t from "drizzle-orm/pg-core";
import { program } from "./program";
import { StatusEnum } from "./status-enum";
import { typology } from "./typology";

export const project = t.pgTable("project", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(),
  cup: t.text("cup").notNull(),
  budget: t.decimal("budget", { precision: 10, scale: 2 }).notNull(),
  startDate: t.date("start_date").notNull(),
  endDate: t.date("end_date").notNull(),
  status: StatusEnum(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),

  // Relations
  programId: t
    .integer("program_id")
    .notNull()
    .references(() => program.id, { onDelete: "cascade" }),
  strategicObjectiveId: t
    .integer("strategic_objective_id")
    .notNull()
    .references(() => program.id, { onDelete: "cascade" }),
  typologyId: t
    .integer("typology_id")
    .notNull()
    .references(() => typology.id, { onDelete: "cascade" }),
});
