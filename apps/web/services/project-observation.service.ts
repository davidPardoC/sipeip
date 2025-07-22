import { projectObservationRepository } from "@/repositories/project-observation.repository";
import {
  ProjectObservation,
  ProjectObservationCreate,
  ProjectObservationUpdate,
} from "@/types/domain/project-observation.entity";

export class ProjectObservationService {
  async create(data: ProjectObservationCreate): Promise<ProjectObservation> {
    const result = await projectObservationRepository.create(data);
    return result[0];
  }

  async update(
    id: number,
    data: ProjectObservationUpdate
  ): Promise<ProjectObservation | null> {
    const result = await projectObservationRepository.update(id, data);
    return result[0] || null;
  }

  async getByProjectId(projectId: number): Promise<ProjectObservation[]> {
    return await projectObservationRepository.getByProjectId(projectId);
  }

  async getById(id: number): Promise<ProjectObservation | null> {
    return await projectObservationRepository.getById(id);
  }

  async delete(id: number): Promise<void> {
    await projectObservationRepository.delete(id);
  }
}

export const projectObservationService = new ProjectObservationService();
