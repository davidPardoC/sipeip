import { seedOds } from "./ods.seeder.ts";
import { seedPndObjectives } from "./pnd-objectives.seeders.ts";
import { seedAllSectors } from "./sectores.seeder.ts";
import { seedTypologies } from "./typologoy.seeder.ts";
import { seedComplianceData } from "./compliance.seeder.ts";


const seed = async () => {
  console.log("Seeding Initiated...");
  await Promise.all([
    seedTypologies(),
    seedOds(),
    seedAllSectors(),
    seedPndObjectives(),
    seedComplianceData(),
  ]);
  console.log("Seeding completed.");
  process.exit(0);
};

seed();
