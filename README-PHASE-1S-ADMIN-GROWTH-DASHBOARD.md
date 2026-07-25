# Phase 1S - Admin Growth and Revenue Intelligence Dashboard

## New admin page

```txt
/admin/growth
```

## Purpose

This page helps the admin understand business performance and act on revenue opportunities.

## What it tracks

1. Total verified revenue.
2. Revenue in the last 7 days and 30 days.
3. Average revenue per paid payment.
4. Pending manual UPI payments.
5. Active free, paid, premium and featured ads.
6. Paid share of active ads.
7. Estimated free-to-paid conversion.
8. Sold rate.
9. Reminder touches in the last 30 days.
10. Expired ads in the last 30 days.
11. Free ads expiring soon.
12. Paid/premium ads expiring soon.
13. Expired ads worth reactivating.
14. Top viewed active ads.
15. Recent paid payments.

## Admin actions supported

- Convert expiring free ads into Paid or Premium renewals.
- Push Featured add-on to high-view ads.
- Follow up with paid/premium users before expiry.
- Reactivate expired ads that are not marked sold.
- Verify pending UPI payments faster.

## Files added / updated

- Added: `app/admin/growth/page.jsx`
- Updated: `app/components/AdminNav.jsx`

## Commands

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

## Test

After deployment:

```txt
https://myclassifieds.in/admin/growth
```

Login as admin and verify that the dashboard loads.

No Prisma database change is required.
