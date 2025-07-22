import * as t from "drizzle-orm/pg-core";
import { project } from "./project";

export const projectObservations = t.pgTable("project_observations", {
  id: t.serial("id").primaryKey(),
  observation: t.text("observation").notNull(),
  // Audit fields
  createdBy: t.text("created_by").notNull(),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  projectId: t
    .integer("project_id")
    .notNull()
    .references(() => project.id),
});
