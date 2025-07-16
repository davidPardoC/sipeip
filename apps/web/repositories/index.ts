import { MacroSectorRepository } from "./macro-sector.repository";
import { MicroSectorRepository } from "./micro-sector.repository";
import { PublicEntityRepository } from "./public-entity.repository";
import { SectorRepository } from "./sector.repository";

const macroSectorRepo = new MacroSectorRepository();
const sectorRepo = new SectorRepository();
const microSectorRepo = new MicroSectorRepository();
const publicEntityRepo = new PublicEntityRepository();

export { macroSectorRepo, sectorRepo, microSectorRepo, publicEntityRepo };

export type {
  MacroSectorRepository,
  SectorRepository,
  MicroSectorRepository,
  PublicEntityRepository,
};
