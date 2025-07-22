import { db } from "@/infraestructure/database/connection";
import { typology } from "@/infraestructure/database/schemas";
import { Typology } from "@/types/domain/typology.entity";
import { and, desc, eq, isNull, like, ne, or } from "drizzle-orm";

export class TypologyRepository {
  // Create a new typology
  create(typologyCreate: Partial<Typology>) {
    return db
      .insert(typology)
      .values(typologyCreate as typeof typology.$inferInsert)
      .returning();
  }

  // Get all typologies (not deleted)
  getAll() {
    return db.query.typology.findMany({
      where: (typology, { isNull }) => isNull(typology.deletedAt),
      orderBy: [desc(typology.updatedAt)],
    });
  }

  // Get typology by ID
  getById(id: number) {
    return db.query.typology.findFirst({
      where: and(eq(typology.id, id), isNull(typology.deletedAt)),
    });
  }

  // Update a typology
  update(id: number, data: Partial<Typology>) {
    return db
      .update(typology)
      .set({ 
        ...data, 
        updatedAt: new Date().toISOString() 
      } as typeof typology.$inferInsert)
      .where(eq(typology.id, id))
      .returning();
  }

  // Soft delete a typology
  delete(id: number) {
    return db
      .update(typology)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(typology.id, id))
      .returning();
  }

  // Get typology by code
  getByCode(code: string) {
    return db.query.typology.findFirst({
      where: and(eq(typology.code, code), isNull(typology.deletedAt)),
    });
  }

  // Search typologies by name or description
  searchByName(searchTerm: string) {
    const searchPattern = `%${searchTerm}%`;
    return db.query.typology.findMany({
      where: and(
        or(
          like(typology.name, searchPattern),
          like(typology.description, searchPattern)
        ),
        isNull(typology.deletedAt)
      ),
      orderBy: [desc(typology.updatedAt)],
    });
  }

  // Get typologies created by a specific user
  getByCreatedBy(createdBy: string) {
    return db.query.typology.findMany({
      where: and(
        eq(typology.createdBy, createdBy),
        isNull(typology.deletedAt)
      ),
      orderBy: [desc(typology.createdAt)],
    });
  }

  // Get paginated typologies
  getPaginated(offset: number = 0, limit: number = 10) {
    return db.query.typology.findMany({
      where: (typology, { isNull }) => isNull(typology.deletedAt),
      orderBy: [desc(typology.updatedAt)],
      offset,
      limit,
    });
  }

  // Count all typologies (not deleted)
  async count(): Promise<number> {
    const result = await db
      .select({ count: typology.id })
      .from(typology)
      .where(isNull(typology.deletedAt));
    return result.length;
  }

  // Check if a code already exists
  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    let whereConditions = and(
      eq(typology.code, code),
      isNull(typology.deletedAt)
    );

    if (excludeId) {
      whereConditions = and(
        eq(typology.code, code),
        isNull(typology.deletedAt),
        ne(typology.id, excludeId)
      );
    }

    const result = await db.query.typology.findFirst({
      where: whereConditions,
    });

    return !!result;
  }
}
