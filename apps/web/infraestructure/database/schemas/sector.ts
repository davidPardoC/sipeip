import * as t from "drizzle-orm/pg-core";
import { macroSector } from "./macro-sector";

export const sector = t.pgTable("sector", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  code: t.text("code").notNull(),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  macroSectorId: t
    .integer("macro_sector_id")
    .notNull()
    .references(() => macroSector.id, { onDelete: "cascade" }),
});
