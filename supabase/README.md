# Supabase

Database migrations for Claudy Map (Postgres + PostGIS).

## Migrations

- `migrations/20260101000000_init.sql` — creates the `claudy_map` schema and
  enables the `postgis` extension. No application tables yet (that comes in
  later stages).

## How to apply a migration to your Supabase project

You need to run this yourself — the repo has no access to your Supabase
project. Two options:

### Option A — Supabase CLI (recommended)

```bash
# 1. Install the CLI (once): https://supabase.com/docs/guides/cli
# 2. From the repo root, link to your project (grab the ref from the dashboard URL):
supabase link --project-ref <your-project-ref>

# 3. Push local migrations to the remote database:
supabase db push
```

`supabase db push` applies every file in `supabase/migrations/` that hasn't
been applied yet, in filename order.

### Option B — SQL Editor in the dashboard

1. Open your project → **SQL Editor** → **New query**.
2. Paste the contents of `migrations/20260101000000_init.sql`.
3. Run it.

> Note: on Supabase, PostGIS may already be available. `create extension if
> not exists postgis;` is a no-op if it is already enabled.
