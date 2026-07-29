# Phase 2C — Tier-II and Tier-III Maharashtra Expansion

Implemented after the platform positioning was clarified as being developed for the needs of tier-II and tier-III cities and towns of Maharashtra.

## Important note

Live web search was not available in the chat where this implementation was made. Therefore, this is a practical curated Maharashtra non-metro launch-location list, not a claimed official government/industry tier classification list.

Mumbai, Pune, Nagpur and similar metro-first locations remain intentionally outside the current launch focus.

## Implementation

### Location policy expanded

Updated:

- `app/lib/locations.js`

The central approved-location policy now contains 85 selected Maharashtra cities and towns across Western Maharashtra, North Maharashtra, Marathwada, Vidarbha and Konkan.

All existing location helpers continue to work through backward-compatible exports:

- `ALLOWED_TIER2_LOCATIONS`
- `ALLOWED_TIER2_LOCATION_SLUGS`
- `getAllowedTier2Cities()`
- `getAllowedTier2CitySearchOptions()`
- `getAllowedAdCityWhere()`

### Website copy updated

Updated:

- `app/page.jsx`
- `app/about/page.jsx`
- `app/components/BrandHeroGraphic.jsx`
- `app/components/Footer.jsx`
- `app/lib/seo.js`
- `app/manifest.js`
- `app/opengraph-image.jsx`
- `public/brand/my-classifieds-thumbnail.svg`

Main public positioning changed from tier-2 only to:

`tier-II and tier-III Maharashtra`

Homepage and About now explain that the platform serves smaller Maharashtra cities and towns where traditional newspaper/weekly/fortnightly classified ads may be costly or inconvenient for ordinary citizens and small businesses.

### Public UI changes

- Homepage city selector now lists all approved cities/towns.
- Homepage location-chip section is scrollable so it does not make the hero too tall.
- About page now has a dedicated location coverage section showing all approved launch locations.
- Brand hero and social thumbnail show the updated tier-II/tier-III positioning.

## No backend schema change

No Prisma schema change and no new environment variable required.
