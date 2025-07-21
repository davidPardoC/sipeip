import * as t from "drizzle-orm/pg-core";
import { institutionalPlan } from "./institutional-plan.ts";
import { StatusEnum } from "./status-enum.ts";

export const strategicObjective = t.pgTable("strategic_objective", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(),
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
  status: StatusEnum(),
  startTime: t.timestamp("start_time", { mode: "string" }).notNull(),
  endTime: t.timestamp("end_time", { mode: "string" }).notNull(),
  //Audit fields
  createdBy: t.text("created_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  institutionalPlanId: t
    .integer("institutional_plan_id")
    .notNull()
    .references(() => institutionalPlan.id, { onDelete: "cascade" }),
});
