# AMEA

This project now runs as a split application:

- The root app is a `Next.js` frontend.
- The `backend/` app is an `Express + Drizzle + PostgreSQL` API.
- The frontend talks to the backend through local proxy routes in `app/api/**`.

## How The Migration Works

The migration moved data, auth, submissions, admin actions, and uploads out of the Next.js app and into the standalone backend.

- `Next.js` is responsible for UI rendering and calling local route handlers.
- `app/api/auth/*`, `app/api/public/*`, and `app/api/admin/uploads/*` proxy requests to the backend.
- The backend exposes:
  - `GET /health`
  - `POST/GET /api/auth/*`
  - `GET/POST /api/public/*`
  - `GET/POST/PATCH/DELETE /api/admin/*`
- Database schema and migrations live in [`backend/drizzle`](/Users/djimijosias/code/amea/Amea/backend/drizzle).
- Drizzle runs migrations through [`backend/src/db/migrate.ts`](/Users/djimijosias/code/amea/Amea/backend/src/db/migrate.ts).
- Uploaded files are stored by the backend and served from `/uploads`.

In practice, the frontend remains the public entrypoint, but the backend is now the source of truth for persistence and auth.

## Environment Setup

Use [`.env.example`](/Users/djimijosias/code/amea/Amea/.env.example) as the template.

You need two env files:

1. Root `.env` for the Next.js app.
2. `backend/.env` for the Express backend.

Copy the frontend section from `.env.example` into the root `.env`, and copy the backend section into `backend/.env`.

## Required Environment Variables

These are the values that must be set for the migrated setup to work end-to-end:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `AUTH_TRUSTED_ORIGINS`
- `INTERNAL_API_BASE_URL`

Common local defaults are already included in `.env.example` for:

- `HOST`
- `PORT`
- `BETTER_AUTH_URL`
- `AUTH_OTP_EXPIRES_IN_SECONDS`
- `AUTH_OTP_ALLOWED_ATTEMPTS`
- `AUTH_OTP_RATE_LIMIT_WINDOW_SECONDS`
- `AUTH_OTP_RATE_LIMIT_MAX`
- `AUTH_REQUEST_RATE_LIMIT_WINDOW_SECONDS`
- `AUTH_REQUEST_RATE_LIMIT_MAX`
- `AUTH_DISABLE_SIGNUP`
- `UPLOAD_PUBLIC_BASE_URL`
- `UPLOAD_DIRECTORY`
- `UPLOAD_IMAGE_MAX_BYTES`
- `UPLOAD_VIDEO_MAX_BYTES`

## Install Dependencies

Install dependencies for both apps:

```bash
npm install
npm --prefix backend install
```

## Run The Migration

After `backend/.env` is configured, apply the database migrations:

```bash
npm --prefix backend run db:migrate
```

If you change the schema later, generate a new migration first:

```bash
npm --prefix backend run db:generate
```

## Start The Apps

Run the backend:

```bash
npm --prefix backend run dev
```

In a second terminal, run the frontend:

```bash
npm run dev
```

Local defaults:

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:4000`
- Health check: `http://127.0.0.1:4000/health`

## Request Flow

With the migration in place, requests flow like this:

1. Browser hits the Next.js app.
2. Next route handlers proxy auth/public/upload requests to the backend.
3. The backend reads and writes PostgreSQL through Drizzle.
4. The backend returns JSON or upload URLs.
5. The frontend renders the result.

This means the backend must be running for auth, admin actions, uploads, contact submissions, volunteer submissions, and database-backed content to work.
