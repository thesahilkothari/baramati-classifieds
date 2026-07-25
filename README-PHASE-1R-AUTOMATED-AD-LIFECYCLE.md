# Phase 1R - Automated Ad Lifecycle Management

## Purpose

This phase keeps the public classifieds clean and improves renewal retention.

It automatically:

1. Expires active ads whose listing period has ended.
2. Removes Featured placement when the Featured add-on period ends.
3. Sends an email after expiry with renewal / upgrade / sold-status actions.
4. Sends an email when Featured placement ends, encouraging the user to add Featured again if needed.

## New Cron Route

```txt
/api/cron/ad-lifecycle
```

## Vercel Cron Schedule

```txt
15 4 * * *
```

Approximate India time:

```txt
09:45 AM IST daily
```

This runs before the reminder cron.

## Existing Reminder Cron

The existing reminder cron remains:

```txt
/api/cron/ad-reminders
30 4 * * *
```

Approximate India time:

```txt
10:00 AM IST daily
```

## Logic

### Expired Ads

The lifecycle cron finds:

```txt
status = ACTIVE
expiresAt <= now
```

Then:

```txt
status = EXPIRED
isFeatured = false
followUpNoticeSentAt = now
```

If the ad owner has an email address, it sends an expiry email with links to:

- Renew / Upgrade
- My Ads dashboard
- Mark Sold / Available

### Featured Placement Ended

The lifecycle cron finds:

```txt
status = ACTIVE
isFeatured = true
featuredUntil <= now
```

Then:

```txt
isFeatured = false
followUpNoticeSentAt = now
```

If the ad owner has an email address, it sends a Featured-ended email with links to:

- Renew / Add Featured Again
- My Ads dashboard

## Environment Variables

Required:

```txt
CRON_SECRET=your_secret
RESEND_API_KEY=your_resend_key
EMAIL_FROM=My Classifieds <connect@myclassifieds.in>
NEXT_PUBLIC_SITE_URL=https://myclassifieds.in
```

Optional:

```txt
AD_LIFECYCLE_BATCH_LIMIT=100
```

## Manual Dry Run

Dry run does not send emails and does not update the database:

```txt
https://myclassifieds.in/api/cron/ad-lifecycle?dryRun=1&token=YOUR_CRON_SECRET
```

## Manual Actual Run

This sends emails and updates database status:

```txt
https://myclassifieds.in/api/cron/ad-lifecycle?token=YOUR_CRON_SECRET
```

## Deployment Commands

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

Vercel should auto-deploy from GitHub after the commits.

## No Prisma Change

This phase uses existing fields:

- `status`
- `isFeatured`
- `expiresAt`
- `featuredUntil`
- `followUpNoticeSentAt`

No Prisma schema change is required.
