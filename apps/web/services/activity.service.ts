import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { ActivityRepository } from "@/repositories/activity.repository";
import { Activity, ActivityCreate, ActivityUpdate } from "@/types/domain/activity.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";
import { MonitoringService } from "./monitoring.service";

export class ActivityService extends BaseService {
  private logEvents = LOG_EVENTS.ACTIVITIES;
  private monitoringService = new MonitoringService();

  constructor(private readonly activityRepository: ActivityRepository) {
    super();
  }

  async create(activityData: ActivityCreate): Promise<Activity[]> {
    // Generate Code: ACT001, ACT002...
    const lastCode = await this.activityRepository.getLastCode(activityData.projectId);
    let newSequence = 1;
    if (lastCode) {
      // Assume format ACTxxx or similar. Extract number.
      const matches = lastCode.match(/(\d+)$/);
      if (matches) {
        newSequence = parseInt(matches[0], 10) + 1;
      }
    }
    const code = `ACT${newSequence.toString().padStart(3, '0')}`;

    // Calculate Planned Duration
    let plannedDuration = 0;
    if (activityData.startDate && activityData.endDate) {
      const start = new Date(activityData.startDate).getTime();
      const end = new Date(activityData.endDate).getTime();
      plannedDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    const dataToCreate = {
      ...activityData,
      code,
      plannedDuration: plannedDuration > 0 ? plannedDuration : 0,
      isActive: true,
      priority: activityData.priority || 1
    };

    const newActivity = await this.activityRepository.create(dataToCreate);

    // Save Objectives (M:N)
    if (activityData.objectiveIds) {
      await this.activityRepository.saveObjectives(newActivity[0].id, activityData.objectiveIds);
    }



    publishLogEvent({
      event: this.logEvents.CREATE,
      resourceId: newActivity[0].id,
    });

    this.emitLogEvent({
      event: this.logEvents.CREATE,
      after: newActivity[0],
      resourceId: newActivity[0].id,
      message: `Actividad ${newActivity[0].name} creada exitosamente.`,
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
      throw new Error(`Actividad con id ${id} no encontrada`);
    }

    // Recalculate Planned Duration if dates change
    let plannedDuration = previousActivity.plannedDuration;
    if (data.startDate || data.endDate) {
      const start = new Date(data.startDate || previousActivity.startDate).getTime();
      const end = new Date(data.endDate || previousActivity.endDate).getTime();
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      plannedDuration = duration > 0 ? duration : 0;
    }

    const updatedActivity = await this.activityRepository.update(id, {
      ...data,
      plannedDuration,
      updatedAt: new Date().toISOString(),
    });

    // Save Objectives if provided
    if (data.objectiveIds) {
      await this.activityRepository.saveObjectives(id, data.objectiveIds);
    }

    // Save Objectives if provided
    if (data.objectiveIds) {
      await this.activityRepository.saveObjectives(id, data.objectiveIds);
    }

    // Calculate Indicators & Update Status
    // We do this after the update so the DB has the latest values (MonitoringService fetches from DB)
    // Optimization: Pass updatedActivity[0] to calculateActivityIndicators to avoid fetch?
    // MonitoringService currently fetches. We can refactor it or just let it fetch.
    const indicators = await this.monitoringService.calculateActivityIndicators(id);

    // Update reportedStatus if it changed
    if (updatedActivity[0].reportedStatus !== indicators.complianceStatus) {
      await this.activityRepository.update(id, {
        reportedStatus: indicators.complianceStatus
      });
      updatedActivity[0].reportedStatus = indicators.complianceStatus;
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
      message: `Actividad ${updatedActivity[0].name} actualizada exitosamente.`,
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
        message: `Actividad con id ${id} eliminada exitosamente.`,
      });
    }
  }
}
