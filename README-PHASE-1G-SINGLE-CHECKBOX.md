# Phase 1G - Single Posting Terms Checkbox

This patch removes the multiple mandatory declaration checkboxes from the post-ad page and replaces them with one consolidated acceptance checkbox.

## Added

- `/legal/posting-terms`
- Single checkbox:
  `I have read and I accept all the Terms and Conditions for Posting a Classified.`
- Backend validation updated to accept the consolidated declaration.
- PolicyAcceptance and ConsentRecord still store legal evidence.

## Files

- `app/components/PostAdForm.jsx`
- `app/api/ads/route.js`
- `app/lib/compliance.js`
- `app/lib/manualPayment.js`
- `app/legal/posting-terms/page.jsx`
- `app/api/admin/payments/[id]/manual-verify/route.js`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Consolidate posting declarations into single checkbox"
git push -u origin main
```

## Test

1. Open `/post-ad`.
2. Confirm only one legal checkbox is shown.
3. Click the linked terms name.
4. Confirm `/legal/posting-terms` opens.
5. Submit one free ad.
6. Submit one paid/premium ad with UPI reference.
