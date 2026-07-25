# Phase 1P - Email OTP Login for My Ads

## What this patch implements

This patch upgrades the `/my-ads` security model from:

```txt
mobile + email match
```

to:

```txt
email OTP verification + posting mobile number
```

Now the user cannot access the My Ads dashboard merely by knowing someone’s mobile number or email address.

## User flow

1. User opens `/my-ads`.
2. User enters the email address used while posting the ad.
3. Website sends a random 6-digit OTP to that email.
4. User enters OTP.
5. If OTP matches, a secure HTTP-only session cookie is created.
6. User enters posting mobile number.
7. Only ads matching verified email + mobile are shown.
8. User can then:
   - view ad status
   - mark sold
   - mark available
   - request edit
   - renew/upgrade

## Email sending options

This patch supports two modes.

### Option A: Resend API

Recommended if you can verify `myclassifieds.in` in Resend.

Add these Vercel environment variables:

```txt
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=My Classifieds <connect@myclassifieds.in>
```

### Option B: SMTP

Use this if your domain email provider gives SMTP details.

Install dependency first:

```bat
npm install nodemailer --save
```

Then add these Vercel environment variables:

```txt
EMAIL_FROM=My Classifieds <connect@myclassifieds.in>
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=connect@myclassifieds.in
SMTP_PASS=your_email_password_or_app_password
```

For port 465:

```txt
SMTP_PORT=465
SMTP_SECURE=true
```

## Other environment variables

Optional:

```txt
EMAIL_OTP_EXPIRY_MINUTES=10
USER_EMAIL_SESSION_MINUTES=120
```

Required already:

```txt
JWT_SECRET=your_existing_jwt_secret
NEXT_PUBLIC_SITE_URL=https://myclassifieds.in
```

## Files added

- `app/lib/emailService.js`
- `app/lib/userAuth.js`
- `app/components/EmailOtpGate.jsx`
- `app/api/user/email-otp/request/route.js`
- `app/api/user/email-otp/verify/route.js`
- `app/api/user/email-otp/session/route.js`

## Files updated

- `app/lib/userVerification.js`
- `app/api/user/ads/route.js`
- `app/api/user/ad-status/route.js`
- `app/api/user/edit-request/route.js`
- `app/api/payment/manual/route.js`
- `app/components/UserAdsDashboard.jsx`
- `app/my-ads/page.jsx`

## Commands

If using SMTP:

```bat
cd C:\baramati-classifieds
npm install nodemailer --save
npm run build
git add .
git commit -m "Add email OTP verification for my ads"
git push -u origin main
```

If using Resend:

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Add email OTP verification for my ads"
git push -u origin main
```

## Test

1. Add environment variables on Vercel.
2. Deploy.
3. Open `/my-ads`.
4. Enter posting email.
5. Check OTP email.
6. Enter OTP.
7. Enter posting mobile number.
8. Confirm ads are visible.
9. Try wrong email.
10. Try expired OTP.
11. Try mark sold / edit request / renew.

## No database change

This patch reuses the existing `Otp` table by storing email OTPs using a safe prefix:

```txt
email:user@example.com
```

No Prisma schema change is required.
