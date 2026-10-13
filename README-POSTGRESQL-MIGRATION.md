# My Classifieds PostgreSQL Migration Runbook

This runbook moves My Classifieds from the present AWS RDS MySQL database to PostgreSQL without disturbing the live website until the final cutover window.

## Current status

- Current production database engine: MySQL on AWS RDS.
- Current Prisma datasource provider: `mysql` in `prisma/schema.prisma`.
- Target engine: PostgreSQL.
- The live application must not be deployed with `provider = "postgresql"` while Vercel still has the old MySQL `DATABASE_URL`; doing so will break Prisma generation/runtime.

## Recommended target

Use one PostgreSQL database for production. Acceptable targets:

1. PostgreSQL on your own VPS, for maximum control and open-source stack.
2. Managed PostgreSQL provider such as Supabase, Neon, Railway, Render, DigitalOcean Managed PostgreSQL, or another non-AWS provider.
3. Local PostgreSQL only for development/testing, not for production website hosting.

## Target DATABASE_URL format

Use this format in Vercel after the PostgreSQL database is created:

```bash
DATABASE_URL="postgresql://MYCLASSIFIEDS_USER:STRONG_PASSWORD@HOST:5432/myclassifieds?schema=public&sslmode=require"
```

For a self-hosted PostgreSQL server without SSL inside a private network, the URL may be:

```bash
DATABASE_URL="postgresql://MYCLASSIFIEDS_USER:STRONG_PASSWORD@HOST:5432/myclassifieds?schema=public"
```

## Phase 1: Prepare PostgreSQL database

Create database and user:

```sql
CREATE USER myclassifieds WITH PASSWORD 'CHANGE_THIS_STRONG_PASSWORD';
CREATE DATABASE myclassifieds OWNER myclassifieds;
GRANT ALL PRIVILEGES ON DATABASE myclassifieds TO myclassifieds;
```

Connect once:

```bash
psql "postgresql://myclassifieds:CHANGE_THIS_STRONG_PASSWORD@HOST:5432/myclassifieds?schema=public"
```

## Phase 2: Export MySQL data

Take a MySQL dump from the existing AWS RDS database:

```bash
mysqldump \
  --host=baramati-classifieds-db.ctc60ggyc1kx.eu-north-1.rds.amazonaws.com \
  --port=3306 \
  --user=YOUR_MYSQL_USER \
  --password \
  --single-transaction \
  --routines \
  --triggers \
  --set-gtid-purged=OFF \
  baramati_classifieds > myclassifieds_mysql_backup.sql
```

Keep this backup offline and private. It contains users, mobile numbers, ads, payment references and compliance records.

## Phase 3: Convert and import data

Preferred tool: `pgloader`.

Example:

```bash
pgloader \
  mysql://MYSQL_USER:MYSQL_PASSWORD@baramati-classifieds-db.ctc60ggyc1kx.eu-north-1.rds.amazonaws.com:3306/baramati_classifieds \
  postgresql://myclassifieds:POSTGRES_PASSWORD@POSTGRES_HOST:5432/myclassifieds
```

After import, inspect the important tables:

```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Ad";
SELECT COUNT(*) FROM "Category";
SELECT COUNT(*) FROM "City";
SELECT COUNT(*) FROM "Payment";
SELECT COUNT(*) FROM "ReportTicket";
```

## Phase 4: Switch Prisma to PostgreSQL

Only after the PostgreSQL data import is verified, change this block in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

to:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run locally with the PostgreSQL `DATABASE_URL`:

```bash
npm install
npx prisma generate
npx prisma db pull --print
npm run build
```

## Phase 5: Vercel cutover

1. Put site in a low-traffic maintenance window.
2. Stop posting/moderation activity temporarily.
3. Run one final MySQL dump/import or pgloader sync.
4. Update Vercel production `DATABASE_URL` to the PostgreSQL URL.
5. Deploy the commit changing Prisma provider to `postgresql`.
6. Check:
   - `/`
   - `/ads`
   - `/post-ad`
   - `/admin`
   - `/admin/ads`
   - `/admin/payments`
   - `/my-ads`
7. Approve one test ad and verify it appears publicly.
8. Submit one manual UPI test reference in staging or controlled production flow.

## Phase 6: Rollback plan

If PostgreSQL cutover fails:

1. Restore old Vercel `DATABASE_URL` pointing to AWS RDS MySQL.
2. Roll back the Prisma provider commit to `mysql`.
3. Redeploy immediately.
4. Do not delete the AWS RDS instance until PostgreSQL has been stable for at least 7 to 14 days.

## Important notes

- Do not delete AWS RDS immediately after cutover.
- Rotate the old AWS RDS password because database credentials were historically exposed in project history.
- Keep one encrypted backup of both MySQL and PostgreSQL after cutover.
- Prisma native types currently used in the schema (`Text`, `VarChar`, `Decimal`, `Json`) are compatible with PostgreSQL, but the live provider should be changed only during final cutover.
