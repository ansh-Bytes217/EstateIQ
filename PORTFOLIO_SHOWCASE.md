# 🏢 EstateIQ — Enterprise Architecture & Portfolio Showcase

> **EstateIQ** is an enterprise-grade, full-stack real-estate platform engineered with a **Java 21 / Spring Boot 3.2** microservice architecture and a **React 19 / Vite** frontend. It features an **autonomous multi-persona AI Copilot** that streamlines workflows for **Buyers**, **Tenants**, **Real Estate Agents**, and **Landlords/Sellers**.

---

## 💼 Resume-Ready Bullet Points

### For Full-Stack / Software Engineering Roles
- **Architected a modular microservices platform** using **Java 21**, **Spring Boot 3.2**, and **Spring Cloud Gateway**, deploying independently scalable domain services (Gateway, Auth, Property Management, Search) behind a centralized reverse proxy with CORS and rate-limiting.
- **Engineered an autonomous AI Copilot** utilizing **Google Gemini** (`@google/genai`) and structured tool-calling routines to dynamically execute live actions: semantic property querying, mortgage & EMI amortization, tenant maintenance triage, and automated MLS listing copy generation.
- **Designed multi-tenant PostgreSQL persistence** with **Flyway** database migrations (V1–V4), maintaining strict schema isolation between auth and property domains, and validated resilience via **Testcontainers** integration testing.
- **Developed a responsive, high-performance UI** using **React 19**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **TanStack Query**, reducing client-side bundle load times and delivering interactive **Leaflet** geospatial mapping.
- **Implemented zero-trust OAuth2 / JWT security** integrating **Keycloak 24** as an identity provider, enforcing role-based access control (RBAC) across Buyer, Tenant, Agent, and Landlord personas.

### For AI / Machine Learning Engineer Roles
- **Designed an Agentic Tool Execution Engine** enabling multi-turn conversation orchestration with deterministic client-side fallbacks, supporting context-aware system prompts and JSON-schema-driven function calling.
- **Built an automated maintenance triage pipeline** that diagnoses tenant repair symptoms, categorizes trade disciplines (Plumbing, HVAC, Electrical), computes incident severity (Critical, High, Routine), and estimates contractor resolution times.
- **Created a Comparative Market Analysis (CMA) valuation model** synthesizing property square footage, regional micro-market appreciation trends, and rental yield metrics into actionable investment scores.

---

## 🏛️ System Architecture

```text
                                  +---------------------------------------+
                                  |     React 19 + TypeScript Client      |
                                  |    (Tailwind CSS, Zustand, Leaflet)   |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS / REST
                                                      v
                                  +---------------------------------------+
                                  |   Spring Cloud Gateway (Port 8080)    |
                                  |      Routing, CORS, Token Relay       |
                                  +---------+-----------+-----------+-----+
                                            |           |           |
                     +----------------------+           |           +----------------------+
                     |                                  |                                  |
                     v                                  v                                  v
+-----------------------------+    +-----------------------------+    +-----------------------------+
|    Auth Service (:8081)     |    |   Property Service (:8082)  |    |   Search Service (:8083)    |
| - Profile & User domain     |    | - Listings & Specifications |    | - High-throughput search    |
| - Spring Security OAuth2    |    | - Spring Data JPA/Hibernate |    | - Filter aggregation engine |
+--------------+--------------+    +--------------+--------------+    +-----------------------------+
               |                                  |
               v                                  v
+-----------------------------+    +-----------------------------+    +-----------------------------+
|      Keycloak 24 (:8080)    |    |   PostgreSQL 16 Database    |    |   Prometheus & Grafana      |
| - OpenID Connect & OAuth2   |    | - Flyway Migrations (V1-V4) |    | - Micrometer Metrics        |
| - JWT Token Issuer          |    | - 'auth' & 'property' schemas|   | - Latency & Health Probes   |
+-----------------------------+    +-----------------------------+    +-----------------------------+
```

---

## 🤖 The Multi-Persona Agentic Flow

EstateIQ introduces a context-aware **AI Copilot** (`⌘K` or floating trigger) equipped with tool-calling capabilities tailored to four distinct personas:

| Persona | Core Problems Solved | AI Agentic Tools Executed |
| :--- | :--- | :--- |
| **Buyer** | Overwhelming search filters, uncertain financing | `search_properties(criteria)` — returns interactive property mini-cards in-chat<br>`calculate_mortgage(price, downPayment, rate)` — interactive EMI & Cap Rate widget |
| **Tenant** | Slow emergency repair response, confusing leases | `triage_maintenance(category, issue, severity)` — emergency diagnosis & work order dispatch<br>`analyze_lease_clause(text)` — plain-English liability & risk breakdown |
| **Agent** | Lead follow-up friction, tedious MLS descriptions | `generate_listing_copy(specs)` — SEO headlines, marketing description & bullet points<br>`schedule_tour(propertyId, date, time)` — instant digital gate pass |
| **Landlord / Seller** | Rental yield uncertainty, tenant screening | `calculate_rental_yield()` — cash flow & cap rate benchmark<br>`send_ai_payment_reminder()` — automated rent follow-up |

