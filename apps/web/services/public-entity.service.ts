import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { PublicEntityRepository } from "@/repositories";
import { PublicEntity } from "@/types/domain/public-entity.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class PublicEntityService extends BaseService {
  constructor(private readonly publicEntityRepository: PublicEntityRepository) {
    super();
  }

  async create(publicEntity: Partial<PublicEntity>): Promise<PublicEntity[]> {
    const entity = await this.publicEntityRepository.create(publicEntity);

    publishLogEvent({
      event: LOG_EVENTS.PUBLIC_ENTITIES.CREATE,
      resourceId: entity[0].id,
    });

    this.emitLogEvent({
      event: LOG_EVENTS.PUBLIC_ENTITIES.CREATE,
      after: entity[0],
      resourceId: entity[0].id,
      message: `Public entity ${entity[0].name} created successfully.`,
    });

    return entity;
  }

  getAll(): Promise<PublicEntity[]> {
    return this.publicEntityRepository.getAll();
  }

  getById(id: number) {
    return this.publicEntityRepository.getById(id);
  }

  async update(id: number, data: Partial<PublicEntity>): Promise<PublicEntity[]> {
    const previousEntity = await this.publicEntityRepository.getById(id);

    if (!previousEntity) {
      throw new Error(`Public entity with id ${id} not found`);
    }

    const entity = await this.publicEntityRepository.update(id, data);

    publishLogEvent({
      event: LOG_EVENTS.PUBLIC_ENTITIES.UPDATE,
      resourceId: entity[0].id,
      before: previousEntity,
      after: entity[0],
    });

    this.emitLogEvent({
      event: LOG_EVENTS.PUBLIC_ENTITIES.UPDATE,
      before: previousEntity,
      after: entity[0],
      resourceId: entity[0].id,
      message: `Public entity ${entity[0].name} updated successfully.`,
    });

    return entity;
  }

  async delete(id: number) {
    const deletes = await this.publicEntityRepository.delete(id);
    if (deletes) {
      this.emitLogEvent({
        event: LOG_EVENTS.PUBLIC_ENTITIES.DELETE,
        resourceId: id,
        message: `Public entity with id ${id} deleted successfully.`,
      });
    }
  }
}
