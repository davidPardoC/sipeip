# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SIPEiP V2 is a TypeScript-based monorepo for managing institutional planning and projects. It uses TurboRepo for monorepo management and consists of two main applications:

- **Web App** (Next.js 15): Main user-facing application for institutional planning management
- **Logger App** (NestJS): Microservice for event logging using Kafka

## Development Commands

### Setup

```bash
# Install dependencies
npm install

# Start infrastructure (Kafka, PostgreSQL, MongoDB)
docker compose up -d
```

### Web App (apps/web)

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Linting
npm run lint

# Testing
npm test                    # Run Jest unit tests
npm run test:e2e           # Run Playwright E2E tests

# Database
npm run seed:db            # Seed database with test data
npm run force:db           # Push Drizzle schema to database
npx drizzle-kit push       # Push schema changes
npx drizzle-kit generate   # Generate migrations
```

### Logger App (apps/logger)

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm test                   # Run Jest unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run E2E tests

# Linting
npm run lint
npm run format
```

## Architecture

### Web Application Structure

The Next.js web app follows a layered architecture with clear separation of concerns:

#### Directory Structure

- **`app/`**: Next.js App Router with file-based routing
  - `app/api/`: REST API routes (Next.js Route Handlers)
  - `app/home/`: Main application pages and features
  - `app/unauthorized/`: Access control pages

- **`infraestructure/`**: Infrastructure and external integrations
  - `database/`: Drizzle ORM setup, schemas, and seeders
  - `kafka/`: Kafka client and event publishers
  - `storage/`: File storage integrations (Supabase)

- **`repositories/`**: Data access layer - contains repository classes that interact with the database
  - Each entity has its own repository file (e.g., `project.repository.ts`, `program.repository.ts`)
  - Repositories handle CRUD operations and complex queries

- **`services/`**: Business logic layer
  - Services extend `BaseService` which provides `emitLogEvent()` for Kafka event publishing
  - Each service corresponds to a domain entity and uses repositories for data access
  - Services emit audit events via Kafka for all mutations

- **`components/`**: Shared React components

- **`ui/`**: Radix UI-based component library (shadcn/ui pattern)

- **`types/`**: TypeScript type definitions
  - `domain/`: Domain entity types
  - `event.types.ts`: Kafka event constants

- **`hooks/`**: React custom hooks

- **`lib/`**: Utility functions

- **`constants/`**: Application constants

#### Authentication

- Uses **NextAuth.js v5** with **Keycloak** provider
- JWT-based sessions with role extraction from Keycloak tokens
- User sign-ins trigger:
  1. Database insert to `users_mapping` table
  2. Kafka event publication for audit logging
- Middleware in `middleware.ts` protects routes

#### Database

- **ORM**: Drizzle ORM with PostgreSQL
- **Connection**: Configured in `infraestructure/database/connection.ts`
- **Schemas**: Located in `infraestructure/database/schemas/`
- **Migrations**: Generated in `infraestructure/database/schemas/migrations/`
- Key entities: institutional plans, programs, projects, strategic objectives, indicators, goals, activities, ODS goals, PND objectives, typologies, sectors, public entities

#### Event-Driven Architecture

The web app publishes audit events to Kafka for all mutations:

- **Publisher**: `infraestructure/kafka/kafka.publisher.ts`
- **Topic**: `event-log-core`
- **Event Types**: Defined in `types/event.types.ts` (LOG_EVENTS)
- **Pattern**: Services extend `BaseService` which provides `emitLogEvent()` helper
- Events include: userId, timestamp, resourceId, before/after snapshots, event type

#### API Layer

- REST API using Next.js Route Handlers in `app/api/`
- Pattern: Each route calls corresponding service methods
- Services handle business logic and emit Kafka events
- Repositories handle data access

### Logger Application

A NestJS microservice that consumes events from Kafka and stores them in MongoDB:

- **Entry Point**: `src/main.ts` - Creates both a Kafka microservice (consumer) and HTTP API
- **Port**: 5500 (HTTP API)
- **Kafka Consumer Group**: `sipeip_logger`
- **Storage**: MongoDB via Mongoose
- **Module**: `src/logging/` contains controller, service, and schema
- **Pattern**: Listens to Kafka events and persists to MongoDB for audit trail

### Infrastructure Services

The `docker-compose.yml` provides:
- **PostgreSQL**: Port 5432 (web app database)
- **MongoDB**: Port 27017 (logger storage)
- **Kafka**: Port 9094 (external), 9092 (internal) - Event streaming

## Key Patterns

### Service Layer Pattern

Services inherit from `BaseService` to gain event publishing capability:

```typescript
class MyService extends BaseService {
  async create(data) {
    // Business logic
    const result = await repository.create(data);

    // Emit event
    await this.emitLogEvent({
      event: LOG_EVENTS.MY_ENTITY.CREATE,
      resourceId: result.id,
      after: result,
    });

    return result;
  }
}
```

### Repository Pattern

Repositories encapsulate database queries using Drizzle ORM:

```typescript
class MyRepository {
  async findById(id: number) {
    return db.query.myEntity.findFirst({ where: eq(myEntity.id, id) });
  }
}
```

## Environment Variables

### Web App

Required environment variables (create `.env` in `apps/web/`):
- `DATABASE_URL`: PostgreSQL connection string
- Keycloak configuration for NextAuth.js
- Supabase credentials for file storage

### Logger App

Environment variables are configured inline in the code for Kafka and MongoDB connections.

## Testing

- **Web**: Jest for unit tests, Playwright for E2E
- **Logger**: Jest for unit and E2E tests
- Test files use `.spec.ts` extension

## Domain Model

The application manages institutional planning with hierarchical relationships:

- **Institutional Plans** → contain Strategic Objectives
- **Strategic Objectives** → contain Programs
- **Programs** → contain Projects
- **Projects** → contain Indicators → contain Goals → contain Activities
- **Alignment**: Projects align with ODS Goals and PND Objectives
- **Organization**: Entities, Sectors (Macro/Micro), and Organizational Units

PDF report generation is available for programs and activities.
