# AMEA

This project now runs as a split application:

- The root app is a `Next.js` frontend.
- The `backend/` app is an `Express + Drizzle + PostgreSQL` API.
- The frontend owns the public Better Auth route at `app/api/auth/[...all]`.
- The frontend proxies public submissions and upload requests to the backend through `app/api/**`.

## How The Migration Works

The migration moved data, auth, submissions, admin actions, and uploads out of the Next.js app and into the standalone backend.

- `Next.js` is responsible for UI rendering, the public Better Auth route, and calling local route handlers.
- `app/api/public/*` and `app/api/admin/uploads/*` proxy requests to the backend.
- The backend exposes:
  - `GET /health`
  - `GET/POST /api/public/*`
  - `GET/POST/PATCH/DELETE /api/admin/*`
- Database schema and migrations live in [`backend/drizzle`](/Users/djimijosias/code/amea/Amea/backend/drizzle).
- Drizzle runs migrations through [`backend/src/db/migrate.ts`](/Users/djimijosias/code/amea/Amea/backend/src/db/migrate.ts).
- Uploaded images are stored in AWS S3 and saved as public media URLs.
- Uploaded videos still use backend local storage and are served from `/uploads`.

In practice, the frontend remains the public entrypoint, Better Auth is used directly in the Next app on both client and server, and the backend remains the source of truth for persistence and admin data.

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
- `NEXT_PUBLIC_AUTH_URL`
- `AWS_S3_PUBLIC_BASE_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_S3_REGION`

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
- `AWS_S3_ENDPOINT`
- `AWS_S3_KEY_PREFIX`
- `AWS_S3_FORCE_PATH_STYLE`
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
2. Better Auth client calls the Next app’s `/api/auth/*` route handler directly.
3. Next proxies public submission and upload requests to the backend.
4. The backend stores uploaded images in S3, stores uploaded videos locally, and reads/writes PostgreSQL through Drizzle.
5. The frontend renders the result.

This means the backend must be running for auth, admin actions, uploads, contact submissions, volunteer submissions, and database-backed content to work. S3 credentials must also be configured before image uploads and previews will work.
