import { StrategicObjectiveRepository } from "@/repositories/strategic-objective.repository";
import {
  StrategicObjective,
  StrategicObjectiveWithPlan,
} from "@/types/domain/strategic-objective.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class StrategicObjectiveService extends BaseService {
  private logEvents = LOG_EVENTS.STRATEGIC_OBJECTIVES;

  constructor(
    private readonly strategicObjectiveRepository: StrategicObjectiveRepository
  ) {
    super();
  }

  async create(
    strategicObjective: Partial<StrategicObjective>
  ): Promise<StrategicObjective[]> {
    const newObjective = await this.strategicObjectiveRepository.create({
      ...strategicObjective,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newObjective[0],
      resourceId: newObjective[0].id,
      message: `Strategic objective ${newObjective[0].name} created successfully.`,
    });

    return newObjective;
  }

  getAll(): Promise<StrategicObjectiveWithPlan[]> {
    return this.strategicObjectiveRepository.getAll();
  }

  getById(id: number): Promise<StrategicObjectiveWithPlan | undefined> {
    return this.strategicObjectiveRepository.getById(id);
  }

  getByInstitutionalPlan(
    institutionalPlanId: number
  ): Promise<StrategicObjective[]> {
    return this.strategicObjectiveRepository.getByInstitutionalPlan(
      institutionalPlanId
    );
  }

  async update(
    id: number,
    data: Partial<StrategicObjective>
  ): Promise<StrategicObjective[]> {
    const previousObjective =
      await this.strategicObjectiveRepository.getById(id);

    const result = await this.strategicObjectiveRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousObjective,
      after: result[0],
      resourceId: id,
      message: `Strategic objective ${result[0].name} updated successfully.`,
    });

    return result;
  }

  async delete(id: number) {
    const deleted = await this.strategicObjectiveRepository.delete(id);

    if (deleted && deleted.length > 0) {
      this.emitLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
        message: `Strategic objective deleted successfully.`,
      });
    }

    return deleted;
  }

  getByCode(code: string) {
    return this.strategicObjectiveRepository.getByCode(code);
  }
}
