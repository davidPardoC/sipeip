import * as t from "drizzle-orm/pg-core";

export const typology = t.pgTable("typology", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(),
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
});
