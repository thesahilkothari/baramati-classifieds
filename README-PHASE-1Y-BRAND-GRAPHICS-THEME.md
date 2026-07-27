# Phase 1Y — Brand Graphics, Logo and Recommended Theme Implementation

Implemented the recommended My Classifieds positioning and visual system.

## Positioning

Primary positioning applied:

- `My Classifieds`
- `Online Classifieds Platform`

## Palette applied

- Deep navy blue `#0F3D5E` — header, logo, search button, headings
- Burnt orange `#C2410C` — `My` logo word and Post Free Ad CTA
- Deep teal `#0F766E` — trust accents and active/focus states
- Cool off-white `#F8FAFC` — page background
- White `#FFFFFF` — cards and panels
- Slate-black `#0F172A` — titles/body
- Slate grey `#475569` — secondary details
- Light slate `#CBD5E1` — borders
- Darker slate `#64748B` — inputs
- Amber `#F59E0B` — Featured badge
- Deep red `#B91C1C` — report/fraud actions

## Graphics added

### SVG assets

- `public/brand/my-classifieds-logo.svg`
- `public/brand/my-classifieds-icon.svg`
- `public/brand/my-classifieds-thumbnail.svg`

These follow the generated logo direction: location pin + listing card + search mark, `My` in burnt orange and `Classifieds` in deep navy.

### React components

- `app/components/BrandMark.jsx`
- `app/components/BrandLogo.jsx`
- `app/components/BrandHeroGraphic.jsx`

### Dynamic app/social images

- `app/icon.jsx`
- `app/apple-icon.jsx`
- `app/opengraph-image.jsx`

The Open Graph image creates a branded thumbnail server-side with a search-first classified layout.

## UI changes

### Header

Updated to a compact deep navy header with a white logo capsule and burnt-orange `Post Free Ad` CTA.

### Homepage

Updated to a clean, search-first homepage:

- White hero panel
- Large keyword/category/location search bar
- Navy search button
- Burnt-orange Post Free Ad CTA
- Generated-style brand hero graphic

### Listing cards

Updated cards with:

- 4:3 branded visual area
- White card body
- Navy category badge
- Amber featured badge with dark text
- Teal verified-seller badge where seller verification exists
- Clear Report button in deep red
- Medium rounded corners and light borders

### Browse/search filters

Updated with accessible input borders, teal focus states, navy action button and consistent labels.

### About and landing pages

Updated to use the same palette and generated-style brand graphic.

### Footer and mobile navigation

Updated to navy brand treatment and orange hover/CTA states.

## Notes

This phase does not add user listing image upload, gallery, Cloudinary, image moderation, or any Prisma schema change. Listing cards use a branded 4:3 visual placeholder until a separate moderated-media phase is intentionally implemented.

## Local validation

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

After deployment, verify:

- `/`
- `/ads`
- `/about`
- `/brand/my-classifieds-logo.svg`
- `/brand/my-classifieds-icon.svg`
- `/brand/my-classifieds-thumbnail.svg`
- `/opengraph-image`
- `/icon`
- `/manifest.webmanifest`
