import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { IndicatorRepository } from "@/repositories/indicator.repository";
import { Indicator, CreateIndicatorData, UpdateIndicatorData } from "@/types/domain/indicator.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class IndicatorService extends BaseService {
  private logEvents = LOG_EVENTS.INDICATORS;

  constructor(private readonly indicatorRepository: IndicatorRepository) {
    super();
  }

  async create(indicatorData: CreateIndicatorData): Promise<Indicator[]> {
    const newIndicator = await this.indicatorRepository.create(indicatorData);

    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newIndicator[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newIndicator[0],
      resourceId: newIndicator[0].id,
      message: `Indicator ${newIndicator[0].name} created successfully.`,
    });

    return newIndicator;
  }

  getAll(): Promise<Indicator[]> {
    return this.indicatorRepository.getAll();
  }

  getById(id: number): Promise<Indicator | undefined> {
    return this.indicatorRepository.getById(id);
  }

  getByStrategicObjective(strategicObjectiveId: number): Promise<Indicator[]> {
    return this.indicatorRepository.getByOwner("StrategicObjective", strategicObjectiveId);
  }

  async update(id: number, data: UpdateIndicatorData): Promise<Indicator[]> {
    const previousIndicator = await this.indicatorRepository.getById(id);

    if (!previousIndicator) {
      throw new Error(`Indicator with id ${id} not found`);
    }

    const [updatedIndicator] = await this.indicatorRepository.update(id, data);

    publishLogEvent({
      event: this.logEvents.UPDATE,
      resourceId: updatedIndicator.id,
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousIndicator,
      after: updatedIndicator,
      resourceId: updatedIndicator.id,
      message: `Indicator ${updatedIndicator.name} updated successfully.`,
    });

    return [updatedIndicator];
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.indicatorRepository.delete(id);
    
    if (deleted) {
      publishLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
      });

      this.emitLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
        message: `Indicator with id ${id} deleted successfully.`,
      });
    } else {
      throw new Error(`Indicator with id ${id} not found`);
    }
  }
}
