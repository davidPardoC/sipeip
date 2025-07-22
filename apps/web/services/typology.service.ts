import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { TypologyRepository } from "@/repositories/typology.repository";
import { Typology } from "@/types/domain/typology.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class TypologyService extends BaseService {
  constructor(private readonly typologyRepository: TypologyRepository) {
    super();
  }

  async create(typology: Partial<Typology>): Promise<Typology[]> {
    const newTypology = await this.typologyRepository.create({
      ...typology,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: LOG_EVENTS.TYPOLOGIES.CREATE,
      resourceId: newTypology[0].id,
    });

    this.emitLogEvent({
      event: LOG_EVENTS.TYPOLOGIES.CREATE,
      after: newTypology[0],
      resourceId: newTypology[0].id,
      message: `Typology ${newTypology[0].name} created successfully.`,
    });

    return newTypology;
  }

  getAll(): Promise<Typology[]> {
    return this.typologyRepository.getAll();
  }

  getById(id: number): Promise<Typology | undefined> {
    return this.typologyRepository.getById(id);
  }

  getByCode(code: string): Promise<Typology | undefined> {
    return this.typologyRepository.getByCode(code);
  }

  searchByName(searchTerm: string): Promise<Typology[]> {
    return this.typologyRepository.searchByName(searchTerm);
  }

  async update(id: number, data: Partial<Typology>): Promise<Typology[]> {
    const previousTypology = await this.typologyRepository.getById(id);

    if (!previousTypology) {
      throw new Error(`Typology with id ${id} not found`);
    }

    const updatedTypology = await this.typologyRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: LOG_EVENTS.TYPOLOGIES.UPDATE,
      resourceId: updatedTypology[0].id,
      before: previousTypology,
      after: updatedTypology[0],
    });

    this.emitLogEvent({
      event: LOG_EVENTS.TYPOLOGIES.UPDATE,
      before: previousTypology,
      after: updatedTypology[0],
      resourceId: updatedTypology[0].id,
      message: `Typology ${updatedTypology[0].name} updated successfully.`,
    });

    return updatedTypology;
  }

  async delete(id: number) {
    const deletedTypology = await this.typologyRepository.delete(id);
    if (deletedTypology) {
      publishLogEvent({
        event: LOG_EVENTS.TYPOLOGIES.DELETE,
        resourceId: id,
      });

      this.emitLogEvent({
        event: LOG_EVENTS.TYPOLOGIES.DELETE,
        resourceId: id,
        message: `Typology with id ${id} deleted successfully.`,
      });
    }
  }

  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    return this.typologyRepository.codeExists(code, excludeId);
  }

  getPaginated(offset: number = 0, limit: number = 10): Promise<Typology[]> {
    return this.typologyRepository.getPaginated(offset, limit);
  }

  count(): Promise<number> {
    return this.typologyRepository.count();
  }
}
