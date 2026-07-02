# DesiVagabond

## Intelligent Travel Planning & Itinerary Management Platform

DesiVagabond is an intelligent travel planning and itinerary management platform designed to simplify trip organization through personalized itinerary creation, collaborative planning, budget management, and destination discovery. Built with modern web technologies, the platform enables travelers to seamlessly plan multi-city journeys, manage travel expenses, organize activities, and share itineraries through an intuitive and interactive user experience.

Planning a trip often involves juggling multiple applications for budgeting, destination research, itinerary creation, note-taking, and collaboration. This fragmented approach makes travel planning inefficient and difficult to manage, particularly for longer journeys involving multiple destinations and travelers. DesiVagabond addresses these challenges by providing a unified platform where every aspect of trip planning can be managed from a single interface.

Designed with scalability, performance, and user experience in mind, DesiVagabond combines a modern React frontend with a robust NestJS backend to deliver a feature-rich travel ecosystem. From intelligent itinerary management and budget visualization to secure authentication and collaborative sharing, the platform provides travelers with the tools needed to plan memorable journeys efficiently while offering developers a clean, modular architecture for future enhancements.

---

## Vision

To build a modern travel planning ecosystem that enables travelers to organize, collaborate, and explore destinations through intelligent itinerary management, interactive visualization, and personalized travel experiences.

---

## Problem Statement

Travel planning has become increasingly complex as travelers rely on multiple disconnected applications to manage itineraries, budgets, destinations, accommodation details, travel notes, and activity schedules. Information is often scattered across spreadsheets, messaging applications, note-taking platforms, and booking websites, making it difficult to maintain a clear overview of an entire journey.

Collaborative trip planning introduces additional challenges, including itinerary coordination, budget tracking, destination research, and schedule management among multiple travelers. Without a centralized platform, planning becomes time-consuming, error-prone, and difficult to update.

Some of the primary challenges include:

* Fragmented travel planning across multiple applications.
* Difficulty organizing multi-city travel itineraries.
* Limited tools for collaborative trip planning.
* Inefficient travel budget management and expense tracking.
* Poor visualization of travel schedules and destinations.
* Lack of integrated trip journals, packing lists, and travel notes.
* Limited itinerary sharing capabilities.

DesiVagabond addresses these challenges by integrating itinerary planning, budgeting, destination discovery, collaboration, and travel management into a single intelligent platform that simplifies the entire travel planning process.

---

## Core Features

DesiVagabond provides a comprehensive set of features designed to enhance every stage of travel planning, including:

* Secure JWT-based authentication with mandatory email verification.
* Personalized multi-city itinerary creation and management.
* Drag-and-drop itinerary organization for flexible trip planning.
* Interactive travel budget tracking with graphical insights.
* Packing checklist with categorized recommendations.
* Trip journals and notes linked to itinerary destinations.
* Public itinerary sharing through secure, expiring share links.
* Destination and activity directory covering Indian tourist locations.
* Administrative dashboard for platform management and monitoring.
* Interactive visual experiences powered by Three.js and modern animations.
* Responsive interface optimized for desktop and mobile devices.

---

## Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* Zustand
* React Router
* Three.js
* GSAP
* Framer Motion
* Chart.js
* dnd-kit
* Axios
* React Hot Toast
* React Datepicker

### Backend

* NestJS
* TypeORM
* Passport
* Passport JWT
* bcryptjs
* csurf
* NestJS Throttler
* Cache Manager
* Nodemailer

### Database

* PostgreSQL
* SQLite (Development)

### Infrastructure

* Docker
* Docker Compose

---

## System Architecture

DesiVagabond follows a modular client-server architecture that separates presentation, business logic, authentication, and data persistence into independent layers.

The frontend provides an interactive interface for itinerary planning, budget visualization, destination exploration, and collaborative travel management. React components communicate with a RESTful NestJS backend responsible for authentication, authorization, itinerary management, administrative services, and secure API operations.

Application data is stored within PostgreSQL for production deployments, while SQLite provides a lightweight development environment. Authentication is implemented using JWT stored in secure HTTP-only cookies, supported by CSRF protection, role-based authorization, and rate limiting to ensure platform security.

The modular architecture enables independent development of frontend and backend services while supporting future expansion through additional APIs, third-party integrations, and scalable deployment strategies.

---

## Design Principles

DesiVagabond is developed around several architectural principles:

* User-centric travel planning experience.
* Modular and maintainable application architecture.
* Secure authentication and authorization.
* Responsive and accessible user interface.
* Interactive data visualization for budgeting and planning.
* Clean separation between frontend and backend services.
* Scalable infrastructure for future platform growth.
* Performance-focused application design.
* Extensible architecture for travel-related integrations.

---

## Future Scope

DesiVagabond is designed to evolve into a comprehensive intelligent travel ecosystem. Planned enhancements include AI-assisted itinerary generation, personalized destination recommendations, weather-aware trip planning, accommodation and transportation integrations, interactive mapping, offline itinerary synchronization, expense sharing among travel groups, multilingual support, mobile applications, and real-time collaborative planning capabilities.

The long-term objective is to transform DesiVagabond into a complete travel companion that combines intelligent planning, seamless collaboration, and immersive destination discovery within a unified platform, enabling travelers to plan and manage every aspect of their journeys with confidence.

---

## Getting Started

### Prerequisites

* Node.js 20+
* npm 10+
* Docker & Docker Compose (for PostgreSQL deployments)
* SMTP credentials (optional for development)


