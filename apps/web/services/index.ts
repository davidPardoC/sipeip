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
import { projectObservationService } from "./project-observation.service";

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
  projectObservationService,
};
