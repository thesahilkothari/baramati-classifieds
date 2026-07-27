# Phase 2A — Tier-2 Maharashtra Launch Locations

This phase restricts My Classifieds launch locations to approved tier-2 / local Maharashtra cities and intentionally excludes tier-1 cities such as Pune and Mumbai.

## Approved launch locations

Current approved location list:

- Baramati
- Phaltan
- Akluj
- Solapur
- Karad
- Satara
- Sangli
- Indapur
- Daund
- Shirur
- Nashik
- Chhatrapati Sambhajinagar
- Ahilyanagar

## Files changed

- `app/lib/locations.js`
- `app/post-ad/page.jsx`
- `app/api/ads/route.js`
- `app/page.jsx`
- `app/ads/page.jsx`
- `app/ads/[slug]/page.jsx`
- `app/category/[slug]/page.jsx`
- `app/components/SeoLandingPage.jsx`
- `app/sitemap.js`
- `prisma/seed.js`

## Enforcement

### Public selectors

Only approved launch locations are shown in:

- Homepage search location selector
- Browse Ads location filter
- Post Ad city selector

### Backend validation

The ad submission API validates the selected `cityId` and rejects cities whose slug is not in the approved tier-2 location list. This means direct API submission using Pune, Mumbai or any non-approved city is blocked.

### Public ad visibility

Public ad lists, category pages, SEO landing pages, sitemap entries and direct ad detail pages are filtered to approved launch locations only. If an old ad exists in a non-launch city, it will not appear publicly through normal routes.

### Database seeding

`prisma/seed.js` now seeds the approved launch locations only. It no longer seeds Pune as a launch location.

The runtime helper also creates missing approved cities automatically when the public city list is loaded, so the approved cities become available without a separate manual seed step on production.

## No schema change

No Prisma schema change is required.

## Validation

Run locally:

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

Then test:

- `/post-ad` city dropdown
- `/ads` location filter
- `/` homepage location filter
- `/sitemap.xml`

Pune and Mumbai should not appear in public posting/search selectors.
