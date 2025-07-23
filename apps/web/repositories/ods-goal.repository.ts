import { db } from "@/infraestructure/database/connection";
import { odsGoal } from "@/infraestructure/database/schemas/ods-goal";
import { OdsGoal } from "@/types/domain/ods-goal.entity";
import { eq, and, isNull } from "drizzle-orm";

export class OdsGoalRepository {
  async create(data: Partial<OdsGoal>): Promise<OdsGoal[]> {
    const result = await db
      .insert(odsGoal)
      .values({
        code: data.code!,
        name: data.name!,
        description: data.description!,
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return result as OdsGoal[];
  }

  async getAll(): Promise<OdsGoal[]> {
    const result = await db
      .select()
      .from(odsGoal)
      .where(isNull(odsGoal.deletedAt));
    
    return result as OdsGoal[];
  }

  async getById(id: number): Promise<OdsGoal | undefined> {
    const result = await db
      .select()
      .from(odsGoal)
      .where(and(eq(odsGoal.id, id), isNull(odsGoal.deletedAt)));
    
    return result[0] as OdsGoal | undefined;
  }

  async update(id: number, data: Partial<OdsGoal>): Promise<OdsGoal[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = data;
    
    const result = await db
      .update(odsGoal)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(odsGoal.id, id), isNull(odsGoal.deletedAt)))
      .returning();
    
    return result as OdsGoal[];
  }

  async delete(id: number): Promise<void> {
    await db
      .update(odsGoal)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(and(eq(odsGoal.id, id), isNull(odsGoal.deletedAt)));
  }

  async getByCode(code: string): Promise<OdsGoal | undefined> {
    const result = await db
      .select()
      .from(odsGoal)
      .where(and(eq(odsGoal.code, code), isNull(odsGoal.deletedAt)));
    
    return result[0] as OdsGoal | undefined;
  }
}
