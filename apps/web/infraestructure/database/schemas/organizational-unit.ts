import * as t from "drizzle-orm/pg-core";
import { publicEntity } from "./public-entity";
import { StatusEnum } from "./status-enum";

export const organizationalUnit = t.pgTable("organizational_unit", {
  id: t.serial("id").primaryKey(),
  code: t.text("code").notNull(),
  name: t.text("name").notNull(),
  level: t.integer("level").notNull(),
  status: StatusEnum(),
  parentId: t.integer("parent_id").notNull(),
  // Audit fields
  createdBy: t.text("created_by"),
  updatedBy: t.text("updated_by"),
  createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow(),
  deletedAt: t.timestamp("deleted_at", { mode: "string" }),
  // Relations
  publicEntityId: t
    .integer("public_entity_id")
    .notNull()
    .references(() => publicEntity.id, { onDelete: "cascade" }),
});
