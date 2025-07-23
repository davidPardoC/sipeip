import { db } from "@/infraestructure/database/connection";
import { activity } from "@/infraestructure/database/schemas/activity";
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

  // Get all activities (not deleted)
  async getAll(): Promise<Activity[]> {
    const result = await db
      .select()
      .from(activity)
      .where(isNull(activity.deletedAt))
      .orderBy(desc(activity.updatedAt));

    return result as Activity[];
  }

  // Get activity by ID
  async getById(id: number): Promise<Activity | undefined> {
    const result = await db
      .select()
      .from(activity)
      .where(and(eq(activity.id, id), isNull(activity.deletedAt)))
      .limit(1);

    return result[0] as Activity | undefined;
  }

  // Get activities by project ID
  async getByProjectId(projectId: number): Promise<Activity[]> {
    const result = await db
      .select()
      .from(activity)
      .where(and(eq(activity.projectId, projectId), isNull(activity.deletedAt)))
      .orderBy(desc(activity.updatedAt));

    return result as Activity[];
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
}
