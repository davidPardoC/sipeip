import { db } from "@/infraestructure/database/connection";
import {
  institutionalPlan,
  publicEntity,
} from "@/infraestructure/database/schemas";
import {
  InstitutionalPlan,
  InstitutionalPlanWithEntity,
} from "@/types/domain/institutional-plan.entity";
import { and, desc, eq, isNull } from "drizzle-orm";

export class InstitutionalPlanRepository {
  // Define methods for interacting with the institutional plan data
  create(institutionalPlanCreate: Partial<InstitutionalPlan>) {
    return db
      .insert(institutionalPlan)
      .values(institutionalPlanCreate as typeof institutionalPlan.$inferInsert)
      .returning();
  }

  async getAll(): Promise<InstitutionalPlanWithEntity[]> {
    const result = await db
      .select({
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
        publicEntity: {
          id: publicEntity.id,
          name: publicEntity.name,
          code: publicEntity.code,
          shortName: publicEntity.shortName,
          govermentLevel: publicEntity.govermentLevel,
          status: publicEntity.status,
          subSectorId: publicEntity.subSectorId,
          createdAt: publicEntity.createdAt,
          updatedAt: publicEntity.updatedAt,
          deletedAt: publicEntity.deletedAt,
        },
      })
      .from(institutionalPlan)
      .leftJoin(
        publicEntity,
        eq(institutionalPlan.publicEntityId, publicEntity.id)
      )
      .where(isNull(institutionalPlan.deletedAt))
      .orderBy(desc(institutionalPlan.updatedAt));

    return result as InstitutionalPlanWithEntity[];
  }

  async getByUserId(userId: string): Promise<InstitutionalPlanWithEntity[]> {
    const result = await db
      .select({
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
        publicEntity: {
          id: publicEntity.id,
          name: publicEntity.name,
          code: publicEntity.code,
          shortName: publicEntity.shortName,
          govermentLevel: publicEntity.govermentLevel,
          status: publicEntity.status,
          subSectorId: publicEntity.subSectorId,
          createdAt: publicEntity.createdAt,
          updatedAt: publicEntity.updatedAt,
          deletedAt: publicEntity.deletedAt,
        },
      })
      .from(institutionalPlan)
      .leftJoin(
        publicEntity,
        eq(institutionalPlan.publicEntityId, publicEntity.id)
      )
      .where(
        and(
          isNull(institutionalPlan.deletedAt),
          eq(institutionalPlan.createdBy, userId)
        )
      )
      .orderBy(desc(institutionalPlan.updatedAt));

    return result as InstitutionalPlanWithEntity[];
  }

  async getById(id: number): Promise<InstitutionalPlanWithEntity | undefined> {
    const result = await db
      .select({
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
        publicEntity: {
          id: publicEntity.id,
          name: publicEntity.name,
          code: publicEntity.code,
          shortName: publicEntity.shortName,
          govermentLevel: publicEntity.govermentLevel,
          status: publicEntity.status,
          subSectorId: publicEntity.subSectorId,
          createdAt: publicEntity.createdAt,
          updatedAt: publicEntity.updatedAt,
          deletedAt: publicEntity.deletedAt,
        },
      })
      .from(institutionalPlan)
      .leftJoin(
        publicEntity,
        eq(institutionalPlan.publicEntityId, publicEntity.id)
      )
      .where(
        and(eq(institutionalPlan.id, id), isNull(institutionalPlan.deletedAt))
      )
      .limit(1);

    return result[0] as InstitutionalPlanWithEntity | undefined;
  }

  async getByPublicEntity(
    publicEntityId: number
  ): Promise<InstitutionalPlanWithEntity[]> {
    const result = await db
      .select({
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
        publicEntity: {
          id: publicEntity.id,
          name: publicEntity.name,
          code: publicEntity.code,
          shortName: publicEntity.shortName,
          govermentLevel: publicEntity.govermentLevel,
          status: publicEntity.status,
          subSectorId: publicEntity.subSectorId,
          createdAt: publicEntity.createdAt,
          updatedAt: publicEntity.updatedAt,
          deletedAt: publicEntity.deletedAt,
        },
      })
      .from(institutionalPlan)
      .leftJoin(
        publicEntity,
        eq(institutionalPlan.publicEntityId, publicEntity.id)
      )
      .where(
        and(
          eq(institutionalPlan.publicEntityId, publicEntityId),
          isNull(institutionalPlan.deletedAt)
        )
      )
      .orderBy(desc(institutionalPlan.updatedAt));

    return result as InstitutionalPlanWithEntity[];
  }

  update(id: number, data: Partial<InstitutionalPlan>) {
    return db
      .update(institutionalPlan)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      } as typeof institutionalPlan.$inferInsert)
      .where(eq(institutionalPlan.id, id))
      .returning();
  }

  delete(id: number) {
    return db
      .update(institutionalPlan)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(institutionalPlan.id, id))
      .returning();
  }
}
