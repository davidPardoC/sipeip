import { db } from "@/infraestructure/database/connection";
import { activity } from "@/infraestructure/database/schemas/activity";
import {
  Activity,
  ActivityCreate,
  ActivityUpdate,
} from "@/types/domain/activity.entity";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";

export class ActivityRepository {
  // Create a new activity with Phase 1 fields
  create(activityCreate: ActivityCreate) {
    return db
      .insert(activity)
      .values({
        // Phase 1 fields
        activityCode: activityCreate.activityCode,
        actualStartDate: activityCreate.actualStartDate || null,
        actualEndDate: activityCreate.actualEndDate || null,
        plannedDuration: activityCreate.plannedDuration || null,
        plannedProgress: activityCreate.plannedProgress || "0.00",
        actualProgress: activityCreate.actualProgress || "0.00",
        priority: activityCreate.priority || 3,
        reportedStatus: activityCreate.reportedStatus || "NO_INICIADA",
        // Original fields
        name: activityCreate.name,
        description: activityCreate.description,
        responsiblePerson: activityCreate.responsiblePerson,
        startDate: activityCreate.startDate,
        endDate: activityCreate.endDate,
        progressPercent: activityCreate.progressPercent || "0.00",
        executedBudget: activityCreate.executedBudget || "0.00",
        status: activityCreate.status || "PLANNED",
        projectId: activityCreate.projectId,
        createdBy: activityCreate.createdBy,
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
  getByStatus(
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD"
  ) {
    return db
      .select()
      .from(activity)
      .where(and(eq(activity.status, status), isNull(activity.deletedAt)))
      .orderBy(desc(activity.updatedAt));
  }

  // Get activities by reportedStatus
  async getByReportedStatus(
    reportedStatus: "NO_INICIADA" | "EN_RIESGO" | "COMPLETADA"
  ): Promise<Activity[]> {
    const result = await db
      .select()
      .from(activity)
      .where(
        and(
          eq(activity.reportedStatus, reportedStatus),
          isNull(activity.deletedAt)
        )
      )
      .orderBy(desc(activity.updatedAt));

    return result as Activity[];
  }

  // Get activities by priority
  async getByPriority(priority: number): Promise<Activity[]> {
    const result = await db
      .select()
      .from(activity)
      .where(and(eq(activity.priority, priority), isNull(activity.deletedAt)))
      .orderBy(desc(activity.updatedAt));

    return result as Activity[];
  }

  // Get activities at risk (reportedStatus = EN_RIESGO)
  async getActivitiesAtRisk(): Promise<Activity[]> {
    return this.getByReportedStatus("EN_RIESGO");
  }

  // Get completed activities
  async getCompletedActivities(): Promise<Activity[]> {
    return this.getByReportedStatus("COMPLETADA");
  }

  // Get multiple activities by IDs (for batch operations)
  async getByIds(ids: number[]): Promise<Activity[]> {
    if (ids.length === 0) return [];

    const result = await db
      .select()
      .from(activity)
      .where(and(inArray(activity.id, ids), isNull(activity.deletedAt)));

    return result as Activity[];
  }
}
