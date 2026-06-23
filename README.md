# AeroPlan — Project Management System

A full-stack project management application built with React, Node.js, Express, MySQL, and Prisma ORM. Manage your projects and tasks with a modern, responsive minimalist dark-themed UI.

## Features

- **User Authentication** — Register, login, and JWT-based session management
- **Project Management** — Create, read, update, delete projects with status and priority tracking (Low, Medium, High)
- **Task Management** — Full CRUD for tasks with priority levels (Low, Medium, High) and status workflow
- **Global Tasks Page** — Manage all your tasks across different projects from a single unified view
- **Dashboard** — Aggregated statistics with recent projects and upcoming tasks
- **Search, Sort & Filter** — Filter projects and tasks by status or priority, search by name, and dynamically sort them by name, date, priority, or status
- **Responsive Design** — Dark-themed glassmorphism UI that works on all devices
- **Rate Limiting** — Protection against brute-force attacks on auth endpoints
- **Input Validation** — Server-side validation with express-validator
- **Cascade Deletes** — Delete a user → cascades to projects → cascades to tasks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| DevOps | Docker + Docker Compose |

---

## Prerequisites

- **Node.js** >= 18
- **MySQL** >= 8.0 (or Docker)
- **npm** >= 9

---

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, env, rate limiter config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth, error handler, validation
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic
│   │   └── utils/           # Token & password helpers
│   ├── prisma/schema.prisma # Database schema
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # Custom hooks
│   │   └── pages/           # Page components
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Local Setup (without Docker)

### 1. Database Setup

Set up a [Supabase](https://supabase.com/) project and get your PostgreSQL connection strings. You will need both the transaction pooler URL and the session/direct connection URL.

### 2. Backend Setup

```bash
cd backend

# Copy env file and configure Supabase URLs
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL and DIRECT_URL


# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Deploy your database schema to Supabase
npx prisma generate
npx prisma migrate dev --name init

# Start the dev server
npm run dev
```

The backend will run on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will run on `http://localhost:5173` with API proxy to the backend.

---

## Local Setup (with Docker)

Make sure to set up your `.env` files in both the root folder and `backend/` to include your Supabase connection URLs.

```bash
docker-compose up --build
```

The application will run with:
*   Backend: http://localhost:5000
*   Frontend: http://localhost:3000
*   Database: Your remote Supabase instance

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@localhost:3306/project_management` |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Database Schema

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    User     │     │    Project      │     │     Task        │
├─────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)     │←──┐ │ id (PK)         │←──┐ │ id (PK)         │
│ fullName    │   │ │ name            │   │ │ name            │
│ email (UQ)  │   │ │ description     │   │ │ description     │
│ password    │   │ │ status          │   │ │ priority        │
│ createdAt   │   │ │ priority        │   │ │ status          │
│             │   │ │ startDate       │   │ │ dueDate         │
│             │   │ │ endDate         │   │ │ createdAt       │
│             │   │ │ createdAt       │   │ │ projectId (FK)  │
│             │   └─│ userId (FK)     │   └─│ userId (FK)     │
│             │     │                 │     │                 │
└─────────────┘     └─────────────────┘     └─────────────────┘
```

**Enums:**
- `ProjectStatus`: NOT_STARTED, IN_PROGRESS, COMPLETED
- `TaskPriority` (Shared): LOW, MEDIUM, HIGH
- `TaskStatus`: PENDING, IN_PROGRESS, COMPLETED

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout (stateless) | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

#### Register

```json
// POST /api/auth/register
// Request
{ "fullName": "John Doe", "email": "john@example.com", "password": "password123" }

// Response 201
{ "user": { "id": "uuid", "fullName": "John Doe", "email": "john@example.com" }, "token": "jwt-token" }
```

#### Login

```json
// POST /api/auth/login
// Request
{ "email": "john@example.com", "password": "password123" }

// Response 200
{ "user": { "id": "uuid", "fullName": "John Doe", "email": "john@example.com" }, "token": "jwt-token" }
```

---

### Projects

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| GET | `/api/projects` | List user's projects | `?name=`, `?status=`, `?priority=`, `?sortBy=`, `?sortOrder=` |
| GET | `/api/projects/:id` | Get project details | — |
| POST | `/api/projects` | Create project | — |
| PUT | `/api/projects/:id` | Update project | — |
| DELETE | `/api/projects/:id` | Delete project | — |

#### Create Project

```json
// POST /api/projects
// Request
{ "name": "My Project", "description": "...", "status": "NOT_STARTED", "priority": "MEDIUM", "startDate": "2024-01-01", "endDate": "2024-12-31" }

// Response 201
{ "project": { "id": "uuid", "name": "My Project", "priority": "MEDIUM", ... } }
```

---

### Tasks

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| GET | `/api/tasks` | List user's tasks | `?name=`, `?status=`, `?priority=`, `?projectId=`, `?sortBy=`, `?sortOrder=` |
| GET | `/api/tasks/:id` | Get task details | — |
| POST | `/api/tasks` | Create task | — |
| PUT | `/api/tasks/:id` | Update task | — |
| DELETE | `/api/tasks/:id` | Delete task | — |

#### Create Task

```json
// POST /api/tasks
// Request
{ "name": "My Task", "description": "...", "priority": "HIGH", "status": "PENDING", "dueDate": "2024-06-30", "projectId": "project-uuid" }

// Response 201
{ "task": { "id": "uuid", "name": "My Task", ... } }
```

---

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard` | Get aggregated stats | Yes |

#### Response

```json
{
  "projects": { "total": 5, "notStarted": 1, "inProgress": 3, "completed": 1 },
  "tasks": { "total": 20, "pending": 8, "inProgress": 7, "completed": 5 },
  "recentProjects": [...],
  "upcomingTasks": [...]
}
```

---

### Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": [{ "field": "email", "message": "Email is required" }]
  }
}
```

| HTTP Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not resource owner) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## License

MIT
