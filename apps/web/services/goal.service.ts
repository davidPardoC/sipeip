import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { GoalRepository } from "@/repositories/goal.repository";
import { Goal, CreateGoalData, UpdateGoalData } from "@/types/domain/goal.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class GoalService extends BaseService {
  private logEvents = LOG_EVENTS.GOALS;

  constructor(private readonly goalRepository: GoalRepository) {
    super();
  }

  async create(goalData: CreateGoalData): Promise<Goal[]> {
    const newGoal = await this.goalRepository.create(goalData);

    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newGoal[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newGoal[0],
      resourceId: newGoal[0].id,
      message: `Goal for year ${newGoal[0].year} created successfully.`,
    });

    return newGoal;
  }

  getAll(): Promise<Goal[]> {
    return this.goalRepository.getAll();
  }

  getById(id: number): Promise<Goal | undefined> {
    return this.goalRepository.getById(id);
  }

  getByIndicator(indicatorId: number): Promise<Goal[]> {
    return this.goalRepository.getByIndicator(indicatorId);
  }

  async update(id: number, data: UpdateGoalData): Promise<Goal[]> {
    const previousGoal = await this.goalRepository.getById(id);

    if (!previousGoal) {
      throw new Error(`Goal with id ${id} not found`);
    }

    const updatedGoal = await this.goalRepository.update(id, data);

    publishLogEvent({
      event: this.logEvents.UPDATE,
      resourceId: id,
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousGoal,
      after: updatedGoal[0],
      resourceId: id,
      message: `Goal for year ${updatedGoal[0].year} updated successfully.`,
    });

    return updatedGoal;
  }

  async delete(id: number): Promise<void> {
    const goalToDelete = await this.goalRepository.getById(id);

    if (!goalToDelete) {
      throw new Error(`Goal with id ${id} not found`);
    }

    await this.goalRepository.delete(id);

    publishLogEvent({
      event: this.logEvents.DELETE,
      resourceId: id,
    });

    this.emitLogEvent({
      event: this.logEvents.DELETE,
      before: goalToDelete,
      resourceId: id,
      message: `Goal for year ${goalToDelete.year} deleted successfully.`,
    });
  }
}
