import * as t from "drizzle-orm/pg-core";

export const StatusEnum = t.pgEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
]);
