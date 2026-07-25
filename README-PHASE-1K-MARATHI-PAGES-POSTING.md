# Phase 1K - Remaining Public Pages Marathi + Marathi Ad Posting

## What this patch adds

1. Users can post ads in Marathi or English.
   - Post Ad page now clearly says English/Marathi text is accepted.
   - Heading and description inputs accept Marathi Unicode text.
   - Backend already stores Unicode in MySQL text fields.
   - If title is fully Marathi, the URL slug safely falls back to a generated classified slug.

2. Expanded language translations for:
   - Home page
   - Browse ads page
   - Ad cards
   - Pricing page
   - Post Ad page
   - Plan cards and inclusions
   - Sold status page
   - Renew / Upgrade page
   - Search filters
   - Support content already covered

3. Plan inclusions are now bilingual:
   - Free
   - Paid
   - Premium
   - Featured add-on

4. Category dropdowns prefer Marathi category name when Marathi mode is active.

## Files included

- `app/lib/i18n.js`
- `app/lib/planFeatures.js`
- `app/lib/itemConditions.js`
- `app/page.jsx`
- `app/ads/page.jsx`
- `app/components/AdCard.jsx`
- `app/post-ad/page.jsx`
- `app/components/PostAdForm.jsx`
- `app/pricing/page.jsx`
- `app/sold-status/page.jsx`
- `app/components/SoldStatusForm.jsx`
- `app/renew/page.jsx`
- `app/components/RenewAdForm.jsx`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Translate remaining public pages and support Marathi ad posting"
git push -u origin main
```

## Test

1. Open homepage.
2. Switch to मराठी.
3. Check homepage, /ads, /pricing, /post-ad, /sold-status, /renew.
4. On /post-ad, enter heading and description fully in Marathi.
5. Submit a free ad and confirm it reaches admin approval.
6. Submit a paid/premium ad in Marathi with UPI reference and verify admin flow.
