# Claudy Map

A walking app where the city map is hidden under a **fog** that clears only as
you actually walk its streets. Explore your city on foot to reveal it tile by
tile.

> **Stage 0 — project skeleton.** This repository currently contains only
> infrastructure and stubs. No app business logic (fog, routes, statistics) is
> implemented yet — that comes in later stages.

## Repository structure

This is a [pnpm](https://pnpm.io/) monorepo.

```
Claudy-Map/
├── apps/
│   ├── mobile/            # Expo (Dev Client) + expo-router + zustand — the mobile app
│   └── server/            # Node.js + TypeScript + Fastify — the backend API
├── packages/
│   └── shared-types/      # Shared TypeScript types (placeholder for now)
├── infra/
│   └── osrm/              # Docker setup for OSRM (routing engine) — config + docs
├── supabase/
│   └── migrations/        # Postgres/PostGIS migrations
├── pnpm-workspace.yaml
└── README.md
```

## Tech stack

| Area            | Technology                                          |
| --------------- | --------------------------------------------------- |
| Mobile          | Expo (Dev Client), expo-router, zustand, TypeScript |
| Backend         | Node.js, TypeScript, Fastify                        |
| Database        | Supabase (Postgres + PostGIS)                       |
| Routing         | OSRM (self-hosted, Docker)                           |
| Package manager | pnpm (workspaces)                                   |

## Getting started

```bash
# Install all workspace dependencies
pnpm install

# Run the backend (health-check at http://localhost:3000/health)
pnpm --filter @claudy-map/server dev

# Run the mobile app (requires a Dev Client build on a device)
pnpm --filter @claudy-map/mobile start
```

See each package's own README / docs for details:

- `apps/mobile` — Expo Dev Client build & run
- `apps/server` — server env & scripts (`apps/server/.env.example`)
- `infra/osrm/README.md` — how to build & run the OSRM routing container
