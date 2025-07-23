import { MacroSectorRepository } from "./macro-sector.repository";
import { MicroSectorRepository } from "./micro-sector.repository";
import { PublicEntityRepository } from "./public-entity.repository";
import { SectorRepository } from "./sector.repository";
import { OrganizationalUnitRepository } from "./organizational-unit.repository";
import { InstitutionalPlanRepository } from "./institutional-plan.repository";
import { StrategicObjectiveRepository } from "./strategic-objective.repository";
import { ProgramRepository } from "./program.repository";
import { ProjectRepository } from "./project.repository";
import { TypologyRepository } from "./typology.repository";
import { OdsGoalRepository } from "./ods-goal.repository";
import { PndObjectiveRepository } from "./pnd-objective.repository";
import { ObjectiveAlignmentRepository } from "./objective-alignment.repository";
import { IndicatorRepository } from "./indicator.repository";
import { GoalRepository } from "./goal.repository";
import { projectObservationRepository } from "./project-observation.repository";
import { ActivityRepository } from "./activity.repository";

const macroSectorRepo = new MacroSectorRepository();
const sectorRepo = new SectorRepository();
const microSectorRepo = new MicroSectorRepository();
const publicEntityRepo = new PublicEntityRepository();
const organizationalUnitRepo = new OrganizationalUnitRepository();
const institutionalPlanRepo = new InstitutionalPlanRepository();
const strategicObjectiveRepo = new StrategicObjectiveRepository();
const programRepo = new ProgramRepository();
const projectRepo = new ProjectRepository();
const typologyRepo = new TypologyRepository();
const odsGoalRepo = new OdsGoalRepository();
const pndObjectiveRepo = new PndObjectiveRepository();
const objectiveAlignmentRepo = new ObjectiveAlignmentRepository();
const indicatorRepo = new IndicatorRepository();
const goalRepo = new GoalRepository();
const activityRepo = new ActivityRepository();

export {
  macroSectorRepo,
  sectorRepo,
  microSectorRepo,
  publicEntityRepo,
  organizationalUnitRepo,
  institutionalPlanRepo,
  strategicObjectiveRepo,
  programRepo,
  projectRepo,
  typologyRepo,
  odsGoalRepo,
  pndObjectiveRepo,
  objectiveAlignmentRepo,
  indicatorRepo,
  goalRepo,
  projectObservationRepository,
  activityRepo
};export type {
  MacroSectorRepository,
  SectorRepository,
  MicroSectorRepository,
  PublicEntityRepository,
  OrganizationalUnitRepository,
  InstitutionalPlanRepository,
  StrategicObjectiveRepository,
  ProgramRepository,
  ProjectRepository,
  TypologyRepository,
  OdsGoalRepository,
  PndObjectiveRepository,
  ObjectiveAlignmentRepository,
  IndicatorRepository,
  GoalRepository,
  ActivityRepository,
};
