import * as t from "drizzle-orm/pg-core";
import { strategicObjective } from "./strategic-objectives";
import { pndObjective } from "./pnd-objective";
import { odsGoal } from "./ods-goal";

export const objectiveAlignment = t.pgTable("objective_alignment", {
  id: t.serial("id").primaryKey(),
  weight: t.decimal("weight", { precision: 5, scale: 2 }).notNull(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  strategicObjectiveId: t
    .integer("strategic_objective_id")
    .notNull()
    .references(() => strategicObjective.id, { onDelete: "cascade" }),
  pndObjectiveId: t
    .integer("pnd_objective_id")
    .notNull()
    .references(() => pndObjective.id, { onDelete: "cascade" }),
  odsGoalId: t
    .integer("ods_goal_id")
    .notNull()
    .references(() => odsGoal.id, { onDelete: "cascade" }),
});
