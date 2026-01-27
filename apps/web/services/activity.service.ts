import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { ActivityRepository } from "@/repositories/activity.repository";
import { ActivityObjectiveRepository } from "@/repositories/activity-objective.repository";
import {
  Activity,
  ActivityCreate,
  ActivityUpdate,
  ActivityIndicators,
} from "@/types/domain/activity.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";
import {
  calculateActivityProgress,
  calculateTimeVariance,
  calculateReportedStatus,
  getIndicator1Status,
  getIndicator2Status,
  getIndicator3Status,
} from "@/lib/utils/indicator-calculations";

export class ActivityService extends BaseService {
  private logEvents = LOG_EVENTS.ACTIVITIES;
  private activityObjectiveRepository: ActivityObjectiveRepository;

  constructor(
    private readonly activityRepository: ActivityRepository,
    activityObjectiveRepository?: ActivityObjectiveRepository
  ) {
    super();
    // Initialize activity-objective repository
    this.activityObjectiveRepository =
      activityObjectiveRepository || new ActivityObjectiveRepository();
  }

  async create(activityData: ActivityCreate): Promise<Activity[]> {
    // Auto-calculate reportedStatus if not provided
    if (!activityData.reportedStatus && activityData.actualProgress) {
      const actualProgress = parseFloat(activityData.actualProgress);
      activityData.reportedStatus = calculateReportedStatus(
        actualProgress,
        activityData.actualEndDate || null,
        activityData.endDate
      );
    }

    const newActivity = await this.activityRepository.create(activityData);

    // If objectiveIds provided, link them (V-03)
    if (activityData.objectiveIds && activityData.objectiveIds.length > 0) {
      await this.activityObjectiveRepository.createMultiple(
        newActivity[0].id,
        activityData.objectiveIds,
        activityData.createdBy
      );

      this.emitLogEvent({
        event: this.logEvents.LINK_OBJECTIVES,
        after: {
          activityId: newActivity[0].id,
          objectiveIds: activityData.objectiveIds,
        },
        resourceId: newActivity[0].id,
        message: `Activity ${newActivity[0].name} linked to ${activityData.objectiveIds.length} objectives`,
      });
    }

    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newActivity[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newActivity[0],
      resourceId: newActivity[0].id,
      message: `Activity ${newActivity[0].name} created successfully.`,
    });

