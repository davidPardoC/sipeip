import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { PndObjectiveRepository } from "@/repositories/pnd-objective.repository";
import { PndObjective } from "@/types/domain/pnd-objective.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class PndObjectiveService extends BaseService {
  private logEvents = LOG_EVENTS.PND_OBJECTIVES;

  constructor(private readonly pndObjectiveRepository: PndObjectiveRepository) {
    super();
  }

  async create(pndObjective: Partial<PndObjective>): Promise<PndObjective[]> {
    // Check if code already exists
    const existingPndObjective = await this.pndObjectiveRepository.getByCode(pndObjective.code!);
    if (existingPndObjective) {
      throw new Error(`PND Objective with code ${pndObjective.code} already exists`);
    }

    const newPndObjective = await this.pndObjectiveRepository.create({
      ...pndObjective,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newPndObjective[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newPndObjective[0],
      resourceId: newPndObjective[0].id,
      message: `PND Objective ${newPndObjective[0].name} created successfully.`,
    });

    return newPndObjective;
  }

  getAll(): Promise<PndObjective[]> {
    return this.pndObjectiveRepository.getAll();
  }

  getById(id: number): Promise<PndObjective | undefined> {
    return this.pndObjectiveRepository.getById(id);
  }

  async update(id: number, data: Partial<PndObjective>): Promise<PndObjective[]> {
    const previousPndObjective = await this.pndObjectiveRepository.getById(id);

    if (!previousPndObjective) {
      throw new Error(`PND Objective with id ${id} not found`);
    }

    // Check if code is being updated and already exists
    if (data.code && data.code !== previousPndObjective.code) {
      const existingPndObjective = await this.pndObjectiveRepository.getByCode(data.code);
      if (existingPndObjective) {
        throw new Error(`PND Objective with code ${data.code} already exists`);
      }
    }

    const updatedPndObjective = await this.pndObjectiveRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: this.logEvents.UPDATE,
      resourceId: id,
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousPndObjective,
      after: updatedPndObjective[0],
      resourceId: id,
      message: `PND Objective ${updatedPndObjective[0].name} updated successfully.`,
    });

    return updatedPndObjective;
  }

  async delete(id: number): Promise<void> {
    const pndObjective = await this.pndObjectiveRepository.getById(id);

    if (!pndObjective) {
      throw new Error(`PND Objective with id ${id} not found`);
    }

    await this.pndObjectiveRepository.delete(id);

    publishLogEvent({
      event: this.logEvents.DELETE,
      resourceId: id,
    });

    this.emitLogEvent({
      event: this.logEvents.DELETE,
      before: pndObjective,
      resourceId: id,
      message: `PND Objective ${pndObjective.name} deleted successfully.`,
    });
  }

  getByCode(code: string): Promise<PndObjective | undefined> {
    return this.pndObjectiveRepository.getByCode(code);
  }
}
