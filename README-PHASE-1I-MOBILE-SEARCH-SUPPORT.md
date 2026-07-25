# Phase 1I - Mobile Experience, Search Filters and Support Assistant

## What this patch implements

1. Better mobile experience:
   - Sticky mobile bottom navigation.
   - Floating WhatsApp/help assistant.
   - Quick post/search/help actions.

2. Easier search:
   - Adds UI filters for:
     - keyword
     - category
     - location/city
     - min price
     - max price
     - condition: New / Used / Like New
     - posted today / last 7 days / last 30 days

3. Faster support:
   - Floating instant support assistant.
   - `/support` help centre.
   - FAQ answers for:
     - How to post an ad
     - Pricing
     - Approval time
     - Payment process
     - Featured ads
     - Renewal/upgrade
   - WhatsApp links with pre-filled support questions.

## Important manual code step for condition filter

To make condition searchable as structured data, add this line inside `model Ad` in `prisma/schema.prisma`, preferably after `address`:

```prisma
condition   String?  @db.VarChar(40)
```

Then update `app/api/ads/route.js` and `app/components/PostAdForm.jsx` in your next development step to store `condition`.

This patch adds the UI layer first. It does not overwrite your current post-ad workflow.

## Commands

```bat
cd C:\baramati-classifieds
npx prisma db push
npx prisma generate
npm run build
git add .
git commit -m "Improve mobile support and search UX"
git push -u origin main
```

## Test

1. Open `/post-ad` on mobile.
2. Confirm bottom mobile nav appears.
3. Open `/support`.
4. Test floating WhatsApp support assistant.
5. Open `/ads` after the next backend filter patch is applied.