    return newActivity as Activity[];
  }

  getAll(): Promise<Activity[]> {
    return this.activityRepository.getAll();
  }

  getById(id: number): Promise<Activity | undefined> {
    return this.activityRepository.getById(id);
  }

  getByProjectId(projectId: number): Promise<Activity[]> {
    return this.activityRepository.getByProjectId(projectId);
  }

  async update(id: number, data: ActivityUpdate): Promise<Activity[]> {
    const previousActivity = await this.activityRepository.getById(id);

    if (!previousActivity) {
      throw new Error(`Activity with id ${id} not found`);
    }

    // V-02: Validation for approval - activity must have objectives
    if (data.status === "COMPLETED" || data.status === "IN_PROGRESS") {
      await this.validateForApproval(id);
    }

    // Auto-calculate reportedStatus based on current/updated values
    const actualProgress = data.actualProgress
      ? parseFloat(data.actualProgress)
      : parseFloat(previousActivity.actualProgress || "0");

    const actualEndDate =
      data.actualEndDate || previousActivity.actualEndDate || null;
    const plannedEndDate = data.endDate || previousActivity.endDate;

    data.reportedStatus = calculateReportedStatus(
      actualProgress,
      actualEndDate,
      plannedEndDate
    );

    const updatedActivity = await this.activityRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    // If objectiveIds provided, replace existing links
    if (data.objectiveIds !== undefined) {
      const previousObjectives =
        await this.activityObjectiveRepository.getObjectivesByActivityId(id);

      await this.activityObjectiveRepository.replaceObjectives(
        id,
        data.objectiveIds,
        data.updatedBy
      );

      this.emitLogEvent({
        event: this.logEvents.UPDATE_OBJECTIVES,
        before: {
          activityId: id,
          objectiveIds: previousObjectives.map((o) => o.id),
        },
        after: { activityId: id, objectiveIds: data.objectiveIds },
        resourceId: id,
        message: `Activity objectives updated`,
      });
    }

    publishLogEvent({
      event: this.logEvents.UPDATE,
      resourceId: updatedActivity[0].id,
      before: previousActivity,
      after: updatedActivity[0],
    });

    this.emitLogEvent({
      event: this.logEvents.UPDATE,
      before: previousActivity,
      after: updatedActivity[0],
      resourceId: updatedActivity[0].id,
      message: `Activity ${updatedActivity[0].name} updated successfully.`,
    });

    return updatedActivity as Activity[];
  }

  async delete(id: number): Promise<void> {
    const deletedActivity = await this.activityRepository.delete(id);
    if (deletedActivity) {
      publishLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
      });

      this.emitLogEvent({
        event: this.logEvents.DELETE,
        resourceId: id,
        message: `Activity with id ${id} deleted successfully.`,
      });
    }
  }

  // V-02 Validation - Check if activity has at least one objective
  async validateForApproval(activityId: number): Promise<void> {
    const hasObjectives =
      await this.activityObjectiveRepository.hasObjectives(activityId);

    if (!hasObjectives) {
      throw new Error(
        "Activity cannot be started or completed without being linked to at least one strategic objective (V-02)"
      );
    }
  }

  // Get activities by reported status
  getByReportedStatus(
    reportedStatus: "NO_INICIADA" | "EN_RIESGO" | "COMPLETADA"
  ): Promise<Activity[]> {
    return this.activityRepository.getByReportedStatus(reportedStatus);
  }

  // Get activities at risk
  getActivitiesAtRisk(): Promise<Activity[]> {
    return this.activityRepository.getActivitiesAtRisk();
  }

  // Calculate all three indicators for an activity
  async calculateIndicators(activityId: number): Promise<ActivityIndicators> {
    const activity = await this.activityRepository.getById(activityId);

    if (!activity) {
      throw new Error(`Activity with id ${activityId} not found`);
    }

    // Parse decimal values
    const actualProgress = parseFloat(activity.actualProgress || "0");
    const plannedProgress = parseFloat(activity.plannedProgress || "0");

    // INDICATOR 1: Activity Progress
    const indicator1Value = calculateActivityProgress(
      actualProgress,
      plannedProgress
    );

    // INDICATOR 2: Time Variance
    const indicator2Value = calculateTimeVariance(
      activity.actualEndDate || null,
      activity.endDate
    );

    // INDICATOR 3: Deadline Compliance (reportedStatus)
    const indicator3Value = activity.reportedStatus || "NO_INICIADA";

    return {
      activityId: activity.id,
      indicator1_activityProgress: {
        value: indicator1Value,
        unit: "%",
        target: 100,
        status: getIndicator1Status(indicator1Value),
        formula: "actualProgress / plannedProgress * 100",
      },
      indicator2_timeVariance: {
        value: indicator2Value,
        unit: "days",
        target: 0,
        status: getIndicator2Status(indicator2Value),
        formula: "actualEndDate - endDate",
      },
      indicator3_deadlineCompliance: {
        value: indicator3Value as any,
        status: getIndicator3Status(indicator3Value as any),
      },
    };
  }

  // Link activity to objectives
  async linkObjectives(
    activityId: number,
    objectiveIds: number[],
    userId?: string
  ): Promise<void> {
    await this.activityObjectiveRepository.createMultiple(
      activityId,
      objectiveIds,
      userId
    );

    this.emitLogEvent({
      event: this.logEvents.LINK_OBJECTIVES,
      after: { activityId, objectiveIds },
      resourceId: activityId,
      message: `Activity ${activityId} linked to objectives`,
    });
  }

  // Get objectives for an activity
  async getObjectives(activityId: number) {
    return this.activityObjectiveRepository.getObjectivesByActivityId(
      activityId
    );
  }
}
