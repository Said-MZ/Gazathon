# GazaDon

GazaDon is a platform designed to help hospitals in Gaza coordinate medical supplies and equipment. It lets hospitals publish inventory, discover shortages, and request medicines from each other.

## 2-minute local setup with Docker

You only need Docker Desktop / Docker Engine installed.

```bash
git clone https://github.com/your-username/gazathon.git
cd gazathon
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

The Docker setup starts Postgres, runs all Drizzle migrations, seeds demo data, and starts the Next.js app automatically.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gazadon.local` | `password123` |
| Hospital user | `user@gazadon.local` | `password123` |

### Reset Docker data

If you want a fresh database again:

```bash
docker compose down -v
docker compose up --build
```

## Local setup without Docker

1. Copy the env example and adjust values if needed:

   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start a local Postgres database and make sure `DATABASE_URL` points to it.

4. Run migrations and seed data:

   ```bash
   npm run setup
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run db:migrate   # apply Drizzle migrations
npm run db:seed      # insert idempotent demo users, hospitals, medicines, permissions, requests, and transactions
npm run setup        # migrate + seed
npm run dev          # local development server
npm run build        # production build
npm run start        # production server
npm run lint         # Next.js linting
```

## Features

- Authentication system with login, register, forgot password, 2FA-ready fields, password/email changes, and roles
- Admin and hospital-user roles
- Hospital directory and pending hospital workflow
- Medicine inventory management
- Medicine requests between hospitals
- Dashboard statistics
- Responsive Tailwind CSS UI
- Dark mode support
- Toast notifications and form validation

## Tech stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Auth.js / NextAuth
- Drizzle ORM
- PostgreSQL
- Framer Motion
- React Hook Form
- Zod
- Sonner
- Lucide React

## Environment variables

The Docker Compose setup provides these automatically. For manual local development, copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js secret; generate a real one with `openssl rand -base64 32` for non-local deployments |
| `WEBSITE_URL` | Base URL used for email links |
| `RESEND_API_KEY` | Resend email API key for password reset and verification emails |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional GitHub OAuth credentials |

## Notes

- The seed script is idempotent, so rerunning `npm run setup` will not duplicate records.
- Docker uses local-only development secrets. Replace them before deploying anywhere public.
- `RESEND_API_KEY` is a placeholder in Docker because the seeded users are already email-verified and can log in without email delivery.
