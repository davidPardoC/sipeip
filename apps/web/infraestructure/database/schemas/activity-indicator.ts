import * as t from "drizzle-orm/pg-core";
import { activity } from "./activity";
import { indicator } from "./indicator";

export const activityIndicator = t.pgTable(
    "activity_indicator",
    {
        activityId: t
            .integer("activity_id")
            .notNull()
            .references(() => activity.id, { onDelete: "cascade" }),
        indicatorId: t
            .integer("indicator_id")
            .notNull()
            .references(() => indicator.id, { onDelete: "cascade" }),
    },
    (table) => {
        return {
            pk: t.primaryKey({ columns: [table.activityId, table.indicatorId] }),
        };
    }
);
