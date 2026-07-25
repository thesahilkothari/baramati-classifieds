# Phase 1M - User Ad Status Dashboard

## New route

```txt
/my-ads
```

Users can enter the mobile number used while posting an ad and check:

- pending / active / rejected / expired / sold status
- payment verification status
- UPI reference submitted
- paid amount and plan
- approval date
- expiry date
- ad views
- category and city
- public ad link
- renewal / upgrade link
- mark sold through My Classifieds
- mark sold elsewhere
- mark available again
- edit request via WhatsApp
- support via WhatsApp

## New API routes

```txt
GET /api/user/ads?mobile=XXXXXXXXXX
PATCH /api/user/ad-status
```

## Files added or updated

- `app/my-ads/page.jsx`
- `app/components/UserAdsDashboard.jsx`
- `app/api/user/ads/route.js`
- `app/api/user/ad-status/route.js`
- `app/components/Header.jsx`
- `app/components/MobileBottomBar.jsx`
- `app/components/Footer.jsx`
- `app/sitemap.js`
- `app/robots.js`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Add user ad status dashboard"
git push -u origin main
```

## Test

After deployment:

```txt
https://myclassifieds.in/my-ads
```

Test:

1. Enter a mobile number used for posting.
2. Confirm user's ads are displayed.
3. Check pending payment status for a payment submitted ad.
4. Check active ad public link.
5. Click renew / upgrade.
6. Mark an ad as sold through My Classifieds.
7. Mark it available again.
8. Test Marathi toggle and mobile bottom nav.
