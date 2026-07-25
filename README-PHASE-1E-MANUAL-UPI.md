# My Classifieds Phase 1E Manual UPI Payment Patch

Razorpay was rejected by banking partner review, so this patch disables customer-facing Razorpay checkout and replaces it with manual UPI payment plus admin verification.

## Company UPI

- UPI ID / VPA: `skepl1@icici`
- Payee: `SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED`
- QR image path: `public/upi-qr.jpeg`

## Files included

- `public/upi-qr.jpeg`
- `app/lib/manualPayment.js`
- `app/api/payment/manual/route.js`
- `app/api/admin/payments/[id]/manual-verify/route.js`
- `app/components/AdPromotionPayment.jsx`
- `app/components/AdminManualPaymentActions.jsx`
- `app/admin/payments/page.jsx`
- `app/pricing/page.jsx`

## Required commands after extracting

```bat
cd C:\baramati-classifieds
rmdir /s /q app\api\debug-razorpay
npm run build
git add .
git commit -m "Replace Razorpay checkout with manual UPI payments"
git push -u origin main
```

If `rmdir /s /q app\api\debug-razorpay` says the folder does not exist, ignore it.

## No Prisma database push required

This patch uses your existing Payment table fields:

- `razorpayOrderId` stores the manual platform reference number.
- `razorpayPaymentId` stores the UPI UTR / transaction reference.
- `failureReason` stores payer and admin verification notes as JSON.
- `status` stores `PENDING_MANUAL_VERIFICATION`, `PAID`, or `REJECTED_MANUAL`.

## Optional environment variables

Add these to `.env` and Vercel Production for clarity:

```env
PAYMENT_PROVIDER=manual_upi
NEXT_PUBLIC_PAYMENT_PROVIDER=manual_upi
NEXT_PUBLIC_UPI_ID=skepl1@icici
NEXT_PUBLIC_UPI_PAYEE_NAME=SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED
```

## Test

1. Submit a classified.
2. On success page, choose Paid or Premium.
3. Scan QR / open UPI app.
4. Enter a test/reference number in the form.
5. Open `/admin/payments`.
6. Click "Mark Paid & Apply Plan".
7. Confirm the ad becomes PAID or PREMIUM after approval.
