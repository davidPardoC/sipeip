import { db } from "@/infraestructure/database/connection";
import { activityObjective } from "@/infraestructure/database/schemas/activity-objective";
import { strategicObjective } from "@/infraestructure/database/schemas/strategic-objectives";
import { eq, and, inArray } from "drizzle-orm";

export interface ActivityObjectiveCreate {
  activityId: number;
  strategicObjectiveId: number;
  createdBy?: string;
}

export interface ActivityObjective {
  id: number;
  activityId: number;
  strategicObjectiveId: number;
  createdBy?: string | null;
  createdAt?: string | null;
}

export class ActivityObjectiveRepository {
  // Link an activity to a strategic objective
  create(data: ActivityObjectiveCreate) {
    return db
      .insert(activityObjective)
      .values({
        ...data,
        createdAt: new Date().toISOString(),
      })
      .returning();
  }

  // Link multiple objectives to an activity
  async createMultiple(activityId: number, objectiveIds: number[], createdBy?: string) {
    const values = objectiveIds.map(objectiveId => ({
      activityId,
      strategicObjectiveId: objectiveId,
      createdBy,
      createdAt: new Date().toISOString(),
    }));

    return db.insert(activityObjective).values(values).returning();
  }

  // Get all objectives linked to an activity
  async getObjectivesByActivityId(activityId: number) {
    return db
      .select({
        id: strategicObjective.id,
        code: strategicObjective.code,
        name: strategicObjective.name,
        description: strategicObjective.description,
        status: strategicObjective.status,
        fulfillmentRule: strategicObjective.fulfillmentRule,
        fulfillmentStatus: strategicObjective.fulfillmentStatus,
      })
      .from(activityObjective)
      .innerJoin(
        strategicObjective,
        eq(activityObjective.strategicObjectiveId, strategicObjective.id)
      )
      .where(eq(activityObjective.activityId, activityId));
  }

  // Get all activities linked to an objective
  async getActivitiesByObjectiveId(objectiveId: number) {
    return db
      .select()
      .from(activityObjective)
      .where(eq(activityObjective.strategicObjectiveId, objectiveId));
  }

  // Remove a specific link
  async deleteLink(activityId: number, objectiveId: number) {
    return db
      .delete(activityObjective)
      .where(
        and(
          eq(activityObjective.activityId, activityId),
          eq(activityObjective.strategicObjectiveId, objectiveId)
        )
      )
      .returning();
  }

  // Remove all links for an activity (used when updating objectives)
  async deleteAllByActivityId(activityId: number) {
    return db
      .delete(activityObjective)
      .where(eq(activityObjective.activityId, activityId))
      .returning();
  }

  // Replace all objectives for an activity
  async replaceObjectives(activityId: number, objectiveIds: number[], createdBy?: string) {
    // Delete existing links
    await this.deleteAllByActivityId(activityId);

    // Create new links
    if (objectiveIds.length > 0) {
      return this.createMultiple(activityId, objectiveIds, createdBy);
    }

    return [];
  }

  // Check if activity is linked to at least one objective (for V-02 validation)
  async hasObjectives(activityId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(activityObjective)
      .where(eq(activityObjective.activityId, activityId))
      .limit(1);

    return result.length > 0;
  }
}
