import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { OdsGoalRepository } from "@/repositories/ods-goal.repository";
import { OdsGoal } from "@/types/domain/ods-goal.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class OdsGoalService extends BaseService {
  private logEvents = LOG_EVENTS.ODS_GOALS;

  constructor(private readonly odsGoalRepository: OdsGoalRepository) {
    super();
  }

  async create(odsGoal: Partial<OdsGoal>): Promise<OdsGoal[]> {
    // Check if code already exists
    const existingOdsGoal = await this.odsGoalRepository.getByCode(odsGoal.code!);
    if (existingOdsGoal) {
      throw new Error(`ODS Goal with code ${odsGoal.code} already exists`);
    }

    const newOdsGoal = await this.odsGoalRepository.create({
      ...odsGoal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newOdsGoal[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newOdsGoal[0],
      resourceId: newOdsGoal[0].id,
      message: `ODS Goal ${newOdsGoal[0].name} created successfully.`,
    });

    return newOdsGoal;
  }

  getAll(): Promise<OdsGoal[]> {
    return this.odsGoalRepository.getAll();
  }

  getById(id: number): Promise<OdsGoal | undefined> {
    return this.odsGoalRepository.getById(id);
  }

  async update(id: number, data: Partial<OdsGoal>): Promise<OdsGoal[]> {
    const previousOdsGoal = await this.odsGoalRepository.getById(id);

    if (!previousOdsGoal) {
      throw new Error(`ODS Goal with id ${id} not found`);
    }

    // Check if code is being updated and already exists
    if (data.code && data.code !== previousOdsGoal.code) {
      const existingOdsGoal = await this.odsGoalRepository.getByCode(data.code);
      if (existingOdsGoal) {
        throw new Error(`ODS Goal with code ${data.code} already exists`);
      }
    }

    const updatedOdsGoal = await this.odsGoalRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: this.logEvents.UPDATE,
      resourceId: id,
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousOdsGoal,
      after: updatedOdsGoal[0],
      resourceId: id,
      message: `ODS Goal ${updatedOdsGoal[0].name} updated successfully.`,
    });

    return updatedOdsGoal;
  }

  async delete(id: number): Promise<void> {
    const odsGoal = await this.odsGoalRepository.getById(id);

    if (!odsGoal) {
      throw new Error(`ODS Goal with id ${id} not found`);
    }

    await this.odsGoalRepository.delete(id);

    publishLogEvent({
      event: this.logEvents.DELETE,
      resourceId: id,
    });

    this.emitLogEvent({
      event: this.logEvents.DELETE,
      before: odsGoal,
      resourceId: id,
      message: `ODS Goal ${odsGoal.name} deleted successfully.`,
    });
  }

  getByCode(code: string): Promise<OdsGoal | undefined> {
    return this.odsGoalRepository.getByCode(code);
  }
}
