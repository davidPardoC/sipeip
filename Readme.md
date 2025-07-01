# SIPEiP V2

This is the sipeip v2 mono repo, which contains the code for the sipeip v2 app.

All the code is written in TypeScript and uses TurboRepo for managing the monorepo structure.

The code has 2 main parts:

- apps:
  - web (Next.js): The web app, which is the main app that users interact with.
  - logger (NestJs): The logger app, which is used to log events and errors in the web app uses kafka to listen events.
- packages: All common code that is shared between the web and logger

### Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm (Node Package Manager)
- TurboRepo (for managing the monorepo)
- Docker (for running Kafka and Postgres)

### Setting up the environment

Start development containers using Docker. This will set up Kafka and Postgres for you.

```bash
docker compose -f ./docker-compose.local.yml  up -d
```

### Installation

To install the dependencies, run the following command in the root of the monorepo:

```bash
npm install
```

### Running the apps

To run the apps, you can use the following commands:

#### Web App

To run the web app, use the following command:

```bash
npm run dev
```

### Logger App

To run the logger app, use the following command:

```bash
npm run dev
```
