import { db } from "@/infraestructure/database/connection";
import { sector } from "@/infraestructure/database/schemas";
import { Sector } from "@/types/domain/sector.entity";
import { and, desc, eq, isNull } from "drizzle-orm";

export class SectorRepository {
  create(sectorCreate: Partial<Sector>) {
    return db
      .insert(sector)
      .values(sectorCreate as Sector)
      .returning();
  }

  getAll() {
    return db.query.sector.findMany({
      where: (sector, { isNull }) => isNull(sector.deletedAt),
      orderBy: [desc(sector.updatedAt)],
    });
  }

  getById(id: number) {
    return db.query.sector.findFirst({
      where: and(eq(sector.id, id), isNull(sector.deletedAt)),
    });
  }

  update(id: number, data: Partial<Sector>) {
    return db
      .update(sector)
      .set(data as Sector)
      .where(eq(sector.id, id))
      .returning();
  }

  delete(id: number) {
    return db
      .update(sector)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(sector.id, id))
      .returning();
  }

  getByCode(code: string) {
    return db.query.sector.findFirst({
      where: and(eq(sector.code, code), isNull(sector.deletedAt)),
    });
  }
}