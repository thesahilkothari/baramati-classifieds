# Phase 2B — Homepage City List and Hero Alignment

Implemented after review of the homepage hero/search area.

## Changes

### 1. Homepage city selector

The homepage search form continues to use the approved tier-2 Maharashtra location list from `app/lib/locations.js`.

The allowed city list is now shown directly below the homepage search box as visible city chips, not only inside the dropdown.

Launch locations displayed:

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

Pune, Mumbai and similar tier-1 cities remain intentionally excluded.

### 2. Homepage hero alignment

The left hero text block was changed from vertically centered alignment to top alignment using `items-start` on the grid and `justify-start` on the content column. This removes the unnecessary empty feeling at the upper-left part of the homepage hero area.

### 3. Hero brand graphic

The decorative brand graphic on the homepage was updated so it no longer shows only Baramati near the mock search bar. It now shows:

- `13 launch cities`
- a preview of the launch cities
- sample listing locations from Baramati, Satara and Phaltan

### 4. Social thumbnail copy

The dynamic Open Graph image was updated from a Baramati-only location label to:

`Tier-2 Maharashtra • 13 Launch Cities • Local Classifieds`

## Uploaded PNG image note

The uploaded PNG-style promotional graphic is suitable for advertising, WhatsApp/status/social-media promotion and brand launch posts. It has not been inserted as a raster image inside the live website UI. The website currently uses lightweight SVG/dynamic brand graphics so the public site remains fast and does not become image-heavy.

## Files changed

- `app/page.jsx`
- `app/components/BrandHeroGraphic.jsx`
- `app/opengraph-image.jsx`
- `app/lib/locations.js`
