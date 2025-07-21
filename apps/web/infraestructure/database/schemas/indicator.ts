import * as t from "drizzle-orm/pg-core";
import { StatusEnum } from "./status-enum.ts";

export const indicator = t.pgTable("indicator", {
  id: t.serial("id").primaryKey(),
  ownerType: t.text("owner_type").notNull(),
  ownerId: t.integer("owner_id").notNull(),
  name: t.text("name").notNull(),
  unit: t.text("unit").notNull(),
  formula: t.text("formula").notNull(),
  baseline: t.decimal("baseline", { precision: 10, scale: 2 }).notNull(),
  status: StatusEnum(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
