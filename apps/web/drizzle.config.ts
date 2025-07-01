import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./infraestructure/database/schemas/migrations",
  schema: "./infraestructure/database/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
