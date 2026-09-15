# EstateIQ Enterprise Backend

This repository contains the backend services for EstateIQ, an enterprise-grade real estate marketplace and property management platform.

## Architecture

The backend follows a microservices architecture, orchestrated via Spring Cloud Gateway. Services are grouped by domain to ensure independent deployability, while sharing common utilities (like DTOs and Exception Handling) via the `common` module.

### Services (Phase 1 Foundation)

1. **gateway-service**: The unified API entry point handling routing, CORS, and acting as the public perimeter.
2. **auth-service**: The security boundary responsible for Keycloak identity integration and OAuth2/JWT resource server enforcement.
3. **property-service**: The core domain managing properties, listings, and real estate metadata using PostgreSQL and Flyway.
4. **search-service**: The domain boundary prepared for future Elasticsearch/advanced query integrations.

## Technology Stack

- **Core**: Java 21, Spring Boot 3.2.x, Maven
- **Database**: PostgreSQL 16
- **Migrations**: Flyway
- **Security**: Keycloak (OIDC), Spring Security OAuth2 Resource Server
- **Observability**: Spring Boot Actuator, Micrometer, Prometheus, Grafana
- **Infrastructure**: Docker, Docker Compose

## Project Structure

```
estateiq-backend/
├── common/                  # Shared exceptions, standard DTOs
├── gateway-service/         # Spring Cloud Gateway
├── auth-service/            # Keycloak/JWT foundation
├── property-service/        # PostgreSQL + JPA + Flyway (Properties Domain)
├── search-service/          # Skeleton for future advanced search
├── docker-compose.yml       # Infrastructure provisioning
└── pom.xml                  # Parent POM
```

## Local Development

### 1. Provision Infrastructure
Run the following command to spin up PostgreSQL, Keycloak, Prometheus, and Grafana:
```bash
docker compose up -d
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env` in the root of `estateiq-backend` to configure environment overrides. 
By default, the services fallback to localhost connections:
- **PostgreSQL**: `jdbc:postgresql://localhost:5432/estateiq_db` (User: `estateiq`, Password: `estateiq_password`)
- **Keycloak**: Running on `http://localhost:8080` (Admin: `admin` / `admin`)

### 3. Build & Test
```bash
mvn clean verify
```

### 4. Build Service Docker Images
Each microservice contains a multi-stage Dockerfile that correctly resolves the monorepo dependencies. Build them via:
```bash
docker build -t estateiq-gateway-service -f gateway-service/Dockerfile .
docker build -t estateiq-property-service -f property-service/Dockerfile .
```

### 4. Run Services
You can run each service via your IDE, or using Maven:
```bash
cd property-service
mvn spring-boot:run
```

## Database Migrations

Database schemas are strictly managed using **Flyway**. Manual schema modification via Hibernate (`ddl-auto=update`) is disabled in favor of `validate`. 
Migration files are located in `property-service/src/main/resources/db/migration`.

## Security

EstateIQ implements Role-Based Access Control (RBAC) via Keycloak.
- **Roles Provided**: `BUYER`, `TENANT`, `LANDLORD`, `AGENT`, `PROPERTY_MANAGER`, `ADMIN`
- **Validation**: Incoming requests via the Gateway are validated using JWTs. The Gateway routes to the internal microservices, which use Spring Security Resource Server configurations to parse claims.

## CI/CD Foundation

GitHub Actions are configured in `.github/workflows/backend-ci.yml` to automatically execute `mvn clean verify` on all branches and pull requests to `main`.
