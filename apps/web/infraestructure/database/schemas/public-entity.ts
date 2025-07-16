import * as t from "drizzle-orm/pg-core";
import { microSector } from "./micro-sector";

export const publicEntity = t.pgTable("public_entity", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  shortName: t.text("short_name").notNull(),
  code: t.text("code").notNull(),
  status: t.text("status").notNull(),
  microSectorId: t
    .integer("micro_sector_id")
    .notNull()
    .references(() => microSector.id),
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
