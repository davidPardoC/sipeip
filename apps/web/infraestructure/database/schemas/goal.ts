import * as t from "drizzle-orm/pg-core";
import { StatusEnum } from "./status-enum";
import { indicator } from "./indicator";

export const goal = t.pgTable("goal", {
  id: t.serial("id").primaryKey(),
  year: t.integer("year").notNull(),
  targetValue: t.decimal("target_value", { precision: 10, scale: 2 }).notNull(),
  actualValue: t.decimal("actual_value", { precision: 10, scale: 2 }),
  status: StatusEnum(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  indicatorId: t
    .integer("indicator_id")
    .notNull()
    .references(() => indicator.id, { onDelete: "cascade" }),
});
