import { db } from "@/infraestructure/database/connection";
import { organizationalUnit } from "@/infraestructure/database/schemas";
import { OrganizationalUnit } from "@/types/domain/organizational-unit.entity";
import { and, desc, eq, isNull } from "drizzle-orm";

export class OrganizationalUnitRepository {
  // Define methods for interacting with the organizational unit data
  create(organizationalUnitCreate: Partial<OrganizationalUnit>) {
    return db
      .insert(organizationalUnit)
      .values(organizationalUnitCreate as OrganizationalUnit)
      .returning();
  }

  getAll() {
    return db.query.organizationalUnit.findMany({
      where: (organizationalUnit, { isNull }) => isNull(organizationalUnit.deletedAt),
      orderBy: [desc(organizationalUnit.updatedAt)],
    });
  }

  getByPublicEntity(publicEntityId: number) {
    return db.query.organizationalUnit.findMany({
      where: and(
        eq(organizationalUnit.publicEntityId, publicEntityId),
        isNull(organizationalUnit.deletedAt)
      ),
      orderBy: [desc(organizationalUnit.updatedAt)],
    });
  }

  getById(id: number) {
    return db.query.organizationalUnit.findFirst({
      where: and(eq(organizationalUnit.id, id), isNull(organizationalUnit.deletedAt)),
    });
  }

  update(id: number, data: Partial<OrganizationalUnit>) {
    return db
      .update(organizationalUnit)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(organizationalUnit.id, id))
      .returning();
  }

  delete(id: number) {
    return db
      .update(organizationalUnit)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(organizationalUnit.id, id))
      .returning();
  }
}
