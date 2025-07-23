import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { ActivityRepository } from "@/repositories/activity.repository";
import { Activity, ActivityCreate, ActivityUpdate } from "@/types/domain/activity.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class ActivityService extends BaseService {
  private logEvents = LOG_EVENTS.ACTIVITIES;

  constructor(private readonly activityRepository: ActivityRepository) {
    super();
  }

  async create(activityData: ActivityCreate): Promise<Activity[]> {
    const newActivity = await this.activityRepository.create(activityData);

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

    const updatedActivity = await this.activityRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

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
}
