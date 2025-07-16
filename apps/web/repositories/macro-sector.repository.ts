import { db } from "@/infraestructure/database/connection";
import { macroSector } from "@/infraestructure/database/schemas";
import { MacroSector } from "@/types/domain/macro-sector.entity";
import { and, desc, eq, isNull, not } from "drizzle-orm";

export class MacroSectorRepository {
  // Define methods for interacting with the sector data
  create(macroSectorCreate: Partial<MacroSector>) {
    return db
      .insert(macroSector)
      .values(macroSectorCreate as MacroSector)
      .returning();
  }

  getAll() {
    return db.query.macroSector.findMany({
      where: (macroSector, { isNull }) => isNull(macroSector.deletedAt),
      orderBy: [desc(macroSector.updatedAt)],
    });
  }

  getById(id: number) {
    return db.query.macroSector.findFirst({
      where: and(eq(macroSector.id, id), isNull(macroSector.deletedAt)),
    });
  }

  update(id: number, data: Partial<MacroSector>) {
    return db
      .update(macroSector)
      .set(data as MacroSector)
      .where(eq(macroSector.id, id))
      .returning();
  }

  delete(id: number) {
    return db
      .update(macroSector)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(macroSector.id, id))
      .returning();
  }
}
