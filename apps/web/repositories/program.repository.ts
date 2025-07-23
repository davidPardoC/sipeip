import { db } from "@/infraestructure/database/connection";
import { program } from "@/infraestructure/database/schemas";
import { Program } from "@/types/domain/program.entity";
import { eq, and, isNull } from "drizzle-orm";

export class ProgramRepository {
  async create(data: Partial<Program>): Promise<Program[]> {
    const result = await db
      .insert(program)
      .values({
        name: data.name!,
        budget: data.budget!,
        startDate: data.startDate!,
        endDate: data.endDate!,
        status: (data.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") || "ACTIVE",
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return result as Program[];
  }

  async getAll(): Promise<Program[]> {
    const result = await db
      .select()
      .from(program)
      .where(isNull(program.deletedAt));

    return result as Program[];
  }

  async getById(id: number): Promise<Program | undefined> {
    const result = await db
      .select()
      .from(program)
      .where(and(eq(program.id, id), isNull(program.deletedAt)));

    return result[0] as Program | undefined;
  }

  async update(id: number, data: Partial<Program>): Promise<Program[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = data;

    const result = await db
      .update(program)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(program.id, id), isNull(program.deletedAt)))
      .returning();

    return result as Program[];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .update(program)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(and(eq(program.id, id), isNull(program.deletedAt)))
      .returning();

    return result.length > 0;
  }

  async getByCreatedBy(createdBy: string): Promise<Program[]> {
    const result = await db
      .select()
      .from(program)
      .where(and(eq(program.createdBy, createdBy), isNull(program.deletedAt)));

    return result as Program[];
  }
}
