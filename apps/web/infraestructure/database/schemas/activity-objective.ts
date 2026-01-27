import * as t from "drizzle-orm/pg-core";
import { activity } from "./activity.ts";
import { strategicObjective } from "./strategic-objectives.ts";

export const activityObjective = t.pgTable("activity_objective", {
  id: t.serial("id").primaryKey(),
  // Relations
  activityId: t
    .integer("activity_id")
    .notNull()
    .references(() => activity.id, { onDelete: "cascade" }),
  strategicObjectiveId: t
    .integer("strategic_objective_id")
    .notNull()
    .references(() => strategicObjective.id, { onDelete: "cascade" }),
  // Audit fields
  createdBy: t.text("created_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
});
