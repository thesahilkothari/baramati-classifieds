# Phase 1X — Generated Brand Image Placement

This phase implements the generated analyzer/comparator brand image in appropriate places while keeping the lightweight launch constraint intact.

## Source asset

The audit implementation had already added a valid 1200×630 generic social-share asset:

- `public/og-image.jpg`

This is a platform/brand image only. It is not a listing photo, seller photo, product photo, gallery, thumbnail system, media upload, Cloudinary pipeline or image moderation feature.

## Placement implemented

### 1. Social metadata

The site metadata already uses `/og-image.jpg` through `buildPageMetadata()` as the default Open Graph/Twitter image fallback for public pages.

### 2. Homepage hero brand panel

Updated:

- `app/page.jsx`

The generated image is now shown inside the right-side homepage brand/trust panel using `next/image`, fixed dimensions and responsive `sizes`. It supports the homepage brand impression without making the ad cards image-dependent.

### 3. About page brand header

Updated:

- `app/about/page.jsx`

The generated image is now shown in the About page header as a brand preview image using `next/image` and lazy loading.

## Constraints preserved

- No listing image upload.
- No listing gallery.
- No media moderation pipeline.
- No user image fields.
- No Prisma schema change.
- No Cloudinary dependency or configuration change.
- No new environment variable.

## Local validation

Run:

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

After deployment, verify:

- `/`
- `/about`
- public social share preview using `/og-image.jpg`
