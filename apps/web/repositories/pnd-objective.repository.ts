import { db } from "@/infraestructure/database/connection";
import { pndObjective } from "@/infraestructure/database/schemas/pnd-objective";
import { PndObjective } from "@/types/domain/pnd-objective.entity";
import { eq, and, isNull } from "drizzle-orm";

export class PndObjectiveRepository {
  async create(data: Partial<PndObjective>): Promise<PndObjective[]> {
    const result = await db
      .insert(pndObjective)
      .values({
        code: data.code!,
        name: data.name!,
        description: data.description!,
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return result as PndObjective[];
  }

  async getAll(): Promise<PndObjective[]> {
    const result = await db
      .select()
      .from(pndObjective)
      .where(isNull(pndObjective.deletedAt));
    
    return result as PndObjective[];
  }

  async getById(id: number): Promise<PndObjective | undefined> {
    const result = await db
      .select()
      .from(pndObjective)
      .where(and(eq(pndObjective.id, id), isNull(pndObjective.deletedAt)));
    
    return result[0] as PndObjective | undefined;
  }

  async update(id: number, data: Partial<PndObjective>): Promise<PndObjective[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = data;
    
    const result = await db
      .update(pndObjective)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(pndObjective.id, id), isNull(pndObjective.deletedAt)))
      .returning();
    
    return result as PndObjective[];
  }

  async delete(id: number): Promise<void> {
    await db
      .update(pndObjective)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(and(eq(pndObjective.id, id), isNull(pndObjective.deletedAt)));
  }

  async getByCode(code: string): Promise<PndObjective | undefined> {
    const result = await db
      .select()
      .from(pndObjective)
      .where(and(eq(pndObjective.code, code), isNull(pndObjective.deletedAt)));
    
    return result[0] as PndObjective | undefined;
  }
}
