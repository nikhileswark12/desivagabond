# DesiVagabond

## Intelligent Travel Planning & Itinerary Management Platform

DesiVagabond is a modern travel planning platform that helps users organize trips, manage itineraries, track budgets, discover destinations, and collaborate with fellow travelers through a single, intuitive interface.

---

## About the Project

DesiVagabond simplifies travel planning by bringing itinerary management, budgeting, destination discovery, notes, and collaboration into one unified platform. Built with a React frontend and a NestJS backend, it offers a scalable architecture suitable for both personal and collaborative trip planning.

## Key Features

- Multi-city itinerary planning
- Drag-and-drop itinerary management
- Budget tracking and analytics
- Packing checklist
- Trip journals and notes
- Destination discovery
- Secure JWT authentication
- Public itinerary sharing
- Responsive UI
- RESTful API

## Tech Stack

| Category | Technologies |
|:---------|:-------------|
| **Languages** | <img src="https://skillicons.dev/icons?i=ts,js" /> |
| **Frontend** | <img src="https://skillicons.dev/icons?i=react,vite" /> |
| **Backend** | <img src="https://skillicons.dev/icons?i=nestjs,nodejs" /> |
| **Database** | <img src="https://skillicons.dev/icons?i=postgresql,sqlite" /> |
| **Infrastructure** | <img src="https://skillicons.dev/icons?i=docker" /> |
| **Tools** | <img src="https://skillicons.dev/icons?i=git,github,vscode,postman" /> |

## Architecture

```text
React Frontend
      │
REST API
      │
NestJS Backend
      │
├── Authentication
├── Trips
├── Budget
├── Sharing
└── Administration
      │
PostgreSQL / SQLite
```

## Project Structure

```text
desivagabond/
├── backend/
├── frontend/
├── docker-compose.yml
└── package.json
```

## Quick Start

```bash
git clone <repository-url>
cd desivagabond

npm install
npm run dev
```

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=
VITE_API_URL=
```

## Docker

```bash
docker-compose up --build
```

## Database

```bash
npm run migration:generate
npm run migration:run
npm run migration:revert
```

## Testing

```bash
npm run test
npm run test:e2e
```

## API Modules

- Authentication
- Users
- Trips
- Stops
- Shared Itineraries
- Cities
- Activities
- Administration

## Security

- JWT Authentication
- Email Verification
- CSRF Protection
- bcrypt Password Hashing
- Role-based Authorization
- Rate Limiting

## Roadmap

- AI itinerary generation
- Weather integration
- Offline support
- Mobile application
- Interactive maps
- Expense sharing
- Multilingual support

## Contributors

| Name | Role |
|------|------|
| Srikara Varadan | Frontend Development |
| Kavuru Nikhileswar | Backend Development |
