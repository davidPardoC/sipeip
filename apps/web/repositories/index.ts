import { MacroSectorRepository } from "./macro-sector.repository";
import { MicroSectorRepository } from "./micro-sector.repository";
import { PublicEntityRepository } from "./public-entity.repository";
import { SectorRepository } from "./sector.repository";
import { OrganizationalUnitRepository } from "./organizational-unit.repository";
import { InstitutionalPlanRepository } from "./institutional-plan.repository";
import { StrategicObjectiveRepository } from "./strategic-objective.repository";
import { ProgramRepository } from "./program.repository";

const macroSectorRepo = new MacroSectorRepository();
const sectorRepo = new SectorRepository();
const microSectorRepo = new MicroSectorRepository();
const publicEntityRepo = new PublicEntityRepository();
const organizationalUnitRepo = new OrganizationalUnitRepository();
const institutionalPlanRepo = new InstitutionalPlanRepository();
const strategicObjectiveRepo = new StrategicObjectiveRepository();
const programRepo = new ProgramRepository();

export { 
  macroSectorRepo, 
  sectorRepo, 
  microSectorRepo, 
  publicEntityRepo, 
  organizationalUnitRepo,
  institutionalPlanRepo,
  strategicObjectiveRepo,
  programRepo
};

export type {
  MacroSectorRepository,
  SectorRepository,
  MicroSectorRepository,
  PublicEntityRepository,
  OrganizationalUnitRepository,
  InstitutionalPlanRepository,
  StrategicObjectiveRepository,
  ProgramRepository,
};
