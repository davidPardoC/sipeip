import {
  macroSectorRepo,
  microSectorRepo,
  publicEntityRepo,
  sectorRepo,
} from "@/repositories";
import { MacroSectorService } from "./macro-sector.service";
import { MicroSectorService } from "./micro-sector.service";
import { SectorService } from "./sector.service";
import { PublicEntityService } from "./public-entity.service";

const sectorService = new SectorService(sectorRepo);
const macroSectorService = new MacroSectorService(macroSectorRepo);
const microSectorService = new MicroSectorService(microSectorRepo);
const publicEntityService = new PublicEntityService(publicEntityRepo);

export {
  sectorService,
  macroSectorService,
  microSectorService,
  publicEntityService,
};
