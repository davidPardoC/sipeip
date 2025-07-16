import { db } from "@/infraestructure/database/connection";
import { microSector } from "@/infraestructure/database/schemas";
import { MicroSector } from "@/types/domain/micro-sector.entity";
import { and, desc, eq, isNull } from "drizzle-orm";

export class MicroSectorRepository {
  create(microSectorCreate: Partial<MicroSector>) {
    return db
      .insert(microSector)
      .values(microSectorCreate as MicroSector)
      .returning();
  }

  getAll() {
    return db.query.microSector.findMany({
      where: (microSector, { isNull }) => isNull(microSector.deletedAt),
      orderBy: [desc(microSector.updatedAt)],
    });
  }

  getById(id: number) {
    return db.query.microSector.findFirst({
      where: and(eq(microSector.id, id), isNull(microSector.deletedAt)),
    });
  }

  update(id: number, data: Partial<MicroSector>) {
    return db
      .update(microSector)
      .set(data as MicroSector)
      .where(eq(microSector.id, id))
      .returning();
  }

  delete(id: number) {
    return db
      .update(microSector)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(microSector.id, id))
      .returning();
  }

  getByCode(code: string) {
    return db.query.microSector.findFirst({
      where: and(eq(microSector.code, code), isNull(microSector.deletedAt)),
    });
  }

  getBySectorId(sectorId: number) {
    return db.query.microSector.findMany({
      where: and(eq(microSector.sectorId, sectorId), isNull(microSector.deletedAt)),
      orderBy: [desc(microSector.updatedAt)],
    });
  }
}
