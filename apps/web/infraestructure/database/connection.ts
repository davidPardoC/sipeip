import { drizzle } from "drizzle-orm/postgres-js";
import * as dotenv from "dotenv";
import {
  macroSector,
  microSector,
  sector,
  publicEntity,
  StatusEnum,
  goal,
  indicator,
  institutionalPlan,
  objectiveAlignment,
  odsGoal,
  organizationalUnit,
  pndObjective,
  program,
  project,
  strategicObjective,
  typology,
  attachment,
} from "./schemas/index.ts";
import { usersMapping } from "./schemas/users_mapping.ts";

dotenv.config();

const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
    ssl: false,
  },
  schema: {
    macroSector,
    microSector,
    sector,
    publicEntity,
    StatusEnum,
    goal,
    indicator,
    institutionalPlan,
    objectiveAlignment,
    odsGoal,
    organizationalUnit,
    pndObjective,
    program,
    project,
    strategicObjective,
    typology,
    attachment,
    usersMapping
  },
});

export { db };
