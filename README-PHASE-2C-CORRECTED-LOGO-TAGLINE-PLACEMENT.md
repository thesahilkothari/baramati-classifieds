# Phase 2C — Corrected Logo and Tagline Placement

Implemented after logo review.

## Rule applied

The logo artwork itself must contain only:

- newspaper/classifieds + location-pin brand mark
- `My Classifieds` wordmark

The tagline is not embedded inside the standalone logo asset.

The tagline is rendered separately at placement time:

`Online Classifieds Platform`

## Updated assets

- `public/brand/my-classifieds-logo.svg`
  - standalone logo only; no tagline inside the SVG artwork
- `public/brand/my-classifieds-icon.svg`
  - corrected newspaper + orange location pin + teal map grid mark
- `public/brand/my-classifieds-thumbnail.svg`
  - social/website thumbnail with the logo and tagline rendered as a separate line

## Updated components

- `app/components/BrandMark.jsx`
- `app/components/BrandLogo.jsx`

`BrandLogo` now renders the brand mark and wordmark, and places the tagline underneath as separate HTML text when `showTagline` is true.

## Updated dynamic images

- `app/icon.jsx`
- `app/opengraph-image.jsx`

The favicon/app icon now uses the corrected newspaper + location pin mark.

The dynamic Open Graph image now uses the corrected brand mark and renders `Online Classifieds Platform` as a separate tagline line below `My Classifieds`.

## No backend change

No Prisma schema change and no new environment variables are required.
