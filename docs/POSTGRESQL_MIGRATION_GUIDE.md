# Portfolio Pro - Production PostgreSQL Migration & Backup Guide

This guide details the procedure to transition Portfolio Pro from local development SQLite to a fully managed, production-grade **PostgreSQL** database (such as **Supabase**, **Neon**, **AWS RDS**, or **Railway**).

---

## 1. Setting up Managed PostgreSQL (Supabase Example)

### A. Create Project
1. Go to [supabase.com](https://supabase.com) and create an account.
2. Click **New Project** and select the region closest to India (e.g. `Singapore (ap-southeast-1)` or `Mumbai (ap-south-1)` if available).
3. Set a strong database password and copy it securely.

### B. Retrieve Connection Strings
In Supabase Project Settings → **Database**:
1. **Connection Pooling URL** (Use this for `DATABASE_URL` in serverless / Vercel):
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
2. **Direct Connection URL** (Use this for `DIRECT_URL` during Prisma migrations):
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

---

## 2. Switching the Codebase to PostgreSQL

Run the automated switcher utility:
```bash
node scripts/switch-db.js postgresql
```
*This updates `prisma/schema.prisma` with `provider = "postgresql"` and regenerates the Prisma client.*

Set your production database URL in your environment (`.env.production` or Vercel dashboard):
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

Push the database schema to your live PostgreSQL database:
```bash
npx prisma db push
```

---

## 3. Seeding Production Initial Data

Seed the master fund catalog (HDFC, ICICI, SBI, Nippon), plans, and administrative accounts:
```bash
node scripts/seed.js
```

---

## 4. Automated Database Backups

### Method A: Supabase Automated Daily Backups
* Supabase automatically creates daily snapshots of your database with 7-day retention (or 30-day retention on Pro plan with Point-In-Time-Recovery / PITR).
* Go to Supabase Dashboard → **Database** → **Backups** to download or restore any snapshot with 1 click.

### Method B: Manual CLI Backup (pg_dump)
To take an encrypted, offline cold backup before major migrations or updates:

```bash
# Export compressed PostgreSQL dump
pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file=backup_portfoliopro_$(date +%Y%m%d_%H%M%S).dump
```

### Method C: Restoring From Backup (pg_restore)
To restore a snapshot into a new or existing database instance:

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  backup_portfoliopro_[TIMESTAMP].dump
```

---

## 5. Verification Checklist

1. Verify schema tables in Supabase Table Editor: `User`, `Client`, `Fund`, `Holding`, `Transaction`, `SIP`, `AuditLog`.
2. Verify foreign key constraints and cascading deletes.
3. Test query response times from Indian geographic regions (< 100ms on connection pool).