---

## 🧭 Live Demo Walkthrough (For Technical Screens)

When presenting this project to interviewers, follow this **3-minute walkthrough sequence**:

### 1. Multi-Persona Role Switching (0:00 - 0:45)
- Open the application at `http://localhost:3000`.
- In the top navigation bar, click the user profile icon and switch between roles:
  - **Buyer**: Explore `/search` with live filters, beds, pricing, and Leaflet interactive map.
  - **Landlord**: View `/dashboard/landlord` — observe the live portfolio rent revenue, occupancy rate, tenancy ledger, and AI maintenance triage board.
  - **Tenant**: View `/dashboard/tenant` — inspect active lease details, simulate 1-click rent payment, and test the maintenance issue submission with automated AI symptom diagnostic.
  - **Agent**: View `/dashboard/agent` — observe the AI Lead Qualification Pipeline (HOT / WARM leads with match scores) and launch the "+ Create AI Listing" modal.

### 2. Autonomous AI Copilot in Action (0:45 - 2:00)
- Press **`⌘K`** or click **"EstateIQ Copilot"** on any page.
- Switch Copilot tabs to demonstrate multi-persona intelligence:
  - **Prompt 1 (Buyer)**: *"Find luxury apartments in Mumbai"* ➔ Watch the AI return interactive property cards with instant links.
  - **Prompt 2 (Financial)**: *"Calculate 20-year EMI for ₹1.5 Cr home"* ➔ Watch the AI generate the down payment, monthly EMI, and rental yield widget.
  - **Prompt 3 (Tenant Repair)**: *"Water leakage in kitchen sink beneath pipes"* ➔ Watch the AI classify it as a **HIGH Priority Plumbing** ticket, recommend an isolation valve safety action, and log it to the maintenance board.
  - **Prompt 4 (Marketing)**: *"Draft a luxury listing for my 3-bed villa"* ➔ Watch the AI synthesize high-converting copy with 1-click copy-to-clipboard.

### 3. Side-by-Side Comparison Matrix (2:00 - 2:30)
- Navigate to `/saved`.
- Show how saved homes populate the wishlist.
- Demonstrate the **Side-by-Side Comparison Matrix** comparing pricing, price/sqft, configuration, amenities, and AI investment ratings.

### 4. Backend & Distributed Systems Architecture (2:30 - 3:00)
- Highlight `estateiq-backend`:
  - `gateway-service`: Centralized entry point, CORS configuration, token relay.
  - `property-service`: Flyway migrations (`V1__initial_schema.sql` through `V4__remove_listing_fields_from_properties.sql`).
  - `auth-service`: OAuth2 Keycloak resource server.
  - `Testcontainers`: Real PostgreSQL container spun up during `mvn verify` for integration tests.

---

## 🛠️ Tech Stack Matrix

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.8, Vite 6 | Modern, component-driven client architecture |
| **Styling & Motion** | Tailwind CSS v4, Motion (Framer) | Glassmorphism, animations, responsive design system |
| **State & Data** | Zustand v5, TanStack Query v5 | Lightweight domain state & cached server synchronization |
| **Geospatial Maps** | Leaflet 1.9, React Leaflet 5 | Interactive viewport search & coordinate clustering |
| **AI Copilot** | Google Gemini (`@google/genai`) + Agentic Fallback | Multi-persona tool calling, diagnostics, and copy synthesis |
| **API Gateway** | Spring Cloud Gateway (Java 21, Spring Boot 3.2) | Centralized reverse proxy, routing, and CORS policy |
| **Microservices** | Spring Boot 3.2 (Auth, Property, Search) | Modular domain boundaries and separation of concerns |
| **Persistence** | PostgreSQL 16, Spring Data JPA, Hibernate | Relational persistence with isolated schema namespaces |
| **Migrations** | Flyway 10 | Versioned, immutable database migration scripts |
| **Security** | Spring Security OAuth2, Keycloak 24 | OpenID Connect, JWT validation, and RBAC policies |
| **Testing** | JUnit 5, MockMvc, Testcontainers | Production-grade integration testing against real database instances |
| **Observability** | Micrometer, Prometheus, Grafana | Health check actuators, scrape endpoints, and system metrics |

---

## 🚀 Quick Start Instructions

```bash
# 1. Install and run frontend
npm install
npm run vite:dev
# -> Open http://localhost:3000

# 2. Run backend infrastructure (Docker Desktop required)
cd estateiq-backend
docker compose up -d
mvn clean verify
```
