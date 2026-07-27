# Phase 1Z — Plain Text Classified Cards

This phase restores the public ad cards to a plain-text classified style while retaining the newly implemented navy, orange and teal brand palette.

## Reason

The platform is not launching image upload, listing thumbnails or gallery features at this stage. Public ad cards should therefore not show a 4:3 image placeholder or any UI that suggests image upload is available.

## Implemented

Updated:

- `app/components/AdCard.jsx`

The ad card now shows:

- Featured badge in amber where applicable.
- Verified Seller badge in teal where applicable.
- Category badge in deep navy.
- Compact category marker only, not an image placeholder.
- Plain text title, price, city, date and description.
- View and Report actions.
- White card, light slate border, restrained shadow and 10–12px rounded visual character.

## Explicitly not added

- No listing image upload.
- No listing photo slot.
- No gallery.
- No thumbnail placeholder.
- No media storage or image moderation pipeline.
- No Prisma schema change.
- No new environment variable.

## Local validation

```bat
cd C:\baramati-classifieds
git pull origin main
npm run build
```

Check:

- `/`
- `/ads`
- category pages
- SEO landing pages using `AdCard`
