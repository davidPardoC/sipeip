import * as t from "drizzle-orm/pg-core";

export const typology = t.pgTable("typology", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull().unique(),
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
