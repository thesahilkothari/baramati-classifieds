# Phase 1T - Admin Outreach & Conversion Centre

## Purpose

This phase converts growth data into direct revenue action.

The new admin page helps the operator contact sellers through ready email and WhatsApp templates for:

1. Free ad to paid upgrade
2. Paid / premium renewal
3. Expired ad reactivation
4. High-view free ad upgrade

## New admin page

```txt
/admin/outreach
```

## New files

```txt
app/admin/outreach/page.jsx
app/components/AdminOutreachActions.jsx
app/api/admin/outreach/send-email/route.js
app/lib/outreachTemplates.js
```

## Updated file

```txt
app/components/AdminNav.jsx
```

## How to use

1. Open `/admin/outreach`.
2. Login as admin.
3. Review the lead groups.
4. For each ad, use:
   - Send Email
   - WhatsApp
   - Copy Text
5. Follow up with high-value users first.

## Lead groups

### Free Ads Expiring Soon

These users are ideal for paid conversion.

Recommended pitch:

```txt
Your free ad is expiring. Renew to Paid ₹199 / 7 days or Premium ₹499 / 30 days.
```

### Paid / Premium Ads Expiring Soon

These users already have payment intent.

Recommended pitch:

```txt
If sold, mark it as sold. If still available, renew or upgrade before expiry.
```

### Expired Ads Worth Reactivating

These are warm reactivation leads from the last 45 days.

Recommended pitch:

```txt
Your ad has expired. Reactivate it if the item or service is still available.
```

### High-View Free Ads

These ads have demand signal and are best candidates for upgrade.

Recommended pitch:

```txt
Your ad is getting views. Upgrade to Premium or Featured for better visibility.
```

## Email provider

This page uses the existing transactional email system:

```txt
RESEND_API_KEY
EMAIL_FROM
```

## Database change

No Prisma schema change is required.
