import { db } from "@/infraestructure/database/connection";
import { goal } from "@/infraestructure/database/schemas/goal";
import { Goal, CreateGoalData, UpdateGoalData } from "@/types/domain/goal.entity";
import { eq, and, isNull } from "drizzle-orm";

export class GoalRepository {
  async create(data: CreateGoalData): Promise<Goal[]> {
    const result = await db
      .insert(goal)
      .values({
        year: data.year,
        targetValue: data.targetValue,
        actualValue: data.actualValue || null,
        status: (data.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
        indicatorId: data.indicatorId,
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return result as Goal[];
  }

  async getAll(): Promise<Goal[]> {
    const result = await db
      .select()
      .from(goal)
      .where(isNull(goal.deletedAt));
    
    return result as Goal[];
  }

  async getById(id: number): Promise<Goal | undefined> {
    const result = await db
      .select()
      .from(goal)
      .where(and(eq(goal.id, id), isNull(goal.deletedAt)));
    
    return result[0] as Goal | undefined;
  }

  async getByIndicator(indicatorId: number): Promise<Goal[]> {
    const result = await db
      .select()
      .from(goal)
      .where(
        and(
          eq(goal.indicatorId, indicatorId),
          isNull(goal.deletedAt)
        )
      );
    
    return result as Goal[];
  }

  async update(id: number, data: UpdateGoalData): Promise<Goal[]> {
    const result = await db
      .update(goal)
      .set({
        year: data.year,
        targetValue: data.targetValue,
        actualValue: data.actualValue,
        status: data.status as "ACTIVE" | "INACTIVE" | "ARCHIVED",
        updatedBy: data.updatedBy,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(goal.id, id), isNull(goal.deletedAt)))
      .returning();
    
    return result as Goal[];
  }

  async delete(id: number): Promise<void> {
    await db
      .update(goal)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(eq(goal.id, id));
  }
}
