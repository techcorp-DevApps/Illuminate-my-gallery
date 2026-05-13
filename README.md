# Illuminate My Gallery Monorepo

This repository is organized as a pnpm monorepo for a photography client management platform with separate customer, admin, and API services.

## Architecture

### Apps
- `apps/client-portal` — Next.js app for customer-facing gallery access, booking visibility, and image selection.
- `apps/admin-portal` — Next.js app for internal/admin workflows such as client operations, shoots, and delivery.
- `apps/api` — Fastify + Prisma backend for business logic, REST endpoints, and database access.

### Shared Packages
- `packages/ui` — shared React UI primitives.
- `packages/types` — shared TypeScript domain types.
- `packages/config` — shared static config helpers/constants.

### Data Layer
- Prisma schema in `apps/api/prisma/schema.prisma` includes initial models for:
  - users, roles, clients, shoots, bookings
  - gallery assets, image selections
  - contracts, inbox items, documents
  - status timeline, pricing packages

## Quick Start

### 1) Install dependencies
```bash
pnpm install
```

### 2) Configure environment variables
Copy each example file:
```bash
cp apps/client-portal/.env.example apps/client-portal/.env.local
cp apps/admin-portal/.env.example apps/admin-portal/.env.local
cp apps/api/.env.example apps/api/.env
```

### 3) Initialize database
Ensure Postgres is running and `DATABASE_URL` is set in `apps/api/.env`.

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate --name init
```

### 4) Run apps locally
Run all services in parallel:
```bash
pnpm dev
```

Or run individually:
```bash
pnpm --filter client-portal dev
pnpm --filter admin-portal dev
pnpm --filter api dev
```

## Workspace Tooling
- Workspaces configured in `pnpm-workspace.yaml`.
- Root TypeScript base config in `tsconfig.base.json`.
- Root lint and formatting with ESLint + Prettier (`.eslintrc.cjs`, `.prettierrc`).

## Deployment Notes

### Client/Admin Portals
- Build with `pnpm --filter <app> build`.
- Deploy Next.js apps to Vercel or a Node runtime with `next start`.

### API
- Build with `pnpm --filter api build`.
- Run migrations before deploy: `pnpm --filter api prisma:migrate deploy`.
- Deploy to container/VM/managed Node service with environment variables from secrets manager.

### Database
- Use managed Postgres for production.
- Store `DATABASE_URL` securely; do not commit secrets.
