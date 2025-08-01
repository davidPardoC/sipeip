import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "next-auth/providers/credentials":
      "<rootDir>/next-auth-credentials.ts",
    "next-auth": "<rootDir>/next-auth.ts",
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: ["/node_modules/(?!(next-auth)/)"],
  setupFilesAfterEnv: ["<rootDir>/setup.jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/e2e"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
