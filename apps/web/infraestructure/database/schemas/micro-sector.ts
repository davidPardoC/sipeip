import * as t from "drizzle-orm/pg-core";
import { sector } from "./sector";

export const microSector = t.pgTable("micro_sector", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  code: t.text("code").notNull(),
  createdBy: t.text("created_by"),
   updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  sectorId: t
    .integer("sector_id")
    .notNull()
    .references(() => sector.id, { onDelete: "cascade" }),
});
