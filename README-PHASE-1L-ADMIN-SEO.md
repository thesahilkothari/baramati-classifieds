# Phase 1L - Admin Dashboard Polish + SEO Basics

## What this patch adds

### Admin dashboard polish

New route:

```txt
/admin/dashboard
```

Adds:

- Admin control centre navigation.
- Pending ads count.
- Pending manual UPI payments count.
- Open grievance/report count.
- Follow-up reminders count.
- Active ads count.
- Featured ads count.
- Ads posted today.
- Ads expiring soon.
- Paid revenue summary.
- Latest pending ads.
- Latest manual payments.
- Latest reports.
- Quick operation shortcuts.

The admin navigation appears on admin pages after login.

### SEO basics

Adds:

- `app/sitemap.js`
- `app/robots.js`
- `app/manifest.js`
- `app/lib/seo.js`
- stronger metadata in `app/layout.jsx`
- structured data helper component

Sitemap includes:

- homepage
- ads page
- post-ad
- pricing
- support
- legal pages
- category pages
- city-filtered ad URLs
- active ad detail URLs

Robots blocks:

- `/admin`
- `/api`
- `/renew`
- `/sold-status`

## Files included

- `app/admin/dashboard/page.jsx`
- `app/admin/layout.jsx`
- `app/components/AdminLoginBox.jsx`
- `app/components/AdminNav.jsx`
- `app/lib/seo.js`
- `app/layout.jsx`
- `app/sitemap.js`
- `app/robots.js`
- `app/manifest.js`
- `app/components/StructuredData.jsx`

## Commands

```bat
cd C:\baramati-classifieds
npm run build
git add .
git commit -m "Add admin dashboard and SEO basics"
git push -u origin main
```

## Test

After deployment, open:

```txt
https://myclassifieds.in/admin/dashboard
https://myclassifieds.in/sitemap.xml
https://myclassifieds.in/robots.txt
https://myclassifieds.in/manifest.webmanifest
```

Also confirm:

- `/admin/payments` still works.
- `/admin/followups` still works.
- `/admin/grievances` still works.
- `/admin/compliance` still works.
- sitemap lists active ads.
