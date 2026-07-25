# Phase 1N - User Edit Request + Admin Review Workflow

## New route

```txt
/edit-request
```

Users can now request correction/update in their ad from the My Ads dashboard.

## What this adds

1. Edit/update request form.
2. User verifies by:
   - Ad ID
   - Posting mobile number
3. User can request correction for:
   - Ad heading/title
   - Description
   - Price
   - Contact details
   - Location/address
   - Category
   - Other update
4. Request is saved into existing `ReportTicket` table as:
   - `reportType: AD_EDIT_REQUEST`
5. Admin can review it from existing:
   - `/admin/grievances`
6. User receives a reference number.
7. My Ads dashboard now opens `/edit-request` instead of only WhatsApp.
8. Robots.txt excludes `/edit-request` from indexing.

## Files added / updated

- `app/edit-request/page.jsx`
- `app/components/EditRequestForm.jsx`
- `app/api/user/edit-request/route.js`
- `app/components/UserAdsDashboard.jsx`
- `app/robots.js`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Add user ad edit request workflow"
git push -u origin main
```

## Test

After deployment:

```txt
https://myclassifieds.in/my-ads
```

1. Enter posting mobile number.
2. Click `Request Edit` on any ad.
3. Submit correction request.
4. Confirm reference number appears.
5. Open `/admin/grievances`.
6. Confirm the edit request appears as a new ticket.

No Prisma database change is required.
