import * as t from "drizzle-orm/pg-core";
import { activity } from "./activity";
import { strategicObjective } from "./strategic-objectives";

export const activityStrategicObjective = t.pgTable(
    "activity_strategic_objective",
    {
        activityId: t
            .integer("activity_id")
            .notNull()
            .references(() => activity.id, { onDelete: "cascade" }),
        strategicObjectiveId: t
            .integer("strategic_objective_id")
            .notNull()
            .references(() => strategicObjective.id, { onDelete: "cascade" }),
    },
    (table) => {
        return {
            pk: t.primaryKey({ columns: [table.activityId, table.strategicObjectiveId] }),
        };
    }
);
