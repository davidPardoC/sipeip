import { eq, and, isNull, desc } from "drizzle-orm";
import { db } from "@/infraestructure/database/connection";
import { projectObservations } from "@/infraestructure/database/schemas/project_observations";
import {
  ProjectObservation,
  ProjectObservationCreate,
  ProjectObservationUpdate,
} from "@/types/domain/project-observation.entity";
import { usersMapping } from "@/infraestructure/database/schemas/users_mapping";

export class ProjectObservationRepository {
  async create(data: ProjectObservationCreate): Promise<ProjectObservation[]> {
    return await db
      .insert(projectObservations)
      .values({
        observation: data.observation,
        projectId: data.projectId,
        createdBy: data.createdBy,
      })
      .returning({
        id: projectObservations.id,
        observation: projectObservations.observation,
        projectId: projectObservations.projectId,
        createdBy: projectObservations.createdBy,
        updatedBy: projectObservations.updatedBy,
        createdAt: projectObservations.createdAt,
        updatedAt: projectObservations.updatedAt,
        deletedAt: projectObservations.deletedAt,
      });
  }

  async update(
    id: number,
    data: ProjectObservationUpdate
  ): Promise<ProjectObservation[]> {
    return await db
      .update(projectObservations)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(projectObservations.id, id),
          isNull(projectObservations.deletedAt)
        )
      )
      .returning({
        id: projectObservations.id,
        observation: projectObservations.observation,
        projectId: projectObservations.projectId,
        createdBy: projectObservations.createdBy,
        updatedBy: projectObservations.updatedBy,
        createdAt: projectObservations.createdAt,
        updatedAt: projectObservations.updatedAt,
        deletedAt: projectObservations.deletedAt,
      });
  }

  async getByProjectId(projectId: number): Promise<ProjectObservation[]> {
    return await db
      .select({
        id: projectObservations.id,
        observation: projectObservations.observation,
        projectId: projectObservations.projectId,
        createdBy: projectObservations.createdBy,
        updatedBy: projectObservations.updatedBy,
        createdAt: projectObservations.createdAt,
        updatedAt: projectObservations.updatedAt,
        deletedAt: projectObservations.deletedAt,
        user: usersMapping,
      })
      .from(projectObservations)
      .leftJoin(
        usersMapping,
        eq(usersMapping.keycloakId, projectObservations.createdBy)
      )
      .where(
        and(
          eq(projectObservations.projectId, projectId),
          isNull(projectObservations.deletedAt)
        )
      )
      .orderBy(desc(projectObservations.createdAt));
  }

  async getById(id: number): Promise<ProjectObservation | null> {
    const result = await db
      .select({
        id: projectObservations.id,
        observation: projectObservations.observation,
        projectId: projectObservations.projectId,
        createdBy: projectObservations.createdBy,
        updatedBy: projectObservations.updatedBy,
        createdAt: projectObservations.createdAt,
        updatedAt: projectObservations.updatedAt,
        deletedAt: projectObservations.deletedAt,
      })
      .from(projectObservations)
      .where(
        and(
          eq(projectObservations.id, id),
          isNull(projectObservations.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  async delete(id: number): Promise<void> {
    await db
      .update(projectObservations)
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where(eq(projectObservations.id, id));
  }
}

export const projectObservationRepository = new ProjectObservationRepository();
