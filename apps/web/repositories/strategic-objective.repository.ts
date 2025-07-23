import { db } from "@/infraestructure/database/connection";
import { strategicObjective, institutionalPlan } from "@/infraestructure/database/schemas";
import { StrategicObjective, StrategicObjectiveWithPlan } from "@/types/domain/strategic-objective.entity";
import { eq, and, isNull } from "drizzle-orm";

export class StrategicObjectiveRepository {
  async create(data: Partial<StrategicObjective>): Promise<StrategicObjective[]> {
    return await db
      .insert(strategicObjective)
      .values({
        code: data.code!,
        name: data.name!,
        description: data.description!,
        status: data.status || "ACTIVE",
        startTime: data.startTime!,
        endTime: data.endTime!,
        institutionalPlanId: data.institutionalPlanId!,
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
  }

  async getAll(): Promise<StrategicObjectiveWithPlan[]> {
    const result = await db
      .select({
        id: strategicObjective.id,
        code: strategicObjective.code,
        name: strategicObjective.name,
        description: strategicObjective.description,
        status: strategicObjective.status,
        startTime: strategicObjective.startTime,
        endTime: strategicObjective.endTime,
        institutionalPlanId: strategicObjective.institutionalPlanId,
        createdBy: strategicObjective.createdBy,
        createdAt: strategicObjective.createdAt,
        updatedAt: strategicObjective.updatedAt,
        deletedAt: strategicObjective.deletedAt,
        institutionalPlan: {
          id: institutionalPlan.id,
          name: institutionalPlan.name,
          version: institutionalPlan.version,
          periodStart: institutionalPlan.periodStart,
          periodEnd: institutionalPlan.periodEnd,
          status: institutionalPlan.status,
          publicEntityId: institutionalPlan.publicEntityId,
          createdBy: institutionalPlan.createdBy,
          createdAt: institutionalPlan.createdAt,
          updatedAt: institutionalPlan.updatedAt,
          deletedAt: institutionalPlan.deletedAt,
        },
      })
      .from(strategicObjective)
      .leftJoin(institutionalPlan, eq(strategicObjective.institutionalPlanId, institutionalPlan.id))
      .where(isNull(strategicObjective.deletedAt));

    return result.map(item => ({
      ...item,
      institutionalPlan: item.institutionalPlan?.id ? item.institutionalPlan : undefined,
    })) as StrategicObjectiveWithPlan[];
  }

  async getByInstitutionalPlan(institutionalPlanId: number): Promise<StrategicObjective[]> {
    return await db
      .select()
      .from(strategicObjective)
      .where(
        and(
          eq(strategicObjective.institutionalPlanId, institutionalPlanId),
          isNull(strategicObjective.deletedAt)
        )
      );
  }

  async getById(id: number): Promise<StrategicObjectiveWithPlan | undefined> {
    const result = await db
      .select({
        id: strategicObjective.id,
        code: strategicObjective.code,
        name: strategicObjective.name,
        description: strategicObjective.description,
        status: strategicObjective.status,
        startTime: strategicObjective.startTime,
        endTime: strategicObjective.endTime,
        institutionalPlanId: strategicObjective.institutionalPlanId,
        createdBy: strategicObjective.createdBy,
        createdAt: strategicObjective.createdAt,
        updatedAt: strategicObjective.updatedAt,
        deletedAt: strategicObjective.deletedAt,
        institutionalPlan: {
          id: institutionalPlan.id,
          name: institutionalPlan.name,
          version: institutionalPlan.version,
          periodStart: institutionalPlan.periodStart,
          periodEnd: institutionalPlan.periodEnd,
          status: institutionalPlan.status,
          publicEntityId: institutionalPlan.publicEntityId,
          createdBy: institutionalPlan.createdBy,
          createdAt: institutionalPlan.createdAt,
          updatedAt: institutionalPlan.updatedAt,
          deletedAt: institutionalPlan.deletedAt,
        },
      })
      .from(strategicObjective)
      .leftJoin(institutionalPlan, eq(strategicObjective.institutionalPlanId, institutionalPlan.id))
      .where(
        and(
          eq(strategicObjective.id, id),
          isNull(strategicObjective.deletedAt)
        )
      )
      .limit(1);

    if (result.length === 0) return undefined;
    
    const item = result[0];
    return {
      ...item,
      institutionalPlan: item.institutionalPlan?.id ? item.institutionalPlan : undefined,
    } as StrategicObjectiveWithPlan;
  }

  async update(id: number, data: Partial<StrategicObjective>): Promise<StrategicObjective[]> {
    return await db
      .update(strategicObjective)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(strategicObjective.id, id))
      .returning();
  }

  async delete(id: number) {
    return await db
      .update(strategicObjective)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(eq(strategicObjective.id, id))
      .returning();
  }

  async getByCode(code: string): Promise<StrategicObjective | undefined> {
    const result = await db
      .select()
      .from(strategicObjective)
      .where(
        and(
          eq(strategicObjective.code, code),
          isNull(strategicObjective.deletedAt)
        )
      )
      .limit(1);

    return result[0];
  }
}
