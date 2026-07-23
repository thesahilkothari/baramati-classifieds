# My Classifieds Phase 1B Compliance Patch

This patch adds clickwrap policy acceptance and consent logging for the post-classified workflow.

## Confirmed values

- Policy version: 1.0
- Policy effective date: 23 July 2026
- GST display: GST inclusive

## Files included

- prisma/schema.prisma
- app/lib/compliance.js
- app/api/ads/route.js
- app/components/PostAdForm.jsx
- app/admin/compliance/page.jsx

## Required commands after copying files

```bat
cd C:\baramati-classifieds
npx prisma db push
npx prisma generate
npm run build
git add .
git commit -m "Add post ad policy acceptance logging"
git push -u origin main
```

## Test after deployment

1. Open /post-ad.
2. Submit a classified without ticking declarations. It should not submit.
3. Tick all declarations and submit.
4. Open /admin/compliance.
5. Confirm the policy acceptance and consent records are visible.
