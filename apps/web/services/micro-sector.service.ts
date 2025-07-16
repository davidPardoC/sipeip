import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { MicroSectorRepository } from "@/repositories";
import { MicroSector } from "@/types/domain/micro-sector.entity";
import { LOG_EVENTS } from "@/types/event.types";

export class MicroSectorService {
  constructor(private readonly microSectorRepository: MicroSectorRepository) {}

  async create(microSector: Partial<MicroSector>): Promise<MicroSector[]> {
    const newMicroSector = await this.microSectorRepository.create(microSector);

    publishLogEvent({
      event: LOG_EVENTS.SECTORS.MICRO.CREATE,
      resourceId: newMicroSector[0].id,
    });

    return newMicroSector;
  }

  getAll(): Promise<MicroSector[]> {
    return this.microSectorRepository.getAll();
  }

  getById(id: number) {
    return this.microSectorRepository.getById(id);
  }

  async update(id: number, data: Partial<MicroSector>): Promise<MicroSector[]> {
    const previousMicroSector = await this.microSectorRepository.getById(id);

    if (!previousMicroSector) {
      throw new Error(`Micro sector with id ${id} not found`);
    }

    const microSector = await this.microSectorRepository.update(id, data);

    publishLogEvent({
      event: LOG_EVENTS.SECTORS.MICRO.UPDATE,
      resourceId: microSector[0].id,
      before: previousMicroSector,
      after: microSector[0],
    });

    return microSector;
  }

  delete(id: number) {
    return this.microSectorRepository.delete(id);
  }

  getByCode(code: string) {
    return this.microSectorRepository.getByCode(code);
  }

  getBySectorId(sectorId: number) {
    return this.microSectorRepository.getBySectorId(sectorId);
  }
}
