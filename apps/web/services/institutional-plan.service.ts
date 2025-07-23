import { InstitutionalPlanRepository } from "@/repositories/institutional-plan.repository";
import {
  InstitutionalPlan,
  InstitutionalPlanWithEntity,
} from "@/types/domain/institutional-plan.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class InstitutionalPlanService extends BaseService {
  private logEvents = LOG_EVENTS.INSTITUTIONAL_PLANS;

  constructor(
    private readonly institutionalPlanRepository: InstitutionalPlanRepository
  ) {
    super();
  }

  async create(
    institutionalPlan: Partial<InstitutionalPlan>,
    createdBy?: string
  ): Promise<InstitutionalPlan[]> {
    const newPlan = await this.institutionalPlanRepository.create({
      ...institutionalPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newPlan[0],
      resourceId: newPlan[0].id,
      message: `Institutional plan ${newPlan[0].name} created successfully.`,
    });

    return newPlan;
  }

  getAll(): Promise<InstitutionalPlanWithEntity[]> {
    return this.institutionalPlanRepository.getAll();
  }

  getById(id: number): Promise<InstitutionalPlanWithEntity | undefined> {
    return this.institutionalPlanRepository.getById(id);
  }

  async getByUserId(userId: string): Promise<InstitutionalPlanWithEntity[]> {
    return this.institutionalPlanRepository.getByUserId(userId);
  }

  getByPublicEntity(
    publicEntityId: number
  ): Promise<InstitutionalPlanWithEntity[]> {
    return this.institutionalPlanRepository.getByPublicEntity(publicEntityId);
  }

  async update(
    id: number,
    data: Partial<InstitutionalPlan>
  ): Promise<InstitutionalPlan[]> {
    const previousPlan = await this.institutionalPlanRepository.getById(id);

    if (!previousPlan) {
      throw new Error(`Institutional plan with id ${id} not found`);
    }

    const updatedPlan = await this.institutionalPlanRepository.update(id, data);

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousPlan,
      after: updatedPlan[0],
      resourceId: updatedPlan[0].id,
      message: `Institutional plan ${updatedPlan[0].name} updated successfully.`,
    });

    return updatedPlan;
  }

  async delete(id: number) {
    const planToDelete = await this.institutionalPlanRepository.getById(id);

    if (!planToDelete) {
      throw new Error(`Institutional plan with id ${id} not found`);
    }

    const deleted = await this.institutionalPlanRepository.delete(id);

    if (deleted) {
      this.emitLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
        message: `Institutional plan ${planToDelete.name} deleted successfully.`,
      });
    }

    return deleted;
  }
}
