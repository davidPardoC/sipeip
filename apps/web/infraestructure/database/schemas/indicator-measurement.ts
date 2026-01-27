import * as t from "drizzle-orm/pg-core";
import { indicator } from "./indicator";

export const indicatorMeasurement = t.pgTable("indicator_measurement", {
    id: t.serial("id").primaryKey(),
    indicatorId: t
        .integer("indicator_id")
        .references(() => indicator.id, { onDelete: "cascade" })
        .notNull(),
    period: t.text("period").notNull(), // e.g. "2024-Q1", "2024-01"
    targetValue: t.decimal("target_value", { precision: 10, scale: 2 }).notNull(),
    currentValue: t.decimal("current_value", { precision: 10, scale: 2 }).notNull(),
    complianceStatus: t.text("compliance_status").notNull(), // "CUMPLIDO", "NO_CUMPLIDO", etc.

    // Audit fields
    createdBy: t.text("created_by"),
    updatedBy: t.text("updated_by"),
    createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
    deletedAt: t.timestamp("deleted_at", { mode: "string" }),
});
