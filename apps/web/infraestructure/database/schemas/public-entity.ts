import * as t from "drizzle-orm/pg-core";

export const publicEntity = t.pgTable("public_entity", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  code: t.text("code").notNull(),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
});
