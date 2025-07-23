import {
  macroSectorRepo,
  microSectorRepo,
  publicEntityRepo,
  sectorRepo,
  organizationalUnitRepo,
  institutionalPlanRepo,
  strategicObjectiveRepo,
  programRepo,
  projectRepo,
  typologyRepo,
  odsGoalRepo,
  pndObjectiveRepo,
  indicatorRepo,
  goalRepo,
  activityRepo,
} from "@/repositories";
import { MacroSectorService } from "./macro-sector.service";
import { MicroSectorService } from "./micro-sector.service";
import { SectorService } from "./sector.service";
import { PublicEntityService } from "./public-entity.service";
import { OrganizationalUnitService } from "./organizational-unit.service";
import { InstitutionalPlanService } from "./institutional-plan.service";
import { StrategicObjectiveService } from "./strategic-objective.service";
import { ProgramService } from "./program.service";
import { ProjectService } from "./project.service";
import { TypologyService } from "./typology.service";
import { OdsGoalService } from "./ods-goal.service";
import { PndObjectiveService } from "./pnd-objective.service";
import { ObjectiveAlignmentService } from "./objective-alignment.service";
import { IndicatorService } from "./indicator.service";
import { GoalService } from "./goal.service";
import { projectObservationService } from "./project-observation.service";
import { ActivityService } from "./activity.service";

const sectorService = new SectorService(sectorRepo);
const macroSectorService = new MacroSectorService(macroSectorRepo);
const microSectorService = new MicroSectorService(microSectorRepo);
const publicEntityService = new PublicEntityService(publicEntityRepo);
const organizationalUnitService = new OrganizationalUnitService(organizationalUnitRepo);
const institutionalPlanService = new InstitutionalPlanService(institutionalPlanRepo);
const strategicObjectiveService = new StrategicObjectiveService(strategicObjectiveRepo);
const programService = new ProgramService(programRepo);
const projectService = new ProjectService(projectRepo);
const typologyService = new TypologyService(typologyRepo);
const odsGoalService = new OdsGoalService(odsGoalRepo);
const pndObjectiveService = new PndObjectiveService(pndObjectiveRepo);
const objectiveAlignmentService = new ObjectiveAlignmentService();
const indicatorService = new IndicatorService(indicatorRepo);
const goalService = new GoalService(goalRepo);
const activityService = new ActivityService(activityRepo);

export {
  sectorService,
  macroSectorService,
  microSectorService,
  publicEntityService,
  organizationalUnitService,
  institutionalPlanService,
  strategicObjectiveService,
  programService,
  projectService,
  typologyService,
  odsGoalService,
  pndObjectiveService,
  objectiveAlignmentService,
  indicatorService,
  goalService,
  projectObservationService,
  activityService,
};
