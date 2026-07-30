# Phase 2C - UPI Automation and Bank Webhook-Ready Checkout

This phase improves the manual UPI checkout experience without depending on Razorpay or another payment gateway.

## Implemented

1. UPI intent checkout with pre-filled amount, payee, currency and transaction note.
2. Checkout reference generation for each ad/plan selection.
3. Client-side UTR / payment reference normalization and validation.
4. Server-side UTR / payment reference validation.
5. Duplicate UTR blocking.
6. UTR stored in both `manualTransactionRef` and the legacy `razorpayPaymentId` display field for easier admin viewing.
7. Payment metadata stored as structured JSON in `failureReason` for admin review.
8. Admin payment screen now shows UTR confidence, checkout reference, payer details and automation mode.
9. Bank webhook-ready endpoint added at `/api/payment/bank-webhook`.
10. Stored bank credit events can be reconciled later when the user submits a matching UTR.

## Current default mode

Without bank credentials, the system works in:

```txt
DECENTRALISED_UTR_VALIDATION
```

This means users pay by UPI, submit the UTR, and the system validates format/deduplicates the reference. Admin then verifies from the bank/UPI statement.

## Bank webhook mode

After the bank provides official corporate API/webhook access, configure:

```txt
BANK_WEBHOOK_SECRET=<bank-provided-or-platform-generated-shared-secret>
```

The webhook endpoint expects an HMAC SHA-256 signature in one of these headers:

```txt
x-myclassifieds-bank-signature
x-bank-signature
x-webhook-signature
```

The signature must be HMAC-SHA256 of the raw JSON body using `BANK_WEBHOOK_SECRET`.

## Expected bank credit payload

The endpoint accepts flexible field names, including:

```json
{
  "eventId": "bank-event-unique-id",
  "eventType": "BANK_CREDIT",
  "utr": "412345678901",
  "amount": 199,
  "currency": "INR",
  "payerName": "Customer Name",
  "payerVpa": "customer@upi",
  "paidAt": "2026-07-30T15:00:00.000Z"
}
```

Equivalent fields such as `upiReference`, `transactionReference`, `bankReference`, `rrn`, `refNo`, `amountInPaise`, `creditAmount`, or nested `data` fields are also supported.

## Matching rule

A bank credit is auto-applied only when all conditions match:

1. Existing pending payment record is provider `MANUAL_UPI`.
2. Submitted UTR equals bank webhook UTR after normalization.
3. Amount matches exactly in paise.
4. Payment status is `PENDING_MANUAL_VERIFICATION`.

If no matching pending payment exists, the bank event is stored as unprocessed and can be reconciled later when the user submits the matching UTR.

## Security note

Do not expose bank secrets in client-side code. Configure webhook secrets only as Vercel server environment variables.
