# EstateIQ Backend

EstateIQ is a real-estate marketplace and property-management platform built as a modular Spring Boot backend. It provides a single API gateway for the web client while keeping authentication, property management, and search capabilities independently deployable.

The project is designed to demonstrate production-minded backend engineering: service boundaries, centralized routing, JWT resource-server security, database migrations, integration testing, containerized builds, and cloud deployment.

## Highlights

- Microservice architecture with a dedicated Spring Cloud Gateway
- Java 21 and Spring Boot 3.2
- OAuth2/JWT validation through Keycloak
- PostgreSQL persistence with Flyway migrations
- Separate `auth` and `property` database schemas
- Testcontainers-backed PostgreSQL integration tests
- Docker images for each deployable service
- Actuator health endpoints and Prometheus metrics
- CORS configuration for a separately deployed Vercel frontend
- Railway-ready deployment model for backend services

## Architecture

```text
Vercel frontend
       |
       v
Gateway Service :8080
   |       |       |
   v       v       v
 Auth   Property  Search
 :8081    :8082   :8083
   |        |
   +--------+-----> PostgreSQL

      Keycloak
```

### Services

| Service | Port | Responsibility |
| --- | ---: | --- |
| `gateway-service` | `8080` | Public API boundary, routing, CORS, and service composition |
| `auth-service` | `8081` | Current-user profile operations and authentication-domain persistence |
| `property-service` | `8082` | Property and listing management backed by PostgreSQL |
| `data-generator` | - | Standalone synthetic property and listing data CLI |
| `search-service` | `8083` | Search-service foundation for future advanced search capabilities |
| `common` | - | Shared security configuration, DTOs, exceptions, and utilities |

Keycloak is an external identity provider. The services validate access tokens as OAuth2 resource servers; they do not store passwords or implement custom authentication flows.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Language and runtime | Java 21 |
| Application framework | Spring Boot 3.2, Spring Cloud Gateway |
| Persistence | Spring Data JPA, Hibernate, PostgreSQL 16 |
| Database migrations | Flyway |
| Security | Spring Security, OAuth2 Resource Server, Keycloak |
| Testing | JUnit, Spring Boot Test, MockMvc, Testcontainers |
| Operations | Spring Actuator, Micrometer, Prometheus |
| Packaging | Maven, Docker |
| Deployment | Railway backend services, Vercel frontend |

## API Surface

All browser traffic should go through the gateway.

### Property API

```text
GET    /api/v1/properties/health
GET    /api/v1/properties/search?city=Mumbai&listingType=SALE
GET    /api/v1/properties
POST   /api/v1/properties
GET    /api/v1/properties/{id}
PATCH  /api/v1/properties/{id}
DELETE /api/v1/properties/{id}
POST   /api/v1/properties/{propertyId}/listings
GET    /api/v1/properties/listings/{listingId}
PATCH  /api/v1/properties/listings/{listingId}/status
PATCH  /api/v1/properties/listings/{listingId}/moderate
```

### User API

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me
```

Protected endpoints require a valid bearer token issued by the configured Keycloak realm.

## Local Development

### Prerequisites

- Java 21
- Maven 3.9+
- Docker Desktop with Docker Compose
- A Keycloak realm named `estateiq` when testing secured flows

### Start infrastructure

From this directory:

```bash
docker compose up -d
```

This starts PostgreSQL, Keycloak, Redis, Kafka, Prometheus, and Grafana. Redis is available for opt-in cache profiles; Kafka receives listing lifecycle events when `ESTATEIQ_EVENTS_ENABLED=true`.

### Configure the services

The services use environment variables with local development defaults. Copy `.env.example` as a reference and configure the variables in your IDE, shell, or service runner.

Important local values:

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/estateiq_db
DATABASE_USERNAME=estateiq
DATABASE_PASSWORD=estateiq_password
KEYCLOAK_ISSUER_URI=http://localhost:8080/realms/estateiq
CORS_ALLOWED_ORIGINS=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:8081
PROPERTY_SERVICE_URL=http://localhost:8082
SEARCH_SERVICE_URL=http://localhost:8083
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
ESTATEIQ_EVENTS_ENABLED=false
```

