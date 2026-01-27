import { StrategicObjectiveRepository } from "@/repositories/strategic-objective.repository";
import { ActivityObjectiveRepository } from "@/repositories/activity-objective.repository";
import { ActivityRepository } from "@/repositories/activity.repository";
import {
  StrategicObjective,
  StrategicObjectiveWithPlan,
  FulfillmentRule,
  FulfillmentStatus,
} from "@/types/domain/strategic-objective.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class StrategicObjectiveService extends BaseService {
  private logEvents = LOG_EVENTS.STRATEGIC_OBJECTIVES;
  private activityObjectiveRepository: ActivityObjectiveRepository;
  private activityRepository: ActivityRepository;

  constructor(
    private readonly strategicObjectiveRepository: StrategicObjectiveRepository,
    activityObjectiveRepository?: ActivityObjectiveRepository,
    activityRepository?: ActivityRepository
  ) {
    super();
    this.activityObjectiveRepository =
      activityObjectiveRepository || new ActivityObjectiveRepository();
    this.activityRepository = activityRepository || new ActivityRepository();
  }

  async create(
    strategicObjective: Partial<StrategicObjective>
  ): Promise<StrategicObjective[]> {
    const newObjective = await this.strategicObjectiveRepository.create({
      ...strategicObjective,
      fulfillmentRule: strategicObjective.fulfillmentRule || "AND",
      fulfillmentStatus: strategicObjective.fulfillmentStatus || "NO_CUMPLIDO",
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

  // Get activities linked to this objective
  async getLinkedActivities(objectiveId: number) {
    const links =
      await this.activityObjectiveRepository.getActivitiesByObjectiveId(
        objectiveId
      );

    const activityIds = links.map((link) => link.activityId);

    if (activityIds.length === 0) return [];

    return this.activityRepository.getByIds(activityIds);
  }

  // Calculate fulfillment status based on linked activities
  async calculateFulfillmentStatus(
    objectiveId: number
  ): Promise<FulfillmentStatus> {
    const objective =
      await this.strategicObjectiveRepository.getById(objectiveId);

    if (!objective) {
      throw new Error(`Strategic objective with id ${objectiveId} not found`);
    }

    // Get all activities linked to this objective
    const activities = await this.getLinkedActivities(objectiveId);

    if (activities.length === 0) {
      // No activities linked - cannot determine fulfillment
      return "NO_CUMPLIDO";
    }

    // Count completed activities (reportedStatus = COMPLETADA)
    const completedActivities = activities.filter(
      (activity) => activity.reportedStatus === "COMPLETADA"
    );

    const inProgressActivities = activities.filter(
      (activity) =>
        activity.reportedStatus === "NO_INICIADA" ||
        activity.reportedStatus === "EN_RIESGO"
    );

    // Apply fulfillment rule
    const fulfillmentRule = objective.fulfillmentRule || "AND";

    if (fulfillmentRule === "AND") {
      // Rule 1 (AND): ALL activities must be completed
      if (completedActivities.length === activities.length) {
        return "CUMPLIDO";
      } else if (inProgressActivities.length > 0) {
        return "EN_PROGRESO";
      } else {
        return "NO_CUMPLIDO";
      }
    } else {
      // Rule 2 (OR): AT LEAST ONE activity must be completed
      if (completedActivities.length > 0) {
        return "CUMPLIDO";
      } else if (inProgressActivities.length > 0) {
        return "EN_PROGRESO";
      } else {
        return "NO_CUMPLIDO";
      }
    }
  }

  // Update fulfillment status (convenience method)
  async updateFulfillmentStatus(
    objectiveId: number
  ): Promise<StrategicObjective[]> {
    const newStatus = await this.calculateFulfillmentStatus(objectiveId);

    return this.update(objectiveId, {
      fulfillmentStatus: newStatus,
    });
  }
}
