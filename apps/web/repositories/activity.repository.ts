import { db } from "@/infraestructure/database/connection";
import { activity } from "@/infraestructure/database/schemas/activity";
import { activityStrategicObjective } from "@/infraestructure/database/schemas/activity-strategic-objective";
import { Activity, ActivityCreate, ActivityUpdate } from "@/types/domain/activity.entity";
import { and, desc, eq, isNull } from "drizzle-orm";

export class ActivityRepository {
  // Create a new activity
  create(activityCreate: ActivityCreate) {
    return db
      .insert(activity)
      .values({
        ...activityCreate,
        progressPercent: activityCreate.progressPercent || "0.00",
        executedBudget: activityCreate.executedBudget || "0.00",
        status: activityCreate.status || "PLANNED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as typeof activity.$inferInsert)
      .returning();
  }

  // Get activity by ID with Objectives
  async getById(id: number): Promise<Activity | undefined> {
    const result = await db
      .select({
        activity: activity,
        objectiveId: activityStrategicObjective.strategicObjectiveId
      })
      .from(activity)
      .leftJoin(activityStrategicObjective, eq(activity.id, activityStrategicObjective.activityId))
      .where(and(eq(activity.id, id), isNull(activity.deletedAt)));

    if (result.length === 0) return undefined;

    const activityData = result[0].activity;
    const objectiveIds = result
      .map(r => r.objectiveId)
      .filter((id): id is number => id !== null);

    return {
      ...activityData,
      objectiveIds
    } as Activity;
  }

  // Get activities by project ID with Objectives
  async getByProjectId(projectId: number): Promise<Activity[]> {
    const rows = await db
      .select({
        activity: activity,
        objectiveId: activityStrategicObjective.strategicObjectiveId
      })
      .from(activity)
      .leftJoin(activityStrategicObjective, eq(activity.id, activityStrategicObjective.activityId))
      .where(and(eq(activity.projectId, projectId), isNull(activity.deletedAt)))
      .orderBy(desc(activity.updatedAt));

    const activityMap = new Map<number, Activity>();

    for (const row of rows) {
      if (!activityMap.has(row.activity.id)) {
        activityMap.set(row.activity.id, {
          ...row.activity,
          objectiveIds: []
        } as Activity);
      }

      if (row.objectiveId !== null) {
        activityMap.get(row.activity.id)!.objectiveIds!.push(row.objectiveId);
      }
    }

    return Array.from(activityMap.values());
  }

  // Get all activities with Objectives
  async getAll(): Promise<Activity[]> {
    const rows = await db
      .select({
        activity: activity,
        objectiveId: activityStrategicObjective.strategicObjectiveId
      })
      .from(activity)
      .leftJoin(activityStrategicObjective, eq(activity.id, activityStrategicObjective.activityId))
      .where(isNull(activity.deletedAt))
      .orderBy(desc(activity.updatedAt));

    const activityMap = new Map<number, Activity>();

    for (const row of rows) {
      if (!activityMap.has(row.activity.id)) {
        activityMap.set(row.activity.id, {
          ...row.activity,
          objectiveIds: []
        } as Activity);
      }

      if (row.objectiveId !== null) {
        activityMap.get(row.activity.id)!.objectiveIds!.push(row.objectiveId);
      }
    }

    return Array.from(activityMap.values());
  }

  // Update an activity
  update(id: number, data: ActivityUpdate) {
    return db
      .update(activity)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      } as typeof activity.$inferInsert)
      .where(eq(activity.id, id))
      .returning();
  }

  // Soft delete an activity
  delete(id: number) {
    return db
      .update(activity)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(activity.id, id))
      .returning();
  }

  // Get activities by status
  getByStatus(status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD") {
    return db
      .select()
      .from(activity)
      .where(and(eq(activity.status, status), isNull(activity.deletedAt)))
      .orderBy(desc(activity.updatedAt));
  }

  // Get last code for project
  async getLastCode(projectId: number): Promise<string | null> {
    const result = await db
      .select({ code: activity.code })
      .from(activity)
      .where(and(eq(activity.projectId, projectId)))
      .orderBy(desc(activity.code))
      .limit(1);

    return result[0]?.code || null;
  }
  // Save objectives for activity (M:N)
  async saveObjectives(activityId: number, objectiveIds: number[]) {
    // First delete existing
    await db.delete(activityStrategicObjective)
      .where(eq(activityStrategicObjective.activityId, activityId));

    // Insert new
    if (objectiveIds.length > 0) {
      await db.insert(activityStrategicObjective).values(
        objectiveIds.map(objId => ({
          activityId,
          strategicObjectiveId: objId
        }))
      );
    }
  }
}
