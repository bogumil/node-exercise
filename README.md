# Server-node Exercise

REST API for managing Users, Organizations, and Orders using Node.js, TypeScript, Express, Sequelize, and MySQL.

## Requirements

- Node.js 22+ or 24+
- npm
- Docker and Docker Compose

## Environment Files

This project uses separate env files for local development and Docker-based execution.

Create local development env:
```bash
cp .env.local.example .env.local
```

Create Docker env:
```bash
cp .env.docker.example .env.docker
```
Local development uses ```MYSQL_HOST=localhost``` because the app runs on your machine.
Docker execution uses ```MYSQL_HOST=database``` because the app runs inside Docker Compose and connects to the MySQL service by service name.

## Run Locally
Start only the MySQL database:
```bash
docker compose --env-file .env.local -f docker-compose.local.yaml up -d
```

Install dependencies:
```bash
npm install
```

Run the API in development mode:
```bash
npm run dev
```
The API will be available at:```http://localhost:3001```

### API Documentation

Swagger UI will be available at:```http://localhost:3001/swagger```

OpenAPI JSON will be available at:```http://localhost:3001/swagger/json```

## Run With Docker
Build and run the production-like stack, including the app and MySQL:
```bash
docker compose --env-file .env.docker -f docker-compose.yaml up --build -d
```

The API will be available at:```http://localhost:3000```

Stop the stack:
```bash
docker compose --env-file .env.docker -f docker-compose.yaml down
```
Remove Docker volumes if you want a clean database:
```bash
docker compose --env-file .env.docker -f docker-compose.yaml down -v
```

## Health Checks
Liveness probe:
```GET /health```
Readiness probe:
```GET /readiness```
The readiness endpoint checks whether required dependencies are available, including the database and cache layer.

## Seed Data
Run the seed script after the database is available:
For local:
```
npm run seed
```
For docker application
```
npm run seed:docker
```
The seed script creates:
- 2 organizations
- 10 users
- 20 orders

## Tests
Run the unit test suite:
```
npm test
```
Run tests with coverage:
```
npm run test:coverage
```
Run TypeScript validation:
```
npm run typecheck
```
Run lint/format checks:
```
npm run check
```

## Design Decisions

## ORM
Sequelize is used as the ORM for MySQL access. Models are defined separately from route handlers, and database access is isolated behind repository modules.

## Layering
The codebase separates responsibilities into:
- Routes: HTTP route registration and OpenAPI metadata
- Controllers: request/response handling
- Services: business rules and validation that requires data access
- Repositories: Sequelize access
- Schemas: request validation and response DTO definitions
- Middleware: validation, logging, and error handling

## DTOs
Sequelize model instances are not returned directly from controllers. Responses are mapped to DTO-shaped plain objects before being sent to clients.

## Error Handling
The API uses centralized error middleware. Expected errors return structured JSON responses, including validation errors, not-found errors, and conflicts.
Unexpected errors return:
```json
{
  "status": 500,
  "message": "Internal server error"
}
```
## Logging
Pino is used for structured logging.
- Database state changes are logged at info level.
- HTTP request and response headers are logged at debug level.
- Sensitive headers such as authorization and cookies are redacted.

## Caching
- User and Organization responses can be cached by clients for 10 minutes.
- Order responses can use ETag-based caching and return 304 Not Modified when the client already has a current representation.
- Server-side GET response caching is implemented with an in-memory cache using a 10-minute TTL.
