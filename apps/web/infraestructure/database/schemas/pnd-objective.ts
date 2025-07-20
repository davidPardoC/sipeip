import * as t from "drizzle-orm/pg-core";

export const pndObjective = t.pgTable("pnd_objective", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(),
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
