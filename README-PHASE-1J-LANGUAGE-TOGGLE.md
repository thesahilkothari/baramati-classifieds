# Phase 1J - English / Marathi Header Language Toggle

## What this patch adds

1. Header language toggle:
   - EN
   - मराठी

2. Language is saved in a cookie:
   - `myclassifieds_lang`

3. When the user changes language:
   - cookie is updated
   - page refreshes
   - server components render in selected language

4. Translated now:
   - Header navigation
   - Footer
   - Mobile bottom navigation
   - Floating support assistant
   - `/support` page
   - `/ads` search filter labels
   - category dropdown prefers Marathi category name in Marathi mode

5. Existing legal pages still support Marathi separately through:
   - `/legal/[slug]?lang=mr`

## Files included

- `app/lib/i18n.js`
- `app/components/LanguageToggle.jsx`
- `app/components/Header.jsx`
- `app/components/Footer.jsx`
- `app/components/MobileBottomBar.jsx`
- `app/components/WhatsAppSupportBot.jsx`
- `app/components/AdSearchFilters.jsx`
- `app/lib/supportFaq.js`
- `app/support/page.jsx`
- `app/layout.jsx`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Add English Marathi language toggle"
git push -u origin main
```

## Test

1. Open `/`.
2. Click `मराठी` in the header.
3. Confirm header/footer/mobile nav/support widget change to Marathi.
4. Open `/ads`.
5. Confirm filter labels and category dropdown are Marathi-aware.
6. Open `/support`.
7. Confirm FAQ content changes to Marathi.
8. Click `EN` to switch back.

## Notes

This is the language foundation. Some older page body text may still be English if it is hardcoded in server pages. The next refinement can translate the remaining page-level static content page by page.
