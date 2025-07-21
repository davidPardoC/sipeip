import * as t from "drizzle-orm/pg-core";
import { StatusEnum } from "./status-enum.ts";

export const program = t.pgTable("program", {
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull(),
  budget: t.decimal("budget", { precision: 10, scale: 2 }).notNull(),
  startDate: t.date("start_date").notNull(),
  endDate: t.date("end_date").notNull(),
  status: StatusEnum(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
