import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";
import { ProjectRepository } from "@/repositories/project.repository";
import { Project, ProjectWithRelations } from "@/types/domain/project.entity";
import { LOG_EVENTS } from "@/types/event.types";
import { BaseService } from "./base.service";

export class ProjectService extends BaseService {
  constructor(private readonly projectRepository: ProjectRepository) {
    super();
  }

  async create(project: Partial<Project>): Promise<Project[]> {
    const newProject = await this.projectRepository.create({
      ...project,
      typologyId: project.typologyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: LOG_EVENTS.PROJECTS.CREATE,
      resourceId: newProject[0].id,
    });

    this.emitLogEvent({
      event: LOG_EVENTS.PROJECTS.CREATE,
      after: newProject[0],
      resourceId: newProject[0].id,
      message: `Project ${newProject[0].code} created successfully.`,
    });

    return newProject as Project[];
  }

  getAll(): Promise<ProjectWithRelations[]> {
    return this.projectRepository.getAll();
  }

  getById(id: number): Promise<ProjectWithRelations | undefined> {
    return this.projectRepository.getById(id);
  }

  getByProgramId(programId: number): Promise<ProjectWithRelations[]> {
    return this.projectRepository.getByProgramId(programId);
  }

  async update(id: number, data: Partial<Project>): Promise<Project[]> {
    const previousProject = await this.projectRepository.getById(id);

    if (!previousProject) {
      throw new Error(`Project with id ${id} not found`);
    }

    const updatedProject = await this.projectRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    publishLogEvent({
      event: LOG_EVENTS.PROJECTS.UPDATE,
      resourceId: updatedProject[0].id,
      before: previousProject,
      after: updatedProject[0],
    });

    this.emitLogEvent({
      event: LOG_EVENTS.PROJECTS.UPDATE,
      before: previousProject,
      after: updatedProject[0],
      resourceId: updatedProject[0].id,
      message: `Project ${updatedProject[0].code} updated successfully.`,
    });

    return updatedProject as Project[];
  }

  async delete(id: number) {
    const deletedProject = await this.projectRepository.delete(id);
    if (deletedProject) {
      publishLogEvent({
        event: LOG_EVENTS.PROJECTS.DELETE,
        resourceId: id,
      });

      this.emitLogEvent({
        event: LOG_EVENTS.PROJECTS.DELETE,
        resourceId: id,
        message: `Project with id ${id} deleted successfully.`,
      });
    }
  }

  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    return this.projectRepository.codeExists(code, excludeId);
  }

  async cupExists(cup: string, excludeId?: number): Promise<boolean> {
    return this.projectRepository.cupExists(cup, excludeId);
  }
}
