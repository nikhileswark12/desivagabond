# DesiVagabond

> A personalized travel planning and itinerary management platform for Indian destinations.

DesiVagabond allows users to create, manage, and share customized multi-city itineraries with budgeting, activity planning, and collaborative travel tools. It provides travelers with an intuitive, interactive platform to organize trips efficiently, visualize schedules, estimate expenses, and explore destinations seamlessly.

---

## Features

- 🔐 JWT cookie-based auth with hard-gate email verification (must verify before first login)
- 🗺️ Multi-city itinerary builder with drag-and-drop stop reordering (dnd-kit)
- 💰 Budget tracking with Chart.js pie and bar visualizations
- 🧳 Packing checklist with category filters and default suggestions
- 📓 Trip journal and notes linked to specific itinerary stops
- 🔗 Expiring public share links (token-based, 30-day TTL, daily cron cleanup)
- 🏙️ City and activity directory for Indian destinations with search, filters, and pagination
- 📊 Admin dashboard with platform stats, paginated audit logs, and cache management
- 🌌 3D WebGL particle effects and interactive globe (Three.js) on auth and dashboard
- 📜 "Explorer's Map" sepia parchment theme with GSAP navigation and Framer Motion transitions

---

## Tech Stack

| Frontend | Backend |
| --- | --- |
| React 19, TypeScript, Vite, Zustand 5, React Router 7, Three.js, GSAP, Framer Motion, Chart.js, dnd-kit, Axios, react-hot-toast, react-datepicker, Lucide React | NestJS 11, TypeORM, PostgreSQL (production) / SQLite (development), Passport + Passport-JWT, bcryptjs, csurf, @nestjs/throttler, @nestjs/cache-manager, @nestjs/schedule, Nodemailer, Docker + Docker Compose |

---

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose (required for PostgreSQL in production)
- SMTP credentials (Ethereal auto-generated in dev if `MAIL_HOST` is not set)

---

## Getting Started

### Clone
```bash
git clone <repository-url>
cd desivagabond
```

### Root (run both services together)
```bash
npm install
npm run dev
```

### Backend only
```bash
cd backend
npm install
cp .env.example .env
npm run build
npm run migration:run
npm run start:dev
```
Runs on `http://localhost:3000`

### Frontend only
```bash
cd frontend
npm install
# Set VITE_API_URL in frontend/.env if not using http://localhost:3000/api
npm run dev
```
Runs on `http://localhost:5173`

### Docker (full stack with PostgreSQL)
```bash
docker-compose up --build
```
Starts NestJS API on port 3000 and PostgreSQL automatically.
*Note: set `DB_TYPE=postgres` and all `DB_` vars in `backend/.env` before running.*

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Example | Description |
| --- | --- | --- |
| `DB_TYPE` | `sqlite` | Database driver: 'sqlite' or 'postgres' |
| `DB_HOST` | `localhost` | PostgreSQL host (postgres only) |
| `DB_PORT` | `5432` | PostgreSQL port (postgres only) |
| `DB_USER` | `traveloop_user` | PostgreSQL username (postgres only) |
| `DB_PASSWORD` | `traveloop_pass` | PostgreSQL password (postgres only) |
| `DB_NAME` | `traveloop` | PostgreSQL database name (postgres only) |
| `DB_PATH` | `./data/traveloop.db` | SQLite file path (sqlite only) |
| `JWT_SECRET` | `change_me` | Secret used to sign JWT tokens |
| `JWT_EXPIRY` | `7d` | JWT token lifespan |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `COOKIE_SAME_SITE` | `strict` | Cookie SameSite policy (use 'none' for cross-domain) |
| `COOKIE_DOMAIN` | | Cookie domain (leave empty for localhost) |
| `PORT` | `3000` | Port the API runs on |
| `SHARE_EXPIRY_DAYS` | `30` | Days before a public share link expires |
| `MAIL_HOST` | `smtp.ethereal.email` | SMTP host (Ethereal auto-created in dev if omitted) |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USER` | | SMTP username |
| `MAIL_PASS` | | SMTP password |

### Frontend (`frontend/.env`)

| Variable | Example | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API base URL |

---

## Database Migrations

- `synchronize` is disabled in production; all schema changes go through migration files.
- 7 migrations exist covering the full schema history.
- Commands:
  ```bash
  npm run migration:generate src/migrations/MigrationName
  npm run migration:run
  npm run migration:revert
  ```
- *Note: the `AddEmailVerifiedToUser` migration includes a backfill that sets `emailVerified=true` on all pre-existing accounts so they are not locked out after upgrading.*

---

## Running Tests

```bash
cd backend && npm run test        # unit tests (auth, trips, admin, users, mail)
cd backend && npm run test:e2e    # end-to-end tests
```

---

## Project Structure

```
.
├── backend
│   └── src
│       ├── activities
│       ├── admin
│       ├── auth
│       ├── cities
│       ├── mail
│       ├── shared
│       ├── trips
│       └── users
├── frontend
│   └── src
│       ├── components
│       ├── hooks
│       └── pages
├── docker-compose.yml
└── package.json
```

---

## API Overview

| Group | Base Path | Auth Required | Notes |
| --- | --- | --- | --- |
| Auth | `/api/auth` | No (except `/me`) | Login, register, logout, forgot/reset password |
| Users | `/api/users` | No (`verify-email`) / Yes (`profile`) | Profile, email verify, account delete |
| Trips | `/api/trips` | Yes | CRUD, share toggle, paginated list |
| Stops | `/api/trips/:id/stops` | Yes | Add, delete, reorder, activities |
| Shared | `/api/shared/:token` | No | Public read-only itinerary view |
| Cities | `/api/cities` | No | Directory with filters, types, regions |
| Activities | `/api/activities` | No | Directory with city/category/cost filters |
| Admin | `/api/admin` | Yes (admin role) | Stats, audit logs, cache clear |

---

## Security

- JWT stored in `httpOnly` cookie (7d TTL, secure, sameSite strict)
- Hard-gate email verification: login blocked until email is verified
- CSRF protection: csurf middleware issues `XSRF-TOKEN` cookie; frontend sends it as `X-CSRF-Token` header
- Rate limiting: 10 req/min globally, 5 req/min on auth endpoints via `@nestjs/throttler`
- bcrypt with 12 salt rounds for password hashing
- All destructive actions (trip/stop/item deletes) written to `audit_logs` table

---

## Contributors

| Name | Role |
|---|---|
| [Srikara Varadan](https://github.com/) | Frontend Developer |
| [Nikhileswar](https://github.com/) | Backend Developer |
