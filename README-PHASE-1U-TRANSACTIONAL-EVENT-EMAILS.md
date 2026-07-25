# Phase 1U - Transactional Event Email Integration

## Purpose

This phase completes the main communication loop for My Classifieds by sending transactional emails when important user/admin events occur.

## Events covered

### 1. Ad submission

When a user posts an ad:

- User receives confirmation email.
- Admin receives a new ad notification email.
- If payment reference is included, the email includes pending manual verification details.

### 2. Admin approval

When admin approves an ad:

- User receives "Your Ad is Live" email.
- Email includes public ad link, My Ads link, and Renew / Upgrade link.

### 3. Admin rejection

When admin rejects an ad:

- User receives correction / listing rules email.
- Email directs user to My Ads and Listing Rules.

### 4. Manual UPI payment approval

When admin verifies a manual UPI payment:

- User receives payment verified email.
- Email includes amount, plan, reference, and My Ads link.

### 5. Manual UPI payment rejection

When admin rejects a manual UPI payment:

- User receives payment verification failed email.
- Email includes reason and link to submit again / renew.

## Files added

- `app/lib/userEventEmails.js`

## Files updated

- `app/api/ads/route.js`
- `app/api/admin/ads/[id]/route.js`
- `app/api/admin/payments/[id]/manual-verify/route.js`

## Environment variables

Already required:

```txt
RESEND_API_KEY=...
EMAIL_FROM=My Classifieds <connect@myclassifieds.in>
NEXT_PUBLIC_SITE_URL=https://myclassifieds.in
```

Optional:

```txt
ADMIN_NOTIFICATION_EMAIL=connect@myclassifieds.in
```

If `ADMIN_NOTIFICATION_EMAIL` is not set, the system tries to use the email address inside `EMAIL_FROM`, then falls back to `connect@myclassifieds.in`.

## Testing checklist

1. Submit a free ad and check user confirmation email.
2. Submit a paid ad and check user confirmation email with payment reference.
3. Check admin new ad email.
4. Approve a pending ad and check user approval email.
5. Reject a pending ad and check user correction email.
6. Approve a manual payment and check user payment verified email.
7. Reject a manual payment and check user payment failed email.

## Notes

Email failures are intentionally non-blocking. If Resend is temporarily unavailable, the main website action still succeeds and the error is logged server-side.
