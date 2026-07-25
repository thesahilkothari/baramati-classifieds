# Phase 1Q - Automated Ad Expiry and Renewal Email Reminders

## What this phase adds

This phase adds automated email reminders for classified ads before expiry.

The system runs once daily using Vercel Cron:

```txt
/api/cron/ad-reminders
```

Schedule in `vercel.json`:

```txt
30 4 * * *
```

This is approximately 10:00 AM IST every day.

## Reminder logic

### Free ads

When a free ad is active and expiring within the configured lookahead window, the user receives an email reminder.

The email:

- warns that the free visibility period is ending
- invites the user to renew or upgrade
- highlights Paid, Premium and Featured options
- links to `/my-ads` for email OTP verification and renewal
- uses a sales-retention oriented message

### Paid / Premium / Featured ads

When a paid, premium or legacy featured ad is active and expiring within the configured lookahead window, the user receives an email reminder.

The email:

- asks the user to confirm whether the product/service is sold
- tells the user to mark sold if sold
- tells the user to renew before expiry if still available
- highlights Premium and Featured upgrade options
- links to `/my-ads` for email OTP verification and action

## Anti-spam / duplicate prevention

The system uses existing fields in the `Ad` table:

```txt
expiryNoticeSentAt
renewalNoticeSentAt
followUpNoticeSentAt
```

Once a reminder is sent, the system sets `expiryNoticeSentAt`, so the same ad is not reminded again for the same expiry cycle.

When a paid/premium renewal is applied, `paymentApply.js` resets reminder flags so future cycles can receive reminders again.

## Environment variables

Required:

```txt
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=My Classifieds <connect@myclassifieds.in>
NEXT_PUBLIC_SITE_URL=https://myclassifieds.in
CRON_SECRET=use_a_long_random_secret
```

Optional:

```txt
AD_REMINDER_LOOKAHEAD_HOURS=60
AD_REMINDER_BATCH_LIMIT=60
```

The default lookahead is 60 hours instead of exactly 48 hours so the daily cron does not miss ads that expire between two cron runs.

## Manual testing

After deployment, run this in your browser while logged into Vercel environment or call the URL directly with the token:

```txt
https://myclassifieds.in/api/cron/ad-reminders?dryRun=1&token=YOUR_CRON_SECRET
```

Dry run does not send emails and does not update the database.

To actually send reminders manually:

```txt
https://myclassifieds.in/api/cron/ad-reminders?token=YOUR_CRON_SECRET
```

## Files added

- `app/lib/adReminderEmails.js`
- `app/lib/adReminderJob.js`
- `app/api/cron/ad-reminders/route.js`
- `vercel.json`

## Files updated

- `app/lib/emailService.js`
- `app/lib/paymentApply.js`

## Commands

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
git status
```

Vercel will auto-deploy from GitHub after the commits are pushed.

## Best-practice retention logic used

1. Reminders are sent before expiry, not after expiry.
2. Free users are converted toward Paid/Premium options.
3. Paid/Premium users are asked to confirm sold status or renew.
4. Email links drive users to the secure `/my-ads` dashboard.
5. Reminder is sent once per expiry cycle to avoid spam.
6. Renewed ads reset reminder flags for the next cycle.
7. Batch limits avoid sending too many emails in one cron execution.