## Installation

### Clone the Repository

```bash id="rknpju"
git clone <repository-url>
cd desivagabond
```

---

### Install Dependencies

Install the project dependencies from the repository root.

```bash id="lgqj4w"
npm install
```

---

### Run the Complete Application

Launch both the frontend and backend services simultaneously during development.

```bash id="xujygv"
npm run dev
```

---

### Backend Setup

Navigate to the backend directory and configure the application.

```bash id="fthifx"
cd backend

npm install

cp .env.example .env

npm run build

npm run migration:run

npm run start:dev
```

The backend service runs on:

```id="ylr37d"
http://localhost:3000
```

---

### Frontend Setup

Navigate to the frontend directory.

```bash id="1vb3c8"
cd frontend

npm install

npm run dev
```

If required, configure the backend API endpoint inside `frontend/.env`.

```env id="v2s15m"
VITE_API_URL=http://localhost:3000/api
```

The frontend application runs on:

```id="psbb1j"
http://localhost:5173
```

---

## Docker Deployment

DesiVagabond supports containerized deployment using Docker Compose, enabling both frontend and backend services to run alongside PostgreSQL within an isolated environment.

Start the complete application stack using:

```bash id="gd1knx"
docker-compose up --build
```

Before deployment, ensure the backend environment is configured for PostgreSQL by updating the required database environment variables.

---

## Environment Configuration

### Backend Environment Variables

Configure the following variables inside `backend/.env`.

| Variable            | Purpose                                |
| ------------------- | -------------------------------------- |
| `DB_TYPE`           | Database driver (SQLite or PostgreSQL) |
| `DB_HOST`           | PostgreSQL host                        |
| `DB_PORT`           | PostgreSQL port                        |
| `DB_USER`           | Database username                      |
| `DB_PASSWORD`       | Database password                      |
| `DB_NAME`           | Database name                          |
| `DB_PATH`           | SQLite database location               |
| `JWT_SECRET`        | Secret key used for signing JWT tokens |
| `JWT_EXPIRY`        | JWT token expiration period            |
| `PORT`              | Backend application port               |
| `CORS_ORIGINS`      | Allowed frontend origins               |
| `COOKIE_SAME_SITE`  | Cookie security policy                 |
| `COOKIE_DOMAIN`     | Cookie domain                          |
| `SHARE_EXPIRY_DAYS` | Public itinerary expiration period     |
| `MAIL_HOST`         | SMTP server host                       |
| `MAIL_PORT`         | SMTP server port                       |
| `MAIL_USER`         | SMTP username                          |
| `MAIL_PASS`         | SMTP password                          |

---

### Frontend Environment Variables

Configure the frontend API endpoint.

| Variable       | Purpose         |
| -------------- | --------------- |
| `VITE_API_URL` | Backend API URL |

---

## Database Migrations

DesiVagabond uses TypeORM migrations for schema management. Automatic synchronization is disabled in production to ensure database consistency and controlled schema evolution.

Generate a new migration:

```bash id="3l6ymx"
npm run migration:generate src/migrations/MigrationName
```

Apply pending migrations:

```bash id="mrjlwm"
npm run migration:run
```

Rollback the latest migration:

```bash id="6h3cw2"
npm run migration:revert
```

Migration-based schema management provides a reliable deployment workflow while preserving database integrity across application updates.

---

## Testing

DesiVagabond includes automated testing for authentication, trip management, administrative modules, and core backend services.

Run unit tests:

```bash id="skl6w7"
cd backend

npm run test
```

Run end-to-end tests:

```bash id="d9ksan"
npm run test:e2e
```

Executing automated tests before deployment helps ensure application stability and verifies that newly introduced features do not affect existing functionality.

---

## API Overview

The backend exposes a RESTful API organized into modular service groups.

| Module             | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| Authentication     | User registration, login, logout, email verification, password reset |
| Users              | User profile management and account operations                       |
| Trips              | Trip creation, updates, deletion, itinerary management               |
| Stops              | Destination management and itinerary reordering                      |
| Shared Itineraries | Public read-only itinerary access through secure share links         |
| Cities             | Destination directory with search and filtering                      |
| Activities         | Activity catalog with category and location filters                  |
| Administration     | Platform statistics, audit logs, and administrative services         |

---

## Security

Security has been integrated throughout the application architecture using industry-standard practices.

Key security measures include:

* JWT authentication using secure HTTP-only cookies.
* Mandatory email verification before account access.
* CSRF protection for authenticated requests.
* Password hashing using bcrypt.
* Request rate limiting to prevent abuse.
* Role-based authorization for administrative functionality.
* Secure public itinerary sharing through expiring tokens.
* Audit logging for sensitive operations and administrative actions.

---

## Project Structure

```text id="xkqn96"
desivagabond/
│
├── backend/
│   └── src/
│       ├── activities/
│       ├── admin/
│       ├── auth/
│       ├── cities/
│       ├── mail/
│       ├── shared/
│       ├── trips/
│       └── users/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── pages/
│
├── docker-compose.yml
└── package.json
```

The project follows a modular architecture that separates frontend presentation, backend business logic, authentication, administrative services, and travel management into independent modules, making the codebase easier to maintain, extend, and scale.

---

## Contributors

| Name               | Role                 |
| ------------------ | -------------------- |
| Srikara Varadan    | Frontend Development |
| Kavuru Nikhileswar | Backend Development  |
