# Phase 1O - Secure User Verification for My Ads, Edit, Sold Status and Renewal

## Why this patch is necessary

The earlier `/my-ads` flow allowed lookup by mobile number only. That is not sufficient because another person may know or guess a mobile number.

This patch changes user-side access to require:

```txt
Posting mobile number + Posting email address
```

This is a zero-cost verification method because it does not require paid SMS, WhatsApp Business API, email API, OTP provider or background message delivery.

## What is secured

1. `/my-ads`
   - now requires both mobile and email.
   - only ads matching both are returned.

2. `/api/user/ads`
   - requires mobile + email.
   - returns only matching ads.

3. `/api/user/ad-status`
   - mark sold / available now requires mobile + email.

4. `/edit-request`
   - requires mobile + email.
   - edit request API verifies both before creating admin ticket.

5. `/renew`
   - requires mobile + email.
   - renewal payment API verifies both before accepting payment reference.

6. `/sold-status`
   - requires mobile + email.

## Important note

This is not full OTP authentication. Full OTP requires one of these:

- paid SMS OTP
- WhatsApp Business Cloud API / BSP
- email service such as Resend, SendGrid or SMTP

This patch is the best zero-cost improvement and should be applied immediately.

## Files added / updated

- `app/lib/userVerification.js`
- `app/api/user/ads/route.js`
- `app/api/user/ad-status/route.js`
- `app/api/user/edit-request/route.js`
- `app/api/payment/manual/route.js`
- `app/api/ads/sold-status/route.js`
- `app/components/UserAdsDashboard.jsx`
- `app/my-ads/page.jsx`
- `app/components/EditRequestForm.jsx`
- `app/edit-request/page.jsx`
- `app/components/RenewAdForm.jsx`
- `app/renew/page.jsx`
- `app/components/SoldStatusForm.jsx`
- `app/sold-status/page.jsx`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Secure user ad actions with mobile email verification"
git push -u origin main
```

## Test

1. Open `/my-ads`.
2. Enter correct mobile + wrong email.
   - It should show no ads.
3. Enter correct mobile + correct posting email.
   - It should show ads.
4. Try mark sold.
   - It should work only with matching mobile + email.
5. Try edit request.
   - It should work only with matching mobile + email.
6. Try renew.
   - It should accept renewal payment reference only with matching mobile + email.
7. Try `/sold-status`.
   - It should require both mobile and email.

No Prisma database change is required.
