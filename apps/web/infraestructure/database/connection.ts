import { drizzle } from "drizzle-orm/postgres-js";
import { macroSector, microSector, sector } from "./schemas/index";

const db = drizzle({
  connection: {
    url: process.env.AUTH_DRIZZLE_URL,
    ssl: false,
  },
  schema: {
    macroSector,
    microSector,
    sector,
  },
});

export { db };
