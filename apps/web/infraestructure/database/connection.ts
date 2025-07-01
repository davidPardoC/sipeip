import { drizzle } from "drizzle-orm/postgres-js";
import {
  users,
  accounts,
  sessions,
  authenticators,
  verificationTokens,
} from "./schemas/auth";
const db = drizzle({
  connection: {
    url: process.env.AUTH_DRIZZLE_URL,
    ssl: false,
  },
  schema: {
    ...users,
    ...accounts,
    ...sessions,
    ...authenticators,
    ...verificationTokens,
  },
});

export { db };
