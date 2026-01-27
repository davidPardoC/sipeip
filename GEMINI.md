# GEMINI Project Analysis: SIPEiP V2

This document provides a comprehensive overview of the SIPEiP V2 project, intended to be used as a context for AI-driven development and analysis.

## Project Overview

SIPEiP V2 is a full-stack monorepo application built with TypeScript. It is managed using Turborepo and npm workspaces. The project consists of two main applications: a web frontend and a logging backend service.

### Core Technologies

-   **Monorepo:** Turborepo
-   **Package Manager:** npm 8.5.0
-   **Language:** TypeScript
-   **Containerization:** Docker

### Architecture

The project follows a microservices-like architecture with two main components:

1.  **`apps/web` (Frontend):** A [Next.js](https://nextjs.org/) application that serves as the main user interface.
    -   **Framework:** Next.js (v15)
    -   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
    -   **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/) connected to a PostgreSQL database.
    -   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
    -   **Testing:** [Jest](https://jestjs.io/) for unit tests and [Playwright](https://playwright.dev/) for end-to-end tests.

2.  **`apps/logger` (Backend):** A [NestJS](https://nestjs.com/) application responsible for handling application-wide logging.
    -   **Framework:** NestJS
    -   **Messaging:** It listens for events using [Apache Kafka](https://kafka.apache.org/).
    -   **Database:** [Mongoose](https://mongoosejs.com/) connected to a MongoDB database for storing logs.

## Getting Started

Follow these steps to set up the development environment.

### Prerequisites

-   Node.js (version 18 or higher)
-   npm (version 8.5.0 or higher)
-   Docker

### 1. Start Backend Services

The project relies on PostgreSQL, MongoDB, and Kafka. These can be started using the provided Docker Compose configuration.

```bash
docker compose up -d
```

*(Note: The `Readme.md` mentions a `docker-compose.local.yml` file, which was not found. The command above uses the existing `docker-compose.yml`.)*

### 2. Install Dependencies

Install all project dependencies from the root directory.

```bash
npm install
```

### 3. Run for Development

To run all applications (`web` and `logger`) in development mode with hot-reloading, use the `dev` script from the root directory. Turborepo will manage the process.

```bash
npm run dev
```

## Key Commands

Commands can be run from the root directory (which will run them for all apps via Turborepo) or from within the specific app's directory (e.g., `apps/web`).

-   `npm run dev`: Starts all applications in development mode.
-   `npm run build`: Builds all applications for production.
-   `npm run test`: Runs unit tests across the repository.
-   `npm run lint`: Lints the code in the repository.

### Web App (`apps/web`)

-   `npm run dev`: Start the Next.js development server.
-   `npm run build`: Build the Next.js app for production.
-   `npm run start`: Start the production Next.js server.
-   `npm run test`: Run Jest unit tests.
-   `npm run test:e2e`: Run Playwright end-to-end tests.
-   `npm run seed:db`: Seed the PostgreSQL database with initial data.
-   `npm run force:db`: Push Drizzle ORM schema changes to the database.

### Logger App (`apps/logger`)

-   `npm run dev`: Start the NestJS development server with watch mode.
-   `npm run build`: Build the NestJS app for production.
-   `npm run start`: Run the compiled NestJS app.
-   `npm run test`: Run Jest tests.
-   `npm run test:e2e`: Run Jest end-to-end tests.

## Development Conventions

-   **Code Style:** The project uses ESLint for linting and Prettier for code formatting. Configuration can be found in `eslint.config.mjs` and `.prettierrc` files.
-   **Commits:** (Convention not specified, but assume conventional commits are a good practice).
-   **Workspaces:** All shared code should ideally be placed in the `packages/*` workspace, although it is not currently populated. New applications should be added under the `apps/` directory.
