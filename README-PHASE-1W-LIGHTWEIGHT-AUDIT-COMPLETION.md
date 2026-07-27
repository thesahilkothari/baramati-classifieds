# Phase 1W — Lightweight Analyzer/Comparator Recommendations

Implemented from the Website Analyzer & Comparator handoff while preserving the lightweight launch constraint.

## Binding constraint preserved

No new image upload, gallery, thumbnail, Cloudinary/media pipeline, AI image moderation, decorative page images or listing-image feature was added. The existing generic social-share fallback asset remains the only share image behavior.

## Implemented

### 1. Server-rendered JSON-LD

Added reusable JSON-LD helpers and script component:

- `app/lib/jsonLd.js`
- `app/components/JsonLd.jsx`

Schema usage:

- Homepage: `Organization` and `WebSite`.
- Browse ads page: `BreadcrumbList`, `CollectionPage`, visible `ItemList`.
- Listing detail page: `BreadcrumbList`; `Product` + `Offer` only for eligible goods-for-sale categories with a visible positive price (`vehicles`, `electronics`, `agriculture-equipment`).
- Landing pages: `BreadcrumbList`, `CollectionPage`, visible `ItemList` where approved ads exist.

Not every classified is marked as `Product`. Jobs, services and property pages do not receive incorrect Product schema.

### 2. Five focused SEO landing pages

Created only the recommended lightweight landing pages:

- `/baramati/property`
- `/baramati/jobs`
- `/baramati/used-vehicles`
- `/baramati/local-services`
- `/maharashtra/agriculture-equipment`

Each page is server-rendered, text-first, bilingual English/Marathi, uses approved active ads only, links to Browse Ads with matching filters, and has an empty state without fabricated inventory.

### 3. Text-only About page

Added:

- `/about`

The page explains the local Baramati/Maharashtra focus, newspaper-style model, moderation/safety commitments, platform role, and operator disclosure.

### 4. Sitemap and robots

Updated:

- `app/sitemap.js`
- `app/robots.js`

Sitemap now includes `/about`, the five landing pages, all public legal routes, active listing URLs and category URLs. Private account/OTP/admin/action routes are not included.

Robots now explicitly blocks private/action/admin/API routes and allows the public lightweight landing routes.

### 5. Public navigation

Updated:

- `app/components/Header.jsx`
- `app/components/Footer.jsx`

Added About and local landing-page links. Expanded footer legal links to the full public legal route set.

### 6. Browse filter safety

Updated:

- `app/ads/page.jsx`

The condition filter no longer queries a non-existent Prisma `Ad.condition` field. It now behaves as a lightweight text-based filter until a real condition field is intentionally added in a future schema phase.

## Files changed

- `app/lib/jsonLd.js`
- `app/components/JsonLd.jsx`
- `app/lib/seoLandingPages.js`
- `app/components/SeoLandingPage.jsx`
- `app/baramati/property/page.jsx`
- `app/baramati/jobs/page.jsx`
- `app/baramati/used-vehicles/page.jsx`
- `app/baramati/local-services/page.jsx`
- `app/maharashtra/agriculture-equipment/page.jsx`
- `app/about/page.jsx`
- `app/page.jsx`
- `app/ads/page.jsx`
- `app/ads/[slug]/page.jsx`
- `app/sitemap.js`
- `app/robots.js`
- `app/components/Header.jsx`
- `app/components/Footer.jsx`

## Deployment

No Prisma schema change and no new environment variable required.

Run locally:

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

Then verify these URLs after Vercel deploy:

- `/about`
- `/baramati/property`
- `/baramati/jobs`
- `/baramati/used-vehicles`
- `/baramati/local-services`
- `/maharashtra/agriculture-equipment`
- `/sitemap.xml`
- `/robots.txt`
