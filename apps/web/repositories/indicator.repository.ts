import { db } from "@/infraestructure/database/connection";
import { indicator } from "@/infraestructure/database/schemas/indicator";
import { Indicator, CreateIndicatorData, UpdateIndicatorData } from "@/types/domain/indicator.entity";
import { eq, and, isNull } from "drizzle-orm";

export class IndicatorRepository {
  async create(data: CreateIndicatorData): Promise<Indicator[]> {
    const result = await db
      .insert(indicator)
      .values({
        ownerType: data.ownerType,
        ownerId: data.ownerId,
        name: data.name,
        unit: data.unit,
        formula: data.formula,
        baseline: data.baseline,
        status: (data.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return result as Indicator[];
  }

  async getAll(): Promise<Indicator[]> {
    const result = await db
      .select()
      .from(indicator)
      .where(isNull(indicator.deletedAt));
    
    return result as Indicator[];
  }

  async getById(id: number): Promise<Indicator | undefined> {
    const result = await db
      .select()
      .from(indicator)
      .where(and(eq(indicator.id, id), isNull(indicator.deletedAt)));
    
    return result[0] as Indicator | undefined;
  }

  async getByOwner(ownerType: string, ownerId: number): Promise<Indicator[]> {
    const result = await db
      .select()
      .from(indicator)
      .where(
        and(
          eq(indicator.ownerType, ownerType),
          eq(indicator.ownerId, ownerId),
          isNull(indicator.deletedAt)
        )
      );
    
    return result as Indicator[];
  }

  async update(id: number, data: UpdateIndicatorData): Promise<Indicator[]> {
    const result = await db
      .update(indicator)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(indicator.id, id), isNull(indicator.deletedAt)))
      .returning();
    
    return result as Indicator[];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .update(indicator)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(and(eq(indicator.id, id), isNull(indicator.deletedAt)))
      .returning();
    
    return result.length > 0;
  }
}
