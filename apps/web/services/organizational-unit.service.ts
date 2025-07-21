import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { OrganizationalUnitRepository } from "@/repositories";
import { OrganizationalUnit } from "@/types/domain/organizational-unit.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class OrganizationalUnitService extends BaseService {
  constructor(private readonly organizationalUnitRepository: OrganizationalUnitRepository) {
    super();
  }

  async create(organizationalUnit: Partial<OrganizationalUnit>): Promise<OrganizationalUnit[]> {
    const unit = await this.organizationalUnitRepository.create(organizationalUnit);

    publishLogEvent({
      event: LOG_EVENTS.ORGANIZATIONAL_UNITS.CREATE,
      resourceId: unit[0].id,
    });

    this.emitLogEvent({
      event: LOG_EVENTS.ORGANIZATIONAL_UNITS.CREATE,
      after: unit[0],
      resourceId: unit[0].id,
      message: `Organizational unit ${unit[0].name} created successfully.`,
    });

    return unit;
  }

  getAll(): Promise<OrganizationalUnit[]> {
    return this.organizationalUnitRepository.getAll();
  }

  getByPublicEntity(publicEntityId: number): Promise<OrganizationalUnit[]> {
    return this.organizationalUnitRepository.getByPublicEntity(publicEntityId);
  }

  getById(id: number) {
    return this.organizationalUnitRepository.getById(id);
  }

  async update(id: number, data: Partial<OrganizationalUnit>): Promise<OrganizationalUnit[]> {
    const previousUnit = await this.organizationalUnitRepository.getById(id);

    if (!previousUnit) {
      throw new Error(`Organizational unit with id ${id} not found`);
    }

    const unit = await this.organizationalUnitRepository.update(id, data);

    publishLogEvent({
      event: LOG_EVENTS.ORGANIZATIONAL_UNITS.UPDATE,
      resourceId: unit[0].id,
      before: previousUnit,
      after: unit[0],
    });

    this.emitLogEvent({
      event: LOG_EVENTS.ORGANIZATIONAL_UNITS.UPDATE,
      before: previousUnit,
      after: unit[0],
      resourceId: unit[0].id,
      message: `Organizational unit ${unit[0].name} updated successfully.`,
    });

    return unit;
  }

  async delete(id: number) {
    const deletes = await this.organizationalUnitRepository.delete(id);
    if (deletes) {
      this.emitLogEvent({
        event: LOG_EVENTS.ORGANIZATIONAL_UNITS.DELETE,
        resourceId: id,
        message: `Organizational unit with id ${id} deleted successfully.`,
      });
    }
  }
}
