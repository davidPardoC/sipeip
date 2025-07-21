import * as t from "drizzle-orm/pg-core";

export const macroSector = t.pgTable("macro_sector", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  code: t.text("code").notNull().unique(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
