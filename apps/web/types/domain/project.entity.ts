import { ProjectStatusEnum } from "../project.status.enum";
import { Program } from "./program.entity";
import { StrategicObjective } from "./strategic-objective.entity";


export interface Project {
  id: number;
  code: string;
  cup: string;
  budget: string;
  startDate: string;
  endDate: string;
  status: ProjectStatusEnum | null;
  programId: number;
  strategicObjectiveId: number;
  typologyId: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface ProjectWithRelations extends Project {
  program?: Program;
  strategicObjective?: StrategicObjective;
  typology?: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
}
