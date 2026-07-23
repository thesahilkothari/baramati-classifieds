# My Classifieds Phase 1D Razorpay Webhook & Payment Hardening

This phase strengthens live Razorpay payments.

## What this patch adds

- Signed Razorpay webhook endpoint:
  - `/api/payment/webhook`
- Idempotent webhook event storage:
  - `PaymentWebhookEvent`
- Hardened browser verification:
  - idempotent payment verification
  - payment signature storage
  - failure reason storage
- Admin payment dashboard:
  - `/admin/payments`
- Shared payment plan application helper:
  - `app/lib/paymentApply.js`

## New required Vercel environment variable

Add this in Vercel Production:

```env
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Do not commit this value to GitHub.

## Required local commands after extracting

```bat
cd C:\baramati-classifieds
npx prisma db push
npx prisma generate
npm run build
git add .
git commit -m "Add Razorpay webhook payment hardening"
git push -u origin main
```

## Razorpay dashboard setup

In Razorpay Dashboard live mode:

1. Go to Webhooks.
2. Add endpoint:
   `https://myclassifieds.in/api/payment/webhook`
3. Select at least:
   - `payment.captured`
   - `payment.failed`
4. Generate/copy webhook secret.
5. Add the same secret in Vercel as `RAZORPAY_WEBHOOK_SECRET`.
6. Redeploy the site after adding env variable.

## Testing

1. Submit a classified.
2. Pay for Paid or Premium plan.
3. Open `/admin/payments`.
4. Confirm:
   - payment status becomes PAID
   - payment ID appears
   - webhook event appears after Razorpay sends it

Browser callback may mark payment as PAID first. The webhook is still useful as an independent server-to-server confirmation.
