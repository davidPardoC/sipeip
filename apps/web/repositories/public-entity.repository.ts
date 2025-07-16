import { db } from "@/infraestructure/database/connection";
import { publicEntity } from "@/infraestructure/database/schemas";
import { PublicEntity } from "@/types/domain/public-entity.entity";
import { and, desc, eq, isNull, like, or, ne } from "drizzle-orm";

export class PublicEntityRepository {
  // Create a new public entity
  create(publicEntityCreate: Partial<PublicEntity>) {
    return db
      .insert(publicEntity)
      .values(publicEntityCreate as PublicEntity)
      .returning();
  }

  // Get all public entities (not deleted)
  getAll() {
    return db.query.publicEntity.findMany({
      where: (publicEntity, { isNull }) => isNull(publicEntity.deletedAt),
      orderBy: [desc(publicEntity.updatedAt)],
    });
  }

  // Get public entity by ID
  getById(id: number) {
    return db.query.publicEntity.findFirst({
      where: and(eq(publicEntity.id, id), isNull(publicEntity.deletedAt)),
    });
  }

  // Update a public entity
  update(id: number, data: Partial<PublicEntity>) {
    return db
      .update(publicEntity)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(publicEntity.id, id))
      .returning();
  }

  // Soft delete a public entity
  delete(id: number) {
    return db
      .update(publicEntity)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(publicEntity.id, id))
      .returning();
  }

  // Get public entity by code
  getByCode(code: string) {
    return db.query.publicEntity.findFirst({
      where: and(eq(publicEntity.code, code), isNull(publicEntity.deletedAt)),
    });
  }

  // Get public entities by micro sector ID
  getByMicroSectorId(microSectorId: number) {
    return db.query.publicEntity.findMany({
      where: and(
        eq(publicEntity.microSectorId, microSectorId),
        isNull(publicEntity.deletedAt)
      ),
      orderBy: [desc(publicEntity.updatedAt)],
    });
  }

  // Get public entities by status
  getByStatus(status: string) {
    return db.query.publicEntity.findMany({
      where: and(
        eq(publicEntity.status, status),
        isNull(publicEntity.deletedAt)
      ),
      orderBy: [desc(publicEntity.updatedAt)],
    });
  }

  // Search public entities by name or short name
  searchByName(searchTerm: string) {
    const searchPattern = `%${searchTerm}%`;
    return db.query.publicEntity.findMany({
      where: and(
        or(
          like(publicEntity.name, searchPattern),
          like(publicEntity.shortName, searchPattern)
        ),
        isNull(publicEntity.deletedAt)
      ),
      orderBy: [desc(publicEntity.updatedAt)],
    });
  }

  // Get public entities created by a specific user
  getByCreatedBy(createdBy: string) {
    return db.query.publicEntity.findMany({
      where: and(
        eq(publicEntity.createdBy, createdBy),
        isNull(publicEntity.deletedAt)
      ),
      orderBy: [desc(publicEntity.createdAt)],
    });
  }

  // Get paginated public entities
  getPaginated(offset: number = 0, limit: number = 10) {
    return db.query.publicEntity.findMany({
      where: (publicEntity, { isNull }) => isNull(publicEntity.deletedAt),
      orderBy: [desc(publicEntity.updatedAt)],
      offset,
      limit,
    });
  }

  // Count all public entities (not deleted)
  async count(): Promise<number> {
    const result = await db
      .select({ count: publicEntity.id })
      .from(publicEntity)
      .where(isNull(publicEntity.deletedAt));
    return result.length;
  }

  // Check if a code already exists
  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    let whereConditions = and(
      eq(publicEntity.code, code),
      isNull(publicEntity.deletedAt)
    );

    if (excludeId) {
      whereConditions = and(
        eq(publicEntity.code, code),
        isNull(publicEntity.deletedAt),
        ne(publicEntity.id, excludeId)
      );
    }

    const result = await db.query.publicEntity.findFirst({
      where: whereConditions,
    });

    return !!result;
  }

  // Bulk update status for multiple entities
  async bulkUpdateStatus(ids: number[], status: string, updatedBy?: string) {
    const updates: Partial<PublicEntity> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (updatedBy) {
      updates.updatedBy = updatedBy;
    }

    // For simplicity, we'll update one by one. In production, you might want to use a more efficient approach
    const results = [];
    for (const id of ids) {
      const result = await db
        .update(publicEntity)
        .set(updates)
        .where(and(
          eq(publicEntity.id, id),
          isNull(publicEntity.deletedAt)
        ))
        .returning();
      results.push(...result);
    }
    
    return results;
  }
}
