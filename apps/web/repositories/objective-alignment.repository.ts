import { and, eq, sql } from "drizzle-orm";
import { db } from "@/infraestructure/database/connection";
import { objectiveAlignment } from "@/infraestructure/database/schemas";
import { ObjectiveAlignment } from "@/types/domain/objective-alignment.entity";

export class ObjectiveAlignmentRepository {
  async create(
    strategicObjectiveId: number,
    pndObjectiveId: number,
    odsGoalId: number,
    weight: number,
    createdBy?: string
  ): Promise<ObjectiveAlignment> {
    const [result] = await db
      .insert(objectiveAlignment)
      .values({
        strategicObjectiveId,
        pndObjectiveId,
        odsGoalId,
        weight: weight.toString(),
        createdBy,
        updatedBy: createdBy,
      })
      .returning();

    return new ObjectiveAlignment(
      result.id,
      result.weight,
      result.strategicObjectiveId,
      result.pndObjectiveId,
      result.odsGoalId,
      result.createdBy,
      result.updatedBy,
      result.createdAt,
      result.updatedAt,
      result.deletedAt
    );
  }

  async findByStrategicObjectiveId(strategicObjectiveId: number): Promise<ObjectiveAlignment[]> {
    const results = await db
      .select()
      .from(objectiveAlignment)
      .where(
        and(
          eq(objectiveAlignment.strategicObjectiveId, strategicObjectiveId),
          sql`${objectiveAlignment.deletedAt} IS NULL`
        )
      );

    return results.map(
      (result) =>
        new ObjectiveAlignment(
          result.id,
          result.weight,
          result.strategicObjectiveId,
          result.pndObjectiveId,
          result.odsGoalId,
          result.createdBy,
          result.updatedBy,
          result.createdAt,
          result.updatedAt,
          result.deletedAt
        )
    );
  }

  async deleteByStrategicObjectiveId(strategicObjectiveId: number, deletedBy?: string): Promise<void> {
    await db
      .update(objectiveAlignment)
      .set({
        deletedAt: sql`NOW()`,
        updatedBy: deletedBy,
      })
      .where(
        and(
          eq(objectiveAlignment.strategicObjectiveId, strategicObjectiveId),
          sql`${objectiveAlignment.deletedAt} IS NULL`
        )
      );
  }

  async findById(id: number): Promise<ObjectiveAlignment | null> {
    const [result] = await db
      .select()
      .from(objectiveAlignment)
      .where(
        and(
          eq(objectiveAlignment.id, id),
          sql`${objectiveAlignment.deletedAt} IS NULL`
        )
      );

    if (!result) {
      return null;
    }

    return new ObjectiveAlignment(
      result.id,
      result.weight,
      result.strategicObjectiveId,
      result.pndObjectiveId,
      result.odsGoalId,
      result.createdBy,
      result.updatedBy,
      result.createdAt,
      result.updatedAt,
      result.deletedAt
    );
  }

  async update(
    id: number,
    data: {
      weight?: number;
      pndObjectiveId?: number;
      odsGoalId?: number;
    },
    updatedBy?: string
  ): Promise<ObjectiveAlignment | null> {
    const updateData: {
      updatedBy?: string;
      updatedAt: ReturnType<typeof sql>;
      weight?: string;
      pndObjectiveId?: number;
      odsGoalId?: number;
    } = {
      updatedBy,
      updatedAt: sql`NOW()`,
    };

    if (data.weight !== undefined) {
      updateData.weight = data.weight.toString();
    }
    if (data.pndObjectiveId !== undefined) {
      updateData.pndObjectiveId = data.pndObjectiveId;
    }
    if (data.odsGoalId !== undefined) {
      updateData.odsGoalId = data.odsGoalId;
    }

    const [result] = await db
      .update(objectiveAlignment)
      .set(updateData)
      .where(
        and(
          eq(objectiveAlignment.id, id),
          sql`${objectiveAlignment.deletedAt} IS NULL`
        )
      )
      .returning();

    if (!result) {
      return null;
    }

    return new ObjectiveAlignment(
      result.id,
      result.weight,
      result.strategicObjectiveId,
      result.pndObjectiveId,
      result.odsGoalId,
      result.createdBy,
      result.updatedBy,
      result.createdAt,
      result.updatedAt,
      result.deletedAt
    );
  }

  async delete(id: number, deletedBy?: string): Promise<boolean> {
    const [result] = await db
      .update(objectiveAlignment)
      .set({
        deletedAt: sql`NOW()`,
        updatedBy: deletedBy,
      })
      .where(
        and(
          eq(objectiveAlignment.id, id),
          sql`${objectiveAlignment.deletedAt} IS NULL`
        )
      )
      .returning({ id: objectiveAlignment.id });

    return !!result;
  }

  async bulkCreate(
    strategicObjectiveId: number,
    alignments: Array<{
      pndObjectiveId: number;
      odsGoalId: number;
      weight: number;
    }>,
    createdBy?: string
  ): Promise<ObjectiveAlignment[]> {
    const alignmentData = alignments.map(alignment => ({
      strategicObjectiveId,
      pndObjectiveId: alignment.pndObjectiveId,
      odsGoalId: alignment.odsGoalId,
      weight: alignment.weight.toString(),
      createdBy,
      updatedBy: createdBy,
    }));

    const results = await db
      .insert(objectiveAlignment)
      .values(alignmentData)
      .returning();

    return results.map(
      (result) =>
        new ObjectiveAlignment(
          result.id,
          result.weight,
          result.strategicObjectiveId,
          result.pndObjectiveId,
          result.odsGoalId,
          result.createdBy,
          result.updatedBy,
          result.createdAt,
          result.updatedAt,
          result.deletedAt
        )
    );
  }
}
