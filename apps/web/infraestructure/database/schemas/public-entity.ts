import * as t from "drizzle-orm/pg-core";
import { microSector } from "./micro-sector.ts";
import { StatusEnum } from "./status-enum.ts";

export const publicEntity = t.pgTable("public_entity", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(),
  name: t.text("name").notNull(),
  shortName: t.text("short_name").notNull(),
  govermentLevel: t.text("goverment_level").notNull(),
  status: StatusEnum(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  subSectorId: t
    .integer("sub_sector_id")
    .notNull()
    .references(() => microSector.id),
});
