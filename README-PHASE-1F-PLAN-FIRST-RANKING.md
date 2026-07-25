# Phase 1F - Plan First Posting + Private Ranking

This patch changes the classified posting and public ranking workflow.

## User-facing changes

1. `/post-ad` now asks the user to choose:
   - Free
   - Paid
   - Premium
   - optional Featured add-on for Paid/Premium

2. For paid/premium/featured selections:
   - total amount is calculated before submission
   - UPI QR is shown before submission
   - user must enter UPI transaction ID / UTR
   - only then the ad is submitted for admin approval

3. For free selection:
   - ad is submitted directly for admin approval without payment

4. Success page no longer asks users to promote after submission.

## Admin safety change

Admin cannot approve an ad if a manual UPI payment record is still pending verification for that ad. The payment must first be verified or rejected from `/admin/payments`.

## Public ranking/privacy change

Public pages no longer show `Paid`, `Premium` or `Free` labels.

Public ordering is:

1. Featured ads at top and visibly marked `Featured`
2. Premium ads next internally
3. Paid ads next internally
4. Free ads last internally

Only `Featured` is shown publicly.

## Files changed

- `app/lib/adPlans.js`
- `app/lib/manualPayment.js`
- `app/lib/paymentApply.js`
- `app/api/ads/route.js`
- `app/components/PostAdForm.jsx`
- `app/post-ad/success/page.jsx`
- `app/api/admin/ads/[id]/route.js`
- `app/components/AdCard.jsx`
- `app/page.jsx`
- `app/ads/page.jsx`
- `app/ads/[slug]/page.jsx`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Add plan first posting and private ad ranking"
git push -u origin main
```

No Prisma schema change is required in this phase.
