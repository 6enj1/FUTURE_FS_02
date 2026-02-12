# Lead Manager CRM

A production-quality mini CRM for managing leads from website contact forms. Built as a full-stack monorepo with React and Express.

## Features

- Secure admin login with JWT authentication
- Dashboard with lead metrics and follow-up summaries
- Lead list with search, filtering, sorting, and pagination
- Quick status updates (New / Contacted / Converted)
- Lead detail view with notes and follow-up management
- Follow-up scheduling with overdue/today indicators
- Activity timeline derived from notes and follow-ups
- Rate-limited login endpoint
- Input validation on all API endpoints

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod

**Backend:** Node.js, Express, TypeScript, Prisma ORM, MySQL, JWT, bcrypt, Helmet, CORS, rate limiting, Zod

**Testing:** Vitest, Supertest

## Screenshots

<!-- Add screenshots here -->

## Local Setup

### Prerequisites

- Node.js 18+
- MySQL 8+

### Database

Create two MySQL databases:

```sql
CREATE DATABASE crm;
CREATE DATABASE crm_test;
```

### Server

```bash
cd server
cp .env.example .env
# Edit .env with your MySQL credentials and desired settings
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:3001`.

### Default Admin Credentials

- Email: `admin@example.com`
- Password: `admin123`

(Configurable via `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars before seeding.)

## Environment Variables

### server/.env

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | MySQL connection string | - |
| `JWT_SECRET` | Secret for signing JWTs | - |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `ADMIN_EMAIL` | Seed admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Seed admin password | `admin123` |

### client/.env

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | API base URL | `http://localhost:3001/api` |

## Migrations & Seed

```bash
cd server

# Push schema to database
npx prisma db push

# Or use migrations
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Running Tests

Tests require a separate `crm_test` MySQL database.

```bash
cd server

# Set test database URL if different from default
export TEST_DATABASE_URL="mysql://root:password@localhost:3306/crm_test"

npm test
```

## Scripts

### Server

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled output |
| `npm test` | Run tests |
| `npm run typecheck` | Type-check without emitting |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

### Client

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Type-check without emitting |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Current user profile |
| GET | `/api/leads` | List leads (search, filter, paginate) |
| POST | `/api/leads` | Create lead |
| GET | `/api/leads/:id` | Get lead with notes & follow-ups |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| GET | `/api/leads/:id/notes` | List notes for lead |
| POST | `/api/leads/:id/notes` | Add note to lead |
| GET | `/api/leads/:id/followups` | List follow-ups for lead |
| POST | `/api/leads/:id/followups` | Schedule follow-up |
| PATCH | `/api/followups/:id` | Update/complete follow-up |
| GET | `/api/metrics/summary` | Dashboard metrics |

## Deployment

**Client:** Deploy to Vercel or Netlify. Set `VITE_API_BASE_URL` to your server URL.

**Server:** Deploy to Render, Fly.io, or Railway. Ensure MySQL is accessible (PlanetScale, Railway MySQL, or AWS RDS).

Run `npx prisma db push` and `npm run db:seed` after deploying the server.