### Build and test

```bash
mvn clean verify
```

Run one service locally with:

```bash
cd property-service
mvn spring-boot:run
```

The same command can be used from `auth-service`, `gateway-service`, or `search-service`.

## Docker Builds

Build commands must be run from the `estateiq-backend` directory because each Dockerfile copies the multi-module Maven project:

```bash
docker build -t estateiq-gateway -f gateway-service/Dockerfile .
docker build -t estateiq-auth -f auth-service/Dockerfile .
docker build -t estateiq-property -f property-service/Dockerfile .
docker build -t estateiq-search -f search-service/Dockerfile .
```

Each image uses a Maven build stage and a smaller Java 21 runtime stage running as a non-root user.

## Deployment

### Frontend on Vercel

Deploy the repository root as a Vite application:

```text
Build command: npm run build
Output directory: dist
```

The root `vercel.json` provides an SPA fallback for client-side routes.

### Backend on Railway

Create separate Railway services for:

1. `gateway-service` - the only publicly exposed backend service
2. `auth-service`
3. `property-service`
4. `search-service`
5. PostgreSQL
6. Keycloak, if hosted as part of the deployment

For each application service, use `estateiq-backend` as the build context and select its service Dockerfile. Configure Railway to pass the assigned service port through `PORT` if required by the platform; the application defaults are `8080`, `8081`, `8082`, and `8083` respectively.

Gateway variables:

```text
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
AUTH_SERVICE_URL=http://auth-service:8081
PROPERTY_SERVICE_URL=http://property-service:8082
SEARCH_SERVICE_URL=http://search-service:8083
```

Database-backed services:

```text
DATABASE_URL=jdbc:postgresql://your-postgres-host:5432/estateiq_db
DATABASE_USERNAME=your-postgres-user
DATABASE_PASSWORD=your-postgres-password
KEYCLOAK_ISSUER_URI=https://your-keycloak-host/realms/estateiq
```

Use Railway private networking for internal service URLs where available. Only the gateway URL should be used by the frontend.

## Database Design

Flyway owns schema changes. The database uses separate schemas to keep service ownership explicit:

- `auth` - users and authentication-domain migration history
- `property` - properties, listings, and property-domain migration history

Hibernate is configured with `ddl-auto=validate`; it does not modify production schemas. Applied migrations are immutable and should not be edited after deployment.

## Observability

Each Spring Boot service exposes health and metrics endpoints through Actuator. Prometheus-compatible metrics are available under:

```text
/actuator/health
/actuator/metrics
/actuator/prometheus
```

For local development, Prometheus is available on port `9090` and Grafana on port `3001` after `docker compose up -d`.

## Testing Strategy

- Unit and web-layer tests validate controller behavior and security rules.
- MockMvc tests cover authenticated and unauthenticated request paths.
- Testcontainers starts a real PostgreSQL instance for persistence integration tests.
- Flyway migrations run against the test database to catch schema and mapping issues early.

Run the complete verification suite with:

```bash
mvn clean verify
```

## Project Structure

```text
estateiq-backend/
├── common/                  # Shared application contracts and security configuration
├── gateway-service/         # Public Spring Cloud Gateway
├── auth-service/            # User and authentication domain
├── property-service/       # Properties and listings domain
├── data-generator/         # Standalone synthetic data CLI
├── search-service/          # Search-service foundation
├── docker-compose.yml       # Local infrastructure
├── .env.example             # Environment variable reference
└── pom.xml                  # Maven multi-module parent
```

## Engineering Notes

- The gateway is the public perimeter; internal services should not be exposed directly.
- Secrets and database credentials belong in environment variables or a managed secret store.
- CORS should contain only the deployed frontend origins in production.
- Database migrations should be reviewed and tested before release.
- The current search module is intentionally a foundation for adding an indexed search implementation later.

## License

This project is intended as a portfolio and demonstration application.
