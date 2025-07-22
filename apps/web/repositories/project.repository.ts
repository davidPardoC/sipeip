import { db } from "@/infraestructure/database/connection";
import {
  project,
  program,
  strategicObjective,
  typology,
} from "@/infraestructure/database/schemas";
import { Project, ProjectWithRelations } from "@/types/domain/project.entity";
import { ProjectStatusEnum } from "@/types/project.status.enum";
import { and, desc, eq, isNull, ne } from "drizzle-orm";

export class ProjectRepository {
  // Create a new project
  create(projectCreate: Partial<Project>) {
    return db
      .insert(project)
      .values(projectCreate as typeof project.$inferInsert)
      .returning();
  }

  // Get all projects (not deleted)
  async getAll(): Promise<ProjectWithRelations[]> {
    const result = await db
      .select({
        id: project.id,
        code: project.code,
        cup: project.cup,
        budget: project.budget,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        programId: project.programId,
        strategicObjectiveId: project.strategicObjectiveId,
        typologyId: project.typologyId,
        createdBy: project.createdBy,
        updatedBy: project.updatedBy,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        deletedAt: project.deletedAt,
        program: {
          id: program.id,
          name: program.name,
          budget: program.budget,
          startDate: program.startDate,
          endDate: program.endDate,
          status: program.status,
        },
        strategicObjective: {
          id: strategicObjective.id,
          code: strategicObjective.code,
          name: strategicObjective.name,
          description: strategicObjective.description,
          status: strategicObjective.status,
        },
        typology: {
          id: typology.id,
          code: typology.code,
          name: typology.name,
          description: typology.description,
        },
      })
      .from(project)
      .leftJoin(program, eq(project.programId, program.id))
      .leftJoin(
        strategicObjective,
        eq(project.strategicObjectiveId, strategicObjective.id)
      )
      .leftJoin(typology, eq(project.typologyId, typology.id))
      .where(isNull(project.deletedAt))
      .orderBy(desc(project.updatedAt));

    return result as ProjectWithRelations[];
  }

  // Get project by ID
  async getById(id: number): Promise<ProjectWithRelations | undefined> {
    const result = await db
      .select({
        id: project.id,
        code: project.code,
        cup: project.cup,
        budget: project.budget,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        programId: project.programId,
        strategicObjectiveId: project.strategicObjectiveId,
        typologyId: project.typologyId,
        createdBy: project.createdBy,
        updatedBy: project.updatedBy,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        deletedAt: project.deletedAt,
        program: {
          id: program.id,
          name: program.name,
          budget: program.budget,
          startDate: program.startDate,
          endDate: program.endDate,
          status: program.status,
        },
        strategicObjective: {
          id: strategicObjective.id,
          code: strategicObjective.code,
          name: strategicObjective.name,
          description: strategicObjective.description,
          status: strategicObjective.status,
        },
        typology: {
          id: typology.id,
          code: typology.code,
          name: typology.name,
          description: typology.description,
        },
      })
      .from(project)
      .leftJoin(program, eq(project.programId, program.id))
      .leftJoin(
        strategicObjective,
        eq(project.strategicObjectiveId, strategicObjective.id)
      )
      .leftJoin(typology, eq(project.typologyId, typology.id))
      .where(and(eq(project.id, id), isNull(project.deletedAt)))
      .limit(1);

    return result[0] as ProjectWithRelations | undefined;
  }

  // Get projects by program ID
  async getByProgramId(programId: number): Promise<ProjectWithRelations[]> {
    const result = await db
      .select({
        id: project.id,
        code: project.code,
        cup: project.cup,
        budget: project.budget,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        programId: project.programId,
        strategicObjectiveId: project.strategicObjectiveId,
        typologyId: project.typologyId,
        createdBy: project.createdBy,
        updatedBy: project.updatedBy,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        deletedAt: project.deletedAt,
        program,
        strategicObjective,
        typology,
      })
      .from(project)
      .leftJoin(program, eq(project.programId, program.id))
      .leftJoin(
        strategicObjective,
        eq(project.strategicObjectiveId, strategicObjective.id)
      )
      .leftJoin(typology, eq(project.typologyId, typology.id))
      .where(and(eq(project.programId, programId), isNull(project.deletedAt)))
      .orderBy(desc(project.updatedAt));

    return result as ProjectWithRelations[];
  }

  // Update a project
  update(id: number, data: Partial<Project>) {
    return db
      .update(project)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      } as typeof project.$inferInsert)
      .where(eq(project.id, id))
      .returning();
  }

  // Soft delete a project
  delete(id: number) {
    return db
      .update(project)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(project.id, id))
      .returning();
  }

  // Get projects by status
  getByStatus(status: ProjectStatusEnum ) {
    return db.query.project.findMany({
      where: and(eq(project.status, status), isNull(project.deletedAt)),
      orderBy: [desc(project.updatedAt)],
    });
  }

  // Check if a code already exists
  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    let whereConditions = and(
      eq(project.code, code),
      isNull(project.deletedAt)
    );

    if (excludeId) {
      whereConditions = and(
        eq(project.code, code),
        isNull(project.deletedAt),
        ne(project.id, excludeId)
      );
    }

    const result = await db.query.project.findFirst({
      where: whereConditions,
    });

    return !!result;
  }

  // Check if a CUP already exists
  async cupExists(cup: string, excludeId?: number): Promise<boolean> {
    let whereConditions = and(eq(project.cup, cup), isNull(project.deletedAt));

    if (excludeId) {
      whereConditions = and(
        eq(project.cup, cup),
        isNull(project.deletedAt),
        ne(project.id, excludeId)
      );
    }

    const result = await db.query.project.findFirst({
      where: whereConditions,
    });

    return !!result;
  }
}
