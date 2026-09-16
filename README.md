# EstateIQ

EstateIQ is a full-stack real-estate marketplace and property-management platform. The project combines a modern React/Vite frontend with a modular Java 21 and Spring Boot backend designed around independently deployable services.

## Project Overview

- **Autonomous AI Copilot**: Context-aware agentic workflows for **Buyers**, **Tenants**, **Agents**, and **Landlords/Sellers** with tool execution (property search, mortgage EMI calculator, emergency maintenance triage, listing copy generation, and tour booking).
- **Multi-Persona Enterprise Portals**: Dedicated operational dashboards for Landlords (rent ledger, AI maintenance triage board) and Tenants (active lease, 1-click rent simulation, AI diagnostic tickets).
- **Side-by-Side Comparison Matrix**: In-depth property analytics and AI investment compatibility scoring.
- **Microservice Architecture**: Java 21 and Spring Boot 3.2 backend with Spring Cloud Gateway routing, OAuth2/Keycloak security, and PostgreSQL 16 with Flyway migrations (V1–V4).
- **Testcontainers & Docker**: Integration testing against real PostgreSQL instances with Testcontainers, Prometheus/Grafana observability, and containerized deployment.

> 🌟 **Looking for recruiter-ready resume bullets, architecture diagrams, and demo walkthrough scripts?**
> See [PORTFOLIO_SHOWCASE.md](PORTFOLIO_SHOWCASE.md) for full technical documentation.

## Architecture

```text
React + Vite frontend (Vercel)
              |
              v
     Spring Cloud Gateway
        /       |       \
       v        v        v
   Auth API  Property API  Search API
       \        |        /
        +---- PostgreSQL
              |
           Keycloak
```

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Leaflet and React Leaflet
- Zustand

### Backend

- Java 21
- Spring Boot 3.2
- Spring Cloud Gateway
- Spring Security OAuth2 Resource Server
- Keycloak
- Spring Data JPA and Hibernate
- PostgreSQL 16
- Flyway
- JUnit, MockMvc, and Testcontainers
- Docker, Actuator, Micrometer, and Prometheus

## Repository Structure

```text
EstateIQ/
├── src/                         # React frontend
├── public/                      # Frontend public assets
├── estateiq-backend/
│   ├── gateway-service/         # Public API gateway
│   ├── auth-service/            # User and authentication domain
│   ├── property-service/        # Properties and listings domain
│   ├── search-service/          # Search-service foundation
│   ├── common/                  # Shared backend contracts and security
│   └── docker-compose.yml       # Local infrastructure
├── vercel.json                  # SPA routing for Vercel
└── package.json
```

## Running Locally

### Frontend

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

### Backend infrastructure

```bash
cd estateiq-backend
docker compose up -d
mvn clean verify
```

The local infrastructure includes PostgreSQL, Keycloak, Prometheus, and Grafana. See the [backend README](estateiq-backend/README.md) for environment variables, API endpoints, Docker builds, database design, and service deployment instructions.

## Deployment

- **Frontend:** Deploy the repository root to Vercel with `npm run build` and `dist` as the output directory.
- **Backend:** Deploy the gateway, auth, property, and search services as separate Railway services.
- **Database:** Use Railway PostgreSQL for production persistence.
- **Identity:** Configure Keycloak and set the production `KEYCLOAK_ISSUER_URI`.

Only the gateway should be publicly exposed. Internal services should communicate through Railway private networking where available.

## Engineering Focus

This project demonstrates practical backend and cloud engineering patterns: clear service ownership, centralized API routing, externalized configuration, schema-isolated persistence, immutable database migrations, containerized builds, security boundaries, and integration testing.

## Detailed Documentation

See [estateiq-backend/README.md](estateiq-backend/README.md) for the complete backend architecture and deployment documentation.

## License

This project is intended as a portfolio and demonstration application.
