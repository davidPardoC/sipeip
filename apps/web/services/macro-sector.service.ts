import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { MacroSectorRepository } from "@/repositories";
import { MacroSector } from "@/types/domain/macro-sector.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class MacroSectorService extends BaseService {
  constructor(private readonly macroSectorRepository: MacroSectorRepository) {
    super();
  }

  async create(macroSectror: Partial<MacroSector>): Promise<MacroSector[]> {
    const sector = await this.macroSectorRepository.create(macroSectror);

    publishLogEvent({
      event: LOG_EVENTS.SECTORS.MACRO.CREATE,
      resourceId: sector[0].id,
    });

    this.emitLogEvent({
      event: LOG_EVENTS.SECTORS.MACRO.CREATE,
      after: sector[0],
      resourceId: sector[0].id,
      message: `Macro sector ${sector[0].name} created successfully.`,
    });

    return sector;
  }

  getAll(): Promise<MacroSector[]> {
    return this.macroSectorRepository.getAll();
  }

  getById(id: number) {
    return this.macroSectorRepository.getById(id);
  }

  async update(id: number, data: Partial<MacroSector>): Promise<MacroSector[]> {
    const previousSector = await this.macroSectorRepository.getById(id);

    if (!previousSector) {
      throw new Error(`Sector with id ${id} not found`);
    }

    const sector = await this.macroSectorRepository.update(id, data);

    publishLogEvent({
      event: LOG_EVENTS.SECTORS.MACRO.UPDATE,
      resourceId: sector[0].id,
      before: previousSector,
      after: sector[0],
    });

    return sector;
  }

  async delete(id: number) {
    const deletes = await this.macroSectorRepository.delete(id);
    if (deletes) {
      this.emitLogEvent({
        event: LOG_EVENTS.SECTORS.MACRO.DELETE,
        resourceId: id,
      });
    }
  }
}
