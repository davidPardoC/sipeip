import * as t from "drizzle-orm/pg-core";
import { publicEntity } from "./public-entity.ts";
import { StatusEnum } from "./status-enum.ts";

export const institutionalPlan = t.pgTable("institutional_plan", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  version: t.text("version").notNull(),
  periodStart: t.timestamp("period_start", { mode: "string" }).notNull(),
  periodEnd: t.timestamp("period_end", { mode: "string" }).notNull(),
  status: StatusEnum(),
  // Audit fields
  createdBy: t.text("created_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  publicEntityId: t
    .integer("public_entity_id")
    .notNull()
    .references(() => publicEntity.id, { onDelete: "cascade" }),
});
