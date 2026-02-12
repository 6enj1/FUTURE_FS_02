# Lead Manager

A mini CRM for tracking leads from contact forms through to conversion.

## Stack

- **Client**: React, TypeScript, Vite, Tailwind, TanStack Query, React Hook Form, Zod
- **Server**: Express, TypeScript, Prisma, MySQL, JWT auth
- **Tests**: Vitest + Supertest

## Setup

You need Node 18+ and MySQL 8+.

```sql
CREATE DATABASE crm;
CREATE DATABASE crm_test;
```

```bash
# Server
cd server
cp .env.example .env   # update DATABASE_URL with your credentials
npm install
npx prisma db push
npm run db:seed
npm run dev

# Client (separate terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs on `localhost:5173`, server on `localhost:3001`.

**Default login:** `admin@example.com` / `admin123`

## Env vars

### server/.env

| Variable | Default |
|---|---|
| `PORT` | `3001` |
| `DATABASE_URL` | - |
| `JWT_SECRET` | - |
| `CLIENT_ORIGIN` | `http://localhost:5173` |
| `ADMIN_EMAIL` | `admin@example.com` |
| `ADMIN_PASSWORD` | `admin123` |

### client/.env

| Variable | Default |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` |

## Tests

```bash
cd server
export TEST_DATABASE_URL="mysql://root:password@localhost:3306/crm_test"
npm test
```

## API

| Method | Path | |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/leads` | List (search, filter, paginate) |
| POST | `/api/leads` | Create |
| GET | `/api/leads/:id` | Detail (includes notes + follow-ups) |
| PATCH | `/api/leads/:id` | Update |
| DELETE | `/api/leads/:id` | Delete |
| GET | `/api/leads/:id/notes` | List notes |
| POST | `/api/leads/:id/notes` | Add note |
| GET | `/api/leads/:id/followups` | List follow-ups |
| POST | `/api/leads/:id/followups` | Schedule follow-up |
| PATCH | `/api/followups/:id` | Update/complete follow-up |
| GET | `/api/metrics/summary` | Dashboard stats |
