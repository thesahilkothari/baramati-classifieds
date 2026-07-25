# Phase 1V - Admin System Health & Integration Check

## Purpose

This phase adds a single admin page to verify whether the important production integrations are configured correctly after deployment.

## New page

```txt
/admin/system
```

## What it checks

- Database connectivity through live counts.
- Email provider readiness.
- Resend key availability and format.
- SMTP backup availability.
- Sender email configuration.
- Cron secret protection.
- Site URL configuration.
- JWT secret availability.
- Manual UPI payment queue.
- Expiring ads and lifecycle readiness.

## Useful sections

### Email Provider

Shows whether the email system is ready for:

- Email OTP login.
- Ad submission emails.
- Approval/rejection emails.
- Payment verification emails.
- Reminder emails.
- Lifecycle emails.
- Outreach emails.

### Cron & Automation

Shows whether `CRON_SECRET` is configured and displays dry-run URL patterns for:

- `/api/cron/ad-reminders`
- `/api/cron/ad-lifecycle`

### Operational lists

Shows:

- Recent ad submissions.
- Recently approved ads.
- Ads expiring soon.

## Files added

- `app/admin/system/page.jsx`

## Files updated

- `app/components/AdminNav.jsx`

## Environment variables checked

```txt
DATABASE_URL
JWT_SECRET
NEXT_PUBLIC_SITE_URL
RESEND_API_KEY
EMAIL_FROM
CRON_SECRET
SMTP_HOST / SMTP_USER / SMTP_PASS
```

## Testing

Open:

```txt
https://myclassifieds.in/admin/system
```

Then confirm:

- Email Provider shows Ready.
- Cron & Automation shows Protected.
- Counts load correctly.
- Recent ads appear.

No Prisma database change is required.
