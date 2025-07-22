import * as t from "drizzle-orm/pg-core";

export const usersMapping = t.pgTable("users_mapping", {
  id: t.serial("id").primaryKey(),
  keycloakId: t.text("keycloak_id").notNull().unique(),
  userName: t.text("user_name").notNull(),
});
