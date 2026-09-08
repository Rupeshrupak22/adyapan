# Database Layer

This folder contains all database-related code shared between frontend and backend.

## Structure

```
database/
  models/     ← Mongoose models (TypeScript)
  scripts/    ← Seed scripts, migration scripts, DB utilities
  prisma/     ← Prisma schema and migrations
  lib/        ← DB connection helpers (mongodb.ts, db.ts)
  .env        ← DB credentials for running scripts locally
```

## Usage

```bash
# Run seed scripts
cd database
node scripts/seed-admin.js
node scripts/seed-atlas.js
```
