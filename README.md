# EstateIQ

**EstateIQ is a full-stack real-estate marketplace and property management platform built to demonstrate production-oriented software engineering across frontend, backend, security, databases, and distributed systems.**

The platform provides property and listing management, authenticated user workflows, centralized API routing, and a foundation for scalable property search and intelligence features.

The project is designed as a portfolio-scale system rather than a production commercial application, with emphasis on **clean architecture, service boundaries, security, persistence, testing, and deployability**.

---

## Architecture

```text
                         ┌──────────────────────┐
                         │   React + TypeScript  │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Spring Cloud Gateway │
                         │      Port :8080      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             ┌────────────┐ ┌─────────────┐ ┌─────────────┐
             │Auth Service│ │Property     │ │Search       │
             │   :8081    │ │Service :8082│ │Service :8083│
             └─────┬──────┘ └──────┬──────┘ └─────────────┘
                   │                │
                   ▼                ▼
             ┌────────────┐   ┌──────────────┐
             │  Keycloak  │   │ PostgreSQL   │
             │ OAuth2/OIDC│   │ + Flyway     │
             └────────────┘   └──────────────┘
```

Each backend service owns its domain and persistence concerns. Database schemas are isolated between services, and services do not rely on cross-service database foreign keys.

---

## Core Features

### Property & Listing Management

* Create, retrieve, update, and delete properties
* Property ownership enforcement
* Property metadata including:

  * property type
  * bedrooms/bathrooms
  * area
  * location
  * furnishing
  * parking
  * year built
* Listing lifecycle management
* Listing state transitions with domain validation
* Admin-level access controls

### Authentication & Authorization

* OAuth2/OIDC-based authentication through Keycloak
* JWT-based API authentication
* Role-based authorization
* Current-user context derived from authenticated JWT claims
* Ownership-based authorization for user-owned resources

### Backend Architecture

The backend is organized as a Maven multi-module project:

```text
estateiq-backend/
├── common/
├── gateway-service/
├── auth-service/
├── property-service/
├── search-service/
└── data-generator/
```

The services are independently structured Spring Boot applications behind a centralized API Gateway.

### Persistence

* PostgreSQL 16
* Spring Data JPA / Hibernate
* Flyway database migrations
* Schema-per-service persistence boundaries
* Immutable versioned migrations
* DTO-based API contracts

### Testing

* JUnit 5
* Spring Boot Test
* MockMvc
* Spring Security Test
* Testcontainers
* PostgreSQL integration testing

### Observability & Infrastructure

* Spring Boot Actuator
* Micrometer
* Prometheus metrics
* Docker / Docker Compose
* Containerized service builds

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Tailwind CSS
* Zustand
* Leaflet / React Leaflet

### Backend

* Java 21
* Spring Boot 3
* Spring MVC
* Spring Security
* Spring Cloud Gateway
* Spring Data JPA
* Hibernate
* PostgreSQL
* Flyway
* Keycloak
* Maven

### Testing & Infrastructure

* JUnit 5
* MockMvc
* Testcontainers
* Docker
* Docker Compose
* Actuator
* Micrometer
* Prometheus

---

## Engineering Decisions

### Why a Gateway?

The API Gateway provides a single entry point for the frontend and centralizes routing and cross-cutting concerns instead of exposing every backend service directly.

### Why separate services?

Authentication, property management, and search have different responsibilities and scaling characteristics. Separating them establishes explicit domain boundaries while keeping the system small enough to understand and operate.

### Why schema isolation?

Each service owns its persistence model. This prevents services from becoming tightly coupled through direct database relationships.

```text
auth.users
property.properties
property.listings
```

Services communicate through APIs rather than depending on another service's database tables.

### Why Flyway?

Database schema changes are version-controlled and applied through immutable migrations rather than relying on Hibernate to silently modify production schemas.

### Why Keycloak?

Identity management is delegated to a dedicated OAuth2/OIDC identity provider while the services remain responsible for authorization and domain-level access control.

---

## Synthetic Data Generation

EstateIQ includes a dedicated data-generator module for producing deterministic, realistic property and listing data at scale.

The generator uses batched writes rather than inserting records individually, allowing the system to be tested with progressively larger datasets.

Example target scales:

```text
10,000
   ↓
100,000
   ↓
1,000,000+ properties
```

This provides a foundation for evaluating search, pagination, filtering, indexing, and future analytics workloads without depending on proprietary real-estate datasets.

---

## Local Development

### Prerequisites

* Java 21
* Maven
* Node.js
* Docker / Docker Compose

### Start infrastructure

```bash
cd estateiq-backend
docker compose up -d
```

### Build backend

```bash
mvn clean verify
```

### Run frontend

```bash
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

Backend services run on their configured ports, with the API Gateway acting as the public entry point.

---

## Project Status

### Implemented

* React/TypeScript frontend
* Spring Cloud Gateway
* Auth service
* Property service
* Search service foundation
* Keycloak/OAuth2/JWT security
* PostgreSQL persistence
* Flyway migrations
* Ownership and role-based authorization
* Listing lifecycle management
* Integration testing with Testcontainers
* Docker-based infrastructure
* Synthetic data generation
* Basic observability

### Planned / Extension Areas

The architecture is intentionally designed to support additional capabilities such as:

* Advanced property search
* Elasticsearch-based search indexing
* Saved searches and alerts
* Property comparison
* Viewing and inquiry workflows
* Kafka-based domain events
* Redis caching
* Recommendation and valuation models
* AI-assisted property workflows

These are extension areas rather than claims about the current implementation.

---

## What This Project Demonstrates

EstateIQ focuses on practical engineering concepts commonly encountered in backend and full-stack systems:

* Domain-driven service boundaries
* REST API design
* Authentication and authorization
* JWT/OAuth2 security
* Relational data modeling
* Database migrations
* Transactional persistence
* API Gateway routing
* Integration testing
* Containerization
* Observability
* Scalable synthetic data generation

The goal is not to build a commercial real-estate startup, but to demonstrate the ability to **design, implement, test, explain, and deploy a non-trivial full-stack system.**

---

## License

This project is intended as a portfolio and demonstration application.
