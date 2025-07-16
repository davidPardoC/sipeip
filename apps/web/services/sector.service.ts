import { SectorRepository } from "@/repositories";
import { Sector } from "@/types/domain/sector.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class SectorService extends BaseService {
  private logEvents = LOG_EVENTS.SECTORS.MACRO;

  constructor(private readonly sectorRepository: SectorRepository) {
    super();
  }

  async create(sector: Partial<Sector>): Promise<Sector[]> {
    const newSector = await this.sectorRepository.create(sector);

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newSector[0].id,
    });

    return newSector;
  }

  getAll(): Promise<Sector[]> {
    return this.sectorRepository.getAll();
  }

  getById(id: number) {
    return this.sectorRepository.getById(id);
  }

  async update(id: number, data: Partial<Sector>): Promise<Sector> {
    const previousSector = await this.sectorRepository.getById(id);

    if (!previousSector) {
      throw new Error(`Sector with id ${id} not found`);
    }

    const [sector] = await this.sectorRepository.update(id, data);

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousSector,
      after: sector,
      resourceId: sector.id,
    });

    return sector;
  }

  async delete(id: number) {
    const deleted = await this.sectorRepository.delete(id);
    if (deleted) {
      this.emitLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
      });
    }
  }

  getByCode(code: string) {
    return this.sectorRepository.getByCode(code);
  }
}
